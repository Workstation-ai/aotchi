# AOTCHI CLI

> Last updated: Chapter 3 (The Deployment)
> See `pergamins/manifest.json` → artifacts → cli for command-level versioning.

## Overview

The CLI is the primary interface for creating and managing AOTCHI agents. Built with `commander.js` and `chalk`, with a custom neon display module.

## Entry Point

`src/cli/index.ts` — commander setup, 8 commands registered.

## Commands

| Command | Flag | Status | Since | Description |
|---------|------|--------|-------|-------------|
| `create` | `<name>` | stable | Ch.2 | Create agent. `--deploy` for on-chain, `--skill` (trading\|analysis\|alerts), `--network` (testnet\|mainnet) |
| `feed` | `<name> <amount>` | stable | Ch.2 | Fund agent balance |
| `status` | `<name>` | stable | Ch.2 | Show agent details |
| `list` | — | stable | Ch.2 | List all local agents |
| `pause` | `<name>` | stable | Ch.2 | Pause agent |
| `resume` | `<name>` | stable | Ch.2 | Resume agent |
| `ledger` | `<name>` | stable | Ch.2 | Show transaction history |
| `skills` | — | stable | Ch.2 | List available skills |

## Skill Types

- `trading` — Portfolio management, trade execution
- `analysis` — Market data analysis, reports
- `alerts` — Price alerts, notifications

## Network Support

- `testnet` (default) — BSC testnet, chain ID 97
- `mainnet` — BSC mainnet, chain ID 56 (needs real BNB)

## Display

`src/cli/display.ts` — Neon-styled terminal output with box-drawing characters, colored borders, centered text.

## Examples

```bash
aotchi create marcus-aurelius --skill trading --deploy
aotchi status marcus-aurelius
aotchi list
```
