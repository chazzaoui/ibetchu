import "./polyfills";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "@rainbow-me/rainbowkit/styles.css";
// import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { configureChains, createClient, WagmiConfig } from "wagmi";
// import { publicProvider } from "wagmi/providers/public";
import { attachmentContentTypeConfig, XMTPProvider } from "@xmtp/react-sdk";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
// import { mainnet } from "wagmi/chains";
// import { infuraProvider } from "wagmi/providers/infura";
import App from "./controllers/AppController";
import { configureChainsConfig } from "./lib/wagmiClientPrivy";
// import { isAppEnvDemo } from "./helpers";
// import { mockConnector } from "./helpers/mockConnector";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? "";

const DB_VERSION = 1;

const contentTypeConfigs = [attachmentContentTypeConfig];

// const { chains, provider, webSocketProvider } = configureChains(
//   [mainnet],
//   [
//     infuraProvider({ apiKey: import.meta.env.VITE_INFURA_ID ?? "" }),
//     publicProvider(),
//   ],
// );

// const { connectors } = getDefaultWallets({
//   appName: "XMTP Inbox Web",
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   chains,
// });

// const wagmiDemoClient = createClient({
//   autoConnect: true,
//   connectors: [mockConnector],
//   provider,
//   webSocketProvider,
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
//   webSocketProvider,
// });

createRoot(document.getElementById("root") as HTMLElement).render(
  // <WagmiConfig client={isAppEnvDemo() ? wagmiDemoClient : wagmiClient}>
  //   <RainbowKitProvider chains={chains}>
  <PrivyProvider appId={PRIVY_APP_ID}>
    <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
      <StrictMode>
        <XMTPProvider
          contentTypeConfigs={contentTypeConfigs}
          dbVersion={DB_VERSION}>
          <App />
        </XMTPProvider>
      </StrictMode>
    </PrivyWagmiConnector>
  </PrivyProvider>,
  //   </RainbowKitProvider>
  // </WagmiConfig>,
);
