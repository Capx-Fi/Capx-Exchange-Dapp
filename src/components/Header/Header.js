import "./Header.scss";
import CapxLogo from "../../assets/CapxExchangeLogo.svg";
import CapxMobileLogo from "../../assets/CapxLogo.svg";
import LogoutIcon from "../../assets/logout.svg";
import { useSnackbar } from "notistack";
import { hexStripZeros } from "@ethersproject/bytes";
import Web3 from "web3";
import { Web3Provider } from "@ethersproject/providers";

import { useMetamask } from "../../metamaskReactHook/index";

import { injected } from "../../utils/connector";

import { connect } from "react-redux";

import { useEffect, useState } from "react";

import NextIcon from "../../assets/next-black.svg";
import MenuIcon from "../../assets/hamburger.svg";
import ConnectCTA from "../CTA/ConnectCTA";
import { hideSideNav } from "../../redux/actions/sideNav";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { useLocation } from "react-router-dom";
import HeaderDropdown from "../HeaderSearch/HeaderDropdown";
import { fetchAllProjectData } from "../../utils/fetchAllProjectData";
import { WRONG_CHAIN_MESSAGE } from "../../constants/config";
import DropDown from "./DropDown/DropDown";
import AccountDropdown from "./AccountDropdown/AccountDropdown";
import {
  getExchangeURL,
  getMasterURL,
  getSortBy,
  getWrappedURL,
} from "../../constants/getChainConfig";
import useWagmi from "../../useWagmi";

function Header({ vesting, hiddenNav, showSteps, exchange, match }) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    active,
    account,
    library,
    connector,
    deactivate,
    chainId,
    switchNetwork,
  } = useWagmi();
  const { metaState, getChain } = useMetamask();
  const [projectData, setProjectData] = useState([]);
  const desiredChainId = "4";

  const [dashboardModal, setDashboardModal] = useState(false);

  const [web3, setWeb3] = useState(null);

  const setupProvider = async () => {
    let result = await connector?.getProvider().then((res) => {
      return res;
    });
    return result;
  };

  useEffect(() => {
    setupProvider().then((res) => {
      setWeb3(new Web3(res));
    });
  }, [active, chainId]);

  console.log("Header-chainID", chainId);

  const exchangeURL = chainId && getExchangeURL(chainId);
  const wrappedURL = chainId && getWrappedURL(chainId);
  const masterURL = chainId && getMasterURL(chainId);

  const [sortBy, setSortBy] = useState("Ethereum");
  const [showMenu, setShowMenu] = useState(false);
  const handleCloseSelectDashboard = () => {
    setDashboardModal(false);
  };

  useEffect(() => {
    if (active) {
      fetchProjects();
    }
  }, [account, chainId]);
  useEffect(() => {
    setSortBy(chainId && getSortBy(chainId));
  }, [chainId]);

  const fetchProjects = async () => {
    console.log("fetching projects", exchangeURL);
    const projects = await fetchAllProjectData(
      exchangeURL,
      masterURL,
      wrappedURL
    );
    setProjectData(projects);
  };

  const chainChange = async (chainId) => {
    await switchNetwork(chainId);
  };
  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      // console.log(ex);
    }
  }
  return (
    <>
      {active && showMenu && (
        <div className="mobileMenu">
          <DropDown
            sortBy={sortBy}
            setShowMenu={setShowMenu}
            chainChange={chainChange}
          />
          <AccountDropdown
            disconnect={disconnect}
            setShowMenu={setShowMenu}
            accountAddress={`${account?.substr(0, 6)}...${account?.substr(-4)}`}
          />
        </div>
      )}
      <header
        className={`header z-40 ${
          vesting
            ? "border-b border-dark-200 tablet:border-none"
            : "border-b border-dark-200 "
        }`}
      >
        <a href="/">
          <div>
            <img
              className={`${
                location.pathname === "/" && active
                  ? "header_logo"
                  : "header_logoInfo"
              } ${vesting && "breakpoint:flex tablet:hidden "}`}
              src={CapxLogo}
              alt="capx logo"
            />
          </div>
        </a>
        {active &&
          (location.pathname.includes("info") ? (
            <HeaderDropdown
              dropdownData={projectData}
              placeholderText={"Search for Assets"}
            />
          ) : location.pathname === "/exchange" || location.pathname === "/" ? (
            <ToggleSwitch />
          ) : null)}
        {active ? (
          <img
            src={MenuIcon}
            className="tablet:hidden"
            alt="menu icon"
            onClick={() => setShowMenu(!showMenu)}
          />
        ) : null}
        {!hiddenNav && (
          <div className="header_navbar">
            {active && <DropDown sortBy={sortBy} chainChange={chainChange} />}
            {active ? (
              // <div className="ml-4 header_navbar_logoutbutton">
              //   <div className="header_navbar_logoutbutton_text">
              //     {" "}
              //     {`${account.substr(0, 6)}...${account.substr(-4)}`}
              //   </div>
              //   <svg
              //     className="w-5 h-5 text-white dark:text-white"
              //     xmlns="http://www.w3.org/2000/svg"
              //     viewBox="0 0 20 20"
              //     fill="currentColor"
              //   >
              //     <path
              //       fill-rule="evenodd"
              //       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              //       clip-rule="evenodd"
              //     />
              //   </svg>
              // </div>
              <>
                <div className="tablet:block breakpoint:hidden">
                  <AccountDropdown
                    disconnect={disconnect}
                    accountAddress={`${account?.substr(0, 6)}...`}
                  />
                </div>

                <div className="tablet:hidden breakpoint:block">
                  <AccountDropdown
                    disconnect={disconnect}
                    accountAddress={`${account?.substr(
                      0,
                      6
                    )}...${account?.substr(-4)}`}
                  />
                </div>
              </>
            ) : (
              <ConnectCTA
                classes="cbutton"
                title="CONNECT"
                icon={NextIcon}
                onClick={connect}
              />
            )}
          </div>
        )}{" "}
      </header>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    sideNavState: state.sideNav,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideSideNav: () => dispatch(hideSideNav()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
