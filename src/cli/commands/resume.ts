import { Command } from "commander";
import { loadAllAgents, saveAgent } from "../../infra/storage.js";
import { NEON } from "../display.js";

export const resumeCommand = new Command("resume")
  .description("Resume a paused AOTCHI")
  .argument("<name>", "Agent name")
  .action((name: string) => {
    const agents = loadAllAgents();
    const agent = agents.find((a) => a.state.name.toLowerCase() === name.toLowerCase());
    if (!agent) {
      console.error(NEON.red(`  ✗ No AOTCHI named "${name}"`));
      process.exit(1);
    }

    agent.resume();
    saveAgent(agent);
    console.log(NEON.green(`\n  ⚡  ${name} resumed. Back to work.\n`));
  });
