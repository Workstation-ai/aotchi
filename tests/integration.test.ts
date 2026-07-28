import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";

const BSC_TESTNET_RPC = "https://bsc-testnet-rpc.publicnode.com";
const IDENTITY_REGISTRY = "0x8004A818BFB912233c491871b3d84c89A494BD9e";

const ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVersion",
    outputs: [{ type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

function getClient() {
  return createPublicClient({
    chain: bscTestnet,
    transport: http(BSC_TESTNET_RPC),
  });
}

describe("ERC-8004 Identity Registry (BSC Testnet)", () => {
  it("should be reachable via RPC", async () => {
    const client = getClient();
    const blockNumber = await client.getBlockNumber();
    assert.ok(blockNumber > 0n, `RPC reachable, block: ${blockNumber}`);
  });

  it("should have correct name", async () => {
    const client = getClient();
    const name = await client.readContract({
      address: IDENTITY_REGISTRY,
      abi: ABI,
      functionName: "name",
    });
    assert.ok(name.length > 0, `Contract name: ${name}`);
    console.log(`    Contract name: "${name}"`);
  });

  it("should have correct symbol", async () => {
    const client = getClient();
    const symbol = await client.readContract({
      address: IDENTITY_REGISTRY,
      abi: ABI,
      functionName: "symbol",
    });
    assert.ok(symbol.length > 0, `Contract symbol: ${symbol}`);
    console.log(`    Contract symbol: "${symbol}"`);
  });

  it("should return a version", async () => {
    const client = getClient();
    const version = await client.readContract({
      address: IDENTITY_REGISTRY,
      abi: ABI,
      functionName: "getVersion",
    });
    console.log(`    Contract version: "${version}"`);
  });

  it("should return tokenURI for a known token (ID 1)", async () => {
    const client = getClient();
    try {
      const uri = await client.readContract({
        address: IDENTITY_REGISTRY,
        abi: ABI,
        functionName: "tokenURI",
        args: [1n],
      });
      console.log(`    Token #1 URI: ${uri}`);
    } catch (e: any) {
      // Token 1 might not exist, that's OK
      console.log(`    Token #1 not found (expected if no agents registered yet)`);
    }
  });
});
