import "./Exchange.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { hideSideNav, showSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import ScrollableTableInstance from "../../layouts/TableLayout/ScrollableTableInstance";
import { ExchangeContractAddress } from "../../constants/config";
import { useWeb3React } from "@web3-react/core";

import crossIcon from "../../assets/close-cyan.svg";

import SellScreen from "./Sell";
import BuyScreen from "./Buy";
import GlobalSearchBox from "../../layouts/TableLayout/GlobalSearchBox";
import TokenSellTable from "./TokenSellTable";
import TokenBuyTable from "./TokenBuyTable";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import { setBuyTicker, setSellTicker } from "../../redux/actions/exchange";
import useWindowSize from "../../utils/windowSize";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import SellModal from "../../components/Modals/VestAndApproveModal/SellModal";
import BuyModal from "../../components/Modals/VestAndApproveModal/BuyModal";
const format = "HH:mm";

function ExchangeScreen({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const { active, account, chainId } = useWeb3React();
  const [payAmount, setPayAmount] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState(null);
  const [assetPrice, setAssetPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [filter, setFilter] = useState("");
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [approveModalStatus, setApproveModalStatus] = useState("");
  const [sellModalStatus, setSellModalStatus] = useState("");
  const [buyModalStatus, setBuyModalStatus] = useState("");
  const [refresh, setRefresh] = useState(false);

  var mode = useSelector((state) => state.exchange.exchangeMode);
  var buyTicker = useSelector((state) => state.exchange.buyTicker);
  var sellTicker = useSelector((state) => state.exchange.sellTicker);

  const isBuyValid = buyTicker?.asset !== undefined && buyTicker.asset !== "";

  const isSellValid =
    sellTicker?.asset !== undefined && sellTicker.asset !== "";
  const setAmount = (quantity, price) => {
    setReceiveAmount(quantity);
    setPayAmount(quantity * Number(price));
    setAssetPrice(price);
  };
  const setMaxAmount = () => {
    const maxPay = Math.min(balance, payAmount);
    setReceiveAmount(maxPay / Number(assetPrice));
    setPayAmount(maxPay);
  };

  const windowWidth = useWindowSize().width;
  const updateSellModalStatus = (status) => {
    setSellModalStatus(status);
    }  
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
      <BuyModal open={buyModalOpen} buyModalStatus={buyModalStatus} />
      {!active ? (
        <MetamaskModal />
      ) : (
        <div
          style={{
            filter:
              approveModalOpen || sellModalOpen || buyModalOpen
                ? "blur(10000px)"
                : "none",
          }}
          className="exchangeScreen"
        >
          {windowWidth > 1279 ? (
            <div className="exchangeScreen_maincontainer">
              <div className="exchangeScreen_leftcontainer">
                <div className="exchangeScreen_header">
                  <div className="exchangeScreen_header_titlecontainer">
                    <p className="exchangeScreen_header_titlecontainer_title">
                      {mode === "sell"
                        ? "Your Portfolio"
                        : filter === "" || filter === undefined
                        ? "Trending Tokens"
                        : "Listed Tokens"}
                    </p>
                    <p className="exchangeScreen_header_titlecontainer_subtitle text-left">
                      {mode === "sell"
                        ? "Sell your tokens on Capx"
                        : "Buy available tokens listed on Capx"}
                    </p>
                  </div>
                  <GlobalSearchBox filter={filter} setFilter={setFilter} mode={mode} />
                </div>
                {mode === "sell" ? (
                  <TokenSellTable filter={filter} refresh={refresh} />
                ) : (
                  <TokenBuyTable
                    filter={filter}
                    setBalance={setBalance}
                    refresh={refresh}
                  />
                )}
              </div>
              {mode === "sell" ? (
                <SellScreen
                  ticker={match.params.ticker}
                  sellModalOpen={sellModalOpen}
                  setSellModalOpen={setSellModalOpen}
                  approveModalOpen={approveModalOpen}
                  setApproveModalOpen={setApproveModalOpen}
                  setApproveModalStatus={setApproveModalStatus}
                  setSellModalStatus={setSellModalStatus}
                  sellModalStatus={sellModalStatus}
                  approveModalStatus={approveModalStatus}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              ) : (
                <BuyScreen
                  ticker={match.params.ticker}
                  payAmount={payAmount}
                  receiveAmount={receiveAmount}
                  setAmount={setAmount}
                  balance={balance}
                  setMaxAmount={setMaxAmount}
                  buyModalOpen={buyModalOpen}
                  setBuyModalOpen={setBuyModalOpen}
                  approveModalOpen={approveModalOpen}
                  setApproveModalOpen={setApproveModalOpen}
                  setApproveModalStatus={setApproveModalStatus}
                  setBuyModalStatus={setBuyModalStatus}
                  buyModalStatus={buyModalStatus}
                  approveModalStatus={approveModalStatus}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              )}
            </div>
          ) : (
            <div
              className={`exchangeScreen_maincontainer ${
                (isBuyValid || isSellValid) &&
                "tablet:border tablet:border-dark-50 rounded-2xl w-90v mx-auto"
              }`}
            >
              <div className="exchangeScreen_leftcontainer">
                {(isBuyValid || isSellValid) && (
                  <div className="hidden tablet:block h-20 relative w-full bg-dark-300 text-white py-6 font-black text-paragraph-1">
                    {isBuyValid
                      ? buyTicker?.asset
                      : isSellValid
                      ? sellTicker?.asset
                      : ""}
                    <img
                      src={crossIcon}
                      alt="close"
                      onClick={() =>
                        buyTicker
                          ? dispatch(setBuyTicker(null))
                          : dispatch(setSellTicker(null))
                      }
                      className="absolute phone:right-8 tablet:right-14  top-6 cursor-pointer h-6"
                    />
                  </div>
                )}
                {!isBuyValid && !isSellValid && (
                  <div className="exchangeScreen_header">
                    <div className="exchangeScreen_header_titlecontainer">
                      <p className="exchangeScreen_header_titlecontainer_title">
                        {mode === "sell"
                          ? "Your Portfolio"
                          : filter === "" || filter === undefined
                          ? "Trending Tokens"
                          : "Listed Tokens"}
                      </p>
                      <p className="exchangeScreen_header_titlecontainer_subtitle text-left">
                        {mode === "sell"
                          ? "Sell your tokens on Capx"
                          : "Buy available tokens listed on Capx"}
                      </p>
                    </div>
                    <GlobalSearchBox filter={filter} setFilter={setFilter} />
                  </div>
                )}

                {mode === "sell" ? (
                  isSellValid ? (
                    <div className="w-auto tablet:px-14 tablet:py-7">
                      <SellScreen
                        ticker={match.params.ticker}
                        sellModalOpen={sellModalOpen}
                        setSellModalOpen={setSellModalOpen}
                        approveModalOpen={approveModalOpen}
                        setApproveModalOpen={setApproveModalOpen}
                        setApproveModalStatus={setApproveModalStatus}
                        setSellModalStatus={setSellModalStatus}
                        sellModalStatus={sellModalStatus}
                        approveModalStatus={approveModalStatus}
                        updateSellModalStatus={updateSellModalStatus}
                        refresh={refresh}
                        setRefresh={setRefresh}
                      />
                    </div>
                  ) : (
                    <TokenSellTable filter={filter} refresh={refresh} />
                  )
                ) : isBuyValid ? (
                  <div className="w-auto  tablet:px-14 tablet:py-7">
                    <BuyScreen
                      ticker={match.params.ticker}
                      payAmount={payAmount}
                      receiveAmount={receiveAmount}
                      setAmount={setAmount}
                      balance={balance}
                      setMaxAmount={setMaxAmount}
                      buyModalOpen={buyModalOpen}
                      setBuyModalOpen={setBuyModalOpen}
                      approveModalOpen={approveModalOpen}
                      setApproveModalOpen={setApproveModalOpen}
                      setApproveModalStatus={setApproveModalStatus}
                      setBuyModalStatus={setBuyModalStatus}
                      buyModalStatus={buyModalStatus}
                      approveModalStatus={approveModalStatus}
                      refresh={refresh}
                      setRefresh={setRefresh}
                    />
                  </div>
                ) : (
                  <TokenBuyTable
                    filter={filter}
                    setBalance={setBalance}
                    refresh={refresh}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ExchangeScreen;
