import React, { useState } from "react";
import "./DropDown.scss";
import Web3 from "web3";
import { useHistory } from "react-router-dom";

function AccountDropdown({ accountAddress, disconnect, setShowMenu }) {
  const [open, setOpen] = useState(false);
  const web3 = new Web3(Web3.givenProvider);
  const history = useHistory();

  return (
    <div className="relative ml-4">
      <button
        className={`header-account-dropdown-button ${
          open ? "border-success-color-400" : "border-dark-50"
        }`}
        onClick={() => setOpen(!open)}
      >
        <span className="mr-4">{accountAddress}</span>
        <svg
          className="w-5 h-5 text-white dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 bg-dark-300 py-2 mt-2 bg-whitedivide-y divide-gray-600 rounded-md shadow-xl w-40">
          <p
            className="option"
            onClick={() => {
              history.push("/withdraw");
              setOpen(false);
              setShowMenu && setShowMenu(false);
            }}
          >
            Withdraw
          </p>
          <p
            className="option"
            onClick={() => {
              history.push("/trades");
              setOpen(false);
              setShowMenu && setShowMenu(false);
            }}
          >
            Trades
          </p>
          <p
            className="option"
            onClick={() => {
              disconnect();
              setOpen(false);
              setShowMenu && setShowMenu(false);
            }}
          >
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default AccountDropdown;
