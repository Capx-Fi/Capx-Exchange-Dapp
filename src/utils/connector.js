import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
	supportedChainIds: process.env.REACT_APP_SUPPORTED_CHAIN_IDS.replace(
		/['"]+/g,
		""
	)
		.split(", ")
		.map(Number),
});

export const walletconnect = new WalletConnectConnector({
	qrcode: true,
	supportedChainIds: process.env.REACT_APP_SUPPORTED_CHAIN_IDS.replace(
		/['"]+/g,
		""
	)
		.split(", ")
		.map(Number),
	rpc: {
		80001: "https://matic-mumbai.chainstacklabs.com",
		97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
		4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
		43113: "https://api.avax-test.network/ext/bc/C/rpc",
		4002: "https://rpc3.fantom.network",
	},
});
