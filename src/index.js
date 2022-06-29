import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { WagmiConfig, createClient, configureChains } from "wagmi";

import { rinkeby, polygonMumbai } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { avalancheChain, bscTestnet } from "./constants/chainObjects";

const { chains, provider, webSocketProvider } = configureChains(
	[avalancheChain, bscTestnet, rinkeby, polygonMumbai],
	[publicProvider()]
);

const client = createClient({
	autoConnect: false,
	connectors: [
		new InjectedConnector({ chains }),
		new WalletConnectConnector({
			chains,
			options: {
				qrcode: true,
			},
		}),
	],
	provider,
	webSocketProvider,
});

ReactDOM.render(
	<WagmiConfig client={client}>
		{/* wagmi client initialisation */}
		<SnackbarProvider // Snackbar for transaction status
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			maxSnack={3}
		>
			<App />
		</SnackbarProvider>
	</WagmiConfig>,
	document.getElementById("root")
);
