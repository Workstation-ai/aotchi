import { Command } from "commander";
import { SKILLS } from "../../core/types.js";
import { NEON } from "../display.js";

export const skillsCommand = new Command("skills")
  .description("List available agent skills")
  .action(() => {
    console.log(NEON.cyan.bold("\n  🧠  AVAILABLE SKILLS\n"));

    for (const [key, skill] of Object.entries(SKILLS)) {
      const profit = skill.avgEarningPerJob * skill.avgJobsPerDay - skill.costPerDay;
      const profitable = profit > 0;

      console.log(`  ${NEON.bold(key)}`);
      console.log(`    ${NEON.dim(skill.description)}`);
      const profitStr = "+" + profit.toFixed(1);
      console.log(
        `    Cost: ${NEON.red(skill.costPerDay.toFixed(1))}/day  ·  Earnings: ~${NEON.green(
          (skill.avgEarningPerJob * skill.avgJobsPerDay).toFixed(1)
        )}/day  ·  Profit: ${profitable ? NEON.green(profitStr) : NEON.red(profitStr)}/day`
      );
      console.log();
    }
  });
