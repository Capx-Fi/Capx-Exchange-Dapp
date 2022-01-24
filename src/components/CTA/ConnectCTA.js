import React from "react";
import "./CTA.scss";

function ConnectCTA({ title, icon, onClick, classes }) {
  return (
    <div className={classes} onClick={onClick}>
      <p className="cbutton_text">{title}</p>
      <img className="cbutton_icon" src={icon} />
    </div>
  );
}

export default ConnectCTA;
