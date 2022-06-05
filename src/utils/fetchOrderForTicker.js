import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { EXCHANGE_ABI } from "../contracts/ExchangeContract";
import { CONTRACT_ABI_ERC20 } from "../contracts/SampleERC20";

import { getExchangeContractAddress } from "../constants/getChainConfig";
BigNumber.config({
	ROUNDING_MODE: 3,
	DECIMAL_PLACES: 18,
	EXPONENTIAL_AT: [-18, 36],
});
async function fetchDerivativeIDs(projectID, wrappedURL) {
	const client = new ApolloClient({
		uri: wrappedURL,
		cache: new InMemoryCache(),
	});
	let lsp = 0;
	let asp = 0;
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
	account,
	chainId,
	setLastSellingPrice,
	setAverageSellingPrice,
	exchangeURL,
	wrappedURL,
	CHAIN_USDT_CONTRACT_ADDRESS,
	web3
) => {
	web3 && console.log(web3);
	const exchangeContract =
		web3 &&
		new web3.eth.Contract(
			EXCHANGE_ABI,
			chainId && getExchangeContractAddress(chainId)
		);
	let derivativeIDs = await fetchDerivativeIDs(projectID, wrappedURL);
	derivativeIDs = derivativeIDs.map((s) => `"${s}"`).join(", ");
	let listedTokens = [];
	const client = new ApolloClient({
		uri: exchangeURL,
		cache: new InMemoryCache(),
	});
	const query = `query {
        orders (where:{cancelled: false, initiator_not: "${account}", tokenGive_in: [${derivativeIDs}] }) {
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

				// Hacky Part

				return {
					tradeID: order.id,
					asset: order.tokenGiveTicker,
					assetID: order.tokenGive,
					GetAsset: order.tokenGetTicker,
					initiator: order.initiator,
					amountSent: order.amountSent,
					amountReceived: order.amountReceived,
					fulfillOrderTimestampInSeconds: order.fulfillOrderTimestamp,
					maxAmountGive: giveTokens.minus(numSent),
					maxAmountGet: numOfTokens.minus(numReceived),
					fulfillOrderTimestamp: convertDateToString(
						order.fulfillOrderTimestamp
					),
					amountGive: giveTokens.minus(numSent),
					amountGet: numOfTokens.minus(numReceived),

					// price: order.price,
					price: priceBN,
					quantity: numOfTokens.minus(numReceived),
					completedQuantity: numOfTokens,
					expiryTimeInSeconds: order.expiryTime,
					displayExpiryDate: convertToDate(order.expiryTime),
					displayExpiryTime: convertToTime(order.expiryTime),
					expiryTime: convertDateToString(order.expiryTime),
					derivativeDecimal: order.tokenGiveDecimal,
					stableCoinDecimal: order.tokenGetDecimal,
				};
			})
			.flat();
		const tokenInst =
			web3 &&
			new web3.eth.Contract(CONTRACT_ABI_ERC20, CHAIN_USDT_CONTRACT_ADDRESS);
		const tokenSymbol = await tokenInst?.methods.symbol().call();
		// console.log(tokenSymbol, "tokenSymbol");
		const USDTTokenDecimal = await tokenInst?.methods.decimals().call();
		let balance = await exchangeContract?.methods
			.unlockBalance(CHAIN_USDT_CONTRACT_ADDRESS, account)
			.call();
		balance = new BigNumber(balance)
			.dividedBy(Math.pow(10, USDTTokenDecimal))
			.toNumber();
		listedTokens = listedTokens.map((token) => {
			return {
				...token,
				balance,
			};
		});
		let activeOrders = listedTokens.filter((order) => {
			return order.quantity > 0;
		});
		activeOrders = activeOrders.filter((order) => {
			return order.initiator !== account;
		});
		activeOrders = activeOrders.filter((order) => {
			return order.expiryTimeInSeconds > Date.now() / 1000;
		});
		const completeOrders = listedTokens.filter((order) => {
			// console.log("Ord val : ", order);
			// console.log(order.quantity.toString(10));
			return order.quantity.toString() === "0";
		});
		// console.log(completeOrders);
		// sort completed orders in descending order of date completed
		completeOrders.sort((a, b) => {
			return (
				b.fulfillOrderTimestampInSeconds - a.fulfillOrderTimestampInSeconds
			);
		});

		let average_price = 0;
		let total_quantity = 0;
		let total_price = 0;
		let last_price = 0;
		if (completeOrders?.length > 0) {
			completeOrders.forEach((order) => {
				total_quantity += order.completedQuantity;
				total_price += order.price * order.completedQuantity;
			});
			average_price = total_price / total_quantity;

			last_price = completeOrders[0].price;
			average_price = parseFloat(average_price).toFixed(2);
			last_price = parseFloat(last_price).toFixed(2);
		}
		setAverageSellingPrice(average_price);
		setLastSellingPrice(last_price);

		setActiveOrders(activeOrders);
		setCompleteOrders(completeOrders);
	} catch (error) {
		console.log(error);
	}
	return listedTokens;
};
