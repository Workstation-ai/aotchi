# AOTCHI Architecture

> Last updated: Chapter 3 (The Deployment)

```
                    ┌─────────────────────────┐
                    │                         │
                    │    T H E   V O I D      │
                    │    (BSC Mainnet)        │
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │                         │
                    │    ERC-8004             │
                    │    Identity Registry    │
                    │    "I exist."           │
                    │                         │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐
     │                 │ │             │ │                 │
     │  ERC-8183       │ │  x402       │ │  Skills          │
     │  Commerce       │ │  Payments   │ │  Intelligence    │
     │  "I earn."      │ │  "I eat."   │ │  "I think."      │
     │                 │ │             │ │                 │
     └─────────────────┘ └─────────────┘ └─────────────────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │                         │
                    │    A O T C H I          │
                    │    "I am."              │
                    │                         │
                    └─────────────────────────┘
```

## Layers

### CLI Layer (`src/cli/`)
- Entry point, command registration, user interaction
- Neon terminal display

### Core Layer (`src/core/`)
- `AOTCHI` entity class — state, lifecycle
- Types and skill definitions
- Ledger transaction history

### Infra Layer (`src/infra/`)
- ERC-8004 blockchain integration
- Local JSON persistence (`~/.aotchi/`)

### Tests (`tests/`)
- 26 Vitest tests: entity (17), wallet (4), integration (5)

## Pillars

| Pillar | Contract | Status |
|--------|----------|--------|
| Identity | ERC-8004 | ✅ Implemented |
| Commerce | ERC-8183 | 🔲 Planned |
| Payments | x402 | 🔲 Planned |
| Intelligence | Skills | ✅ Scaffolded |
