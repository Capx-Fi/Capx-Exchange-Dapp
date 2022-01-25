// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.

// Only show Orders where num of tokens not equal to number of tokens received.

import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { EXCHANGE_ABI } from "../contracts/ExchangeContract";
import { EXCHANGE_CONTRACT_ADDRESS } from "../constants/config";
const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/exchange/v0.1.1";

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
const web3 = new Web3(Web3.givenProvider);
const exchangeContract = new web3.eth.Contract(
  EXCHANGE_ABI,
  EXCHANGE_CONTRACT_ADDRESS
);
export const fetchListedTokens = async (account) => {
  let listedTokens = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
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
          price: order.price,
          quantity: numOfTokens - numReceived,
          expiryTimeActual: order.expiryTime,
          expiryTime: convertDateToString(order.expiryTime),
        };
      })
      .flat();
    console.log(listedTokens);
    listedTokens = listedTokens.filter((token) => token.quantity > 0);
    let balance = await exchangeContract.methods.unlockBalance(
      "0x96711f91eb24a3D1dfA3eD308A84380DFD4CC1c7",
      account
    ).call();
    console.log(balance, "balance");
    balance = new BigNumber(balance).dividedBy(Math.pow(10, 18)).toNumber();
    
    listedTokens = listedTokens.map((token) => {
      return {
        ...token,
        balance,
      };
    });
    //   listedTokens = listedTokens.filter(
    //     (token) => token.amountSent < token.amountGive || token.amountReceived < token.amountGet
    //     );
    // listedTokens = listedTokens.filter(
    //   (token) => token.expiryTimeActual > Date.now()
    // );
    console.log(listedTokens, 'after filter');
  } catch (error) {
    console.log(error);
  }
  return listedTokens;
};
