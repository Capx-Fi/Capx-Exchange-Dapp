export const avalancheChain = {
  id: 43113,
  name: "Avalanche",
  network: "avalanche",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://testnet.snowtrace.io/" },
  },
  testnet: true,
};
