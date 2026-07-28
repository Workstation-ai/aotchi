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

export const SKILLS: Record<string, SkillDefinition> = {
  trading: {
    name: "Trading",
    description: "Market analysis, portfolio management, trade execution",
    costPerDay: 0.5,
    avgEarningPerJob: 2.5,
    avgJobsPerDay: 6,
  },
  analysis: {
    name: "Analysis",
    description: "Data analysis, reporting, insights generation",
    costPerDay: 0.3,
    avgEarningPerJob: 1.5,
    avgJobsPerDay: 4,
  },
  alerts: {
    name: "Alerts",
    description: "Price alerts, monitoring, notification dispatch",
    costPerDay: 0.1,
    avgEarningPerJob: 0.5,
    avgJobsPerDay: 10,
  },
  research: {
    name: "Research",
    description: "Deep research, synthesis, report generation",
    costPerDay: 0.8,
    avgEarningPerJob: 5.0,
    avgJobsPerDay: 3,
  },
};
