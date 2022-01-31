import "./Withdraw.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { hideSideNav, showSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import NextIcon from "../../assets/next-black.svg";
import RefresherInput from "../../components/RefresherInput/RefresherInput";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
import BigNumber from "bignumber.js";
import { useSnackbar } from "notistack";

import { EXCHANGE_CONTRACT_ADDRESS } from "../../constants/config";
import { CONTRACT_ABI_ERC20 } from "../../contracts/SampleERC20";
import { useWeb3React } from "@web3-react/core";

import Web3 from "web3";
import WarningCard from "../../components/WarningCard/WarningCard";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import { withdrawToken } from "../../utils/withdrawToken";
import { setWithdrawTicker } from "../../redux/actions/withdraw";
import WithdrawModal from "../../components/Modals/VestAndApproveModal/WithdrawModal";

function WithdrawContainer({
  withdrawModalOpen,
  setWithdrawModalOpen,
  refetch,
  setRefetch,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, chainId } = useWeb3React();
  const [withdrawModalStatus, setWithdrawModalStatus] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [warningCheck, setWarningCheck] = useState(false);
  const ticker = useSelector((state) => state.withdraw.withdrawTicker);
  const setQuantity = (e) => {
    dispatch(setWithdrawTicker({ ...ticker, quantity: e }));
  };
  const tryWithdraw = async () => {
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      EXCHANGE_CONTRACT_ADDRESS
    );
    console.log("tt", ticker);
    let totalTokens = ticker.quantity;
    let totalAmount = new BigNumber(totalTokens).multipliedBy(Math.pow(10, 18));
    let assetID = ticker.assetID;
    await withdrawToken(
      exchangeContract,
      account,
      assetID,
      totalAmount,
      setWithdrawModalOpen,
      setWithdrawModalStatus,
      setButtonDisabled,
      enqueueSnackbar
    );

    setTimeout(() => {
      setRefetch(!refetch);
      dispatch(setWithdrawTicker(null));
    }, 6000);
  };
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
  return (
    <div
      className={`exchangeScreen_rightcontainer ${
        !ticker && "opacity-60 cursor-not-allowed"
      }`}
    >
      <WithdrawModal
        open={withdrawModalOpen}
        setOpen={setWithdrawModalOpen}
        withdrawModalStatus={withdrawModalStatus}
        setWithdrawModalStatus={setWithdrawModalStatus}
      />
      <div className="exchangeScreen_rightcontainer_buyContainer">
        <div className="exchangeScreen_rightcontainer_buyContainer_header">
          <div className="exchangeScreen_rightcontainer_buyContainer_header_title">
            <img
              className="exchangeScreen_rightcontainer_buyContainer_header_title_icon"
              src={BuyIcon}
              alt="buy icon"
            />
            <p className="exchangeScreen_rightcontainer_buyContainer_header_title_text">
              WITHDRAW {ticker ? " - " + ticker.asset : ""}
            </p>
          </div>
        </div>
        <div className="exchangeScreen_rightcontainer_buyContainer_body">
          <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer">
            <div className="exchangeScreen_rightcontainer_buyContainer_body_payContainer_title">
              Enter Withdraw Amount
            </div>
            <RefresherInput
              ticker={ticker}
              disabled={!ticker}
              setTicker={(e) => {
                console.log(e.target.value);
                if (e.target.value > ticker?.balance) {
                  dispatch(
                    setWithdrawTicker({
                      ...ticker,
                      quantity: ticker?.balance,
                    })
                  );
                } else {
                  dispatch(
                    setWithdrawTicker({
                      ...ticker,
                      quantity: e.target.value,
                    })
                  );
                }
              }}
              warningText={warningCheck && "You don't have enough balance"}
              isMax={true}
              setMaxAmount={() => {
                setQuantity(ticker?.balance);
              }}
              balance={ticker?.balance}
              value={ticker?.quantity}
            />
          </div>
          {warningCheck && (
            <WarningCard
              text={`Not enough balance on DEX! Approve the difference amount to fulfill your order.`}
            />
          )}
          <div className="exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer"></div>
          <div
            onClick={() => tryWithdraw()}
            className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
              (!ticker || disabled) &&
              "pointer-events-none cursor-not-allowed opacity-50"
            }`}
          >
            <div
              className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton_title ${
                (!ticker || disabled) &&
                "pointer-events-none cursor-not-allowed"
              }`}
            >
              WITHDRAW TOKENS
              {console.log(ticker?.balance - ticker?.amountGive)}
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

export default WithdrawContainer;
