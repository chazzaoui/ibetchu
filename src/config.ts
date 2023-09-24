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
    BetchaFactory: "0x9309bd93a8b662d315Ce0D43bb95984694F120Cb",
  },
};

const config = {
  rpcs,
  addresses,
} as const;

export default config;
