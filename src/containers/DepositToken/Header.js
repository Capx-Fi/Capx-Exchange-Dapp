import React, { useState } from "react";
import "./DepositToken.scss";
import BackIcon from "../../assets/previous-cyan.svg";
import CloseIcon from "../../assets/close-cyan.svg";
function DepositTokenHeader() {
  return (
    <div className="DepositTokenScreen_maincontainer_header">
      <div className="DepositTokenScreen_maincontainer_header_left">
        <div className="DepositTokenScreen_maincontainer_header_left_logo">
          <img src={BackIcon} alt="back icon" />
        </div>
        <div className="DepositTokenScreen_maincontainer_header_left_title">
          Back
        </div>
      </div>
      <div className="DepositTokenScreen_maincontainer_header_right">
        <div className="DepositTokenScreen_maincontainer_header_right_title">
          Close
        </div>
        <div className="DepositTokenScreen_maincontainer_header_right_logo">
          <img src={CloseIcon} alt="close icon" />
        </div>
      </div>
    </div>
  );
}

export default DepositTokenHeader;