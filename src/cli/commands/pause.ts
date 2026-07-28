import { Command } from "commander";
import { loadAllAgents, saveAgent } from "../../infra/storage.js";
import { NEON } from "../display.js";

export const pauseCommand = new Command("pause")
  .description("Pause an AOTCHI (stop all activity)")
  .argument("<name>", "Agent name")
  .action((name: string) => {
    const agents = loadAllAgents();
    const agent = agents.find((a) => a.state.name.toLowerCase() === name.toLowerCase());
    if (!agent) {
      console.error(NEON.red(`  ✗ No AOTCHI named "${name}"`));
      process.exit(1);
    }

    agent.pause();
    saveAgent(agent);
    console.log(NEON.yellow(`\n  ⏸  ${name} paused. It will not work until resumed.\n`));
  });
