// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.

// Only show Orders where num of tokens not equal to number of tokens received.

import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { EXCHANGE_ABI } from "../contracts/ExchangeContract";
import { CONTRACT_ABI_ERC20 } from "../contracts/SampleERC20";

import { getExchangeContractAddress } from "../constants/getChainConfig";
BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 19,
  EXPONENTIAL_AT: [-19, 19],
});

function convertDateToString(timestamp) {
  const unixTime = timestamp;
  const date = new Date(unixTime * 1000);
  let unlockDay = date.toLocaleDateString("en-US", {
    day: "numeric",
  });
  let unlockMonth = date.toLocaleDateString("en-US", {
    month: "long",
  });
  let unlockYear = date.toLocaleDateString("en-US", {
    year: "numeric",
  });
  let time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  let displayGraphDate = `${unlockDay} ${unlockMonth}, ${unlockYear} ${time}`;
  return displayGraphDate;
}
function convertToDate(timestamp) {
  const unixTime = timestamp;
  const date = new Date(unixTime * 1000);
  let unlockDay = date.toLocaleDateString("en-US", {
    day: "numeric",
  });
  let unlockMonth = date.toLocaleDateString("en-US", {
    month: "long",
  });
  let unlockYear = date.toLocaleDateString("en-US", {
    year: "numeric",
  });
  let displayGraphDate = `${unlockDay} ${unlockMonth}, ${unlockYear}`;
  return displayGraphDate;
}

function convertToTime(timestamp) {
  const unixTime = timestamp;
  const date = new Date(unixTime * 1000);
  let time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
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
        const numOfTokens = new BigNumber(order?.amountGive).dividedBy(
          Math.pow(10, order.tokenGiveDecimal)
        );
        const numReceived = new BigNumber(order?.amountSent).dividedBy(
          Math.pow(10, order.tokenGiveDecimal)
        );
        const numSent = new BigNumber(order?.amountReceived).dividedBy(
          Math.pow(10, order.tokenGetDecimal)
        );
        const giveTokens = new BigNumber(order?.amountGet).dividedBy(
          Math.pow(10, order.tokenGetDecimal)
        );

        // Hacky Part

        // console.log("Order Data :--", order);

        // Derivative
        let amountBNGive = new BigNumber(order.amountGive);

        // USDT
        let amountBNGet = new BigNumber(order.amountGet);

        let priceBNGive = amountBNGive.dividedBy(
          Math.pow(10, order.tokenGiveDecimal)
        );
        let priceBNGet = amountBNGet.dividedBy(
          Math.pow(10, order.tokenGetDecimal)
        );

        // Price BN calculation
        let priceBN = priceBNGet.dividedBy(priceBNGive);

        // console.log("Price ---", priceBN.toString(10));

        // Hacky Part Ends

        return {
          give: order.amountGive,
          get: order.amountGet,
          received: order.amountReceived,
          sent: order.amountSent,
          tradeID: order.id,
          asset: order.tokenGiveTicker,
          assetID: order.tokenGive,
          GetAsset: order.tokenGetTicker,
          initiator: order.initiator,
          amountSent: order.amountSent,
          amountReceived: order.amountReceived,
          numOfTokens: numOfTokens.toString(10),
          amountGive: giveTokens.minus(numSent).toString(),
          amountGet: numOfTokens.minus(numReceived).toString(),
          maxAmountGet: numOfTokens.minus(numReceived).toString(),
          maxAmountGive: giveTokens.minus(numSent).toString(),
          // price: order.price,
          // Calculation method mentioned above
          price: priceBN.toString(10),
          quantity: numOfTokens.minus(numReceived).toString(),
          expiryTimeActual: order.expiryTime,
          displayExpiryDate: convertToDate(order.expiryTime),
          displayExpiryTime: convertToTime(order.expiryTime),
          expiryTime: convertDateToString(order.expiryTime),
          derivativeDecimal: order.tokenGiveDecimal,
          stableCoinDecimal: order.tokenGetDecimal,
        };
      })
      .flat();
    // console.log("Listed Tokens before 0 :--", listedTokens);

    listedTokens = listedTokens.filter((token) => token.quantity > 0);
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      chainId && getExchangeContractAddress(chainId)
    );
    let balance = await exchangeContract.methods
      .unlockBalance(CHAIN_USDT_CONTRACT_ADDRESS, account)
      .call();
    const tokenInst = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      CHAIN_USDT_CONTRACT_ADDRESS
    );
    const USDTTokenDecimal = await tokenInst.methods.decimals().call();

    balance = new BigNumber(balance)
      .dividedBy(Math.pow(10, USDTTokenDecimal))
      .toNumber();

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
    // console.log("Listed Tokens :--", listedTokens);
  } catch (error) {
    console.log(error);
  }
  return listedTokens;
};
