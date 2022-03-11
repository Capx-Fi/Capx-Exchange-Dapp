import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideSideNav } from "../../redux/actions/sideNav";
import BuyScreen from "./Buy";
import ProjectDescription from "./ProjectDescription";
import { setProjectBuyTicker } from "../../redux/actions/exchange";

import crossIcon from "../../assets/close-cyan.svg";

import {
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  CONTRACT_ADDRESS_CAPX_USDT_BSC,
  CONTRACT_ADDRESS_CAPX_USDT_MATIC,
  CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM,
  MATIC_CHAIN_ID,
  GRAPHAPIURL_EXCHANGE_BSC,
  GRAPHAPIURL_EXCHANGE_MATIC,
  GRAPHAPIURL_EXCHANGE_ETHEREUM,
  GRAPHAPIURL_MASTER_BSC,
  GRAPHAPIURL_MASTER_MATIC,
  GRAPHAPIURL_MASTER_ETHEREUM,
  GRAPHAPIURL_WRAPPED_MATIC,
  GRAPHAPIURL_WRAPPED_BSC,
  GRAPHAPIURL_WRAPPED_ETHEREUM,
} from "../../constants/config";
import InfoHeader from "./InfoHeader";
import { fetchProjectDetails } from "../../utils/fetchProjectDetails";
import { useState } from "react";
import { fetchOrderForTicker } from "../../utils/fetchOrderForTicker";
import { useWeb3React } from "@web3-react/core";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import { useSelector } from "react-redux";
import useWindowSize from "../../utils/windowSize";

function ProjectInfo({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const ticker = useSelector((state) => state.exchange.projectBuyTicker);
  const [projectDetails, setProjectDetails] = useState({});
  const [activeOrders, setActiveOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const { active, account, chainId } = useWeb3React();
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [lastSellingPrice, setLastSellingPrice] = useState(0);
  const [averageSellingPrice, setAverageSellingPrice] = useState(0);
  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM;
  const CHAIN_USDT_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_MATIC
      : CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM;
  const exchangeURL =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? GRAPHAPIURL_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_MATIC
      : GRAPHAPIURL_EXCHANGE_ETHEREUM;
  const wrappedURL =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? GRAPHAPIURL_WRAPPED_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_WRAPPED_MATIC
      : GRAPHAPIURL_WRAPPED_ETHEREUM;
  const masterURL =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? GRAPHAPIURL_MASTER_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_MASTER_MATIC
      : GRAPHAPIURL_MASTER_ETHEREUM;

  useEffect(() => {
    let nullBuyTicker = ticker;
    if (nullBuyTicker) {
      Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ""));
      dispatch(setProjectBuyTicker({ ...nullBuyTicker }));
    }
    getProjectDetails(match.params.ticker);
  }, [match.params.ticker, active, account, chainId, refresh]);
  const getProjectDetails = async () => {
    if (active) {
      const _projectDetails = await fetchProjectDetails(
        match.params.ticker,
        masterURL
      );

      setProjectDetails(_projectDetails);
      const _activeOrders = await fetchOrderForTicker(
        _projectDetails.id,
        setActiveOrders,
        setCompleteOrders,
        account,
        chainId,
        setLastSellingPrice,
        setAverageSellingPrice,
        exchangeURL,
        wrappedURL,
        CHAIN_USDT_CONTRACT_ADDRESS
      );
    }
  };

  const windowWidth = useWindowSize().width;

  return (
    <>
      {!active ? (
        <MetamaskModal />
      ) : (
        <div
          style={{
            filter: approveModalOpen || buyModalOpen ? "blur(10000px)" : "none",
          }}
          className="w-82v breakpoint:w-full  desktop:w-82v mx-auto "
        >
          <div
            className={`main-container ${
              ticker &&
              ticker?.asset !== "" &&
              "border border-dark-50 rounded-2xl block breakpoint:border-0"
            }`}
          >
            {windowWidth > 1279 ? (
              <div className="breakpoint:flex">
                {" "}
                <div className="main-container_left">
                  <InfoHeader
                    ticker={`${projectDetails?.projectName} (${projectDetails.projectTokenTicker})`}
                    lastSellingPrice={lastSellingPrice}
                    averageSellingPrice={averageSellingPrice}
                  />
                  <ProjectDescription
                    projectDetails={projectDetails}
                    activeOrders={activeOrders}
                    completeOrders={completeOrders}
                  />
                </div>
                <BuyScreen
                  buyModalOpen={buyModalOpen}
                  setBuyModalOpen={setBuyModalOpen}
                  approveModalOpen={approveModalOpen}
                  setApproveModalOpen={setApproveModalOpen}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>
            ) : (
              <div className="main-container_left w-full">
                {ticker && ticker.asset !== "" && (
                  <div className="h-20 relative w-full bg-dark-300 text-white py-6 font-black text-paragraph-1">
                    {ticker && ticker?.asset}
                    <img
                      src={crossIcon}
                      alt="close"
                      onClick={() => dispatch(setProjectBuyTicker(null))}
                      className="absolute right-14 top-6 cursor-pointer h-6"
                    />
                  </div>
                )}
                {!ticker || ticker.asset == "" ? (
                  <>
                    <InfoHeader
                      ticker={`${projectDetails?.projectName} (${projectDetails.projectTokenTicker})`}
                      lastSellingPrice={lastSellingPrice}
                      averageSellingPrice={averageSellingPrice}
                    />
                    <ProjectDescription
                      projectDetails={projectDetails}
                      activeOrders={activeOrders}
                      completeOrders={completeOrders}
                    />
                  </>
                ) : (
                  <div className="w-auto  px-14 py-7">
                    <BuyScreen
                      buyModalOpen={buyModalOpen}
                      setBuyModalOpen={setBuyModalOpen}
                      approveModalOpen={approveModalOpen}
                      setApproveModalOpen={setApproveModalOpen}
                      refresh={refresh}
                      setRefresh={setRefresh}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectInfo;
