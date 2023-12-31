export const BETCHA_ROUND_FACTORY_CONTRACT = [
  {
    inputs: [
      {
        internalType: "address",
        name: "safeProxyFactory_",
        type: "address",
      },
      {
        internalType: "address",
        name: "safeMasterCopy_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "deployedAddress",
        type: "address",
      },
    ],
    name: "BetchaRoundCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wagerTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wagerTokenAmount",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "resolvers",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "wagerDeadlineAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "settlementAvailableAt",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "metadataURI",
        type: "string",
      },
    ],
    name: "createRound",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeMasterCopy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeProxyFactory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
