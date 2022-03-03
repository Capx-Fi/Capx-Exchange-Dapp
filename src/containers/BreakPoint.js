import React from "react";
import CapxLogo from "../assets/BreakPoint.svg";

function BreakPoint() {
  return (
    <div className="align-middle justify-center h-screen justify-items-center bg-dark-400 flex mx-auto">
      <div>
        <img
          alt="logo"
          src={CapxLogo}
          className="animate-pulse w-auto align-middle justify-center m-auto"
        />

        <p className="text-center text-white text-2xl font-semibold p-0 mt-3">
          Please open Capx Exchange on a larger viewport .i.e Desktops or
          Laptops to leverage the full expereince
        </p>
      </div>
    </div>
  );
}

export default BreakPoint;
