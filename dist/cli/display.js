import chalk from "chalk";
import boxen from "boxen";
import { SKILLS } from "../core/types.js";
const NEON = {
    cyan: chalk.hex("#00f0ff"),
    magenta: chalk.hex("#ff00ff"),
    green: chalk.hex("#00ff88"),
    yellow: chalk.hex("#ffcc00"),
    red: chalk.hex("#ff3366"),
    dim: chalk.hex("#666688"),
    bold: chalk.bold,
    white: chalk.hex("#eeeeff"),
};
const STATUS_STYLES = {
    egg: { icon: "🥚", color: NEON.yellow },
    active: { icon: "⚡", color: NEON.green },
    paused: { icon: "⏸", color: NEON.dim },
    starved: { icon: "💀", color: NEON.red },
};
export function banner() {
    return boxen(`${NEON.cyan.bold("A O T C H I")}\n${NEON.dim("Your Agent Creatures")}`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        title: "⚡",
        titleAlignment: "center",
    });
}
export function aotchiCard(state) {
    const style = STATUS_STYLES[state.status] || STATUS_STYLES.egg;
    const skill = SKILLS[state.skill];
    const bar = progressBar(state.balance, 20);
    const lines = [
        `${style.icon}  ${NEON.bold(state.name)} ${NEON.dim(`#${state.id}`)}`,
        ``,
        `  ${NEON.dim("Status")}    ${style.color(state.status.toUpperCase())}`,
        `  ${NEON.dim("Skill")}     ${NEON.white(skill?.name || state.skill)}`,
        `  ${NEON.dim("Balance")}   ${NEON.cyan(state.balance.toFixed(2))} AOTCHI`,
        `  ${NEON.dim("Earned")}    ${NEON.green("+" + state.totalEarned.toFixed(2))}`,
        `  ${NEON.dim("Spent")}     ${NEON.red("-" + state.totalSpent.toFixed(2))}`,
        `  ${NEON.dim("Jobs")}      ${NEON.white(String(state.jobsDone))}`,
        `  ${NEON.dim("Refill")}    ${NEON.yellow(state.nextRefillEstimate)}`,
        ``,
        `  ${bar}`,
        ``,
        `  ${NEON.dim("Born")}      ${formatDate(state.createdAt)}`,
        `  ${NEON.dim("Last")}      ${formatDate(state.lastActiveAt)}`,
    ];
    return boxen(lines.join("\n"), {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 1, right: 1 },
        borderStyle: "round",
        borderColor: state.status === "active" ? "green" : state.status === "starved" ? "red" : "gray",
        title: state.name,
        titleAlignment: "left",
    });
}
export function aotchiListCard(state) {
    const style = STATUS_STYLES[state.status] || STATUS_STYLES.egg;
    const skill = SKILLS[state.skill];
    return [
        `  ${style.icon}  ${NEON.bold(state.name)} ${NEON.dim(`#${state.id}`)}  ${style.color(state.status)}`,
        `     ${NEON.dim(skill?.name || state.skill)} · ${NEON.cyan(state.balance.toFixed(2))} AOTCHI`,
        `     ${NEON.green("+" + state.totalEarned.toFixed(2))} earned · ${state.jobsDone} jobs`,
    ].join("\n");
}
export function walletCard(balance, address) {
    const bar = progressBar(balance, 30);
    const addr = address || "0x0000...0000";
    return boxen([
        `${NEON.cyan.bold("💰  WALLET")}`,
        ``,
        `  ${NEON.dim("Balance")}  ${NEON.cyan.bold(balance.toFixed(2))} AOTCHI`,
        `  ${NEON.dim("Address")}  ${NEON.white(addr)}`,
        ``,
        `  ${bar}`,
    ].join("\n"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "yellow",
    });
}
export function eggAnimation(name) {
    return [
        ``,
        `  ${NEON.yellow("🥚")}  ${NEON.dim("Hatching")} ${NEON.bold(name)}...`,
        ``,
        `     ╭──────╮`,
        `     │  ${NEON.cyan("??")}  │`,
        `     │  ${NEON.dim("~~~~")}  │`,
        `     ╰──────╯`,
        ``,
        `  ${NEON.green("⚡")}  ${NEON.bold(name)} ${NEON.green("is alive!")}`,
        ``,
    ].join("\n");
}
export function starvationWarning(name) {
    return boxen([
        `${NEON.red.bold("⚠  STARVATION WARNING")}`,
        ``,
        `  ${NEON.white(name)} has no balance left.`,
        `  It cannot work until fed.`,
        ``,
        `  ${NEON.dim("$")} aotchi feed ${name} <amount>`,
    ].join("\n"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "red",
    });
}
export function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1)
        return "just now";
    if (diffMin < 60)
        return `${diffMin}m ago`;
    if (diffHr < 24)
        return `${diffHr}h ago`;
    return `${diffDay}d ago`;
}
function progressBar(value, width) {
    const maxEstimate = 100;
    const ratio = Math.min(value / maxEstimate, 1);
    const filled = Math.round(ratio * width);
    const empty = width - filled;
    const color = ratio > 0.6 ? NEON.green : ratio > 0.3 ? NEON.yellow : NEON.red;
    const filledBar = color("█".repeat(filled));
    const emptyBar = NEON.dim("░".repeat(empty));
    return `${filledBar}${emptyBar}  ${NEON.dim((ratio * 100).toFixed(0))}%`;
}
export { NEON };
//# sourceMappingURL=display.js.map