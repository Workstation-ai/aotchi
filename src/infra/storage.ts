import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { AotchiState, LedgerEntry } from "../core/types.js";
import { Aotchi } from "../core/aotchi.js";

const AOTCHI_DIR = () => process.env.AOTCHI_DIR || join(homedir(), ".aotchi");
const AGENTS_DIR = () => join(AOTCHI_DIR(), "agents");
const WALLET_FILE = () => join(AOTCHI_DIR(), "wallet.json");

interface WalletData {
  address: string;
  balance: number;
  mnemonic?: string;
}

interface AgentData {
  state: AotchiState;
  ledger: LedgerEntry[];
}

function ensureDirs(): void {
  const dir = AOTCHI_DIR();
  const agents = AGENTS_DIR();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(agents)) mkdirSync(agents, { recursive: true });
}

function agentPath(id: string): string {
  return join(AGENTS_DIR(), `${id}.json`);
}

export function saveAgent(aotchi: Aotchi): void {
  ensureDirs();
  const data: AgentData = {
    state: aotchi.state,
    ledger: aotchi.ledger.entries,
  };
  writeFileSync(agentPath(aotchi.state.id), JSON.stringify(data, null, 2));
}

export function loadAgent(id: string): Aotchi | null {
  const path = agentPath(id);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8");
  const data: AgentData = JSON.parse(raw);
  return Aotchi.fromState(data.state, data.ledger);
}

export function loadAllAgents(): Aotchi[] {
  ensureDirs();
  const files = readdirSync(AGENTS_DIR()).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => {
      const id = f.replace(".json", "");
      return loadAgent(id)!;
    })
    .filter(Boolean);
}

export function deleteAgent(id: string): boolean {
  const path = agentPath(id);
  if (!existsSync(path)) return false;
  unlinkSync(path);
  return true;
}

export function saveWallet(wallet: WalletData): void {
  ensureDirs();
  writeFileSync(WALLET_FILE(), JSON.stringify(wallet, null, 2));
}

export function loadWallet(): WalletData | null {
  if (!existsSync(WALLET_FILE())) return null;
  const raw = readFileSync(WALLET_FILE(), "utf-8");
  return JSON.parse(raw);
}

export function listAgentIds(): string[] {
  ensureDirs();
  return readdirSync(AGENTS_DIR())
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}
