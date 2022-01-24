import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import OverviewIcon from "../assets/OverviewIcon.svg";
import BalanceIcon from "../assets/BalanceIcon.svg";

function SideNavLink({ text }) {
  var location = useLocation();

  function textToLink(str) {
    str = str.replace(/\s/g, "").toLowerCase();
    return str;
  }

  return (
    <NavLink
      className={`flex flex-row p-2 px-6 group h-12 w-full items-center mb-5 rounded-lg transition-all duration-500 ease-in-out  hover:bg-primary-green-300 hover:shadow-md text-white ${
        location.pathname.substring(1) === textToLink(text)
          ? "bg-gradientGreen shadow-md "
          : ""
      }`}
      to={`/${textToLink(text)}`}
      exact
    >
      <div
        className={`w-6 mr-4 text-white shadow-sm group-hover:shadow-sm  group-hover:text-white group-hover:bg-orange transition-all duration-500 ease-in-out flex justify-center items-center rounded-2xl group-focus:bg-orange group-focus:text-white ${
          location.pathname === text ? "shadow-sm " : ""
        }`}
      >
        {text === "Overview" ? (
          <img src={OverviewIcon} className="h-10" alt="logo" />
        ) : null}
        {text === "Balance" ? (
          <img src={BalanceIcon} className="h-10" alt="logo" />
        ) : null}
      </div>
      {text}
    </NavLink>
  );
}

export default SideNavLink;
