import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { Aotchi } from "../core/aotchi.js";
const AOTCHI_DIR = () => process.env.AOTCHI_DIR || join(homedir(), ".aotchi");
const AGENTS_DIR = () => join(AOTCHI_DIR(), "agents");
const WALLET_FILE = () => join(AOTCHI_DIR(), "wallet.json");
function ensureDirs() {
    const dir = AOTCHI_DIR();
    const agents = AGENTS_DIR();
    if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });
    if (!existsSync(agents))
        mkdirSync(agents, { recursive: true });
}
function agentPath(id) {
    return join(AGENTS_DIR(), `${id}.json`);
}
export function saveAgent(aotchi) {
    ensureDirs();
    const data = {
        state: aotchi.state,
        ledger: aotchi.ledger.entries,
    };
    writeFileSync(agentPath(aotchi.state.id), JSON.stringify(data, null, 2));
}
export function loadAgent(id) {
    const path = agentPath(id);
    if (!existsSync(path))
        return null;
    const raw = readFileSync(path, "utf-8");
    const data = JSON.parse(raw);
    return Aotchi.fromState(data.state, data.ledger);
}
export function loadAllAgents() {
    ensureDirs();
    const files = readdirSync(AGENTS_DIR()).filter((f) => f.endsWith(".json"));
    return files
        .map((f) => {
        const id = f.replace(".json", "");
        return loadAgent(id);
    })
        .filter(Boolean);
}
export function deleteAgent(id) {
    const path = agentPath(id);
    if (!existsSync(path))
        return false;
    unlinkSync(path);
    return true;
}
export function saveWallet(wallet) {
    ensureDirs();
    writeFileSync(WALLET_FILE(), JSON.stringify(wallet, null, 2));
}
export function loadWallet() {
    if (!existsSync(WALLET_FILE()))
        return null;
    const raw = readFileSync(WALLET_FILE(), "utf-8");
    return JSON.parse(raw);
}
export function listAgentIds() {
    ensureDirs();
    return readdirSync(AGENTS_DIR())
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""));
}
//# sourceMappingURL=storage.js.map