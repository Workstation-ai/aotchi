#!/usr/bin/env node
import { Command } from "commander";
import { createCommand } from "./commands/create.js";
import { statusCommand } from "./commands/status.js";
import { feedCommand } from "./commands/feed.js";
import { listCommand } from "./commands/list.js";
import { pauseCommand } from "./commands/pause.js";
import { resumeCommand } from "./commands/resume.js";
import { ledgerCommand } from "./commands/ledger.js";
import { skillsCommand } from "./commands/skills.js";
const program = new Command();
program
    .name("aotchi")
    .description("Your Agent Creatures — Autonomous on-chain agents with identity, commerce, and payments.")
    .version("0.1.0");
program.addCommand(createCommand);
program.addCommand(statusCommand);
program.addCommand(feedCommand);
program.addCommand(listCommand);
program.addCommand(pauseCommand);
program.addCommand(resumeCommand);
program.addCommand(ledgerCommand);
program.addCommand(skillsCommand);
program.parse();
//# sourceMappingURL=index.js.map