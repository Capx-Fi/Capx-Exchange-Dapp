import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { MetamaskStateProvider } from "./metamaskReactHook/index";
import { SnackbarProvider } from "notistack";
import Web3 from "web3";
import { WagmiConfig, createClient } from "wagmi";

const client = createClient();

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
