import { AotchiState } from "../core/types.js";
declare const NEON: {
    cyan: import("chalk").ChalkInstance;
    magenta: import("chalk").ChalkInstance;
    green: import("chalk").ChalkInstance;
    yellow: import("chalk").ChalkInstance;
    red: import("chalk").ChalkInstance;
    dim: import("chalk").ChalkInstance;
    bold: import("chalk").ChalkInstance;
    white: import("chalk").ChalkInstance;
};
export declare function banner(): string;
export declare function aotchiCard(state: AotchiState): string;
export declare function aotchiListCard(state: AotchiState): string;
export declare function walletCard(balance: number, address?: string): string;
export declare function eggAnimation(name: string): string;
export declare function starvationWarning(name: string): string;
export declare function formatDate(iso: string): string;
export { NEON };
//# sourceMappingURL=display.d.ts.map