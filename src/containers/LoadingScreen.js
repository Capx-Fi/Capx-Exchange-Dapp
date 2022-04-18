import React from "react";
import CapxLogo from "../assets/CapxExchangeLogo.svg";

function LoadingScreen() {
  return (
    <div className="align-middle justify-center justify-items-center bg-dark-400 flex h-screen">
      <img
        alt="logo"
        src={CapxLogo}
        className="animate-pulse phone:w-55v breakpoint:w-20v h-auto align-middle justify-center m-auto"
      />
    </div>
  );
}

export default LoadingScreen;
