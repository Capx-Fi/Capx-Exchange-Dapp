import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import OverviewIcon from "../../assets/OverviewIcon.svg";
import BalanceIcon from "../../assets/BalanceIcon.svg";
import TradeIcon from "../../assets/TradesIcon.svg";

import OrdersIcon from "../../assets/Ordersicon.svg";

import "./SideNavLink.scss";

function SideNavLink({ text }) {
  var location = useLocation();

  function textToLink(str) {
    str = str.replace(/\s/g, "").toLowerCase();
    return str;
  }

  return (
    <NavLink
      className={`flex tracking-tight flex-row p-1 pl-5 pr-5 text-paragraph-1 group h-12 w-9/12 items-center m-6 rounded-lg transition-all duration-500 ease-in-out hover:shadow-md hover:bg-dark-250 text-white laptop:text-caption-1 desktop:text-caption-1 desktop:py-4 ${
        location.pathname.substring(1) === textToLink(text)
          ? "font-bold active"
          : "font-normal"
      }`}
      to={`/${textToLink(text)}`}
      exact
    >
      <div
        className={`w-6 mr-3 text-white text-center shadow-sm group-hover:shadow-sm  group-hover:text-white  transition-all duration-500 ease-in-out flex justify-center items-center rounded-2xl group-focus:text-white ${
          location.pathname === text ? "shadow-sm " : ""
        }`}
      >
        {text === "Overview" ? (
          <img src={OverviewIcon} className="h-6 mr-1" alt="logo" />
        ) : null}
        {text === "Holdings" ? (
          <img src={BalanceIcon} className="h-6 mr-1" alt="logo" />
        ) : null}
        {text === "Exchange" ? (
          <img src={TradeIcon} className="h-6 mr-1" alt="logo" />
        ) : null}
        {text === "Trades" ? (
          <img src={OrdersIcon} className="h-6 mr-1" alt="logo" />
        ) : null}
      </div>
      {text}
    </NavLink>
  );
}

export default SideNavLink;
