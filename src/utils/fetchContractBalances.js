import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";

import { EXCHANGE_ABI } from "../contracts/ExchangeContract";

import moment from "moment";
import {
	getExchangeContractAddress,
	getUsdtContractAddress,
} from "../constants/getChainConfig";
const format = "HH:mm";
BigNumber.config({
	ROUNDING_MODE: 3,
	DECIMAL_PLACES: 18,
	EXPONENTIAL_AT: [-18, 36],
});
export const fetchContractBalances = async (
	account,
	exchangeURL,
	wrappedURL,
	chainId,
	web3
) => {
	let fetchContractBalances = [];
	let userContractHoldings = [];
	const client = new ApolloClient({
		uri: exchangeURL,
		cache: new InMemoryCache(),
	});
	const exchangeContract =
		web3 &&
		new web3.eth.Contract(
			EXCHANGE_ABI,
			chainId && getExchangeContractAddress(chainId)
		);

	// Getting stable coin
	const stableCoin = chainId && getUsdtContractAddress(chainId);
	// console.log("-Stable coin-", stableCoin);

	// console.log("-chain ID-", chainId);
	const liquidClient = new ApolloClient({
		uri: wrappedURL,
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
            lockedBalance (where: { assetID_not: "${stableCoin}",lockedValue_gt:0}){
                assetID
                lockedValue
            }
            totalBalance (where: { assetID_not: "${stableCoin}",totalValue_gt: 0}){
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

		Object.entries(holdingsData.users).forEach((record) => {
			let userData = record[1];
			let userTotalData = userData.totalBalance;
			let userLockedData = userData.lockedBalance;
			let assetToLockedBalance = {};
			Object.entries(userLockedData).forEach((locked) => {
				assetToLockedBalance[locked[1].assetID] = locked[1].lockedValue;
			});
			Object.entries(userTotalData).forEach((total) => {
				// Not printing stable coin again
				// console.log(total[1].assetID, stableCoin);
				if (
					web3?.utils.toChecksumAddress(total[1].assetID) ===
					web3?.utils.toChecksumAddress(stableCoin)
				) {
					return;
				}

				let xData = {};
				xData.asset = assetData.assets.find(
					(asset) => asset.id === total[1].assetID
				).tokenTicker;
				xData.decimal = assetData.assets.find(
					(asset) => asset.id === total[1].assetID
				).tokenDecimal;
				xData.assetID = total[1].assetID;

				// console.log(
				//   assetUnlockTime.derivatives.find(
				//     (derivative) => derivative.id === total[1].assetID
				//   ),
				//   "----"
				// );
				xData.unlockTime = assetUnlockTime.derivatives.find(
					(derivative) => derivative.id === total[1].assetID
				).unlockTime;

				xData.totalBalance = new BigNumber(total[1].totalValue).toString();
				xData.lockedBalance = assetToLockedBalance[total[1].assetID]
					? new BigNumber(assetToLockedBalance[total[1].assetID]).toString()
					: 0;
				// xData.actualBalance = new BigNumber(xData.totalBalance)
				//   .minus(xData.lockedBalance)
				//   .toString();

				xData.actualBalance = 0;
				fetchContractBalances.push(xData);
			});
		});
		userContractHoldings = await Promise.all(
			fetchContractBalances.map(async (contractHolding) => {
				// await console.log("Before issue");
				// await console.log(
				//   "Before issue values",
				//   contractHolding.assetID,
				//   account
				// );
				// await console.log(exchangeContract);

				let balance = await exchangeContract?.methods
					.unlockBalance(contractHolding.assetID, account)
					.call();
				// await console.log("After issue");
				balance = new BigNumber(balance)
					.dividedBy(Math.pow(10, contractHolding.decimal))
					.toString();
				contractHolding.actualBalance = balance;
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
					expiryTime: moment().utc().add(15, "minutes"),
					unlockTime: contractHolding.unlockTime,
					tokenDecimal: contractHolding.decimal,
					quantity: contractHolding.actualBalance,
					balance: contractHolding.actualBalance,
					unlockDate: displayDate,
					isContract: true,
				};
			})
		);
		userContractHoldings = userContractHoldings.filter(
			(holding) => holding.quantity > 0
		);
	} catch (error) {
		console.log(error);
		// console.log("Holdings error");
	}
	return userContractHoldings;
};
