import { AotchiState, AotchiConfig, AotchiStatus, LedgerEntry, JobResult } from "./types.js";
import { Ledger } from "./ledger.js";
export declare class Aotchi {
    state: AotchiState;
    ledger: Ledger;
    private constructor();
    static create(config: AotchiConfig): Aotchi;
    static fromState(state: AotchiState, entries: LedgerEntry[]): Aotchi;
    feed(amount: number): LedgerEntry;
    work(clientEarnings: number, cost: number, description: string): JobResult;
    pause(): void;
    resume(): void;
    getStatus(): AotchiStatus;
    private updateRefillEstimate;
}
//# sourceMappingURL=aotchi.d.ts.map