// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.

// Only show Orders where num of tokens not equal to number of tokens received.

import { ApolloClient, InMemoryCache, gql, cache } from '@apollo/client';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { EXCHANGE_ABI } from '../contracts/ExchangeContract';
import {
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  EXCHANGE_CONTRACT_ADDRESS,
  MATIC_CHAIN_ID,
} from '../constants/config';

function convertDateToString(timestamp) {
  const unixTime = timestamp;
  const date = new Date(unixTime * 1000);
  let unlockDay = date.toLocaleDateString('en-US', {
    day: 'numeric',
  });
  let unlockMonth = date.toLocaleDateString('en-US', {
    month: 'long',
  });
  let unlockYear = date.toLocaleDateString('en-US', {
    year: 'numeric',
  });
  let time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  let displayGraphDate = `${unlockDay} ${unlockMonth}, ${unlockYear} ${time}`;
  return displayGraphDate;
}
function convertToDate(timestamp) {
  const unixTime = timestamp;
  const date = new Date(unixTime * 1000);
  let unlockDay = date.toLocaleDateString('en-US', {
    day: 'numeric',
  });
  let unlockMonth = date.toLocaleDateString('en-US', {
    month: 'long',
  });
  let unlockYear = date.toLocaleDateString('en-US', {
    year: 'numeric',
  });
  let displayGraphDate = `${unlockDay} ${unlockMonth}, ${unlockYear}`;
  return displayGraphDate;
}

function convertToTime(timestamp) {
  const unixTime = timestamp;
  const date = new Date(unixTime * 1000);
  let time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  let displayGraphDate = `${time}`;
  return displayGraphDate;
}

const web3 = new Web3(Web3.givenProvider);

export const fetchListedTokens = async (
  account,
  chainId,
  exchangeURL,
  CHAIN_USDT_CONTRACT_ADDRESS
) => {
  let listedTokens = [];
  const client = new ApolloClient({
    uri: exchangeURL,
    cache: new InMemoryCache(),
  });
  const query = `query {
  orders (where:{cancelled: false, initiator_not: "${account}"}) {
    id
    initiator
    tokenGive
    tokenGet
    amountGet
    amountGive
    expiryTime
    cancelled
    price
    amountSent
    amountReceived
    tokenGetDecimal
    tokenGetTicker
    tokenGiveDecimal
    tokenGiveTicker
    fulfillOrderTimestamp
  }
}
`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    listedTokens = data.orders
      .map((order) => {
        const numOfTokens = new BigNumber(order?.amountGive)
          .dividedBy(Math.pow(10, order.tokenGiveDecimal))
          .toNumber();
        const numReceived = new BigNumber(order?.amountSent)
          .dividedBy(Math.pow(10, order.tokenGetDecimal))
          .toNumber();
        const numSent = new BigNumber(order?.amountReceived)
          .dividedBy(Math.pow(10, order.tokenGiveDecimal))
          .toNumber();
        const giveTokens = new BigNumber(order?.amountGet)
          .dividedBy(Math.pow(10, order.tokenGetDecimal))
          .toNumber();
        return {
          tradeID: order.id,
          asset: order.tokenGiveTicker,
          assetID: order.tokenGive,
          GetAsset: order.tokenGetTicker,
          initiator: order.initiator,
          amountSent: order.amountSent,
          amountReceived: order.amountReceived,
          amountGive: giveTokens - numSent,
          amountGet: numOfTokens - numReceived,
          maxAmountGet: numOfTokens - numReceived,
          maxAmountGive: giveTokens - numSent,
          price: order.price,
          quantity: numOfTokens - numReceived,
          expiryTimeActual: order.expiryTime,
          displayExpiryDate: convertToDate(order.expiryTime),
          displayExpiryTime: convertToTime(order.expiryTime),
          expiryTime: convertDateToString(order.expiryTime),
        };
      })
      .flat();
    console.log(listedTokens);
    listedTokens = listedTokens.filter((token) => token.quantity > 0);
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      chainId?.toString() === BSC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM
    );
    let balance = await exchangeContract.methods
      .unlockBalance(CHAIN_USDT_CONTRACT_ADDRESS, account)
      .call();
    balance = new BigNumber(balance).dividedBy(Math.pow(10, 18)).toNumber();

    listedTokens = listedTokens.map((token) => {
      return {
        ...token,
        balance,
      };
    });
    // filter tokens whose expiry is gretaer than current time
    listedTokens = listedTokens.filter((token) => {
      return token.expiryTimeActual > Date.now() / 1000;
    });
  } catch (error) {
    console.log(error);
  }
  return listedTokens;
};
