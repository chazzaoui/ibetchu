import "./polyfills";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { ChakraProvider } from "@chakra-ui/react";
import { configureChainsConfig } from "./lib/wagmiClientPrivy";
import App from "./controllers/AppController";
import theme from "../theme";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apolloClient";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? "";

createRoot(document.getElementById("root") as HTMLElement).render(
  <PrivyProvider appId={PRIVY_APP_ID}>
    <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
      <StrictMode>
        <ChakraProvider theme={theme}>
          <ApolloProvider client={apolloClient}>
            <App />
          </ApolloProvider>
        </ChakraProvider>
      </StrictMode>
    </PrivyWagmiConnector>
  </PrivyProvider>,
);
