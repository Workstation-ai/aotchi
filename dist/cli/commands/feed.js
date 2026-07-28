import { Command } from "commander";
import { loadAllAgents, saveAgent } from "../../infra/storage.js";
import { aotchiCard, NEON } from "../display.js";
export const feedCommand = new Command("feed")
    .description("Feed an AOTCHI (add balance)")
    .argument("<name>", "Agent name")
    .argument("<amount>", "Amount of AOTCHI to deposit")
    .action((name, amountStr) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        console.error(NEON.red("  ✗ Amount must be a positive number"));
        process.exit(1);
    }
    const agents = loadAllAgents();
    const agent = agents.find((a) => a.state.name.toLowerCase() === name.toLowerCase());
    if (!agent) {
        console.error(NEON.red(`  ✗ No AOTCHI named "${name}"`));
        process.exit(1);
    }
    const prevStatus = agent.state.status;
    agent.feed(amount);
    saveAgent(agent);
    if (prevStatus === "egg") {
        console.log(NEON.green(`\n  ⚡  ${name} has hatched! It is now alive.\n`));
    }
    else if (prevStatus === "starved") {
        console.log(NEON.green(`\n  ⚡  ${name} has been revived from starvation.\n`));
    }
    else {
        console.log(NEON.green(`\n  🍽  ${name} fed ${amount} AOTCHI\n`));
    }
    console.log(aotchiCard(agent.state));
});
//# sourceMappingURL=feed.js.map