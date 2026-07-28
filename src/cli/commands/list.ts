import { Command } from "commander";
import { loadAllAgents } from "../../infra/storage.js";
import { aotchiListCard, NEON } from "../display.js";

export const listCommand = new Command("list")
  .description("List all AOTCHIs")
  .action(() => {
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
    console.log(NEON.dim(`  ${agents.length} agent(s) total\n`));
  });
