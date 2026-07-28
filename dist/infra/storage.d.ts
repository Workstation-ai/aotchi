import { Aotchi } from "../core/aotchi.js";
interface WalletData {
    address: string;
    balance: number;
    mnemonic?: string;
}
export declare function saveAgent(aotchi: Aotchi): void;
export declare function loadAgent(id: string): Aotchi | null;
export declare function loadAllAgents(): Aotchi[];
export declare function deleteAgent(id: string): boolean;
export declare function saveWallet(wallet: WalletData): void;
export declare function loadWallet(): WalletData | null;
export declare function listAgentIds(): string[];
export {};
//# sourceMappingURL=storage.d.ts.map