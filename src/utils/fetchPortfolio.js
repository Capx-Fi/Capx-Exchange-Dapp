import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/liquid-original/v2.0.0";

export const fetchPortfolio = async () => {
  let userHoldings = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });
  const query = `query{
  projects{
    projectTokenDecimal
    derivatives (where: {wrappedTokenTicker_contains:"-S"}){
    unlockTime
    wrappedTokenTicker
    holders(where: {tokenAmount_gt:0}) {
      address
      tokenAmount
    }
  }
}
}`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    console.log(data);
    userHoldings = data.projects
      .map((project) =>
        project?.derivatives
          .map((derivative) =>
            derivative.holders.map((holder) => {
              const unixTime = derivative.unlockTime;
              const date = new Date(unixTime * 1000);
              let unlockDate = date.toLocaleDateString("en-US");
              let unlockDay = date.toLocaleDateString("en-US", {
                day: "numeric",
              });
              let unlockMonth = date.toLocaleDateString("en-US", {
                month: "long",
              });
              let unlockYear = date.toLocaleDateString("en-US", {
                year: "numeric",
              });
              let displayDate = `${unlockDay} ${unlockMonth}, ${unlockYear}`;
              let numOfTokens = new BigNumber(holder?.tokenAmount)
                .dividedBy(Math.pow(10, project.projectTokenDecimal))
                .toNumber();
              return {
                date: date,
                asset: derivative.wrappedTokenTicker,
                price: numOfTokens,
                quantity: numOfTokens,
                unlockDate: displayDate,
              };
            })
          )
          .flat()
      )
      .flat();
    userHoldings.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log(userHoldings,"uh");
  } catch (e) {
    console.log(e);
  }
  return userHoldings;
};
