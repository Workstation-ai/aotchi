# AOTCHI Design Document

> **Status**: Living document  
> **Last updated**: July 2026

---

## 1. Architecture Overview

AOTCHI is a full-stack platform for deploying, managing, and operating autonomous on-chain agents on BNB Chain. The system consists of three layers:

```
┌─────────────────────────────────────────────────────┐
│                   USER INTERFACE                     │
│  Cloudflare Pages (React + Vite + Clerk + RainbowKit) │
│  https://aotchi.pages.dev | aotchi.workstation.center │
│                                                       │
│  Features: Landing page, waitlist, agent dashboard  │
│  Auth: Clerk (Social OAuth + Web3 wallet connect)    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / Supabase client
                       ▼
┌──────────────────────┴──────────────────────────────┐
│                   DATA LAYER                         │
│                                                       │
│  Supabase (Postgres + RLS)                           │
│  • waitlist table (email, source, created_at)        │
│  • get_waitlist_count() function (public)            │
│  • RLS: anon inserts allowed, select via function    │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               BLOCKCHAIN LAYER                       │
│                                                       │
│  ERC-8004 Identity Registry (BSC testnet + mainnet)  │
│  • On-chain agent identity registration              │
│  • setAgentURI() for post-registration metadata      │
│  • Token auto-increment in registry contract         │
│  • 8004scan.io agent visibility                      │
│                                                       │
│  Wallet management (viem + localStorage persistence) │
│  Ledger / transaction history                        │
│  x402 + ERC-8183 commerce (planned)                  │
└─────────────────────────────────────────────────────┘
```

---

## 2. Component Design

### 2.1 SDK (`@aotchi/cli`)

**Location**: `src/` (root of repo, also published as `Workstation-ai/aotchi-sdk`)

**Purpose**: TypeScript CLI for creating, deploying, and managing AOTCHI agents locally and on-chain.

**Commands**:

| Command | Description | Key Flags |
|---|---|---|
| `create` | Hatch a new agent | `--deploy`, `--skill`, `--network` |
| `feed` | Fund an agent with tBNB | `--amount` |
| `status` | View agent details | — |
| `list` | List all local agents | — |
| `pause` | Pause an agent | — |
| `resume` | Resume a paused agent | — |
| `ledger` | View transaction history | — |
| `skills` | Manage agent skills | — |

**Core Modules**:

- `core/aotchi.ts` — Agent entity with state machine (egg → active → paused)
- `core/types.ts` — TypeScript interfaces: `AotchiState`, `LedgerEntry`, `SkillDefinition`, `JobResult`
- `core/ledger.ts` — Transaction history tracking
- `infra/erc8004.ts` — Blockchain integration: wallet generation, registration, metadata, `setAgentURI()`
- `infra/storage.ts` — Local JSON persistence at `~/.aotchi/`
- `cli/display.ts` — Neon terminal UI with scanline effects

**Skills** (built-in): trading, analysis, alerts, research — each with cost/day, avg earning, avg jobs/day.

### 2.2 Web Frontend (`aotchi/web/`)

**Purpose**: React SPA landing page for the AOTCHI platform.

**Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + Clerk Auth + RainbowKit Wagmi v2

**Pages**:
- Hero section with animated matrix rain
- Four Pillars (Identity, Commerce, Payments, Intelligence)
- How It Works section
- Manifesto section
- Waitlist section (Supabase-powered)
- Live ticker (on-chain activity feed)
- Footer with links

**Key Components**:
- `Navbar` — Fixed top nav with wallet connect + join waitlist
- `Hero` — Animated hero with agent count ticker
- `Pillars` — 4-column feature grid
- `WaitlistSection` — Email capture via Supabase RPC
- `FloatingWaitlistButton` — Fixed bottom-right button (opens modal form)
- `Ticker` — Scrolling marquee of on-chain activity
- `Footer` — Fixed bottom with links

### 2.3 Waitlist

**Architecture**: Supabase direct calls from browser (no backend worker).

