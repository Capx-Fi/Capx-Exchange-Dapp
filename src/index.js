import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { MetamaskStateProvider } from "./metamaskReactHook/index";
import { SnackbarProvider } from "notistack";
import Web3 from "web3";
import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains,
} from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
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

function getLibrary(provider) {
  return new Web3(provider);
}
ReactDOM.render(
  <WagmiConfig client={client}>
    {/* <MetamaskStateProvider> */}
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      maxSnack={3}
    >
      <App />
      {/* <MetamaskModal /> */}
      {/* <VestingOverview/> */}
    </SnackbarProvider>
    {/* </MetamaskStateProvider> */}
  </WagmiConfig>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
