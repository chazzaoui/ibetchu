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
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apolloClient";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? "";

const DB_VERSION = 1;

const contentTypeConfigs = [attachmentContentTypeConfig];

createRoot(document.getElementById("root") as HTMLElement).render(
  <PrivyProvider appId={PRIVY_APP_ID}>
    <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
      <StrictMode>
        <ChakraProvider theme={theme}>
          <ApolloProvider client={apolloClient}>
            <XMTPProvider
              contentTypeConfigs={contentTypeConfigs}
              dbVersion={DB_VERSION}>
              <App />
            </XMTPProvider>
          </ApolloProvider>
        </ChakraProvider>
      </StrictMode>
    </PrivyWagmiConnector>
  </PrivyProvider>,
);
