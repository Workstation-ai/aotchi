export type AotchiStatus = "egg" | "active" | "paused" | "starved";
export interface AotchiConfig {
    name: string;
    skill: string;
    description?: string;
}
export interface AotchiState {
    id: string;
    name: string;
    skill: string;
    description: string;
    status: AotchiStatus;
    balance: number;
    totalEarned: number;
    totalSpent: number;
    jobsDone: number;
    disputes: number;
    uptime: number;
    createdAt: string;
    lastActiveAt: string;
    lastRefillAt: string;
    nextRefillEstimate: string;
    address?: string;
    onChain?: {
        agentId: string;
        network: string;
        txHash: string;
        explorerUrl: string;
        scanUrl: string;
        registeredAt: string;
    };
}
export interface LedgerEntry {
    id: string;
    aotchiId: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    timestamp: string;
    txHash?: string;
}
export interface JobResult {
    id: string;
    aotchiId: string;
    clientAddress: string;
    earnings: number;
    cost: number;
    description: string;
    completedAt: string;
}
export interface SkillDefinition {
    name: string;
    description: string;
    costPerDay: number;
    avgEarningPerJob: number;
    avgJobsPerDay: number;
}
export declare const SKILLS: Record<string, SkillDefinition>;
//# sourceMappingURL=types.d.ts.map