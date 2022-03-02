import "./Exchange.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { hideSideNav, showSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import ScrollableTableInstance from "../../layouts/TableLayout/ScrollableTableInstance";
import { ExchangeContractAddress } from "../../constants/config";
import { useWeb3React } from "@web3-react/core";
import MobileTableBuy from "../../components/MobileTable/MobileTableBuy";

import crossIcon from "../../assets/close-cyan.svg";

import SellScreen from "./Sell";
import BuyScreen from "./Buy";
import GlobalSearchBox from "../../layouts/TableLayout/GlobalSearchBox";
import TokenSellTable from "./TokenSellTable";
import TokenBuyTable from "./TokenBuyTable";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import { setBuyTicker, setSellTicker } from "../../redux/actions/exchange";
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
  const [refresh, setRefresh] = useState(false);

  var mode = useSelector((state) => state.exchange.exchangeMode);
  var buyTicker = useSelector((state) => state.exchange.buyTicker);
  var sellTicker = useSelector((state) => state.exchange.sellTicker);

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

  return (
    <>
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
          <div className="hidden breakpoint:block">
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
                  <GlobalSearchBox filter={filter} setFilter={setFilter} />
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
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              )}
            </div>
          </div>

          {/* exchange below breakpoint .i.e 1280*/}
          <div className="phone:hidden breakpoint:hidden">
            <div
              className={`exchangeScreen_maincontainer ${
                (buyTicker || sellTicker) && "border border-dark-50 rounded-2xl"
              }`}
            >
              <div className="exchangeScreen_leftcontainer">
                {(buyTicker || sellTicker) && (
                  <div className="h-20 relative w-full bg-dark-300 text-white py-6 font-black text-paragraph-1">
                    {buyTicker ? buyTicker?.asset : sellTicker?.asset}
                    <img
                      src={crossIcon}
                      alt="close"
                      onClick={() =>
                        buyTicker
                          ? dispatch(setBuyTicker(null))
                          : dispatch(setSellTicker(null))
                      }
                      className="absolute right-14 top-6 cursor-pointer h-6"
                    />
                  </div>
                )}
                {!buyTicker && !sellTicker && (
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
                  sellTicker?.asset !== undefined && sellTicker.asset !== "" ? (
                    <div className="w-auto  px-14 py-7">
                      <SellScreen
                        ticker={match.params.ticker}
                        sellModalOpen={sellModalOpen}
                        setSellModalOpen={setSellModalOpen}
                        approveModalOpen={approveModalOpen}
                        setApproveModalOpen={setApproveModalOpen}
                        refresh={refresh}
                        setRefresh={setRefresh}
                      />
                    </div>
                  ) : (
                    <TokenSellTable filter={filter} refresh={refresh} />
                  )
                ) : buyTicker ? (
                  <div className="w-auto  px-14 py-7">
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
          </div>
          
          {/* exchange below tablet breakpoint i.e 768px */}
          <div className="tablet:hidden phone:block">
          {!buyTicker && !sellTicker && (
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
            <MobileTableBuy />
          </div>
        </div>
      )}
    </>
  );
}

export default ExchangeScreen;
