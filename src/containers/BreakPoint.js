import React from "react";
import CapxLogo from "../assets/BreakPoint.svg";

function BreakPoint() {
  return (
    <div className="align-middle w-90v -ml-40 h-screen justify-items-center bg-dark-400 flex mx-auto overflow-y-hidden  ">
      <div>
        <img
          alt="logo"
          src={CapxLogo}
          className="animate-pulse w-auto align-middle items-center justify-center m-auto"
        />

        <p className="text-center w-full text-white font-semibold p-0 mt-3 phone:text-caption-2 tablet:text-caption-1 breakpoint:text-paragraph-2 desktop:text-paragraph-1">
          Please open Capx Exchange on a larger viewport .i.e Desktops or
          Laptops to leverage the full experience
        </p>
      </div>
    </div>
  );
}

export default BreakPoint;
