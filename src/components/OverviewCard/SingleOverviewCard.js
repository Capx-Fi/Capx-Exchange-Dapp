import React from "react";
import "./OverviewCard.scss";

import nextGreen from "../../assets/nextGreen.svg";

function SingleOverviewCard({ title, value, change }) {
  return (
    <div className="singleOverviewCard">
      <div className="singleOverviewCard_innerDiv">
        <p className="singleOverviewCard_innerDiv_title">{title}</p>
        <p className="singleOverviewCard_innerDiv_value">{value}</p>
      
      </div>
      <div className="singleOverviewCard_change">
      <p>{change} </p>
      <img alt="next icon" src={nextGreen} className="w-4 ml-2"/>
      </div>
      <hr className="singleOverviewCard_divider" />
    </div>
  );
}

export default SingleOverviewCard;
