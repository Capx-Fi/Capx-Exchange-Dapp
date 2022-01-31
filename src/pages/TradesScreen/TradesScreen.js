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
import { EXCHANGE_CONTRACT_ADDRESS } from "../../constants/config";
import Web3 from "web3";

function TradesScreen() {
    const { active, account, chainId } = useWeb3React();
      const web3 = new Web3(Web3.givenProvider);

  const [sortBy, setSortBy] = useState("Sort By");
  const [tradesData, setTradesData] = useState([]);
  const content = useRef(null);
  const [resetTrade, setResetTrade] = useState([]);
  useEffect(() => {
    if(sortBy===5){
      setTradesData(resetTrade);
    }
    else{
      setTradesData(resetTrade.filter((trade) => trade.status === sortBy));
    }

  }, [sortBy])
  useEffect(() => {
    if (account) {
      console.log("account", account);
      fetchTradeData(account);
    }
  }, [account, chainId]);
  const fetchTradeData = async (account) => {
    let orderList = [];
    orderList = await fetchTrades(account);
    setTradesData(orderList);
    setResetTrade(orderList);
    console.log("orderList", orderList);
  };
  const tryCancelOrder = async(orderId) => {
        const exchangeContract = new web3.eth.Contract(
          EXCHANGE_ABI,
          EXCHANGE_CONTRACT_ADDRESS
        );
    console.log("orderId", orderId);
    const order = await cancelOrder(exchangeContract, account, orderId);
    console.log("order", order);
    fetchTradeData(account);
  }


  return (
    <>
      {!active ? (
        <MetamaskModal />
      ) : (
        <div className="tradesScreen">
          <div className="tradesScreen_header">
            <div className="tradesScreen_header_titlecontainer">
              <p className="tradesScreen_header_titlecontainer_title">Trades</p>
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
        </div>
      )}
    </>
  );
}

export default TradesScreen;
