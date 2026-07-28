import { randomUUID } from "node:crypto";
import { AotchiState, AotchiConfig, AotchiStatus, LedgerEntry, JobResult, SKILLS } from "./types.js";
import { Ledger } from "./ledger.js";

export class Aotchi {
  state: AotchiState;
  ledger: Ledger;

  private constructor(state: AotchiState, ledger: Ledger) {
    this.state = state;
    this.ledger = ledger;
  }

  static create(config: AotchiConfig): Aotchi {
    const skill = SKILLS[config.skill];
    if (!skill) {
      throw new Error(
        `Unknown skill "${config.skill}". Available: ${Object.keys(SKILLS).join(", ")}`
      );
    }

    const id = randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    const state: AotchiState = {
      id,
      name: config.name,
      skill: config.skill,
      description: config.description || skill.description,
      status: "egg",
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      jobsDone: 0,
      disputes: 0,
      uptime: 0,
      createdAt: now,
      lastActiveAt: now,
      lastRefillAt: now,
      nextRefillEstimate: "never",
    };

    const ledger = new Ledger(id);
    return new Aotchi(state, ledger);
  }

  static fromState(state: AotchiState, entries: LedgerEntry[]): Aotchi {
    const ledger = new Ledger(state.id, entries);
    return new Aotchi(state, ledger);
  }

  feed(amount: number): LedgerEntry {
    if (amount <= 0) throw new Error("Amount must be positive");

    this.state.balance += amount;
    this.state.lastRefillAt = new Date().toISOString();

    if (this.state.status === "starved" || this.state.status === "egg") {
      this.state.status = "active";
    }

    const entry = this.ledger.addCredit(amount, `Fed ${amount} AOTCHI`);
    this.updateRefillEstimate();
    return entry;
  }

  work(clientEarnings: number, cost: number, description: string): JobResult {
    if (this.state.status !== "active") {
      throw new Error(`AOTCHI is ${this.state.status}, cannot work`);
    }

    this.state.balance -= cost;
    this.state.totalSpent += cost;
    this.state.balance += clientEarnings;
    this.state.totalEarned += clientEarnings;
    this.state.jobsDone += 1;
    this.state.lastActiveAt = new Date().toISOString();

    this.ledger.addDebit(cost, `LLM cost: ${description}`);
    this.ledger.addCredit(clientEarnings, `Job payment: ${description}`);

    if (this.state.balance <= 0) {
      this.state.status = "starved";
    }

    this.updateRefillEstimate();

    return {
      id: randomUUID().slice(0, 8),
      aotchiId: this.state.id,
      clientAddress: "0x0000...0000",
      earnings: clientEarnings,
      cost,
      description,
      completedAt: new Date().toISOString(),
    };
  }

  pause(): void {
    if (this.state.status === "paused") {
      throw new Error("AOTCHI is already paused");
    }
    this.state.status = "paused";
  }

  resume(): void {
    if (this.state.status !== "paused") {
      throw new Error(`Cannot resume: AOTCHI is ${this.state.status}`);
    }
    if (this.state.balance <= 0) {
      this.state.status = "starved";
    } else {
      this.state.status = "active";
    }
  }

  getStatus(): AotchiStatus {
    if (this.state.status === "active" && this.state.balance <= 0) {
      this.state.status = "starved";
    }
    return this.state.status;
  }

  private updateRefillEstimate(): void {
    if (this.state.status !== "active") {
      this.state.nextRefillEstimate = "paused";
      return;
    }

    const skill = SKILLS[this.state.skill];
    if (!skill) {
      this.state.nextRefillEstimate = "unknown";
      return;
    }

    const dailyCost = skill.costPerDay;
    const hoursLeft = dailyCost > 0 ? (this.state.balance / dailyCost) * 24 : Infinity;

    if (hoursLeft === Infinity) {
      this.state.nextRefillEstimate = "never";
    } else if (hoursLeft < 1) {
      this.state.nextRefillEstimate = "starving";
    } else if (hoursLeft < 24) {
      this.state.nextRefillEstimate = `~${Math.floor(hoursLeft)}h`;
    } else {
      this.state.nextRefillEstimate = `~${Math.floor(hoursLeft / 24)}d`;
    }
  }
}
