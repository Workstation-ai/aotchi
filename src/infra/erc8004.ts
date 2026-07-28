import { createPublicClient, createWalletClient, http, formatEther, parseEther } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const IDENTITY_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "string", name: "agentURI", type: "string" }],
    name: "register",
    outputs: [{ internalType: "uint256", name: "agentId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "string", name: "newURI", type: "string" },
    ],
    name: "setAgentURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const CONTRACTS = {
  testnet: {
    chain: bscTestnet,
    identityRegistry: "0x8004A818BFB912233c491871b3d84c89A494BD9e" as const,
    rpcUrl: "https://bsc-testnet-rpc.publicnode.com",
    explorerUrl: "https://testnet.bscscan.com",
    scanUrl: "https://8004scan.io/agents/bsc-testnet",
  },
  mainnet: {
    chain: bsc,
    identityRegistry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as const,
    rpcUrl: "https://bsc-rpc.publicnode.com",
    explorerUrl: "https://bscscan.com",
    scanUrl: "https://8004scan.io/agents/bsc",
  },
} as const;

type Network = keyof typeof CONTRACTS;

const AOTCHI_DIR = () => process.env.AOTCHI_DIR || join(homedir(), ".aotchi");
const WALLET_FILE = () => join(AOTCHI_DIR(), "wallet.json");

interface StoredWallet {
  privateKey: `0x${string}`;
  address: string;
}

function ensureDir(): void {
  const dir = AOTCHI_DIR();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function getOrCreateWallet(): StoredWallet {
  ensureDir();
  if (existsSync(WALLET_FILE())) {
    const raw = readFileSync(WALLET_FILE(), "utf-8");
    return JSON.parse(raw);
  }
  const pk = generatePrivateKey();
  const account = privateKeyToAccount(pk);
  const wallet: StoredWallet = { privateKey: pk, address: account.address };
  writeFileSync(WALLET_FILE(), JSON.stringify(wallet, null, 2));
  return wallet;
}

export function getWallet(): StoredWallet | null {
  if (!existsSync(WALLET_FILE())) return null;
  return JSON.parse(readFileSync(WALLET_FILE(), "utf-8"));
}

export async function getBalance(address: string, network: Network = "testnet"): Promise<bigint> {
  const config = CONTRACTS[network];
  const client = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });
  return client.getBalance({ address: address as `0x${string}` });
}

export async function registerAgent(
  agentName: string,
  agentURI: string,
  network: Network = "testnet"
): Promise<{ agentId: bigint; txHash: string; explorerUrl: string; scanUrl: string }> {
  const config = CONTRACTS[network];
  const wallet = getOrCreateWallet();
  const account = privateKeyToAccount(wallet.privateKey);

  const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const balance = await publicClient.getBalance({ address: wallet.address as `0x${string}` });
  if (balance === 0n) {
    throw new Error(
      `Wallet ${wallet.address} has no tBNB. Fund it at:\n` +
      `  https://www.bnbchain.org/en/testnet-faucet\n` +
      `  Address: ${wallet.address}\n` +
      `  Required: ~0.005 tBNB for gas`
    );
  }

  console.log(`  ⛓  Registering "${agentName}" on ${network}...`);
  console.log(`  📡 Contract: ${config.identityRegistry}`);
  console.log(`  💰 Balance: ${formatEther(balance)} tBNB`);

  const hash = await walletClient.writeContract({
    address: config.identityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "register",
    args: [agentURI],
  });

  console.log(`  📝 Tx: ${hash}`);
  console.log(`  ⏳ Waiting for confirmation...`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const registeredLog = receipt.logs.find(
    (log) => log.topics[0] === "0x185730948e0a124a975035ce38a12f40e39cd8f83968bb2978ea14f373c06e6a"
  );

  let agentId = 0n;
  if (registeredLog && registeredLog.topics[1]) {
    agentId = BigInt(registeredLog.topics[1]);
  }

  return {
    agentId,
    txHash: hash,
    explorerUrl: `${config.explorerUrl}/tx/${hash}`,
    scanUrl: `${config.scanUrl}/${agentId.toString()}`,
  };
}

export async function setAgentURI(
  agentId: bigint,
  newURI: string,
  network: Network = "testnet"
): Promise<{ txHash: string }> {
  const config = CONTRACTS[network];
  const wallet = getOrCreateWallet();
  const account = privateKeyToAccount(wallet.privateKey);

  const walletClient = createWalletClient({
    account,
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const hash = await walletClient.writeContract({
    address: config.identityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "setAgentURI",
    args: [agentId, newURI],
  });

  const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });
  await publicClient.waitForTransactionReceipt({ hash });

  return { txHash: hash };
}

export async function verifyAgent(agentId: bigint, network: Network = "testnet"): Promise<{
  exists: boolean;
  owner: string;
  uri: string;
}> {
  const config = CONTRACTS[network];
  const client = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const owner = await client.readContract({
    address: config.identityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "ownerOf",
    args: [agentId],
  });

  const uri = await client.readContract({
    address: config.identityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "tokenURI",
    args: [agentId],
  });

  return { exists: true, owner, uri };
}

export { CONTRACTS };
export type { Network };
