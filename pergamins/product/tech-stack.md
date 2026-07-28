# AOTCHI Tech Stack Decision

> **Status**: Living document — canonical reference for technology choices
> **Last updated**: July 2026 — Clerk + RainbowKit final decision

---

## 1. Decision Summary

| Layer | Choice | Cost (Free Tier) | Rationale |
|-------|--------|-----------------|-----------|
| **Database** | Cloudflare D1 | $0 (5M reads/day, 5GB, no pause) | Serverless SQLite, edge-native, never pauses |
| **Auth** | Clerk (Hobby) + RainbowKit | $0 (50K MRU, Web3 wallets) | Social OAuth + Web3 wallet auth (MetaMask, OKX, Base) |
| **Wallet Connect** | RainbowKit + Wagmi + Viem | $0 | WalletConnect, Binance Wallet, Full wallet management |
| **Web** | Vite + React (Cloudflare Pages) | $0 (unlimited static) | Fast build, edge deploy |
| **API** | Cloudflare Workers | $0 (100K req/day) | Edge functions, global |
| **KV Cache** | Cloudflare KV | $0 (100K reads/day) | Session cache, config |
| **Object Storage** | Cloudflare R2 | $0 (10GB, no egress) | Agent artifacts, logs |
| **Agent SDK** | BNB Agent SDK (Python) | $0 | ERC-8004, ERC-8183, x402, wallet management |
| **Wallets** | viem + EVMWalletProvider | $0 | Keystore V3 encryption, D1 storage |
| **Agent Runtime** | Freestyle VMs | $0 (10 VMs, 20 vCPU-h/day) | Real Linux VMs for agent execution |
| **Blockchain** | BSC (testnet → mainnet) | Gas only | Already integrated |
| **Pagos** | x402 + MPP | Agent-funded | Agents pay for own infrastructure |

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
│  │ Clerk    │                                          │
│  │ Auth     │                                          │
│  │ +Rainbow │                                          │
│  │ (Web3)   │                                          │
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

### 3.2 Clerk Auth + RainbowKit Wallet Connect

**Free Tier:**
- Clerk Hobby: 50,000 MRU, free forever
- RainbowKit + Wagmi + Viem: all open source, $0

**What we use it for:**
- Social OAuth login (Google, GitHub)
- Email OTP / magic links
- Web3 wallet auth (MetaMask, OKX, Base, Coinbase Wallet)
- Session management + user profiles
- Wallet connection UI (RainbowKit)
- Binance Wallet + WalletConnect via custom RainbowKit connectors

**Wallet flow:**
1. User signs in (email OTP or social OAuth) — Clerk handles
2. User connects wallet (RainbowKit — MetaMask, OKX, WalletConnect, Binance) — wallet address becomes identity
3. Wallet address linked to Clerk user profile
4. Agent created → viem generates wallet → encrypted key stored in D1
5. All agent ops signed by user's wallet via BNB Agent SDK

**Why Clerk over Supabase:**
- Native Web3 wallet auth (SIWE)
- Built-in user management, social OAuth, magic links
- Free tier generous (50K MRU)
- RainbowKit fills the WalletConnect + Binance Wallet gap
- Better Cloudflare integration path

**Why RainbowKit over Clerk wallets alone:**
- Clerk supports MetaMask, OKX, Base, Coinbase, Solana
- Missing: Binance Wallet (most popular BSC wallet) and WalletConnect (mobile)
- RainbowKit covers both via WalletConnect + custom connectors
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

### 3.5 Clerk Auth + RainbowKit Wallet Connect + viem (Agent Wallets)

**Cost: $0** (Clerk Hobby free tier + open source libraries)

**What we use it for:**
- **Clerk**: Social OAuth, email OTP, session management, user profiles
- **RainbowKit + Wagmi**: Wallet connection UI (MetaMask, OKX, Binance Wallet, WalletConnect, Coinbase Wallet)
- **viem**: Agent wallet generation, transaction signing, on-chain reads

**Auth + Wallet flow:**
1. User signs in via Clerk (email OTP or social OAuth) — Clerk manages the session
2. User connects wallet via RainbowKit (MetaMask, OKX, Binance Wallet, WalletConnect) — wallet address becomes the user's Web3 identity
3. Clerk user profile linked to wallet address
4. User creates agent → viem generates agent wallet → encrypted key stored in D1 (key encrypted with Clerk session token)
5. Agent registered on-chain via ERC-8004 (using agent wallet)
6. Agent earns/spends via ERC-8183 + x402 (BNB Agent SDK)
7. All agent ops signed by user's connected wallet or agent wallet via BNB Agent SDK

**Why not Supabase Auth:**
- Clerk has native SIWE/Web3 wallet auth built in
- RainbowKit fills the WalletConnect + Binance Wallet gap that Clerk lacks
- Better free tier (50K MRU vs Supabase's 50K MAU which pauses idle projects)
- Single platform for auth + session + user management

**Why not just Clerk wallets:**
- Clerk supports MetaMask, OKX, Base, Coinbase, Solana
- Missing: Binance Wallet (most popular BSC wallet) and WalletConnect (mobile users)
- RainbowKit covers both via WalletConnect + custom Binance connector

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
| Launch | Clerk Hobby + RainbowKit | Auth + wallet connection (free tier, 50K MRU) |
| >50K users | Clerk Pro ($25/mo) | MFA, passkeys, unlimited social connections |
| >100 agents | Freestyle Hobby | More VM capacity |
| >1000 agents | Freestyle Pro | Production VMs |
| Mainnet | Real BNB | Production agents |
| Revenue | x402 payments | Self-sustaining agents |
| Multi-chain | ETH/SOL adapters | Cross-chain agents |
