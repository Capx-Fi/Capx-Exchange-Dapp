import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { hideSideNav, showSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import crossIcon from "../../assets/close-cyan.svg";
import { setSellTicker, setTickerBalance } from "../../redux/actions/exchange";
import BigNumber from "bignumber.js";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
import { CONTRACT_ABI_ERC20 } from "../../contracts/SampleERC20";

import { approveSellTokens } from "../../utils/approveSellTokens";
import { createOrder } from "../../utils/createOrder";
import Web3 from "web3";

import LockIcon from "../../assets/lock-asset.svg";
import NextIcon from "../../assets/next-black.svg";
import DatePicker from "react-date-picker";
import DropdownIcon from "../../assets/dropdown.svg";
import { useWeb3React } from "@web3-react/core";
import { TimePicker } from "antd";
import "./antd.css";
import moment from "moment";
import RefresherInput from "../../components/RefresherInput/RefresherInput";
import WarningCard from "../../components/WarningCard/WarningCard";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import SellModal from "../../components/Modals/VestAndApproveModal/SellModal";

// New Import Helper function

import { validateSellAmount } from "../../utils/validateSellAmount";
import {
  getExchangeContractAddress,
  getUsdtContractAddress,
} from "../../constants/getChainConfig";
import SelectInput from "@material-ui/core/Select/SelectInput";
import useWindowSize from "../../utils/windowSize";
import useWagmi from "../../useWagmi";
const format = "HH:mm";
const currentDate = new Date();
BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 36],
});
function SellScreen({
  sellModalOpen,
  setSellModalOpen,
  approveModalOpen,
  setApproveModalOpen,
  setApproveModalStatus,
  setSellModalStatus,
  approveModalStatus,
  sellModalStatus,
  refresh,
  setRefresh,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const { active, account, chainId, connector } = useWagmi();
  const [web3, setWeb3] = useState(null);

  const setupProvider = async () => {
    let result = await connector?.getProvider().then((res) => {
      return res;
    });
    return result;
  };

  useEffect(() => {
    setupProvider().then((res) => {
      setWeb3(new Web3(res));
    });
  }, [active, chainId]);

  // web3 && console.log(web3);

  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId && getExchangeContractAddress(chainId);
  const CHAIN_USDT_CONTRACT_ADDRESS =
    chainId && getUsdtContractAddress(chainId);
  const tokenGetInst =
    web3 &&
    new web3.eth.Contract(CONTRACT_ABI_ERC20, CHAIN_USDT_CONTRACT_ADDRESS);

  const ticker = useSelector((state) => state.exchange.sellTicker);
  const balance = useSelector((state) => state.exchange.tickerBalance);
  const [tokenApproval, setTokenApproval] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [warningDate, setWarningDate] = useState(false);
  const [checkSell, setCheckSell] = useState({});

  const resetValue = () => {
    let nullSellTicker = ticker;
    if (nullSellTicker)
      Object.keys(nullSellTicker).forEach((i) => (nullSellTicker[i] = ""));
    dispatch(
      setSellTicker({
        ...nullSellTicker,
        expiryDate: new Date(),
        expiryTime: moment().utc().add(15, "minutes"),
      })
    );
  };

  useEffect(() => {
    if (sellModalStatus === "success") {
      resetValue();
    }
  }, [sellModalStatus]);

  // useEffect(() => {
  //   resetValue();
  // }, [account]);

  const windowWidth = useWindowSize().width;

  const setAmount = (e) => {
    dispatch(setSellTicker({ ...ticker, price: e }));
  };

  const setDate = (e) => {
    dispatch(setSellTicker({ ...ticker, expiryDate: e }));
  };
  const setTime = (e) => {
    dispatch(setSellTicker({ ...ticker, expiryTime: moment(e, format).utc() }));
  };
  const setQuantity = (e) => {
    dispatch(setSellTicker({ ...ticker, quantity: e }));
  };
  const setSellNull = () => {
    dispatch(setTickerBalance(0));
    dispatch(setSellTicker(null));
  };

  const checkQuantityUpdate = (value) => {
    const { price, quantity } = ticker;
    // let targetValue = new BigNumber(value).toFixed(6);
    // setQuantity(targetValue);

    setQuantity(value);
  };

  const checkValidSell = async () => {
    const tokenDecimal = await tokenGetInst?.methods.decimals().call();
    // console.log(tokenDecimal, "Tok Dec");
    const checkValidity = await validateSellAmount(ticker, tokenDecimal);
    // console.log(checkValidity);
    setCheckSell(checkValidity);
  };
  const initiateSwapApproval = async () => {
    setButtonClicked(true);

    const vestingTokenContract =
      web3 && new web3.eth.Contract(CONTRACT_ABI_ERC20, ticker.assetID);

    const tokenDecimal = ticker.tokenDecimal;
    let tokens = new BigNumber(checkSell?.amountGiveValue)
      .minus(BigNumber(ticker.balance).multipliedBy(Math.pow(10, tokenDecimal)))
      .toString();
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
    const exchangeContract =
      web3 &&
      new web3.eth.Contract(EXCHANGE_ABI, CHAIN_EXCHANGE_CONTRACT_ADDRESS);
    await createOrder(
      exchangeContract,
      account,
      ticker,
      checkSell,
      sellModalStatus,
      setSellModalStatus,
      setSellModalOpen,
      CHAIN_USDT_CONTRACT_ADDRESS,
      setSellNull
    );
    setTimeout(() => {
      setTokenApproval(false);
      setRefresh(!refresh);
    }, 6000);
  };
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    let kp = [date.getFullYear(), mnth, day].join("-");
    let timestamp =
      new Date(
        Date.UTC(kp.split("-")[0], kp.split("-")[1] - 1, kp.split("-")[2])
      ).getTime() / 1000;
    return timestamp;
  }

  function convertToSeconds(str) {
    var date = new Date(str),
      hours = ("0" + date.getUTCHours()).slice(-2),
      minutes = ("0" + date.getUTCMinutes()).slice(-2);
    return +hours * 60 * 60 + +minutes * 60;
  }

  let expiryTime = ticker?.expiryTime;
  let expiryDate = ticker?.expiryDate;
  let totalExpiryTime = convert(expiryDate) + convertToSeconds(expiryTime);

  //total expiry time should be gretaer than current time otherwise setWarning
  useEffect(() => {
    if (totalExpiryTime < currentDate.getTime() / 1000) {
      setWarningDate("Expiry Time should be greater than current time");
    } else {
      setWarningDate(false);
    }
  }, [totalExpiryTime]);
  useEffect(() => {
    checkValidSell();
  }, [ticker?.quantity, ticker?.price]);
  useEffect(() => {
    if (
      totalExpiryTime < currentDate.getTime() / 1000 ||
      ticker?.price <= 0 ||
      BigNumber(ticker?.quantity).isGreaterThan(balance)
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [ticker?.price, ticker?.quantity, totalExpiryTime, balance]);

  // console.log(ticker, "ticker-sell");

  return (
    <>
      <ApproveModal
        open={approveModalOpen}
        setOpen={setApproveModalOpen}
        approveModalStatus={approveModalStatus}
        setApproveModalStatus={setApproveModalStatus}
      />
      <SellModal
        open={sellModalOpen}
        setOpen={sellModalOpen}
        sellModalStatus={sellModalStatus}
      />
      <div
        className={`exchangeScreen_rightcontainer ${
          (!ticker || !ticker?.asset || ticker?.asset === "") &&
          "opacity-60 cursor-not-allowed"
        }`}
      >
        <div className="exchangeScreen_rightcontainer_buyContainer">
          <div className="exchangeScreen_rightcontainer_buyContainer_header">
            <div className="exchangeScreen_rightcontainer_buyContainer_header_title">
              <img
                className="exchangeScreen_rightcontainer_buyContainer_header_title_icon"
                src={BuyIcon}
                alt="buy icon"
              />
              <p className="exchangeScreen_rightcontainer_buyContainer_header_title_text">
                SELL {ticker?.asset !== undefined && "- " + ticker?.asset}
              </p>
              {ticker && ticker?.asset !== "" && window.screen.width < 769 && (
                <img
                  className="absolute right-8 ml-4 h-6"
                  src={crossIcon}
                  alt="close"
                  onClick={() => dispatch(setSellTicker(null))}
                />
              )}
            </div>
          </div>
          <div className="exchangeScreen_rightcontainer_buyContainer_body">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer">
              <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title">
                QUANTITY
              </div>
              <RefresherInput
                ticker={ticker}
                disabled={
                  !ticker?.asset || ticker?.asset === "" || tokenApproval
                }
                balance={balance}
                isMax={true}
                setMaxAmount={() => {
                  setQuantity(balance);
                }}
                value={ticker?.quantity}
                setTicker={(e) => checkQuantityUpdate(e.target.value)}
                warningText={
                  ticker &&
                  BigNumber(ticker?.quantity).isGreaterThan(balance) &&
                  `INSUFFICIENT BALANCE. BUY MORE $ ${ticker && ticker.asset}`
                }
              />
            </div>
            {ticker && BigNumber(ticker?.quantity).isGreaterThan(balance) && (
              <WarningCard
                text={`INSUFFICIENT BALANCE. BUY MORE $${
                  ticker && ticker.asset
                }`}
              />
            )}
            {(!checkSell?.["amountGiveLegal"] || !checkSell?.["USDTLegal"]) && (
              <WarningCard text={`INVALID INPUT`} />
            )}
            <div className="exchangeScreen_rightcontainer_buyContainer_body_splitContainer">
              <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer">
                <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title">
                  PRICE(USDT)
                </div>
                <div
                  className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer ${
                    !ticker?.asset || ticker?.asset === "" || tokenApproval
                      ? tokenApproval
                        ? "pointer-events-none ring-success-color-500 opacity-50"
                        : "pointer-events-none ring-dark-50 opacity-50"
                      : "ring-success-color-500 opacity-500"
                  } `}
                >
                  <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper">
                    <input
                      className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input"
                      type="number"
                      placeholder="0"
                      value={ticker?.price ? ticker?.price : ""}
                      onChange={(e) => setAmount(e.target.value)}
                      warningText={ticker?.price < 0 && "PRICE CANNOT BE ZERO"}
                    />
                  </div>
                </div>
              </div>
              <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer">
                <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title">
                  TOKEN
                </div>
                <RefresherInput
                  value={ticker ? ticker.asset : ""}
                  type={"text"}
                  ticker={ticker}
                  balance={null}
                  disabled={true}
                  icon={ticker && LockIcon}
                />
              </div>
            </div>
            {ticker?.price <= 0 && (
              <WarningCard
                text={`PRICE CANNOT BE ${
                  parseInt(ticker?.price) < 0 ? "NEGATIVE" : "ZERO"
                }`}
              />
            )}

            <div className="exchangeScreen_rightcontainer_buyContainer_body_splitContainer">
              <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer">
                <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title">
                  EXPIRY DATE
                </div>
                <div
                  className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer ${
                    !ticker ||
                    !ticker?.asset ||
                    ticker?.asset === "" ||
                    tokenApproval
                      ? "pointer-events-none ring-dark-50"
                      : "ring-success-color-500 "
                  } `}
                >
                  <div
                    className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper w-full ${
                      !ticker ||
                      !ticker?.asset ||
                      ticker?.asset === "" ||
                      tokenApproval
                        ? "pointer-events-none ring-dark-50"
                        : "ring-success-color-500 "
                    } `}
                  >
                    <DatePicker
                      onChange={setDate}
                      value={ticker && ticker?.expiryDate}
                      clearIcon={null}
                      minDate={new Date()}
                      calendarIcon={
                        <>
                          <img src={DropdownIcon} alt="dropdown" />
                        </>
                      }
                      showLeadingZeros={true}
                      calendarClassName="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_dateInput text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer">
                <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title">
                  EXPIRY TIME (UTC)
                </div>
                <div
                  className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer ${
                    !ticker ||
                    !ticker?.asset ||
                    ticker?.asset === "" ||
                    tokenApproval
                      ? "pointer-events-none ring-dark-50"
                      : "ring-success-color-500 "
                  } `}
                >
                  <div className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper w-full">
                    <TimePicker
                      defaultValue={moment().utc().add(15, "minutes")}
                      allowClear={false}
                      disabled={!ticker}
                      bordered={false}
                      format={format}
                      onChange={(value) => setTime(value)}
                      popupClassName="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_timeInput"
                      className="exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input"
                      minuteStep={15}
                      showNow={false}
                      suffixIcon={
                        <>
                          <img src={DropdownIcon} alt="dropdown" />
                        </>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {warningDate && <WarningCard text={warningDate} />}

            <div className="exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer"></div>
            <div
              onClick={() =>
                tokenApproval ||
                BigNumber(ticker?.quantity).isLessThanOrEqualTo(ticker?.balance)
                  ? finalizeSwap()
                  : initiateSwapApproval()
              }
              className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
                (!ticker?.asset ||
                  ticker?.asset === "" ||
                  disabled ||
                  !checkSell?.["amountGiveLegal"] ||
                  !checkSell?.["USDTLegal"]) &&
                "pointer-events-none cursor-not-allowed opacity-50"
              }`}
            >
              <div className="exchangeScreen_rightcontainer_buyContainer_body_swapButton_title">
                {tokenApproval ||
                BigNumber(ticker?.quantity).isLessThanOrEqualTo(ticker?.balance)
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
    </>
  );
}

export default SellScreen;
