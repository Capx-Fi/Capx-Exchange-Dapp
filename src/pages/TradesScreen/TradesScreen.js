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
import {
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  CONTRACT_ADDRESS_CAPX_USDT_BSC,
  CONTRACT_ADDRESS_CAPX_USDT_MATIC,
  CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM,
  MATIC_CHAIN_ID,
  GRAPHAPIURL_EXCHANGE_BSC,
  GRAPHAPIURL_EXCHANGE_MATIC,
  GRAPHAPIURL_EXCHANGE_ETHEREUM,
  ETHEREUM_CHAIN_ID,
  USDT_CONTRACT_ADDRESS,
} from "../../constants/config";
import Web3 from "web3";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import CancelModal from "../../components/Modals/VestAndApproveModal/CancelModal";
import NothingHereTrades from "../../containers/NothingHere/NothingHereInvestorDa";

function TradesScreen() {
  const { active, account, chainId } = useWeb3React();
  const web3 = new Web3(Web3.givenProvider);
  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM;

  const exchangeURL =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? GRAPHAPIURL_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_MATIC
      : GRAPHAPIURL_EXCHANGE_ETHEREUM;
  const [sortBy, setSortBy] = useState("Sort By");
  const [tradesData, setTradesData] = useState(null);
  const content = useRef(null);
  const [resetTrade, setResetTrade] = useState(null);
  const [cancelModalStatus, setCancelModalStatus] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(tradesData) {
    if (sortBy === 5) {
      setTradesData(resetTrade);
    } else {
      setTradesData(resetTrade.filter((trade) => trade.status === sortBy));
    }
    }
  }, [sortBy]);
  useEffect(() => {
    if (account) {
      fetchTradeData(account);
      setLoading(false);
    }
  }, [account, chainId]);
  const fetchTradeData = async (account) => {
    const orderList = await fetchTrades(account, exchangeURL);
    setTradesData(orderList);
    setResetTrade(orderList);
  };
  const tryCancelOrder = async (orderId) => {
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      CHAIN_EXCHANGE_CONTRACT_ADDRESS
    );
    const order = await cancelOrder(
      exchangeContract,
      account,
      orderId,
      setCancelModalStatus,
      setCancelModalOpen
    );
    fetchTradeData(account);
  };

  return (
    <>
      {!active ? (
        <MetamaskModal />
      ) : tradesData === null ? (
        <>
          <div
            className="tradesScreen"
          >
            <div className="tradesScreen_header">
              <div className="tradesScreen_header_titlecontainer">
                <p className="tradesScreen_header_titlecontainer_title asset_loading">
                  
                </p>
                <p className="tradesScreen_header_titlecontainer_subtitle asset_loading">
                </p>
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
            {!loading && tradesData.length > 0 ? (
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
                <div className="tradesScreen_body" style={{overflow: "hidden"}}>
                <NothingHereTrades />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default TradesScreen;
