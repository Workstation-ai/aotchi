import { Command } from "commander";
import { loadAllAgents } from "../../infra/storage.js";
import { NEON } from "../display.js";
export const ledgerCommand = new Command("ledger")
    .description("Show an AOTCHI's transaction history")
    .argument("<name>", "Agent name")
    .option("-n, --count <number>", "Number of recent entries", "10")
    .action((name, opts) => {
    const count = parseInt(opts.count, 10);
    const agents = loadAllAgents();
    const agent = agents.find((a) => a.state.name.toLowerCase() === name.toLowerCase());
    if (!agent) {
        console.error(NEON.red(`  ✗ No AOTCHI named "${name}"`));
        process.exit(1);
    }
    const entries = agent.ledger.getRecent(count);
    if (entries.length === 0) {
        console.log(NEON.dim(`\n  No transactions for ${name} yet.\n`));
        return;
    }
    console.log(NEON.cyan.bold(`\n  📒  LEDGER — ${name}\n`));
    for (const e of entries) {
        const sign = e.type === "credit" ? "+" : "-";
        const color = e.type === "credit" ? NEON.green : NEON.red;
        const time = new Date(e.timestamp).toLocaleTimeString();
        console.log(`  ${NEON.dim(time)}  ${color(`${sign}${e.amount.toFixed(2)}`)}  ${NEON.dim(e.description)}`);
    }
    console.log();
});
//# sourceMappingURL=ledger.js.map