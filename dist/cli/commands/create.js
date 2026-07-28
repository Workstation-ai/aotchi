import { Command } from "commander";
import { Aotchi } from "../../core/aotchi.js";
import { SKILLS } from "../../core/types.js";
import { saveAgent } from "../../infra/storage.js";
import { registerAgent, getOrCreateWallet, getBalance } from "../../infra/erc8004.js";
import { banner, eggAnimation, aotchiCard, NEON } from "../display.js";
export const createCommand = new Command("create")
    .description("Hatch a new AOTCHI")
    .argument("<name>", "Name of the agent")
    .option("-s, --skill <skill>", "Agent skill type", "trading")
    .option("-d, --description <desc>", "Custom description")
    .option("--deploy", "Register on ERC-8004 (on-chain identity)")
    .option("--network <network>", "Network: testnet or mainnet", "testnet")
    .action(async (name, opts) => {
    console.log(banner());
    const skill = SKILLS[opts.skill];
    if (!skill) {
        console.error(NEON.red(`  ✗ Unknown skill "${opts.skill}"`));
        console.error(NEON.dim(`  Available: ${Object.keys(SKILLS).join(", ")}`));
        process.exit(1);
    }
    const aotchi = Aotchi.create({
        name,
        skill: opts.skill,
        description: opts.description,
    });
    if (opts.deploy) {
        const wallet = getOrCreateWallet();
        aotchi.state.address = wallet.address;
        console.log(NEON.dim(`  🔑 Wallet: ${wallet.address}`));
        const balance = await getBalance(wallet.address, opts.network);
        const balFloat = parseFloat(formatEther(balance));
        if (balFloat < 0.005) {
            console.log(NEON.red(`  ✗ Insufficient tBNB: ${balFloat.toFixed(6)}`));
            console.log(NEON.yellow(`  Fund your wallet at:`));
            console.log(NEON.cyan(`    https://www.bnbchain.org/en/testnet-faucet`));
            console.log(NEON.cyan(`    Address: ${wallet.address}`));
            console.log(NEON.dim(`    Required: ~0.005 tBNB for gas`));
            console.log();
            console.log(NEON.dim(`  Then re-run:`));
            console.log(NEON.cyan(`    aotchi create ${name} --skill ${opts.skill} --deploy`));
            saveAgent(aotchi);
            process.exit(1);
        }
        const metadata = {
            type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
            name: name,
            description: opts.description || skill.description,
            image: "",
            endpoints: [
                {
                    name: skill.name,
                    endpoint: "https://aotchi.app/agents/" + aotchi.state.id,
                    version: "0.1.0",
                },
            ],
            registrations: [],
        };
        const agentURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString("base64")}`;
        try {
            console.log();
            const result = await registerAgent(name, agentURI, opts.network);
            aotchi.state.onChain = {
                agentId: result.agentId.toString(),
                network: opts.network,
                txHash: result.txHash,
                explorerUrl: result.explorerUrl,
                scanUrl: result.scanUrl,
                registeredAt: new Date().toISOString(),
            };
            saveAgent(aotchi);
            console.log();
            console.log(NEON.green(`  ✓ Agent "${name}" registered on ERC-8004!`));
            console.log(NEON.dim(`    Agent ID:  ${result.agentId}`));
            console.log(NEON.dim(`    TX Hash:   ${result.txHash}`));
            console.log(NEON.dim(`    Explorer:  ${result.explorerUrl}`));
            console.log(NEON.dim(`    8004scan:  ${result.scanUrl}`));
            console.log();
            console.log(aotchiCard(aotchi.state));
        }
        catch (err) {
            saveAgent(aotchi);
            console.error(NEON.red(`  ✗ Registration failed: ${err.message}`));
            process.exit(1);
        }
    }
    else {
        saveAgent(aotchi);
        console.log(eggAnimation(name));
        console.log(aotchiCard(aotchi.state));
        console.log(NEON.dim(`  Next: ${NEON.cyan(`aotchi feed ${name} 10`)} to bring it to life`));
        console.log(NEON.dim(`  Or:   ${NEON.cyan(`aotchi create ${name} --skill ${opts.skill} --deploy`)} for on-chain identity`));
    }
    console.log();
});
function formatEther(wei) {
    const str = wei.toString();
    if (str.length <= 18) {
        return "0." + str.padStart(18, "0");
    }
    const intPart = str.slice(0, str.length - 18);
    const decPart = str.slice(str.length - 18);
    return intPart + "." + decPart;
}
//# sourceMappingURL=create.js.map