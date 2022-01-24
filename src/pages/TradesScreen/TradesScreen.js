import "./TradesScreen.scss";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import DropDown from "./DropDown/DropDown";
import dummyToken from "../../assets/dummyToken.svg";
import swapIcon from "../../assets/swapIcon.svg";
import threedot from "../../assets/threedot.svg";
import threedotfilled from "../../assets/threedot-filled.svg";
import Accordion from "./Accordion";

function TradesScreen() {
  const [sortBy, setSortBy] = useState("Sort By");
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const content = useRef(null);
  const tradeData = [
    {
      get: { name: "RELT", amount: "0.456" },
      give: { name: "USDT", amount: "0.234" },
      status: "Completed",
      statusName: "Completed",
    },
    {
      get: { name: "CAPX", amount: "0.456" },
      give: { name: "BNB", amount: "0.234" },
      status: "inProgress",
      statusName: "In Progress",
    },
    {
      get: { name: "RISH", amount: "1.456" },
      give: { name: "SHRE", amount: "100.234" },
      status: "Expired",
      statusName: "Expired",
    },
    {
      get: { name: "MAD", amount: "4.456" },
      give: { name: "PUL", amount: "74.234" },
      status: "Cancelled",
      statusName: "Cancelled",
    },
    {
      get: { name: "RAG", amount: "34.456" },
      give: { name: "SOOR", amount: "23.234" },
      status: "Partial",
      statusName: "Partial",
    },
    {
      get: { name: "ETT", amount: "0.126" },
      give: { name: "MARS", amount: "0.698" },
      status: "Completed",
      statusName: "Completed",
    },
  ];
  const [trades, setTrades] = useState(tradeData);
  useEffect(() => {
    if(sortBy==="Sort By" || sortBy==="All"){
      setTrades(tradeData);
    }
    else{
      setTrades(tradeData.filter(trade=>trade.status===sortBy));
    }

  }, [sortBy])
  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
  }


  return (
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
        {trades.map((trade, index) => (
          <Accordion trade={trade} key={index} />
        ))}
      </div>
    </div>
  );
}

export default TradesScreen;
