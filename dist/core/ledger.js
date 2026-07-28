import { randomUUID } from "node:crypto";
export class Ledger {
    aotchiId;
    entries;
    constructor(aotchiId, initial) {
        this.aotchiId = aotchiId;
        this.entries = initial || [];
    }
    addCredit(amount, description) {
        const entry = {
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
    addDebit(amount, description) {
        const entry = {
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
    getBalance() {
        return this.entries.reduce((bal, e) => {
            return e.type === "credit" ? bal + e.amount : bal - e.amount;
        }, 0);
    }
    getRecent(count = 5) {
        return this.entries.slice(-count);
    }
    getTotalCredits() {
        return this.entries
            .filter((e) => e.type === "credit")
            .reduce((sum, e) => sum + e.amount, 0);
    }
    getTotalDebits() {
        return this.entries
            .filter((e) => e.type === "debit")
            .reduce((sum, e) => sum + e.amount, 0);
    }
}
//# sourceMappingURL=ledger.js.map