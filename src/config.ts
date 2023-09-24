const availableNetworks = [/** 'polygon', */ "base"] as const;
type AvailableNetworks = (typeof availableNetworks)[number];

// RPC
type RPCs = Record<
  AvailableNetworks,
  {
    http: string;
  }
>;
const rpcs: RPCs = {
  // polygon: {
  //     http: process.env.NEXT_PUBLIC_MATIC_URL as string,
  // },
  base: {
    http: import.meta.env.VITE_BASE_URL as string,
  },
};

// Addresses
type Addresses = Record<
  AvailableNetworks,
  {
    BetchaFactory: `0x${string}`;
  }
>;
const addresses: Addresses = {
  base: {
    BetchaFactory: "0xb3a2EAB23AdC21eA78e1851Dd4b1316cb2275D9E",
  },
};

const config = {
  rpcs,
  addresses,
} as const;

export default config;
