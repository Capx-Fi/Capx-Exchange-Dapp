import "./Header.scss";
import CapxLogo from "../../assets/CapxExchangeLogo.svg";
import CapxMobileLogo from "../../assets/CapxLogo.svg";
import LogoutIcon from "../../assets/logout.svg";
import { useSnackbar } from "notistack";
import { hexStripZeros } from "@ethersproject/bytes";
import Web3 from "web3";
import { Web3Provider } from "@ethersproject/providers";

import { useMetamask } from "../../metamaskReactHook/index";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
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

function Header({ vesting, hiddenNav, showSteps, exchange, match }) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { active, account, library, connector, activate, deactivate, chainId } =
    useWeb3React();
  const { metaState, getChain } = useMetamask();
  const [projectData, setProjectData] = useState([]);
  const desiredChainId = "4";
  const currentChainId = metaState.chain.id?.toString();
  const [dashboardModal, setDashboardModal] = useState(false);

  const web3 = new Web3(Web3.givenProvider);

  const exchangeURL = chainId && getExchangeURL(chainId);
  const wrappedURL = chainId && getWrappedURL(chainId);
  const masterURL = chainId && getMasterURL(chainId);

  const [sortBy, setSortBy] = useState("Ethereum");
  const [showMenu, setShowMenu] = useState(false);
  const handleCloseSelectDashboard = () => {
    setDashboardModal(false);
  };
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      if (ex instanceof UnsupportedChainIdError) {
        enqueueSnackbar(WRONG_CHAIN_MESSAGE, {
          variant: "error",
        });
      }
    }
  }
  useEffect(() => {
    if (active) fetchProjects();
  }, [account, chainId]);
  useEffect(() => {
    setSortBy(chainId && getSortBy(chainId));
  }, [chainId]);
  const fetchProjects = async () => {
    const projects = await fetchAllProjectData(
      exchangeURL,
      masterURL,
      wrappedURL
    );
    setProjectData(projects);
  };

  const chainChange = async (chainName) => {
    if (chainName === "Ethereum") {
      try {
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }],
        });
      } catch (error) {}
    } else if (chainName === "Matic") {
      try {
        await web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Polygon Testnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ],
        });
        // await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [
        //     {
        //       chainId: "0x89",
        //       chainName: "Polygon",
        //       nativeCurrency: {
        //         name: "MATIC",
        //         symbol: "MATIC",
        //         decimals: 18,
        //       },
        //       rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
        //       blockExplorerUrls: ["https://polygonscan.com/"],
        //     },
        //   ],
        // });
      } catch (error) {}
    } else if (chainName === "BSC") {
      try {
        await web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x61",
              chainName: "Binance Smart Chain Test",
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
              blockExplorerUrls: ["https://testnet.bscscan.com/"],
            },
          ],
        });
        // await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [
        //     {
        //       chainId: '0x61',
        //       chainName: 'Binance Smart Chain Test',
        //       nativeCurrency: {
        //         name: 'BNB',
        //         symbol: 'BNB',
        //         decimals: 18,
        //       },
        //       rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        //       blockExplorerUrls: ['https://testnet.bscscan.com/'],
        //     },
        //   ],
        // });
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x38",
              chainName: "Binance Smart Chain",
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
              blockExplorerUrls: ["https://bscscan.com/"],
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    } else if (chainName === "Avalanche") {
      try {
        await web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xA869",
              chainName: "Avalanche Fuji",
              nativeCurrency: {
                name: "AVAX",
                symbol: "AVAX",
                decimals: 18,
              },
              rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
              blockExplorerUrls: ["https://testnet.snowtrace.io/"],
            },
          ],
        });
        // await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [
        //     {
        //       chainId: "0xA86A",
        //       chainName: "Avalanche",
        //       nativeCurrency: {
        //         name: "AVAX",
        //         symbol: "AVAX",
        //         decimals: 18,
        //       },
        //       rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        //       blockExplorerUrls: ["https://snowtrace.io/"],
        //     },
        //   ],
        // });
      } catch (error) {
        console.log(error);
      }
    }
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
          <DropDown sortBy={sortBy} chainChange={chainChange} />
          <AccountDropdown
            disconnect={disconnect}
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
                    accountAddress={`${account.substr(0, 6)}...`}
                  />
                </div>

                <div className="tablet:hidden breakpoint:block">
                  <AccountDropdown
                    disconnect={disconnect}
                    accountAddress={`${account.substr(0, 6)}...${account.substr(
                      -4
                    )}`}
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
