import "./polyfills";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { attachmentContentTypeConfig, XMTPProvider } from "@xmtp/react-sdk";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { ChakraProvider } from "@chakra-ui/react";
import { configureChainsConfig } from "./lib/wagmiClientPrivy";
import App from "./controllers/AppController";
import theme from "../theme";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? "";

const DB_VERSION = 1;

const contentTypeConfigs = [attachmentContentTypeConfig];

createRoot(document.getElementById("root") as HTMLElement).render(
  <PrivyProvider appId={PRIVY_APP_ID}>
    <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
      <StrictMode>
        <ChakraProvider theme={theme}>
          <XMTPProvider
            contentTypeConfigs={contentTypeConfigs}
            dbVersion={DB_VERSION}>
            <App />
          </XMTPProvider>
        </ChakraProvider>
      </StrictMode>
    </PrivyWagmiConnector>
  </PrivyProvider>,
);
