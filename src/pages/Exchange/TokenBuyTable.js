import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import DepositIcon from "../../assets/DepositIcon.svg";
import $ from "jquery";
import { hideSideNav } from "../../redux/actions/sideNav";
import useWindowSize from "../../utils/windowSize";
import { useWeb3React } from "@web3-react/core";
import { fetchListedTokens } from "../../utils/fetchListedTokens";
import { useDispatch } from "react-redux";
import { setBuyTicker } from "../../redux/actions/exchange";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { fetchProjectID } from "../../utils/fetchProjectDetails";
import { useHistory } from "react-router-dom";

import { useSelector } from "react-redux";
import MobileTableBuy from "../../components/MobileTable/MobileTableBuy";
import {
	getExchangeURL,
	getUsdtContractAddress,
	getWrappedURL,
} from "../../constants/getChainConfig";
import Web3 from "web3";

const { Column, ColumnGroup } = Table;

function TokenBuyTable({ filter, setBalance, refresh }) {
	const [tokenList, setTokenList] = useState([]);
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(false);
	const ticker = useSelector((state) => state.exchange.buyTicker);
	const { active, account, chainId, connector } = useWeb3React();
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

	let history = useHistory();

	const CHAIN_USDT_CONTRACT_ADDRESS =
		chainId && getUsdtContractAddress(chainId);
	const exchangeURL = chainId && getExchangeURL(chainId);
	const wrappedURL = chainId && getWrappedURL(chainId);

	useEffect(() => {
		let nullBuyTicker = ticker;
		if (nullBuyTicker) {
			Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ""));
			dispatch(setBuyTicker({ ...nullBuyTicker }));
		}
		web3?.currentProvider && fetchListings();
	}, [account, chainId, refresh, web3]);
	const fetchListings = async () => {
		setLoading(true);
		const listingData = await fetchListedTokens(
			account,
			chainId,
			exchangeURL,
			CHAIN_USDT_CONTRACT_ADDRESS,
			web3
		);
		setListings(listingData);
		setTokenList(listingData);
		setLoading(false);
	};
	$(".ant-table-row").on("click", function () {
		var selected = $(this).hasClass("highlight");
		$(".ant-table-row").removeClass("highlight");
		if (!selected) $(this).addClass("highlight");
	});

	useEffect(() => {
		if (filter === "" || filter === undefined) {
			setTokenList(listings);
		} else {
			const filteredList = listings.filter((token) => {
				return token.asset.toLowerCase().includes(filter?.toLowerCase());
			});
			setTokenList(filteredList);
		}
	}, [filter]);

	function onChange(pagination, filters, sorter, extra) {
		// console.log("params", pagination, filters, sorter, extra);
	}

	const dispatch = useDispatch();
	const navigateProject = async (address) => {
		const projectAddress = await fetchProjectID(address, wrappedURL);
		history.push(`/info/${projectAddress}`);
	};
	const windowWidth = useWindowSize().width;
	return (
		<div>
			{windowWidth > 767 ? (
				<div className="tokenListTableContainer">
					<div>
						<Table
							dataSource={loading ? [] : tokenList}
							pagination={false}
							locale={{
								emptyText: loading ? "Loading Tokens..." : "No Token Found",
							}}
							scroll={{ y: 430 }}
							onChange={onChange}
							onRow={(record) => {
								return {
									onClick: (e) => {
										dispatch(setBuyTicker(record));
										setBalance(record.balance);
									},
								};
							}}
						>
							<Column
								title="Asset"
								sorter={(a, b) => a.asset.localeCompare(b.asset)}
								showSorterTooltip={false}
								width={"25%"}
								dataIndex="asset"
								key="asset"
								render={(value, row) => {
									return (
										<div
											onClick={(e) => {
												e.stopPropagation();
												navigateProject(row.assetID);
											}}
										>
											<p className="text-white hover:text-primary-green-400 cursor-pointer upper:text-paragraph-2 tablet:text-caption-2">
												{value}
											</p>
										</div>
									);
								}}
							/>
							<Column
								title="Price (USDT)"
								dataIndex="price"
								key="price"
								render={(value, row) => {
									return (
										<div className="upper:text-paragraph-2 tablet:text-caption-2">
											{new Intl.NumberFormat("en-IN", {
												style: "currency",
												currency: "USD",
												maximumSignificantDigits: 6,
											}).format(Number(value))}
										</div>
									);
								}}
							/>
							<Column
								title="Quantity"
								dataIndex="quantity"
								key="quantity"
								render={(value, row) => {
									return (
										<div className="upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2">
											{convertToInternationalCurrencySystem(value)}
										</div>
									);
								}}
							/>
							<Column
								title="Expiry Time"
								dataIndex="expiryTime"
								key="expiryTime"
								render={(value, row) => {
									return (
										<div className="upper:text-paragraph-2 tablet:text-caption-2">
											{row.expiryTime}
										</div>
									);
								}}
							/>
							<Column
								title=""
								dataIndex="asset"
								key="asset"
								render={(value, row) => {
									return (
										<div className="border cursor-pointer border-grayLabel py-2 rounded-lg flex flex-row justify-center w-fit-content px-3 mx-auto">
											<img src={DepositIcon} alt="deposit" className="mr-2" />
											<p className="text-success-color-400 uppercase font-bold text-caption-2 upper:text-paragraph-2 tablet:text-caption-2">
												BUY
											</p>
										</div>
									);
								}}
							/>
						</Table>
					</div>
				</div>
			) : (
				<div>
					<MobileTableBuy
						tokenList={tokenList}
						loading={loading}
						onChange={onChange}
						setBuyTicker={setBuyTicker}
						navigateProject={navigateProject}
						setBalance={setBalance}
					/>
				</div>
			)}
		</div>
	);
}

export default TokenBuyTable;
