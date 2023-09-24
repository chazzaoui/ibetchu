// You can import additional chains from 'wagmi/chains'
// https://wagmi.sh/react/chains
import { base, arbitrum } from "viem/chains";
import { configureChains } from "wagmi";
// You may replace this with your preferred providers
// https://wagmi.sh/react/providers/configuring-chains#multiple-providers
import { publicProvider } from "wagmi/providers/public";

// Replace the chains and providers with the ones used by your app.
// https://wagmi.sh/react/providers/configuring-chains
export const configureChainsConfig = configureChains(
  [base, arbitrum],
  [publicProvider()],
);
