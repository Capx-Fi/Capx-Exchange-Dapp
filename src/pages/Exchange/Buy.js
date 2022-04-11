import "./Exchange.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { hideSideNav, showSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import LockIcon from "../../assets/lock-asset.svg";
import SwapIcon from "../../assets/swap.svg";
import NextIcon from "../../assets/next-black.svg";
import { setBuyTicker, setSellTicker } from "../../redux/actions/exchange";
import RefresherInput from "../../components/RefresherInput/RefresherInput";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
import { CONTRACT_ABI_ERC20 } from "../../contracts/SampleERC20";
import { approveSellTokens } from "../../utils/approveSellTokens";
import { fulfillOrder } from "../../utils/fulfillOrder";
import BigNumber from "bignumber.js";

import crossIcon from "../../assets/close-cyan.svg";

import { useWeb3React } from "@web3-react/core";

import Web3 from "web3";
import WarningCard from "../../components/WarningCard/WarningCard";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import BuyModal from "../../components/Modals/VestAndApproveModal/BuyModal";

// New Import

import { validateBuyAmount } from "../../utils/validateBuyAmount";
import useWindowSize from "../../utils/windowSize";
import {
  getExchangeContractAddress,
  getUsdtContractAddress,
} from "../../constants/getChainConfig";

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
  const windowWidth = useWindowSize().width;
  var mode = useSelector((state) => state.exchange.exchangeMode);

  const ticker = useSelector((state) => state.exchange.buyTicker);
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const web3 = new Web3(Web3.givenProvider);
  const { active, account, chainId } = useWeb3React();

  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId && getExchangeContractAddress(chainId);
  const CHAIN_USDT_CONTRACT_ADDRESS =
    chainId && getUsdtContractAddress(chainId);
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

  const resetValue = () => {
    let nullBuyTicker = ticker;
    Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ""));
    dispatch(setBuyTicker({ ...nullBuyTicker }));
  };

  const checkValidBuy = async (amountGet, amountGive) => {
    const checkValidity = await validateBuyAmount(
      ticker,
      amountGet,
      amountGive
    );
    // console.log("checkValidity", checkValidity);
    setCheckBuy(checkValidity);
  };
  const initiateSwapApproval = async () => {
    setButtonClicked(true);
    const vestingTokenContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      CHAIN_USDT_CONTRACT_ADDRESS
    );
    // console.log("CheckBuy", checkBuy.stableCoinValue);
    // console.log("ticker", ticker?.balance);

    const tokens = new BigNumber(checkBuy.stableCoinValue).minus(
      BigNumber(ticker?.balance).multipliedBy(
        Math.pow(10, ticker?.stableCoinDecimal)
      )
    );
    // console.log("tokens", tokens);
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
    checkValidBuy(ticker?.amountGet, ticker?.amountGive);
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
  // console.log("My log : ", ticker);

  useEffect(() => {
    // console.log("CHECK BUY", checkBuy);
  }, [checkBuy]);

  return (
    <div
      className={`exchangeScreen_rightcontainer ${
        (!ticker?.asset || ticker?.asset === "") &&
        "opacity-60 cursor-not-allowed"
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
        <div className="exchangeScreen_rightcontainer_buyContainer_header relative">
          <div className="exchangeScreen_rightcontainer_buyContainer_header_title ">
            <img
              className="exchangeScreen_rightcontainer_buyContainer_header_title_icon"
              src={BuyIcon}
              alt="buy icon"
            />

            <p className="exchangeScreen_rightcontainer_buyContainer_header_title_text">
              BUY {ticker ? " - " + ticker?.asset : ""}
            </p>
            {ticker && ticker?.asset !== "" && window.screen.width < 768 && (
              <img
                className="absolute right-8 h-7"
                src={crossIcon}
                alt="close"
                onClick={() =>
                  ticker
                    ? dispatch(setBuyTicker(null))
                    : dispatch(setSellTicker(null))
                }
              />
            )}
          </div>
        </div>
        <div className="exchangeScreen_rightcontainer_buyContainer_body">
          <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer_title">
              YOU PAY {ticker && ": " + ticker.GetAsset}
            </div>
            <RefresherInput
              ticker={ticker}
              disabled={!ticker?.asset || ticker?.asset === "" || tokenApproval}
              setTicker={(e) => {
                if (
                  BigNumber(e.target.value)
                    .dividedBy(ticker.price)
                    .isGreaterThan(ticker?.maxAmountGet)
                ) {
                  validateBuyAmount(
                    ticker,
                    ticker?.maxAmountGet,
                    ticker?.maxAmountGet * ticker?.price
                  ).then((res) => {
                    setCheckBuy(res);
                    dispatch(
                      setBuyTicker({
                        ...ticker,
                        amountGet: res["amountGetDerivativeValue"],
                        amountGive: res["amountGiveStableCoin"],
                      })
                    );
                  });
                } else {
                  validateBuyAmount(
                    ticker,
                    e.target.value / ticker.price,
                    e.target.value
                  ).then((res) => {
                    setCheckBuy(res);
                    dispatch(
                      setBuyTicker({
                        ...ticker,
                        amountGive: res["amountGiveStableCoin"],
                        amountGet: res["amountGetDerivativeValue"],
                      })
                    );
                  });
                }
              }}
              warningText={
                warningCheck &&
                !tokenApproval &&
                "You don't have enough balance"
              }
              setMaxAmount={() =>
                validateBuyAmount(
                  ticker,
                  ticker.balance / ticker.price,
                  ticker.balance
                ).then((res) => {
                  setCheckBuy(res);
                  dispatch(
                    setBuyTicker({
                      ...ticker,
                      amountGet: Math.min(
                        ticker?.balance / ticker?.price,
                        ticker?.maxAmountGet
                      ),
                      amountGive: Math.min(
                        ticker?.balance,
                        ticker?.maxAmountGet * ticker?.price
                      ),
                    })
                  );
                })
              }
              isMax={true}
              balance={ticker?.balance}
              value={ticker ? ticker.amountGive : ""}
            />
          </div>
          {warningCheck && !tokenApproval && (
            <WarningCard
              text={`Not enough balance on DEX! Approve the difference amount to fulfill your order.`}
              mode={mode}
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
              YOU RECEIVE {ticker && ": " + ticker?.asset}
            </div>
            <RefresherInput
              icon={ticker && LockIcon}
              ticker={ticker}
              disabled={!ticker?.asset || ticker?.asset === "" || tokenApproval}
              isMax={false}
              balance={null}
              value={ticker ? ticker.amountGet : ""}
              setTicker={(e) => {
                if (
                  BigNumber(e.target.value).isGreaterThan(ticker?.maxAmountGet)
                ) {
                  validateBuyAmount(
                    ticker,
                    ticker?.maxAmountGet,
                    ticker?.maxAmountGet * ticker?.price
                  ).then((res) => {
                    setCheckBuy(res);
                    dispatch(
                      setBuyTicker({
                        ...ticker,
                        amountGet: res["amountGetDerivativeValue"],
                        amountGive: res["amountGiveStableCoin"],
                      })
                    );
                  });
                } else {
                  // console.log("e.target.value", e.target.value);
                  validateBuyAmount(
                    ticker,
                    e.target.value,
                    e.target.value * ticker?.price
                  ).then((res) => {
                    setCheckBuy(res);
                    dispatch(
                      setBuyTicker({
                        ...ticker,
                        amountGet: res["amountGetDerivativeValue"],
                        amountGive: res["amountGiveStableCoin"],
                      })
                    );
                  });
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
              (!ticker?.asset ||
                ticker?.asset === "" ||
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
