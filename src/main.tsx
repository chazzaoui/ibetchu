import "./polyfills";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { attachmentContentTypeConfig, XMTPProvider } from "@xmtp/react-sdk";
import { mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ChakraProvider } from "@chakra-ui/react";
import App from "./controllers/AppController";
import { isAppEnvDemo } from "./helpers";
import { mockConnector } from "./helpers/mockConnector";
import React from "react";
import theme from "../theme";
import { base } from "@wagmi/chains";

const DB_VERSION = 1;

const contentTypeConfigs = [attachmentContentTypeConfig];

const { chains, provider, webSocketProvider } = configureChains(
  [base],
  [
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_ID ?? "" }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "XMTP Inbox Web",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains,
});

const wagmiDemoClient = createClient({
  autoConnect: true,
  connectors: [mockConnector],
  provider,
  webSocketProvider,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <WagmiConfig client={isAppEnvDemo() ? wagmiDemoClient : wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <StrictMode>
        <ChakraProvider theme={theme}>
          <XMTPProvider
            contentTypeConfigs={contentTypeConfigs}
            dbVersion={DB_VERSION}>
            <App />
          </XMTPProvider>
        </ChakraProvider>
      </StrictMode>
    </RainbowKitProvider>
  </WagmiConfig>,
);
