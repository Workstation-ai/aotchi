import { randomUUID } from "node:crypto";
import { LedgerEntry } from "./types.js";

export class Ledger {
  private aotchiId: string;
  entries: LedgerEntry[];

  constructor(aotchiId: string, initial?: LedgerEntry[]) {
    this.aotchiId = aotchiId;
    this.entries = initial || [];
  }

  addCredit(amount: number, description: string): LedgerEntry {
    const entry: LedgerEntry = {
      id: randomUUID().slice(0, 8),
      aotchiId: this.aotchiId,
      type: "credit",
      amount,
      description,
      timestamp: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }

  addDebit(amount: number, description: string): LedgerEntry {
    const entry: LedgerEntry = {
      id: randomUUID().slice(0, 8),
      aotchiId: this.aotchiId,
      type: "debit",
      amount,
      description,
      timestamp: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }

  getBalance(): number {
    return this.entries.reduce((bal, e) => {
      return e.type === "credit" ? bal + e.amount : bal - e.amount;
    }, 0);
  }

  getRecent(count: number = 5): LedgerEntry[] {
    return this.entries.slice(-count);
  }

  getTotalCredits(): number {
    return this.entries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getTotalDebits(): number {
    return this.entries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0);
  }
}
