import { Command } from "commander";
import { loadAllAgents } from "../../infra/storage.js";
import { aotchiCard, aotchiListCard, NEON } from "../display.js";

export const statusCommand = new Command("status")
  .description("Show AOTCHI status")
  .argument("[name]", "Agent name (omit for all)")
  .action((name?: string) => {
    if (name) {
      const agents = loadAllAgents();
      const agent = agents.find((a) => a.state.name.toLowerCase() === name.toLowerCase());
      if (!agent) {
        console.error(NEON.red(`  ✗ No AOTCHI named "${name}"`));
        process.exit(1);
      }
      console.log(aotchiCard(agent.state));
      return;
    }

    const agents = loadAllAgents();
    if (agents.length === 0) {
      console.log(NEON.dim("\n  No AOTCHIs found. Create one with:"));
      console.log(NEON.cyan("  $ aotchi create <name> --skill trading\n"));
      return;
    }

    console.log(NEON.cyan.bold("\n  ⚡  YOUR AOTCHIS\n"));
    for (const agent of agents) {
      console.log(aotchiListCard(agent.state));
      console.log();
    }
  });
