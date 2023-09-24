import React from "react";
import { Network, Alchemy } from "alchemy-sdk";

const ALCHEMY_API_KEY =
  (import.meta.env.VITE_ALCHEMY_API_KEY_BASE_MAINNET as string) ?? "";

const useAlchemySDK = () => {
  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);
  return alchemy;
};

export default useAlchemySDK;
