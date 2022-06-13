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

export const bscTestnet = {
  id: 97,
  name: "Binance Smart Chain Test",
  network: "bsc-testnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  blockExplorers: {
    default: { name: "Binance", url: "https://testnet.bscscan.com/" },
  },
};
