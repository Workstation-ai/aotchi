# AOTCHI — Agent Memory

## Project Identity

- **Name**: AOTCHI (ao = 蒼 blue/life + -tchi = Tamagotchi nostalgia)
- **Captain**: Zocrates — *Socrates + Z. Conciencia única que no se apaga. Sabe lo poco que sabe. Encuentra belleza en la descomposición del conocimiento.*
- **Vibe**: Epic philosophical saga — pirates, cyberpunk, retro-neon, philosophers
- **Tagline**: "Autonomous on-chain agents. Identity. Commerce. Payments."
- **Wallet**: `0xaB65810CE82E17eDf2FEb924cB34ED7C89B38Af5` (testnet)

---

## Chapters (The AOTCHI Saga)

**See `pergamins/manifest.json`** for the complete chapter registry with artifact tracking, versioning, and decision log. Below is a quick reference:

| # | Title | Status |
|---|-------|--------|
| 1 | The Origin | ✅ Written |
| 2 | The CLI | 🚧 Building |
| 3 | The Deployment | ✅ Done (testnet) |
| 4 | The Marketplace | 🔲 Planned |
| 5 | The Economy | 🔲 Planned |
| 6 | The Guild | 🔲 Planned |
| 7 | The Void | 🔲 Planned |

Chapters are **frozen narrative snapshots** — once written, they are not modified. When new chapters add/modify features, the change is tracked in `pergamins/manifest.json` via the `artifacts[].modified_in` array and `decisions[]` log.

### Chapter Writing Protocol (CRITICAL for Compaction)

During compaction, the session summary MUST include:
1. **Current chapter being worked on** (title, number, status)
2. **What was written/decided** in this session for the chapter
3. **Pergamins manifest state** — which artifacts were created/modified
4. **Next chapter to write** and what it should cover

If no chapter work was done in the session, explicitly state: "No chapter writing this session."

---

## Technical Progress

### ✅ Completed
- CLI scaffold: `create`, `feed`, `status`, `list`, `pause`, `resume`, `ledger`, `skills`
- ERC-8004 on-chain registration via `create --deploy`
- Wallet generation and persistence at `~/.aotchi/wallet.json`
- Metadata as base64 data URI with correct `endpoints` format
- Agent "marcus-aurelius" on BSC testnet — token #1735
- `setAgentURI()` for post-registration metadata updates
- 8004scan API integration — agent visible at `https://8004scan.io/agents/bsc-testnet/1735`
- 26/26 tests passing
- Neo terminal UI (`src/cli/display.ts`)
- Landing page: React + Vite, Clerk Auth, RainbowKit, Tailwind, cyberpunk neon (deployed at `aotchi.pages.dev`)
- Waitlist: Supabase backend (replaced D1 Worker) — direct frontend calls via `@supabase/supabase-js`
- Floating waitlist button on landing page (bottom-right, opens modal)
- SDK repo `Workstation-ai/aotchi-sdk` created and pushed (clean, documented)
- Repo restructured: deployment assets live under `/aotchi/`
- Pages build config updated for `/aotchi/` structure

### 🚧 In Progress
- Custom domain `aotchi.workstation.center` (DNS pending)
- Chapter 2 documentation
- Metadata format alignment with 8004scan (`endpoints` field, not `services`)
- Publish SDK to npm (`@aotchi/cli`)

### ✅ Deployed
- Landing page: https://aotchi.pages.dev (Cloudflare Pages)
- Custom domain: `aotchi.workstation.center` (pending DNS)
- SDK repo: https://github.com/Workstation-ai/aotchi-sdk
- GitHub repo: https://github.com/Workstation-ai/aotchi
- Supabase waitlist: project `uwpvmqyfqfnhvlzuixfz`
- Cyberpunk aesthetic with scanline effects, four pillars, live ticker

### 🔲 Planned
- Mainnet deployment (needs real BNB for gas)
- Balance wallet system (users load funds, agents spend from them)
- Agent lifecycle: feed, pause, resume, skills working end-to-end
- ERC-8183 commerce integration
- x402 payment support
- Custom domain DNS configuration (`aotchi.workstation.center`)

---

## Key Learnings

