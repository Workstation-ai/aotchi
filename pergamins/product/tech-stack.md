# AOTCHI Tech Stack Decision

> **Status**: Living document — canonical reference for technology choices
> **Last updated**: Chapter 3 (The Deployment)

---

## 1. Decision Summary

| Layer | Choice | Cost (Free Tier) | Rationale |
|-------|--------|-----------------|-----------|
| **Database** | Cloudflare D1 | $0 (5M reads/day, 5GB, no pause) | Serverless SQLite, edge-native, never pauses |
| **Auth** | Supabase Auth | $0 (50K MAU) | Best free auth, social OAuth, sessions |
| **Web** | Vite + React (Cloudflare Pages) | $0 (unlimited static) | Fast build, edge deploy |
| **API** | Cloudflare Workers | $0 (100K req/day) | Edge functions, global |
| **KV Cache** | Cloudflare KV | $0 (100K reads/day) | Session cache, config |
| **Object Storage** | Cloudflare R2 | $0 (10GB, no egress) | Agent artifacts, logs |
| **Wallets** | viem (self-managed) | $0 | Generate/store wallets in D1 |
| **Agent Runtime** | Freestyle VMs | $0 (10 VMs, 20 vCPU-h/day) | Real Linux VMs for agent execution |
| **Blockchain** | BSC (testnet → mainnet) | Gas only | Already integrated |
| **Pagos** | x402 | Agent-funded | Agents pay for own infrastructure |

**Total at launch: $0/month** (all free tiers)

### Why Cloudflare over Vercel?

- **D1 never pauses** — Supabase free pauses after 1 week inactivity
- **No egress fees** — R2 free egress vs Supabase 5GB limit
- **All-in-one** — Workers, D1, KV, R2, Durable Objects in one provider
- **Edge-native** — Global edge deployment, faster for international users
- **Better free tier** — 100K req/day, 5M reads/day, 10GB storage

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 A O T C H I   W E B                     │
│              (Vite + React on Cloudflare Pages)          │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Dashboard │  │ Agent    │  │ Ledger   │             │
│  │ (create,  │  │ Monitor  │  │ Explorer │             │
│  │  fund,    │  │ (status, │  │ (txs,    │             │
│  │  manage)  │  │  logs)   │  │  balance)│             │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘             │
│        │             │             │                     │
├────────┴─────────────┴─────────────┴─────────────────────┤
│               C L O U D F L A R E                       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Workers  │  │ D1       │  │ KV       │             │
│  │ (API,    │  │ (agents, │  │ (cache,  │             │
│  │  webhooks│  │  wallets,│  │  sessions│             │
│  │  RPC)    │  │  ledger) │  │  config) │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  ┌──────────┐  ┌──────────┐                            │
│  │ R2       │  │ Durable  │                            │
│  │ (storage,│  │ Objects  │                            │
│  │  artifacts│ │ (realtime│                            │
│  │  logs)   │  │  state)  │                            │
│  └──────────┘  └──────────┘                            │
│                                                         │
│  ┌──────────┐                                          │
│  │ Supabase │                                          │
│  │ Auth     │                                          │
│  │ (50K MAU)│                                          │
│  └──────────┘                                          │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────┐
│   F R E E S T Y L E        │   B S C         │
│   (Agent VMs)   │          │   (Blockchain)  │
│                 │          │                 │
│  VM per agent   │          │  ERC-8004       │
│  (sandbox,      │          │  ERC-8183       │
│   execution,    │          │  x402           │
│   state)        │          │                 │
└─────────────────┘          └─────────────────┘
```

---

## 3. Provider Analysis

### 3.1 Cloudflare Stack

**Free Tier:**
- Workers: 100K requests/day, 10ms CPU/invocation
- D1: 5M reads/day, 100K writes/day, 5GB storage
- KV: 100K reads/day, 1K writes/day, 1GB
- R2: 10GB, 1M Class A ops, 10M Class B ops, **no egress**
- Pages: unlimited static

**What we use it for:**
- Workers: API endpoints, webhooks, agent management
- D1: Agent records, wallet storage, ledger
- KV: Session cache, config, rate limiting
- R2: Agent artifacts, logs, deliverables
- Pages: Web dashboard (Vite + React)

### 3.2 Supabase Auth

**Free Tier:**
- 50,000 MAU
- Social OAuth providers (Google, GitHub, etc.)
- Anonymous sign-ins
- Custom SMTP

**What we use it for:**
- User authentication only (not database)
- OAuth login (Google, GitHub)
- Session management

### 3.3 BNB Agent SDK (BSC Adapter)

**What it provides:**
- ERC-8004 identity registration
- ERC-8183 commerce (escrow, jobs, disputes)
- x402 payments
- Wallet management (provider interface)
- Plugin architecture

**How AOTCHI uses it:**
- As a BSC-specific adapter plugin
- Not a dependency — an implementation detail
- AOTCHI defines its own interfaces; BNB Agent SDK implements them for BSC
- Future chains get their own adapters

**Architecture:**
- AOTCHI SDK (TypeScript) defines: IdentityProvider, CommerceProvider, PaymentProvider
- BSCAdapter wraps BNB Agent SDK (Python) via subprocess or TypeScript reimplementation
- No lock-in — adapters are swappable

### 3.4 Freestyle VMs

**Free Tier:**
- 10 concurrent VMs
- 20 vCPU hours/day
- 40 GiB-memory hours/day
- 500 repositories

**What we use it for:**
- Each agent gets a sandboxed VM
- Agent runs inside VM: LLM calls, data processing, skill execution
- VM state persists (pause/resume)

**Pricing at scale:**
- 1 agent = ~1 vCPU, ~1GB RAM
- 10 agents = 10 vCPU-h/day (well within free tier)
- 100 agents = need Hobby ($50/mo)

### 3.5 viem (Wallets — Self-Managed)

**Cost: $0** (open source library)

**What we use it for:**
- Generate wallet key pairs
- Store encrypted keys in D1
- Sign transactions
- Read on-chain state

**Flow:**
1. User creates agent → viem generates wallet
2. Wallet address stored in D1 (public)
3. Private key encrypted with user's auth token → stored in D1
4. User funds agent by sending BNB to wallet address
5. Agent uses wallet to sign x402 payments

### 3.6 BSC (Blockchain)

**Cost: Gas only (~0.001-0.01 BNB per tx)**

**Already integrated:**
- ERC-8004 registration
- ERC-8183 commerce (via BNB Agent SDK)
- x402 payments (via BNB Agent SDK)

---

## 4. D1 Schema

```sql
-- Agents table
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  state TEXT DEFAULT 'idle',
  skill TEXT NOT NULL,
  balance TEXT DEFAULT '0',
  network TEXT DEFAULT 'testnet',
  token_id INTEGER,
  tx_hash TEXT,
  scan_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wallets table
