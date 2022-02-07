import "./Exchange.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { hideSideNav, showSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import LockIcon from "../../assets/lock-asset.svg";
import SwapIcon from "../../assets/swap.svg";
import NextIcon from "../../assets/next-black.svg";
import { setBuyTicker } from "../../redux/actions/exchange";
import RefresherInput from "../../components/RefresherInput/RefresherInput";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
import { CONTRACT_ABI_ERC20 } from "../../contracts/SampleERC20";
import { approveSellTokens } from "../../utils/approveSellTokens";
import { fulfillOrder } from "../../utils/fulfillOrder";
import BigNumber from "bignumber.js";

import {
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_USDT_BSC,
  CONTRACT_ADDRESS_CAPX_USDT_MATIC,
  MATIC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM,
} from "../../constants/config";
import { useWeb3React } from "@web3-react/core";

import Web3 from "web3";
import WarningCard from "../../components/WarningCard/WarningCard";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import BuyModal from "../../components/Modals/VestAndApproveModal/BuyModal";

// New Import

import { validateBuyAmount } from "../../utils/validateBuyAmount";

BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 36],
});

function BuyScreen({
  setMaxAmount,
  approveModalOpen,
  setApproveModalOpen,
  buyModalOpen,
  setBuyModalOpen,
  refresh,
  setRefresh,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, chainId } = useWeb3React();

  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM;
  const CHAIN_USDT_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_MATIC
      : CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM;
  const tokenGetInst = new web3.eth.Contract(
    CONTRACT_ABI_ERC20,
    CHAIN_USDT_CONTRACT_ADDRESS
  );

  const [tokenApproval, setTokenApproval] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [approveModalStatus, setApproveModalStatus] = useState("");
  const [buyModalStatus, setBuyModalStatus] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [warningCheck, setWarningCheck] = useState(false);
  const [checkBuy, setCheckBuy] = useState({});

  const ticker = useSelector((state) => state.exchange.buyTicker);

  const resetValue = () => {
    let nullBuyTicker = ticker;
    Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ''));
    dispatch(setBuyTicker({ ...nullBuyTicker }));
  };
  const checkValidBuy = async () => {
    const checkValidity = await validateBuyAmount(ticker);
    console.log(checkValidity);
    setCheckBuy(checkValidity);
  };
  const initiateSwapApproval = async () => {
    setButtonClicked(true);

    console.log(await validateBuyAmount(ticker));

    const vestingTokenContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      CHAIN_USDT_CONTRACT_ADDRESS
    );

    const tokens = new BigNumber(checkBuy.stableCoinValue).minus(
      BigNumber(ticker?.balance).multipliedBy(
        Math.pow(10, ticker?.stableCoinDecimal)
      )
    );
    const tokenDecimal = ticker?.stableCoinDecimal;
    await approveSellTokens(
      vestingTokenContract,
      account,
      tokens,
      tokenDecimal,
      CHAIN_EXCHANGE_CONTRACT_ADDRESS,
      setApproveModalStatus,
      setTokenApproval,
      setApproveModalOpen
    );
  };
  const finalizeSwap = async () => {
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      CHAIN_EXCHANGE_CONTRACT_ADDRESS
    );
    let totalTokens = ticker.amountGive;
    let totalAmount = checkBuy?.stableCoinValue;
    let tradeID = ticker.tradeID;
    await fulfillOrder(
      exchangeContract,
      account,
      tradeID,
      totalAmount,
      setBuyModalStatus,
      setBuyModalOpen,
      setTokenApproval,
      resetValue
    );
    setTimeout(() => {
      setTokenApproval(false);
      setRefresh(!refresh);
    }, 6000);
  };
  useEffect(() => {
    checkValidBuy();
  }, [ticker?.amountGet, ticker?.amountGive]);
  useEffect(() => {
    if (ticker?.amountGive <= 0 || ticker?.amountGet <= 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    if (ticker?.amountGive > ticker?.balance) {
      setWarningCheck(true);
    } else {
      setWarningCheck(false);
    }
  }, [ticker?.amountGive]);
  console.log("My log : ", ticker);
  return (
    <div
      className={`exchangeScreen_rightcontainer ${
        !ticker && "opacity-60 cursor-not-allowed"
      }`}
    >
      <ApproveModal
        open={approveModalOpen}
        setOpen={setApproveModalOpen}
        approveModalStatus={approveModalStatus}
        setApproveModalStatus={setApproveModalStatus}
      />
      <BuyModal open={buyModalOpen} buyModalStatus={buyModalStatus} />
      <div className="exchangeScreen_rightcontainer_buyContainer">
        <div className="exchangeScreen_rightcontainer_buyContainer_header">
          <div className="exchangeScreen_rightcontainer_buyContainer_header_title">
            <img
              className="exchangeScreen_rightcontainer_buyContainer_header_title_icon"
              src={BuyIcon}
              alt="buy icon"
            />
            <p className="exchangeScreen_rightcontainer_buyContainer_header_title_text">
              BUY {ticker ? " - " + ticker.asset : ""}
            </p>
          </div>
        </div>
        <div className="exchangeScreen_rightcontainer_buyContainer_body">
          <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer_title">
              YOU PAY {ticker && ": " + ticker.GetAsset}
            </div>
            <RefresherInput
              ticker={ticker}
              disabled={!ticker}
              setTicker={(e) => {
                if (
                  BigNumber(e.target.value)
                    .dividedBy(ticker.price)
                    .isGreaterThan(ticker?.maxAmountGet)
                ) {
                  dispatch(
                    setBuyTicker({
                      ...ticker,
                      amountGive: ticker?.maxAmountGet * ticker?.price,
                      amountGet: ticker?.maxAmountGet,
                    })
                  );
                } else {
                  dispatch(
                    setBuyTicker({
                      ...ticker,
                      amountGive: e.target.value,
                      amountGet: (e.target.value / ticker.price).toString(),
                    })
                  );
                }
              }}
              warningText={warningCheck && "You don't have enough balance"}
              setMaxAmount={setMaxAmount}
              isMax={true}
              balance={ticker?.balance}
              value={ticker ? ticker.amountGive : ""}
            />
          </div>
          {warningCheck && (
            <WarningCard
              text={`Not enough balance on DEX! Approve the difference amount to fulfill your order.`}
            />
          )}
          {(!checkBuy?.["stableCoinLegal"] ||
            !checkBuy?.["DerivativeLegal"]) && (
            <WarningCard text={`INVALID INPUT`} />
          )}
          <div className="exchangeScreen_rightcontainer_buyContainer_body_separator">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_separator_line w-7/12"></div>
            <div className="exchangeScreen_rightcontainer_buyContainer_body_separator_iconContainer w-2/12">
              <img
                className="exchangeScreen_rightcontainer_buyContainer_body_separator_iconContainer_icon"
                src={SwapIcon}
                alt="swap icon"
              />
            </div>
            <div className="exchangeScreen_rightcontainer_buyContainer_body_separator_line w-3/12"></div>
          </div>
          <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer_title">
              YOU RECEIVE {ticker && ": " + ticker.asset}
            </div>
            <RefresherInput
              icon={ticker && LockIcon}
              ticker={ticker}
              disabled={!ticker}
              isMax={false}
              balance={null}
              value={ticker ? ticker.amountGet : ""}
              setTicker={(e) => {
                if (
                  BigNumber(e.target.value).isGreaterThan(ticker?.maxAmountGet)
                ) {
                  dispatch(
                    setBuyTicker({
                      ...ticker,
                      amountGive: ticker?.maxAmountGet * ticker?.price,
                      amountGet: ticker?.maxAmountGet,
                    })
                  );
                } else {
                  dispatch(
                    setBuyTicker({
                      ...ticker,
                      amountGive: e.target.value * ticker?.price,
                      amountGet: e.target.value,
                    })
                  );
                }
              }}
            />
          </div>
          <div className="exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_date">
              {" "}
              EXPIRY DATE: {ticker?.displayExpiryDate}
            </div>
            <div className="exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_time">
              {" "}
              EXPIRY TIME: {ticker?.displayExpiryTime}
            </div>
          </div>
          <div
            onClick={() =>
              tokenApproval ||
              BigNumber(ticker?.balance)
                .minus(ticker?.amountGive)
                .isGreaterThan(0)
                ? finalizeSwap()
                : initiateSwapApproval()
            }
            className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
              (!ticker ||
                disabled ||
                !checkBuy?.["stableCoinLegal"] ||
                !checkBuy?.["DerivativeLegal"]) &&
              "pointer-events-none cursor-not-allowed opacity-50"
            }`}
          >
            <div
              className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton_title`}
            >
              {tokenApproval ||
              BigNumber(ticker?.balance)
                .minus(ticker?.amountGive)
                .isGreaterThan(0)
                ? "SWAP TOKENS"
                : "APPROVE TOKENS"}
            </div>
            <div className="exchangeScreen_rightcontainer_buyContainer_body_swapButton_icon">
              <img src={NextIcon} alt="next icon" />
            </div>
          </div>
        </div>
        <div className="exchangeScreen_rightcontainer_buyContainer_footer"></div>
      </div>
    </div>
  );
}

export default BuyScreen;
