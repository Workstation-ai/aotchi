import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId }),
      coinbaseWallet({ appName: "AOTCHI" }),
      walletConnectWallet({ projectId }),
    ],
  },
]);

export const config = createConfig({
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  connectors,
});

export type ChainId = (typeof config.chains)[number]["id"];
