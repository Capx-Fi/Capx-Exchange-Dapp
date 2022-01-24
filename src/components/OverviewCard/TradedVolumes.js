import React from "react";
import "./OverviewCard.scss";

function TradedVolume({ title, value, change, title2, value2 }) {
  return (
    <div className="TradedVolume">
      <div className="flex flex-row">
        <div className="tradedVolume_innerDiv">
          <p className="tradedVolume_innerDiv_title">{title}</p>
          <p className="tradedVolume_innerDiv_value">{value}</p>
          <p className="tradedVolume_innerDiv_change">{change}</p>
        </div>
        <div className="tradedVolume_innerDiv">
          <p className="tradedVolume_innerDiv_title">{title2}</p>
          <p className="tradedVolume_innerDiv_value">{value2}</p>
          <p className="tradedVolume_innerDiv_change">{change}</p>
        </div>
      </div>
    </div>
  );
}

export default TradedVolume;
