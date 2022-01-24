// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.


import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/exchange/v0.0.7";

export const fetchListedTokens = async () => {
  let listedTokens = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });
  const query = `query {
  orders (where:{cancelled: false}) {
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
  }
}
`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    console.log(data);
    listedTokens = data.orders
      .map((order) => {
        const numOfTokens = new BigNumber(order?.amountGive)
          .dividedBy(Math.pow(10, order.tokenGiveDecimal))
          .toNumber();
        return {
          asset: order.tokenGiveTicker,
          GetAsset: order.tokenGetTicker,
          initiator: order.initiator,
          amountSent: order.amountSent,
          amountReceived: order.amountReceived,
          amountGive: order.amountGive,
          amountGet: order.amountGet,
          price: order.price,
          quantity: numOfTokens,
          expiryTime: order.expiryTime,
        };
      })
      .flat();
      console.log(listedTokens);
    //   listedTokens = listedTokens.filter(
    //     (token) => token.amountSent < token.amountGive || token.amountReceived < token.amountGet
    //     );
    //     listedTokens = listedTokens.filter(
    //         (token) => token.expiryTime > Date.now()
    //     );
            console.log(listedTokens, "after filter");
  } catch (error) {
    console.log(error);
  }
  return listedTokens;
};
