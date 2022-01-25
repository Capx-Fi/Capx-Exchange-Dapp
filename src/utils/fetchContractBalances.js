import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import moment from "moment";
const format = "HH:mm";

const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/exchange/v0.1.3";
const GRAPH_CONTROLLER_URL =
  "https://api.studio.thegraph.com/query/16341/liquid-original/v3.0.0";

export const fetchContractBalances = async (account) => {
  let fetchContractBalances = [];
  let userContractHoldings = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });

  const liquidClient = new ApolloClient({
    uri: GRAPH_CONTROLLER_URL,
    cache: new InMemoryCache(),
  });

  const getAssets = `query{
        assets {
            id
            tokenTicker
            tokenDecimal
        }
    }`;

  const getHoldings = `query{
        users (where: {id:"${account.toLowerCase()}"}){
            id
            lockedBalance (where: { assetID_not: "0x96711f91eb24a3D1dfA3eD308A84380DFD4CC1c7",lockedValue_gt:0}){
                assetID
                lockedValue
            }
            totalBalance (where: { assetID_not: "0x96711f91eb24a3D1dfA3eD308A84380DFD4CC1c7",totalValue_gt: 0}){
                assetID
                totalValue
            }
        }
      }`;

  const getAssetUnlockTime = `query{
        derivatives {
            id
            unlockTime
          }
      }`;

  try {
    const { data: assetData } = await client.query({
      query: gql(getAssets),
    });
    const { data: holdingsData } = await client.query({
      query: gql(getHoldings),
    });
    const { data: assetUnlockTime } = await liquidClient.query({
      query: gql(getAssetUnlockTime),
    });

    console.log(holdingsData);
    Object.entries(holdingsData.users).forEach((record) => {
      let userData = record[1];
      let userTotalData = userData.totalBalance;
      let userLockedData = userData.lockedBalance;
      let assetToLockedBalance = {};
      Object.entries(userLockedData).forEach((locked) => {
        assetToLockedBalance[locked[1].assetID] = locked[1].lockedValue;
      });
      Object.entries(userTotalData).forEach((total) => {
        let xData = {};
        xData.asset = assetData.assets.find(
          (asset) => asset.id === total[1].assetID
        ).tokenTicker;
        xData.decimal = assetData.assets.find(
          (asset) => asset.id === total[1].assetID
        ).tokenDecimal;
        xData.assetID = total[1].assetID;
        xData.unlockTime = assetUnlockTime.derivatives.find(
          (derivative) => derivative.id === total[1].assetID
        ).unlockTime;
        xData.totalBalance = new BigNumber(total[1].totalValue)
          .dividedBy(Math.pow(10, xData.decimal))
          .toNumber();
        xData.lockedBalance = assetToLockedBalance[total[1].assetID]
          ? new BigNumber(assetToLockedBalance[total[1].assetID])
              .dividedBy(Math.pow(10, xData.decimal))
              .toNumber()
          : 0;
        xData.actualBalance = new BigNumber(xData.totalBalance)
          .minus(xData.lockedBalance)
          .toString();
        fetchContractBalances.push(xData);
      });
    });
    userContractHoldings = fetchContractBalances.map(
      (contractHolding) => {
        const unixTime = contractHolding.unlockTime;
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
        let displayDate = `${unlockDay} ${unlockMonth}, ${unlockYear}`;
        return {
          date,
          asset: contractHolding.asset,
          assetID: contractHolding.assetID,
          price: null,
          expiryDate: new Date(),
          expiryTime: moment("12:15", format),
          unlockTime: contractHolding.unlockTime,
          tokenDecimal: contractHolding.decimal,
          quantity: contractHolding.actualBalance,
          unlockDate: displayDate,
        };
      }
    );
    userContractHoldings = userContractHoldings.filter(
        (holding) => holding.quantity > 0
        );
    console.log("User Holdings", userContractHoldings);
  } catch (error) {
    console.log(error);
  }
  return userContractHoldings;
};
