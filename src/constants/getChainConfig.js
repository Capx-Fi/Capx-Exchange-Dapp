import {
  AVALANCHE_CHAIN_ID,
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_AVALANCHE,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_USDT_AVALANCHE,
  CONTRACT_ADDRESS_CAPX_USDT_BSC,
  CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM,
  CONTRACT_ADDRESS_CAPX_USDT_MATIC,
  EXPLORER_AVALANCHE,
  EXPLORER_BSC,
  EXPLORER_ETHEREUM,
  EXPLORER_MATIC,
  GRAPHAPIURL_EXCHANGE_AVALANCHE,
  GRAPHAPIURL_EXCHANGE_BSC,
  GRAPHAPIURL_EXCHANGE_ETHEREUM,
  GRAPHAPIURL_EXCHANGE_MATIC,
  GRAPHAPIURL_MASTER_AVALANCHE,
  GRAPHAPIURL_MASTER_BSC,
  GRAPHAPIURL_MASTER_ETHEREUM,
  GRAPHAPIURL_MASTER_MATIC,
  GRAPHAPIURL_WRAPPED_AVALANCHE,
  GRAPHAPIURL_WRAPPED_BSC,
  GRAPHAPIURL_WRAPPED_ETHEREUM,
  GRAPHAPIURL_WRAPPED_MATIC,
  MATIC_CHAIN_ID,
} from "./config";

//exchange-url
export const getExchangeURL = (chainId) => {
  const exchangeURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_MATIC
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_AVALANCHE
      : GRAPHAPIURL_EXCHANGE_ETHEREUM;
  return exchangeURL;
};

//wrapped-url
export const getWrappedURL = (chainId) => {
  const wrappedURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? GRAPHAPIURL_WRAPPED_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_WRAPPED_MATIC
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? GRAPHAPIURL_WRAPPED_AVALANCHE
      : GRAPHAPIURL_WRAPPED_ETHEREUM;
  return wrappedURL;
};

//exchange-contract-address
export const getExchangeContractAddress = (chainId) => {
  const exchangeContractAddress =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_AVALANCHE
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM;
  return exchangeContractAddress;
};

//usdt-contract-address
export const getUsdtContractAddress = (chainId) => {
  const usdtContractAddress =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_MATIC
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_AVALANCHE
      : CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM;
  return usdtContractAddress;
};

//master-url
export const getMasterURL = (chainId) => {
  const masterURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? GRAPHAPIURL_MASTER_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_MASTER_MATIC
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? GRAPHAPIURL_MASTER_AVALANCHE
      : GRAPHAPIURL_MASTER_ETHEREUM;
  return masterURL;
};

//explorer-url
export const getExplorerURL = (chainId) => {
  const explorerURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? EXPLORER_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? EXPLORER_MATIC
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? EXPLORER_AVALANCHE
      : EXPLORER_ETHEREUM;
  return explorerURL;
};
//getSortBy
export const getSortBy = (chainId) => {
  const sortBy =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? "BSC"
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? "Matic"
      : chainId?.toString() === AVALANCHE_CHAIN_ID.toString()
      ? "Avalanche"
      : "Ethereum";
  return sortBy;
};
