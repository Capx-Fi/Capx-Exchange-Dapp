import React from "react";
import "./OverviewCard.scss";

import WalletIcon from "../../assets/WalletBlack.svg";
import CapxMetamask from "../../assets/FirefoxIllustration.png";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";

import {injected} from "../../utils/connector"
import ExtendedOverviewCard from "./ExtendedOverviewCard";
import DeskCTA from "../CTA/DeskCTA";
import {WRONG_CHAIN_MESSAGE} from "../../constants/config";


function ConnectWalletCard() {


  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { active, account, library, connector, activate, deactivate } =
  useWeb3React();
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      if (ex instanceof UnsupportedChainIdError) {
        enqueueSnackbar(WRONG_CHAIN_MESSAGE, { variant: "error" });
      }
      console.log(ex);
    }
  }
  return (
    active ? <ExtendedOverviewCard title="PORTFOLIO VALUE" value="$8,200,89.795" change="$(145.54) (16.34%)" title2="TRADES BY YOU" value2="1154" change2="Last 30 days"/> :
      <div className="connectWalletCard">
      <div className="connectWalletCard_innerDiv">
        <p className="connectWalletCard_innerDiv_value">
          Connect your wallet to start trading
        </p>
        <DeskCTA onClick={connect} classes="button" title={"CONNECT WALLET"} icon={WalletIcon}/>
      </div>
      <div className="connectWalletCard_illustration">
        <img  src={CapxMetamask} />
      </div>
    </div>
  );
}

export default ConnectWalletCard;
