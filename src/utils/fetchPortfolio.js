import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";

import moment from "moment";
const format = "HH:mm";
BigNumber.config({ ROUNDING_MODE: 3, DECIMAL_PLACES: 18, EXPONENTIAL_AT: [-18,18] });

export const fetchPortfolio = async (account, wrappedURL) => {
  let userHoldings = [];
    function numberToString(num) {
      let numStr = String(num);

      if (Math.abs(num) < 1.0) {
        let e = parseInt(num.toString().split("e-")[1]);
        if (e) {
          let negative = num < 0;
          if (negative) num *= -1;
          num *= Math.pow(10, e - 1);
          numStr = "0." + new Array(e).join("0") + num.toString().substring(2);
          if (negative) numStr = "-" + numStr;
        }
      } else {
        let e = parseInt(num.toString().split("+")[1]);
        if (e > 20) {
          e -= 20;
          num /= Math.pow(10, e);
          numStr = num.toString() + new Array(e + 1).join("0");
        }
      }

      return numStr;
    }
  const client = new ApolloClient({
    uri: wrappedURL,
    cache: new InMemoryCache(),
  });
  const query = `query{
  projects{
    projectTokenDecimal
    derivatives (where: {wrappedTokenTicker_contains:"-S"}){
        id
    unlockTime
    wrappedTokenTicker
    holders(where: {address:"${account}", tokenAmount_gt:0}) {
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
                .toString();
              console.log(numOfTokens.toString(),"num of tokens");
              // numOfTokens = numOfTokens;
              return {
                date: date,
                asset: derivative.wrappedTokenTicker,
                assetID: derivative.id,
                price: null,
                expiryDate: new Date(),
                expiryTime: moment("12:15", format),
                tokenDecimal: project.projectTokenDecimal,
                quantity: numOfTokens,
                unlockDate: displayDate,
                balance: 0,
                isContract: false,
              };
            })
          )
          .flat()
      )
      .flat();
    userHoldings.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log(userHoldings, "uh");
  } catch (e) {
    console.log(e);
  }
  return userHoldings;
};