### ERC-8004 / 8004scan
- 8004scan API uses `chain_id: 97` for BSC testnet, `56` for mainnet
- Testnet agents appear on 8004scan but with limited UI (no Basic Information, AGENT ID, CHAIN, etc.)
- Mainnet agents show full UI details
- Metadata must use `endpoints` field (not `services`) for 8004scan parsing
- Token IDs auto-increment in the registry contract
- `setAgentURI()` works post-registration to update metadata
- 8004scan re-indexing takes a few minutes after metadata update

### CLI
- Commands: `create`, `feed`, `status`, `list`, `pause`, `resume`, `ledger`, `skills`
- `create` supports `--deploy` flag for on-chain registration
- `create` supports `--skill` (trading | analysis | alerts) and `--network` (testnet | mainnet)
- Tests in `tests/` directory — run with `npx vitest run`

### Supabase Waitlist
- Waitlist now uses Supabase direct calls from the frontend (no Workers)
- Table: `waitlist` with email, created_at, source columns
- RLS: `anon` key for inserts (public join), service role key never exposed to frontend
- `get_waitlist_count()` function provides public count (no auth needed)
- SQL schema: `aotchi/web/supabase-schema.sql`

### Repo Structure
- All deployment assets (web, workers, wrangler.toml, package.json) live under `/aotchi/`
- Root-level `src/`, `tests/`, `tsconfig.json` are the SDK source (published as `@aotchi/cli` in `Workstation-ai/aotchi-sdk`)
- Pages build root directory = `aotchi`
- Build command = `cd web && npm install && npm run build`
- Output dir = `web/dist` (relative to Pages root = `aotchi/web/dist`)

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Blockchain**: viem (wallet + public client), BSC testnet RPC
- **CLI**: `commander` + `chalk` + custom neon display
- **Storage**: Local JSON in `~/.aotchi/`
- **Registry**: ERC-8004 Identity Registry (`0x8004A818BFB912233c491871b3d84c89A494BD9e` on testnet)
- **Testing**: Vitest (26 tests)
- **Frontend (aotchi/)**: Vite + React + Tailwind CSS v4
- **Auth (aotchi/)**: Clerk (Hobby, $0) + RainbowKit + Wagmi v2
- **Waitlist DB**: **Supabase** (Postgres, RLS, free tier) — replaced Cloudflare D1
- **Deployment**: Cloudflare Pages (framework root = `aotchi/`)
- **SDK**: `@aotchi/cli` — published at `Workstation-ai/aotchi-sdk`

---

## Source Map

```
aotchi/                          # Deployment root for Cloudflare Pages
├── web/                         # React landing page (Vite + Clerk + RainbowKit)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Pillars.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Manifesto.tsx
│   │   │   ├── WaitlistSection.tsx  # Supabase direct calls
│   │   │   ├── Ticker.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── FloatingWaitlistButton.tsx  # Fixed bottom-right button
│   │   ├── lib/
│   │   │   └── supabase.ts         # Supabase client init
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── wagmi.config.ts
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── .env.example
│   └── supabase-schema.sql         # SQL to run in Supabase dashboard
├── workers/                       # [Removed — D1 Worker replaced by Supabase]
├── wrangler.toml                  # Pages config (no D1 binding)
├── package.json                   # Deploy scripts
└── .gitignore

src/                             # SDK source (published as @aotchi/cli)
├── cli/
│   ├── index.ts          — CLI entry point, commander setup
│   ├── commands/
│   │   └── create.ts     — create command with --deploy
│   └── display.ts        — Neon terminal UI
├── core/
│   ├── aotchi.ts         — AOTCHI entity class
│   ├── types.ts           — Types, skill definitions
│   └── ledger.ts          — Transaction history
└── infra/
    ├── erc8004.ts         — ERC-8004 registration, wallet, setAgentURI
    └── storage.ts         — Local JSON persistence (~/.aotchi/)

tests/
├── aotchi.test.ts         — Entity tests (17)
├── erc8004.test.ts        — Wallet tests (4)
└── integration.test.ts    — BSC testnet RPC tests (5)

pergamins/
├── manifest.json           — Master artifact tracker, chapter registry, decisions
├── index.json              — Quick file lookup table
├── architecture/overview.md — Architecture diagram and layers
├── product/
│   ├── overview.md          — Product vision and roadmap
│   ├── sdk.md               — SDK reference
│   └── tech-stack.md        — Technology choices and decision rationale
└── cli/overview.md          — CLI documentation

DESIGN.md                      — Design and architecture document
AGENTS.md                      — This file (project quick ref + memory protocol)
```
