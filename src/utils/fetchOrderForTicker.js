// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.

// Make two separate arrays one for active orders, one for completed orders.

import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { EXCHANGE_ABI } from "../contracts/ExchangeContract";
import { EXCHANGE_CONTRACT_ADDRESS } from "../constants/config";
const GRAPHAPIURL = "https://api.studio.thegraph.com/query/16341/exchange/v0.1.3";
const CONTROLLER_GRAPH_URL =
  "https://api.studio.thegraph.com/query/16341/liquid-original/v3.0.0"


async function fetchDerivativeIDs(projectID) {
  const client = new ApolloClient({
    uri: CONTROLLER_GRAPH_URL,
    cache: new InMemoryCache(),
  });
  const query = `query {
        projects (where:{id: "${projectID}"}) {
            id
          derivatives {
            id
          }
        }
      }`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    let id = [];
    data.projects.map((project) => {
      if (project.derivatives.length > 0) {
        project?.derivatives.map((derivative) => {
          id.push(derivative.id);
        });
      }
    });
    return id;
  } catch (error) {
    console.log(error);
  }
}

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


export const fetchOrderForTicker = async (
  projectID,
  setActiveOrders,
  setCompleteOrders,
  account
) => {
  const web3 = new Web3(Web3.givenProvider);
  const exchangeContract = new web3.eth.Contract(
    EXCHANGE_ABI,
    EXCHANGE_CONTRACT_ADDRESS
  );
  console.log("Project ID", projectID);
  let derivativeIDs = await fetchDerivativeIDs(projectID);
  derivativeIDs = derivativeIDs.map((s) => `"${s}"`).join(", ");
  console.log("DerivativeIDs", derivativeIDs);
  let listedTokens = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });
  const query = `query {
        orders (where:{cancelled: false, tokenGive_in: [${derivativeIDs}] }) {
            id
            initiator
            tokenGive
            tokenGet
            amountGet
            amountGive
            expiryTime
            cancelled
            fulfillOrderTimestamp
            price
            amountSent
            amountReceived
            tokenGetDecimal
            tokenGetTicker
            tokenGiveDecimal
            tokenGiveTicker
        }
    }`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    console.log("data", data);
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
          fulfillOrderTimestampInSeconds: order.fulfillOrderTimestamp,
          fulfillOrderTimestamp: convertDateToString(
            order.fulfillOrderTimestamp
          ),
          amountGive: giveTokens - numSent,
          amountGet: numOfTokens - numReceived,
          price: order.price,
          quantity: numOfTokens - numReceived,
          completedQuantity: numOfTokens,
          expiryTimeInSeconds: order.expiryTime,
          displayExpiryDate: convertToDate(order.expiryTime),
          displayExpiryTime: convertToTime(order.expiryTime),
          expiryTime: convertDateToString(order.expiryTime),
        };
      })
      .flat();
    console.log(listedTokens, "dededededede");
        let balance = await exchangeContract.methods
          .unlockBalance("0x96711f91eb24a3D1dfA3eD308A84380DFD4CC1c7", account)
          .call();
        console.log(balance, "balance");
        balance = new BigNumber(balance).dividedBy(Math.pow(10, 18)).toNumber();
            listedTokens = listedTokens.map((token) => {
              return {
                ...token,
                balance,
              };
            });
    const activeOrders = listedTokens.filter((order) => {
      return order.quantity > 0;
    });
    activeOrders.filter((order) => order.expiryTime > Date.now());
    const completeOrders = listedTokens.filter((order) => {
      return order.quantity === 0;
    });
    // sort completed orders in descending order of date completed
    completeOrders.sort((a, b) => {
      return (
        b.fulfillOrderTimestampInSeconds - a.fulfillOrderTimestampInSeconds
      );
    });
    // console.log(activeOrders, "activeOrders");
    console.log(completeOrders, "completeOrders");
    setActiveOrders(activeOrders);
    setCompleteOrders(completeOrders);
    //   listedTokens = listedTokens.filter(
    //     (token) => token.amountSent < token.amountGive || token.amountReceived < token.amountGet
    //     );
    //     listedTokens = listedTokens.filter(
    //         (token) => token.expiryTime > Date.now()
    //     );
    // console.log(listedTokens, "after filter");
  } catch (error) {
    console.log(error);
  }
  return listedTokens;
};