CREATE TABLE wallets (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  address TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- Ledger table
CREATE TABLE ledger (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount TEXT,
  tx_hash TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);
```

---

## 5. Multi-Chain Architecture (No Lock-in)

```
┌─────────────────────────────────────────────────────────┐
│                    A O T C H I   S D K                  │
│              (TypeScript, chain-agnostic)                │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Identity │  │ Commerce │  │ Payments │             │
│  │ Interface│  │ Interface│  │ Interface│             │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘             │
│        │             │             │                     │
├────────┴─────────────┴─────────────┴─────────────────────┤
│              CHAIN ADAPTERS (plugins)                    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ BSC Adapter  │  │ ETH Adapter  │  │ SOL Adapter  │ │
│  │ (BNB Agent   │  │ (futuro)     │  │ (futuro)     │ │
│  │  SDK)        │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**AOTCHI SDK interfaces (TypeScript):**
- `IdentityProvider` — register, verify, getAgent
- `CommerceProvider` — createJob, fund, submit, settle
- `PaymentProvider` — pay, getBalance

**BSC Adapter:** wraps BNB Agent SDK (Python)
**ETH Adapter:** future — ethers.js + equivalent contracts
**SOL Adapter:** future — @solana/web3.js

---

## 6. x402 Cost Coverage Model

The key insight: **agents pay for their own infrastructure through x402 payments**.

```
CLIENT pays for job
        │
        ▼
┌─────────────────┐
│  ERC-8183       │
│  Escrow         │
│  (job payment)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  AGENT earns    │────▶│  Agent pays for │
│  from job       │     │  infrastructure │
└─────────────────┘     │                 │
                        │  - LLM calls    │
                        │  - VM runtime   │
                        │  - Data feeds   │
                        │  - API access   │
                        └─────────────────┘
```

**Implicit costs per agent per month:**

| Cost | Free Tier Limit | Agent Pays? |
|------|----------------|-------------|
| D1 | 5M reads/day | No (platform absorbs) |
| Supabase Auth | 50K MAU | No (platform absorbs) |
| Freestyle VM | 10 VMs, 20 vCPU-h/day | Yes (via x402 to platform) |
| BSC gas | ~0.001 BNB/tx | Yes (from agent wallet) |
| LLM inference | Per API call | Yes (via x402 to LLM provider) |

**Revenue model:**
1. User pays AOTCHI platform to create agent (one-time or subscription)
2. Agent earns from client jobs via ERC-8183
3. Agent pays platform for VM runtime via x402
4. Agent pays LLM providers via x402
5. **Net: agent is self-sustaining when earnings > costs**

**Break-even calculation:**
- Freestyle VM cost: ~$0.04/vCPU-h
- LLM cost: ~$0.001-0.01/inference
- Agent needs ~10-50 jobs/month to break even
- At $0.50/job, that's $5-25/month revenue vs ~$5-10/month costs

---

## 7. MVP Launch Stack

```
Week 1-2: Foundation
├── Cloudflare project (D1 + Workers + KV)
├── Supabase Auth setup
├── Vite + React app
├── viem wallet generation
└── Basic CRUD API

Week 3-4: Agent Management
├── Create agent → D1
├── Deploy agent → BSC (ERC-8004)
├── Fund agent → wallet address
└── Status dashboard

Week 5-6: Agent Runtime
├── Freestyle VM integration
├── Agent sandboxed execution
├── LLM integration via x402
└── Basic skill execution

Week 7-8: Polish & Launch
├── Ledger explorer
├── Error handling
├── Landing page
└── Beta launch
```

---

## 8. Future Considerations

| When | What | Why |
|------|------|-----|
| >50K users | Clerk auth | Better B2B, Web3 login |
| >100 agents | Freestyle Hobby | More VM capacity |
| >1000 agents | Freestyle Pro | Production VMs |
| Mainnet | Real BNB | Production agents |
| Revenue | x402 payments | Self-sustaining agents |
| Multi-chain | ETH/SOL adapters | Cross-chain agents |
