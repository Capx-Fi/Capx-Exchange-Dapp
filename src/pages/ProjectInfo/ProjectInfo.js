import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideSideNav } from "../../redux/actions/sideNav";
import BuyScreen from "./Buy";
import ProjectDescription from "./ProjectDescription";
import { setProjectBuyTicker } from "../../redux/actions/exchange";

import crossIcon from "../../assets/close-cyan.svg";
import InfoHeader from "./InfoHeader";
import { fetchProjectDetails } from "../../utils/fetchProjectDetails";
import { useState } from "react";
import { fetchOrderForTicker } from "../../utils/fetchOrderForTicker";
import { useWeb3React } from "@web3-react/core";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import { useSelector } from "react-redux";
import useWindowSize from "../../utils/windowSize";
import {
	getExchangeContractAddress,
	getExchangeURL,
	getMasterURL,
	getUsdtContractAddress,
	getWrappedURL,
} from "../../constants/getChainConfig";
import ApproveModal from "../../components/Modals/VestAndApproveModal/ApproveModal";
import BuyModal from "../../components/Modals/VestAndApproveModal/BuyModal";
import WalletModal from "../../components/WalletModal/WalletModal";
import Web3 from "web3";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
// import { CONTRACT_ABI_ERC20 } from "../contracts/SampleERC20";

function ProjectInfo({ match }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(hideSideNav());
	}, []);
	const ticker = useSelector((state) => state.exchange.projectBuyTicker);
	const [projectDetails, setProjectDetails] = useState({});
	const [activeOrders, setActiveOrders] = useState([]);
	const [completeOrders, setCompleteOrders] = useState([]);
	const { active, account, chainId, connector } = useWeb3React();
	const [approveModalOpen, setApproveModalOpen] = useState(false);
	const [buyModalOpen, setBuyModalOpen] = useState(false);
	const [approveModalStatus, setApproveModalStatus] = useState("");
	const [buyModalStatus, setBuyModalStatus] = useState("");
	const [refresh, setRefresh] = useState(false);
	const [lastSellingPrice, setLastSellingPrice] = useState(0);
	const [averageSellingPrice, setAverageSellingPrice] = useState(0);
	const [modalMode, setModalMode] = useState(0);
	const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
		chainId && getExchangeContractAddress(chainId);
	const CHAIN_USDT_CONTRACT_ADDRESS =
		chainId && getUsdtContractAddress(chainId);
	const exchangeURL = chainId && getExchangeURL(chainId);
	const wrappedURL = chainId && getWrappedURL(chainId);
	const masterURL = chainId && getMasterURL(chainId);
	const [loading, setLoading] = useState(false);
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

	console.log(web3);
	console.log(web3?.currentProvider);
	useEffect(() => {
		let nullBuyTicker = ticker;
		if (nullBuyTicker) {
			Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ""));
			dispatch(setProjectBuyTicker({ ...nullBuyTicker }));
		}
		web3?.currentProvider && getProjectDetails(match.params.ticker);
	}, [match.params.ticker, active, account, chainId, refresh, web3]);

	const getProjectDetails = async () => {
		setLoading(true);
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
				CHAIN_USDT_CONTRACT_ADDRESS,
				web3
			);
			setLoading(false);
		}
	};

	const windowWidth = useWindowSize().width;

	return (
		<>
			<ApproveModal
				open={approveModalOpen}
				setOpen={setApproveModalOpen}
				approveModalStatus={approveModalStatus}
				setApproveModalStatus={setApproveModalStatus}
			/>
			<BuyModal open={buyModalOpen} buyModalStatus={buyModalStatus} />

			{!active ? (
				<WalletModal modalMode={modalMode} setModalMode={setModalMode} />
			) : (
				<div
					style={{
						filter: approveModalOpen || buyModalOpen ? "blur(10000px)" : "none",
					}}
					className="w-82v breakpoint:w-90v desktop:w-82v mx-auto "
				>
					<div
						className={`main-container ${
							ticker &&
							ticker?.asset !== "" &&
							"border border-dark-50 rounded-2xl block phone:border-0"
						}`}
					>
						{windowWidth > 1279 ? (
							<div className="phone:hidden breakpoint:flex">
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
									setApproveModalStatus={setApproveModalStatus}
									buyModalStatus={buyModalStatus}
									setBuyModalStatus={setBuyModalStatus}
									refresh={refresh}
									setRefresh={setRefresh}
								/>
							</div>
						) : (
							<div className="main-container_left w-full">
								{ticker && ticker.asset !== "" && (
									<div className="h-20 hidden tablet:block relative w-full bg-dark-300 text-white py-6 font-black text-paragraph-1">
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
											loading={loading}
										/>
									</>
								) : (
									<div className="w-auto phone:w-full tablet:px-14 tablet:py-7 phone:mb-10">
										<BuyScreen
											buyModalOpen={buyModalOpen}
											setBuyModalOpen={setBuyModalOpen}
											approveModalOpen={approveModalOpen}
											setApproveModalOpen={setApproveModalOpen}
											setApproveModalStatus={setApproveModalStatus}
											buyModalStatus={buyModalStatus}
											setBuyModalStatus={setBuyModalStatus}
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
