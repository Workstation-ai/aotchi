import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./wagmi.config.ts";
import App from "./App";
import "./index.css";

const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00ffd1",
            accentColorForeground: "#0A0C10",
            borderColor: "rgba(0,255,209,0.15)",
            blur: "0px",
            radius: "lg",
            shadow: "none",
          })}
        >
          <App />
        </RainbowKitProvider>
      </WagmiProvider>
    </ClerkProvider>
  </React.StrictMode>,
);