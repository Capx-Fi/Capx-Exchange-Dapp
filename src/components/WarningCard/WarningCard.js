import React from "react";
import "./WarningCard.scss";
import InfoHeader from "../../pages/ProjectInfo/InfoHeader";
import infoIcon from "../../assets/info.svg";

import WarningIcon from "../../assets/warning-orange.svg";
// import DoubleArrow from "../../assets/redirect.svg";
import { useHistory } from "react-router-dom";
import useWindowSize from "../../utils/windowSize";

function WarningCard({ text, redirect, mode, isApproved }) {
  const history = useHistory();
  const windowWidth = useWindowSize().width;
  return (
    <div>
    {isApproved ? (
      <div className="px-4 py-2 flex items-center text-tradeTitle info_gradient flex-row">
      <div>
        {mode === "buy" ? (
        <img src={infoIcon} className="phone:h-5 breakpoint:h-8 upper:h-12" alt="info icon"/>
        ) : (<img src={infoIcon} className="phone:h-5 breakpoint:h-5 upper:h-6" alt="info icon"/>)}
      </div>
      <div className="text-caption-3 upper:text-caption-2 text-left breakpoint:ml-2 font-semibold px-1 tablet:px-2">
        {windowWidth < 768 ? text.substring(0,14).concat("...") : text}
      </div>
      {/* <div onClick={() => history.push(redirect)}>
        <img src={DoubleArrow} />
      </div> */}
    </div>
  ) : (
    <div className="px-4 py-2 flex items-start text-warning-color-400 warning_gradient flex-row">
      <div>
        {mode === "buy" ? (
        <img src={WarningIcon} className="phone:h-5 breakpoint:h-10 upper:h-12" alt="warning icon"/>
        ) : (<img src={WarningIcon} className="phone:h-5 breakpoint:h-5 upper:h-6" alt="warning icon"/>)}
      </div>
      <div className="text-caption-3 upper:text-caption-2 text-left breakpoint:ml-2 font-semibold px-1 tablet:px-2">
        {windowWidth < 768 ? text.substring(0,14).concat("...") : text}
      </div>
      {/* <div onClick={() => history.push(redirect)}>
        <img src={DoubleArrow} />
      </div> */}
    </div>)}
 
 
  </div>);
}

export default WarningCard;