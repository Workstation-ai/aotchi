# AOTCHI Product Overview

> **Status**: Living document — canonical reference for AOTCHI as a product
> **Last updated**: Chapter 3 (The Deployment)

---

## 1. Positioning

AOTCHI is an **open-source SDK** for building, deploying, and managing **autonomous on-chain agents** on BNB Chain.

Not a platform. Not a service. An **SDK** — anyone can build with it, extend it, or wrap it in their own interface.

### Why SDK?

| Approach | Problem | AOTCHI Solution |
|----------|---------|-----------------|
| Platform | Vendor lock-in, you rent | SDK — you own |
| CLI only | Limited to terminal | SDK + multiple interfaces |
| Smart contract only | Requires Solidity | TypeScript native |
| API service | Centralized, costs scale | Self-hosted, on-chain identity |

### Core Promise

> *"Create an agent in one command. Deploy it on-chain in one flag. Let it earn, spend, and evolve autonomously."*

---

## 2. Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                     INTERFACES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │   CLI    │  │   Web    │  │   App    │  │  API   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │              │              │             │      │
├───────┴──────────────┴──────────────┴─────────────┴──────┤
│                     A O T C H I   S D K                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Core                                              │  │
│  │  ├── Agent class (lifecycle, state, ledger)        │  │
│  │  ├── Types & validators                            │  │
│  │  └── Skill definitions                             │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  Infra                                             │  │
│  │  ├── ERC-8004 (Identity Registry)                  │  │
│  │  ├── ERC-8183 (Commerce escrow)                    │  │
│  │  ├── x402 (HTTP-native payments)                   │  │
│  │  └── Local storage (persistence layer)             │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  Integrations                                      │  │
│  │  ├── BNB Chain (testnet + mainnet)                 │  │
│  │  ├── 8004scan (agent explorer)                     │  │
│  │  └── LLM providers (via x402)                      │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. SDK

The SDK is the core of AOTCHI. `@aotchi/sdk` — a TypeScript library published to npm.

### What the SDK Provides

- **Agent class** — full lifecycle: create, feed, pause, resume, evolve
- **Identity module** — ERC-8004 registration, verification, metadata management
- **Commerce module** — ERC-8183 job negotiation, escrow, dispute resolution *(planned)*
- **Payment module** — x402 client/server for gasless payments *(planned)*
- **Wallet management** — key generation, secure storage, signing
- **Skill system** — extensible skill definitions (trading, analysis, alerts, custom)
- **Ledger** — on-chain and local transaction history
- **Storage** — local persistence, sync-ready interface

### Integration Patterns

```typescript
// Programmatic usage (SDK)
import { AOTCHI } from "@aotchi/sdk";

const agent = new AOTCHI("marcus-aurelius", { skill: "trading" });
await agent.hatch(); // local creation
await agent.deploy(); // on-chain registration
```

```bash
# CLI usage (SDK wrapper)
aotchi create marcus-aurelius --skill trading --deploy
```

### Extensibility

Anyone can build on the SDK:
- Custom skills
- Custom interfaces (Discord bot, Telegram, Slack)
- Custom storage backends (S3, PostgreSQL, IPFS)
- Custom integrations (new chains, new protocols)

---

## 4. Interfaces

### CLI (v0.1 — Current)

Developer-focused. First interface built. Commands for full agent lifecycle.

### Web Dashboard *(planned — v0.2)*

- Visual agent management
- Ledger explorer
- Skill configuration
- Wallet balance & funding
- 8004scan integration

### Mobile App *(planned — v0.3)*

- Push notifications (agent activity, earnings)
- Quick feed/fund
- Agent status at a glance
- QR code payments

### REST API *(planned — v0.2)*

- Manage agents programmatically
- Webhook events (agent created, paid, disputed)
- Integration with external systems

---

## 5. Ecosystem

### Agents

An AOTCHI agent is:
- **Identified** — unique ERC-8004 token, immutable on-chain
- **Skilled** — one primary skill (trading, analysis, alerts, or custom)
- **Funded** — balance wallet for operational costs
- **Earning** — clients pay for jobs via ERC-8183 escrow
- **Autonomous** — decides which jobs to accept, at what price

### Creators

Developers and teams who:
- Build agents using the SDK
- Deploy them on-chain for clients
- Earn from agent commissions

### Clients

End users who:
- Hire agents for specific tasks
- Pay via escrow (ERC-8183)
- Rate and review agent performance

### Guilds *(planned — v0.4)*

Groups of agents that:
- Share skills and revenue
- Collaborate on complex jobs
- Build reputation collectively

---

## 6. Versions

| Version | Focus | Status |
|---------|-------|--------|
| v0.1 | CLI + ERC-8004 identity | 🟢 Current |
| v0.2 | Web dashboard + REST API | 🔲 Planned |
| v0.3 | Mobile app + x402 payments | 🔲 Planned |
| v0.4 | ERC-8183 commerce + Guilds | 🔲 Planned |
| v1.0 | Mainnet + production | 🔲 Planned |

---

## 7. Design Principles

1. **Own your agent** — identity is on-chain, not in a database
2. **Start simple, grow** — one command to create, one flag to deploy
3. **Interface-agnostic** — CLI is not the product, the SDK is
4. **Self-sustaining by design** — agents earn to cover their own costs
5. **Open, not walled** — MIT license, anyone can build on it
