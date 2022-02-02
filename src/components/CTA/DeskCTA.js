import React from "react";
import "./CTA.scss";

function DeskCTA({ title, icon, onClick, classes, textClasses }) {
  return (
    <div className={classes} onClick={onClick}>
      <p className="button_text">{title}</p>
      <img className="button_icon" src={icon} />
    </div>
  );
}

export default DeskCTA;
