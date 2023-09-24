const availableNetworks = ["base", "arbitrum"] as const;
type AvailableNetworks = (typeof availableNetworks)[number];

// RPC
type RPCs = Record<
  AvailableNetworks,
  {
    http: string;
  }
>;
const rpcs: RPCs = {
  arbitrum: {
    http: import.meta.env.VITE_ARB_ONE_URL as string,
  },
  base: {
    http: import.meta.env.VITE_BASE_URL as string,
  },
};

// Addresses
type Addresses = Record<
  AvailableNetworks,
  {
    betchaFactory: `0x${string}`;
    usdc: `0x${string}`;
  }
>;
const addresses: Addresses = {
  base: {
    usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    betchaFactory: "0x41e727A4c19EEA4B7D0A079688268F3E74D4F6F0",
  },
  arbitrum: {
    usdc: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    betchaFactory: "0x06304868aa128ecAaab02Dc417D70C59D4091472",
  },
};

const config = {
  rpcs,
  addresses,
} as const;

export default config;
