import React, { useState } from "react";
import SideNavLink from "../components/SideNavLink/SideNavLink";
import { Link } from "react-router-dom";
import Logo from "../assets/CapxLogo.svg";
function SideNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <div className="md:flex flex-col md:flex-row h-screen w-19v pt-20 fixed top-0 left-0 bg-dark-350 border border-dark-50 border-opacity-20 border-r-2 mx-auto">
          <div
            onClick={() => setOpen(!open)}
            className="flex flex-col w-full md:w-72 text-gray-700 bg-dark-350 dark-mode:text-gray-200 mx-auto flex-shrink-0"
          >
            <div className="flex-shrink-0 px-6 py-4 flex flex-row items-center w-screen md:w-full justify-between">
              {/* <Link
                to="/"
                className="flex flex-row items-center justify-center mb-2 w-full font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline"
              >
                <img src={Logo} className="h-10" alt="logo" />
              </Link> */}
              <button
                onClick={() => setOpen(!open)}
                className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-6 h-6"
                >
                  {open ? (
                    <path
                      x-show="open"
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  ) : (
                    <path
                      x-show="!open"
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  )}
                </svg>
              </button>
            </div>
            <nav
              className={`flex-grow w-screen md:w-full md:block px-4 pb-4 md:pb-0 md:overflow-y-auto ${
                open ? "block" : "hidden"
              }`}
            >
              <SideNavLink text={"Overview"} />
              <SideNavLink text={"Holdings"} />

              <SideNavLink text={"Exchange"} />
              <SideNavLink text={"Trades"} />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideNav;
