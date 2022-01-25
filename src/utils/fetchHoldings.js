import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import { CONTRACT_ABI_ERC20 } from "../contracts/SampleERC20";
import Web3 from "web3";

const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/exchange/v0.1.1";
let data = [
  {
    id: "0x6c368bd8cc280a54ad443583d0bc18e4036a2f41",
    lockedBalance: [
      {
        assetID: "0x625f73d47eeac98bcaeefec4d82a877b3b3e310f",
        lockedValue: "214285714285714287",
      },
    ],
    totalBalance: [
      {
        assetID: "0x625f73d47eeac98bcaeefec4d82a877b3b3e310f",
        totalValue: "11314285714285714287",
      },
      {
        assetID: "0x96711f91eb24a3d1dfa3ed308a84380dfd4cc1c7",
        totalValue: "9865873015873015872",
      },
    ],
  },
];

export const fetchHoldings = async () => {
const web3 = new Web3(Web3.givenProvider);


  let fetchTotalHoldings = [];

  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });
  const query = `query{
  users {
    lockedBalance (where: {lockedValue_gt:0}){
      assetID
      lockedValue
    }
    totalBalance (where: {totalValue_gt: 0}){
      assetID
      totalValue
    }
  }
}`;
const assetQuery = `query{
    assets {
        id
        tokenTicker
        tokenDecimal
    }
}`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    const { data: assetData } = await client.query({ query: gql(assetQuery) });
    console.log(data);
    let _data = [];
    Object.entries(data.users).forEach((record) => {
      let userdata = record[1];
      let userTotalData = userdata.totalBalance;
      let userLockedData = userdata.lockedBalance;
      let assetToLockedBalance = {};
      Object.entries(userLockedData).forEach((locked) => {
        assetToLockedBalance[locked[1].assetID] = locked[1].lockedValue;
      });
      Object.entries(userTotalData).forEach((total) => {
        let xdata = {};
        xdata.asset = assetData.assets.find(
            (asset) => asset.id === total[1].assetID
        ).tokenTicker;
        xdata.decimal = assetData.assets.find(
            (asset) => asset.id === total[1].assetID
        ).tokenDecimal;
        xdata.assetID = total[1].assetID;
        xdata.totalBalance = new BigNumber(total[1].totalValue)
          .dividedBy(Math.pow(10, xdata.decimal))
          .toNumber();
        xdata.lockedBalance = assetToLockedBalance[total[1].assetID]
          ? new BigNumber(assetToLockedBalance[total[1].assetID])
              .dividedBy(Math.pow(10, xdata.decimal))
              .toNumber()
          : 0;
        xdata.actualBalance = ((new BigNumber(xdata.totalBalance)).minus(xdata.lockedBalance)).toString();
        _data.push(xdata);
      });
    });
    fetchTotalHoldings = _data;
    console.log(fetchTotalHoldings);
  } catch (error) {
    console.log(error);
  }
  return fetchTotalHoldings;
};
