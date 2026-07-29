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
      coinbaseWallet({ appName: "AOTCHI", projectId }),
      walletConnectWallet({ projectId }),
    ],
  },
]);

export const config = createConfig({
  autoConnect: true,
  connectors,
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

export type ChainId = (typeof config.chains)[number]["id"];