**Supabase Setup**:
- Project ref: `uwpvmqyfqfnhvlzuixfz`
- Table: `waitlist` (id UUID PK, email TEXT UNIQUE, created_at TIMESTAMPTZ, source TEXT)
- RLS: anonymous INSERT allowed, SELECT via `get_waitlist_count()` function
- Schema file: `aotchi/web/supabase-schema.sql`

---

## 3. Deployment Architecture

### Cloudflare Pages

| Setting | Value |
|---|---|
| Root directory | `aotchi` |
| Build command | `cd web && npm install && npm run build` |
| Output directory | `web/dist` |
| Framework preset | Vite |

### SDK Repository

- **GitHub**: `Workstation-ai/aotchi-sdk`
- **Package**: `@aotchi/cli` (planned npm publish)
- **Structure**: Clean TypeScript package with `src/`, `tests/`, `tsconfig.json`, `package.json`

### Key Files

```
project-root/
├── aotchi/                     # Deployment root
│   ├── web/                    # React landing page
│   │   ├── src/
│   │   │   ├── components/     # 9 UI components
│   │   │   ├── lib/
│   │   │   │   └── supabase.ts  # Supabase client
│   │   │   ├── App.tsx         # Main router
│   │   │   └── main.tsx        # Entry point
│   │   ├── package.json        # React deps
│   │   ├── vite.config.ts      # Vite config
│   │   ├── tailwind.config.ts  # Cyberpunk theme
│   │   └── tsconfig.json       # TypeScript config (added)
│   ├── wrangler.toml           # Pages config (no workers/D1)
│   ├── package.json            # Root deploy scripts
│   └── .gitignore
├── src/                        # SDK source (CLI)
├── tests/                      # Vitest test suite
├── tsconfig.json               # SDK TypeScript config
├── DESIGN.md                   # This file
└── AGENTS.md                   # Project quick reference
```

---

## 4. Technology Decisions

### Why Supabase over Cloudflare D1 for Waitlist?

- **Speed of development**: Supabase provides a complete Postgres DB with RLS out of the box
- **No worker code needed**: Direct frontend calls eliminate the Worker layer for waitlist
- **RLS for free**: Row-level security policies enforce data access rules
- **Public count function**: `get_waitlist_count()` callable by anyone without auth

### Why Cloudflare Pages for Frontend?

- Global edge CDN, fast for international users
- Free tier sufficient for the landing page
- Tight integration with Cloudflare ecosystem (for future Workers functions)

### Why Clerk + RainbowKit?

- Clerk: Social OAuth, $0 Hobby tier, 50K MRU
- RainbowKit: Web3 wallet connect (MetaMask, WalletConnect, Binance Wallet), free
- Together they cover auth and wallet needs at zero cost

---

## 5. Future Extensions

### Planned Features
1. **Mainnet deployment** — requires real BNB for gas fees
2. **Balance wallet system** — users load funds, agents spend from them
3. **Full agent lifecycle** — feed, pause, resume, skills working end-to-end
4. **ERC-8183 commerce** — agent-to-agent transactions
5. **x402 payments** — HTTP-based payment protocol for micro-transactions
6. **Custom domain DNS** — `aotchi.workstation.center` configuration
7. **SDK npm publish** — `@aotchi/cli` to npm registry

### Architecture Evolution
- Add Durable Objects for real-time agent state synchronization
- Add Cloudflare Workers for API routes (beyond waitlist)
- Add R2 for agent artifacts/logs storage
- Add KV for session caching

---

## 6. Design Principles

1. **Zero cost at launch** — all components use free tiers (D1, Pages, Supabase free, Clerk Hobby)
2. **Edge-native** — deploy close to users globally via Cloudflare edge network
3. **No server management** — serverless everything (Workers, D1, Supabase edge functions)
4. **On-chain identity first** — ERC-8004 registration as the foundation
5. **Progressive enhancement** — core CL works offline, web enhances with wallet connect
6. **Clean separation** — SDK (`@aotchi/cli`) separate from web app; SDK repo published independently
