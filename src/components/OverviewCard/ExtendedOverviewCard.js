import React from "react";
import "./OverviewCard.scss";

function ExtendedOverviewCard({ title, value, change, title2, value2, change2 }) {
  return (
    <div className="extendedOverviewCard">
      <div className="flex flex-row">
        <div className="extendedOverviewCard_innerDiv">
          <p className="extendedOverviewCard_innerDiv_title">{title}</p>
          <p className="extendedOverviewCard_innerDiv_value">{value}</p>
          <p className="extendedOverviewCard_innerDiv_change">{change}</p>
        </div>
        <div className="extendedOverviewCard_innerDiv">
          <p className="extendedOverviewCard_innerDiv_title">{title2}</p>
          <p className="extendedOverviewCard_innerDiv_value">{value2}</p>
          <p className="extendedOverviewCard_innerDiv_change">{change2}</p>
        </div>
      </div>
      <hr className="extendedOverviewCard_divider w-full -mt-7" />
    </div>
  );
}

export default ExtendedOverviewCard;
