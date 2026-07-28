declare const CONTRACTS: {
    readonly testnet: {
        readonly chain: {
            blockExplorers: {
                readonly default: {
                    readonly name: "BscScan";
                    readonly url: "https://testnet.bscscan.com";
                    readonly apiUrl: "https://api-testnet.bscscan.com/api";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts: {
                readonly multicall3: {
                    readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                    readonly blockCreated: 17422483;
                };
            };
            ensTlds?: readonly string[] | undefined;
            id: 97;
            name: "BNB Smart Chain Testnet";
            nativeCurrency: {
                readonly decimals: 18;
                readonly name: "BNB";
                readonly symbol: "tBNB";
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem").ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
                client: import("viem").Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
                client: import("viem").Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
        };
        readonly identityRegistry: "0x8004A818BFB912233c491871b3d84c89A494BD9e";
        readonly rpcUrl: "https://bsc-testnet-rpc.publicnode.com";
        readonly explorerUrl: "https://testnet.bscscan.com";
        readonly scanUrl: "https://8004scan.io/agents/bsc-testnet";
    };
    readonly mainnet: {
        readonly chain: {
            blockExplorers: {
                readonly default: {
                    readonly name: "BscScan";
                    readonly url: "https://bscscan.com";
                    readonly apiUrl: "https://api.bscscan.com/api";
                };
            };
            blockTime: 750;
            contracts: {
                readonly multicall3: {
                    readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                    readonly blockCreated: 15921452;
                };
            };
            ensTlds?: readonly string[] | undefined;
            id: 56;
            name: "BNB Smart Chain";
            nativeCurrency: {
                readonly decimals: 18;
                readonly name: "BNB";
                readonly symbol: "BNB";
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://56.rpc.thirdweb.com"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet?: boolean | undefined | undefined;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem").ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
                client: import("viem").Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
                client: import("viem").Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
        };
        readonly identityRegistry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
        readonly rpcUrl: "https://bsc-rpc.publicnode.com";
        readonly explorerUrl: "https://bscscan.com";
        readonly scanUrl: "https://8004scan.io/agents/bsc";
    };
};
type Network = keyof typeof CONTRACTS;
interface StoredWallet {
    privateKey: `0x${string}`;
    address: string;
}
export declare function getOrCreateWallet(): StoredWallet;
export declare function getWallet(): StoredWallet | null;
export declare function getBalance(address: string, network?: Network): Promise<bigint>;
export declare function registerAgent(agentName: string, agentURI: string, network?: Network): Promise<{
    agentId: bigint;
    txHash: string;
    explorerUrl: string;
    scanUrl: string;
}>;
export declare function setAgentURI(agentId: bigint, newURI: string, network?: Network): Promise<{
    txHash: string;
}>;
export declare function verifyAgent(agentId: bigint, network?: Network): Promise<{
    exists: boolean;
    owner: string;
    uri: string;
}>;
export { CONTRACTS };
export type { Network };
//# sourceMappingURL=erc8004.d.ts.map