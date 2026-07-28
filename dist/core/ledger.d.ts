import { LedgerEntry } from "./types.js";
export declare class Ledger {
    private aotchiId;
    entries: LedgerEntry[];
    constructor(aotchiId: string, initial?: LedgerEntry[]);
    addCredit(amount: number, description: string): LedgerEntry;
    addDebit(amount: number, description: string): LedgerEntry;
    getBalance(): number;
    getRecent(count?: number): LedgerEntry[];
    getTotalCredits(): number;
    getTotalDebits(): number;
}
//# sourceMappingURL=ledger.d.ts.map