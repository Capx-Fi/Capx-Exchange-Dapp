import "./Header.scss";
import CapxLogo from "../../assets/CapxExchangeLogo.svg";
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
import ConnectCTA from "../CTA/ConnectCTA";
import { hideSideNav } from "../../redux/actions/sideNav";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { useLocation } from "react-router-dom";
import HeaderDropdown from "../HeaderSearch/HeaderDropdown";
import { fetchAllProjectData } from "../../utils/fetchAllProjectData";
import DropDown from "./DropDown/DropDown";

function Header({ vesting, hiddenNav, showSteps, exchange, match }) {
  const location = useLocation();
  console.log("location", location);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { active, account, library, connector, activate, deactivate, chainId } =
    useWeb3React();
  const { metaState, getChain } = useMetamask();
  const [projectData, setProjectData] = useState([]);
  const desiredChainId = "4";
  const currentChainId = metaState.chain.id?.toString();
  const [dashboardModal, setDashboardModal] = useState(false);
  const web3 = new Web3(Web3.givenProvider);
  const [sortBy, setSortBy] = useState("Rinkeby");
  const handleCloseSelectDashboard = () => {
    setDashboardModal(false);
  };
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      if (ex instanceof UnsupportedChainIdError) {
        enqueueSnackbar("Please connect to the Rinkeby Chain.", {
          variant: "error",
        });
      }
      console.log(ex);
    }
  }
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    console.log(chainId);
    if (chainId === 80001) setSortBy("Matic");
    else setSortBy("Rinkeby");
  }, [chainId]);
  const fetchProjects = async () => {
    const projects = await fetchAllProjectData();
    setProjectData(projects);
  };
  console.log(Web3Provider.provider);

  const chainChange = async (chainName) => {
    if (chainName === "Rinkeby") {
      try {
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }],
        });
      } catch (error) {
        console.log(error);
      }
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
      } catch (error) {
        console.log(error);
      }
    }
      else if (chainName === "BSC") {
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
        } catch (error) {
          console.log(error);
        }
      }
    
     else {
      console.log(sortBy);
      console.log("error");
    }
  };
  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }
  return (
    <>
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
              className={`header_logo ${vesting && "flex tablet:hidden "}`}
              src={CapxLogo}
              alt="capx logo"
            />
          </div>
        </a>
        {active &&
          (location.pathname.includes("info") ? (
            <HeaderDropdown
              dropdownData={projectData}
              placeholderText={"Search for Assets or Projects"}
            />
          ) : (
            (location.pathname === "/exchange" || location.pathname === "/") ?(<ToggleSwitch />):(
              null )
          ))}
        {!hiddenNav && (
          <div className="header_navbar">
            <DropDown sortBy={sortBy} chainChange={chainChange} />
            {active ? (
              <div className="ml-4 header_navbar_logoutbutton">
                <div className="header_navbar_logoutbutton_text">
                  {" "}
                  {`${account.substr(0, 6)}...${account.substr(-4)}`}
                </div>
                <img
                  className="header_navbar_logoutbutton_icon"
                  onClick={disconnect}
                  src={LogoutIcon}
                  alt="logout icon"
                />
              </div>
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
