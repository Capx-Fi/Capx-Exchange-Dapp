import "./TradesScreen.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import DropDown from "./DropDown/DropDown";
import { useWeb3React } from "@web3-react/core";
import Accordion from "./Accordion";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import { fetchTrades } from "../../utils/fetchTrades";
import { cancelOrder } from "../../utils/cancelOrder";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
import LoadingAccordion from "./LoadingAccordion";

import Web3 from "web3";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import CancelModal from "../../components/Modals/VestAndApproveModal/CancelModal";
import NothingHereTrades from "../../containers/NothingHere/NothingHereInvestorDa";
import {
  getExchangeContractAddress,
  getExchangeURL,
} from "../../constants/getChainConfig";
import WalletModal from "../../components/WalletModal/WalletModal";
import useWagmi from "../../useWagmi";

function TradesScreen() {
  const { active, account, chainId, connector, provider } = useWagmi();
  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId && getExchangeContractAddress(chainId);

  const exchangeURL = chainId && getExchangeURL(chainId);

  const [sortBy, setSortBy] = useState("Sort By");
  const [tradesData, setTradesData] = useState(null);
  const content = useRef(null);
  const [resetTrade, setResetTrade] = useState(null);
  const [cancelModalStatus, setCancelModalStatus] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(0);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    provider.then((res) => {
      setWeb3(new Web3(res));
    });
  }, [active, chainId]);

  useEffect(() => {
    if (tradesData) {
      if (sortBy === 5) {
        setTradesData(resetTrade);
      } else {
        setTradesData(resetTrade.filter((trade) => trade.status === sortBy));
      }
    }
  }, [sortBy]);

  setTimeout(() => {
    setLoading(false);
  }, 3500);

  // console.log(sortBy);

  useEffect(() => {
    if (account) {
      fetchTradeData(account);
    }
  }, [account, chainId]);
  const fetchTradeData = async (account) => {
    setLoading(true);
    const orderList = await fetchTrades(account, exchangeURL);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setTradesData(orderList);
    setResetTrade(orderList);
  };
  const tryCancelOrder = async (orderId) => {
    const exchangeContract =
      web3 &&
      new web3.eth.Contract(EXCHANGE_ABI, CHAIN_EXCHANGE_CONTRACT_ADDRESS);
    const order = await cancelOrder(
      exchangeContract,
      account,
      orderId,
      setCancelModalStatus,
      setCancelModalOpen
    );
    fetchTradeData(account);
  };

  // console.log(loading);

  return (
    <>
      {!active ? (
        <WalletModal modalMode={modalMode} setModalMode={setModalMode} />
      ) : tradesData === null ? (
        <>
          <div className="tradesScreen">
            <div className="tradesScreen_header">
              <div className="tradesScreen_header_titlecontainer">
                <p className="tradesScreen_header_titlecontainer_title asset_loading"></p>
                <p className="tradesScreen_header_titlecontainer_subtitle asset_loading"></p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <CancelModal
            open={cancelModalOpen}
            setOpen={setCancelModalOpen}
            cancelModalStatus={cancelModalStatus}
          />
          <div
            style={{
              filter: cancelModalOpen ? "blur(10000px)" : "none",
            }}
            className="tradesScreen"
          >
            {loading ? (
              <>
                <div className="tradesScreen_header">
                  <div className="tradesScreen_header_titlecontainer">
                    <p className="tradesScreen_header_titlecontainer_title">
                      Trades
                    </p>
                    <p className="tradesScreen_header_titlecontainer_subtitle">
                      Discover new derivative assets to trade on Capx{" "}
                    </p>
                  </div>
                  <div className="tradesScreen_header_dropdowncontainer">
                    <DropDown sortBy={sortBy} setSortBy={setSortBy} disabled />
                  </div>
                </div>
                <div className="tradesScreen_body">
                  {[0, 1, 2].map(() => (
                    <LoadingAccordion />
                  ))}
                </div>
              </>
            ) : tradesData.length > 0 ? (
              <>
                <div className="tradesScreen_header">
                  <div className="tradesScreen_header_titlecontainer">
                    <p className="tradesScreen_header_titlecontainer_title">
                      Trades
                    </p>
                    <p className="tradesScreen_header_titlecontainer_subtitle">
                      Discover new derivative assets to trade on Capx{" "}
                    </p>
                  </div>
                  <div className="tradesScreen_header_dropdowncontainer">
                    <DropDown sortBy={sortBy} setSortBy={setSortBy} />
                  </div>
                </div>
                <div className="tradesScreen_body">
                  {tradesData.map((trade, index) => (
                    <Accordion
                      trade={trade}
                      key={index}
                      cancelOrder={tryCancelOrder}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="tradesScreen_header">
                  <div className="tradesScreen_header_titlecontainer">
                    <p className="tradesScreen_header_titlecontainer_title">
                      Trades
                    </p>
                    <p className="tradesScreen_header_titlecontainer_subtitle">
                      Discover new derivative assets to trade on Capx{" "}
                    </p>
                  </div>
                  <div className="tradesScreen_header_dropdowncontainer">
                    <DropDown sortBy={sortBy} setSortBy={setSortBy} />
                  </div>
                </div>
                <div
                  className="tradesScreen_body flex flex-col"
                  style={{ overflow: "hidden" }}
                >
                  <NothingHereTrades />
                </div>
                {sortBy !== 5 && sortBy !== "Sort By" ? (
                  <span
                    className="-mt-40 phone:-mt-40 tablet:-mt-36 tablet:mr-8 breakpoint:-mt-4 desktop:-mt-28 block z-50 breakpoint:ml-12 text-tradeTitle underline cursor-pointer"
                    onClick={() => setSortBy(5)}
                  >
                    Reset Filters
                  </span>
                ) : null}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default TradesScreen;
