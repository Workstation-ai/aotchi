# AOTCHI SDK Reference

> **Status**: Living document — SDK API surface and architecture
> **Last updated**: Chapter 3 (The Deployment)

---

## 1. Package

```
@aotchi/sdk
```

TypeScript library. Runtime: Node.js 18+. Blockchain: viem.

## 2. Core API

### Agent Class

```typescript
class AOTCHI {
  constructor(name: string, opts?: { skill?: SkillType; network?: Network })

  // Lifecycle
  create(): Promise<void>          // Local agent record
  deploy(): Promise<DeployResult>  // On-chain ERC-8004 registration
  feed(amount: string): void       // Fund balance
  pause(): void                    // Pause operations
  resume(): void                   // Resume operations

  // Queries
  getStatus(): AgentStatus
  getLedger(): LedgerEntry[]
  getBalance(): string

  // Static
  static list(): AOTCHI[]
  static skills(): Skill[]
}
```

### Types

```typescript
type SkillType = "trading" | "analysis" | "alerts" | "custom"
type Network = "testnet" | "mainnet"
type AgentState = "idle" | "active" | "paused" | "starving"

interface AgentStatus {
  id: string
  name: string
  state: AgentState
  skill: SkillType
  balance: string
  network: Network
  tokenId?: bigint
  txHash?: string
  scanUrl?: string
}

interface DeployResult {
  agentId: bigint
  txHash: string
  explorerUrl: string
  scanUrl: string
}
```

## 3. Infra Layer

### ERC-8004 Module

```typescript
// Registration
registerAgent(agentURI: string, network?: Network): Promise<{
  agentId: bigint; txHash: string; explorerUrl: string; scanUrl: string
}>

// Verification
verifyAgent(agentId: bigint, network?: Network): Promise<{
  exists: boolean; owner: string; uri: string
}>

// Metadata update
setAgentURI(agentId: bigint, newURI: string, network?: Network): Promise<{
  txHash: string
}>
```

### Wallet Module

```typescript
// Deterministic — creates once, reads always
getOrCreateWallet(): { address: string; privateKey: string }
// Stored at: ~/.aotchi/wallet.json
```

### Storage Module

```typescript
// Local JSON persistence at ~/.aotchi/
saveAgent(agent: AgentData): void
loadAgent(name: string): AgentData | null
listAgents(): AgentData[]
deleteAgent(name: string): void
```

## 4. Usage Patterns

### Create and Deploy (SDK)

```typescript
import { AOTCHI } from "@aotchi/sdk";

const agent = new AOTCHI("marcus-aurelius", {
  skill: "trading",
  network: "testnet"
});

await agent.create();
const result = await agent.deploy();
console.log(`Agent #${result.agentId} at ${result.scanUrl}`);
```

### Create and Deploy (CLI)

```bash
aotchi create marcus-aurelius --skill trading --deploy --network testnet
```

### Create Only (no on-chain)

```bash
aotchi create marcus-aurelius --skill trading
```

### Check Status

```bash
aotchi status marcus-aurelius
```

## 5. Metadata Format

Used for ERC-8004 `register()` and `setAgentURI()`:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "marcus-aurelius",
  "description": "Stoic philosopher agent.",
  "image": "",
  "endpoints": [
    {
      "name": "trading",
      "endpoint": "https://aotchi.app/agents/marcus-aurelius",
      "version": "0.1.0"
    }
  ],
  "registrations": []
}
```

## 6. Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `network` | `testnet` | Blockchain network |
| `rpcUrl` | Public BSC RPC | Custom RPC endpoint |
| `storageDir` | `~/.aotchi/` | Local data directory |
