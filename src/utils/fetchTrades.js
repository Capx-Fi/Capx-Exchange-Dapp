import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { convertToInternationalCurrencySystem } from "./convertToInternationalCurrencySystem";

const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/exchange/v0.1.3";

export const fetchTrades = async (account) => {
  let orderList = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });
  const fetchFormattedValue = (value, decimal) => {
    return new BigNumber(value).dividedBy(Math.pow(10, decimal)).toNumber();
  };

  const query = `query {
        orders (where: {initiator:"${account}"}) {
            id
            initiator
            tokenGive
            tokenGet
            tokenGiveDecimal
            tokenGetDecimal
            tokenGiveTicker
            tokenGetTicker
            amountGive
            amountGet
            expiryTime
            direction
            cancelled
            amountReceived
            amountSent
            cancelled
            fulfillOrderTimestamp
        }
    }`;

  try {
    const { data } = await client.query({
      query: gql(query),
    });
    let currentTimeInUTC = Math.floor(new Date().getTime() / 1000);
    Object.entries(data.orders).forEach((record) => {
      let order = {};
      order.id = record[1].id;
      order.tokenGive = record[1].tokenGive;
      order.tokenGet = record[1].tokenGet;
      order.tokenGiveDecimal = record[1].tokenGiveDecimal;
      order.tokenGetDecimal = record[1].tokenGetDecimal;
      order.tokenGiveTicker = record[1].tokenGiveTicker;
      order.tokenGetTicker = record[1].tokenGetTicker;
      order.amountGive = record[1].amountGive;
      order.amountGive = fetchFormattedValue(
        order.amountGive,
        order.tokenGiveDecimal
      );
      order.amountGiveDisplay = convertToInternationalCurrencySystem(order.amountGive);
      order.amountGet = record[1].amountGet;
      order.amountGet = fetchFormattedValue(
        order.amountGet,
        order.tokenGetDecimal
      );
      order.amountGetDisplay = convertToInternationalCurrencySystem(order.amountGet);
      order.amountReceived = record[1].amountReceived;
      order.amountReceived = fetchFormattedValue(
        order.amountReceived,
        order.tokenGetDecimal
      );
      order.amountRemainingToReceive = order.amountGet - order.amountReceived;
      order.amountSent = record[1].amountSent;
      order.amountSent = fetchFormattedValue(
        order.amountSent,
        order.tokenGiveDecimal
      );
      order.amountRemainingToSend = order.amountGive - order.amountSent;
      if (record[1].cancelled) {
        order.status = 1; // Cancelled
        order.statusName = "Cancelled";
      } else if (record[1].fulfillOrderTimestamp > 0) {
        order.status = 2; // Completed
        order.statusName = "Completed";
      } else if (record[1].expiryTime > currentTimeInUTC) {
        order.status = 3; // In Progress
        order.statusName = "In Progress";
      } else {
        order.status = 0; // Expired
        order.statusName = "Expired";
      }
      // 5 for all trades
      orderList.push(order);
    });
    // sort order list based on id in descending order
    orderList.sort((a, b) => {
        return b.id - a.id;
        });
  } catch (error) {
    console.log(error);
  }
  console.log(orderList);
  return orderList;
};
