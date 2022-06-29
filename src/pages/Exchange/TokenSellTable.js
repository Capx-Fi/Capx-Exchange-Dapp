import { Table } from "antd";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./TokenListTable.scss";
import MobileTableSell from "../../components/MobileTable/MobileTableSell";

import SellIcon from "../../assets/sell.svg";

import $ from "jquery";
import useWindowSize from "../../utils/windowSize";
import { fetchPortfolio } from "../../utils/fetchPortfolio";

import { useDispatch } from "react-redux";
import { setSellTicker, setTickerBalance } from "../../redux/actions/exchange";
import { fetchContractBalances } from "../../utils/fetchContractBalances";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { fetchProjectID } from "../../utils/fetchProjectDetails";
import BigNumber from "bignumber.js";
import moment from "moment";
import { useSelector } from "react-redux";
import { getExchangeURL, getWrappedURL } from "../../constants/getChainConfig";
import Web3 from "web3";
import useWagmi from "../../useWagmi";

const { Column } = Table;

function TokenSellTable({ filter, refresh }) {
	const [tokenList, setTokenList] = useState([]);
	const [portfolioHoldings, setPortfolioHoldings] = useState([]);
	const { active, account, chainId, provider } = useWagmi();
	const ticker = useSelector((state) => state.exchange.sellTicker);

	const exchangeURL = chainId && getExchangeURL(chainId);
	const wrappedURL = chainId && getWrappedURL(chainId);

	const [loading, setLoading] = useState(false);
	const [web3, setWeb3] = useState(null);

	useEffect(() => {
		active &&
			provider.then((res) => {
				setWeb3(new Web3(res));
			});
	}, [active, chainId]);
	let history = useHistory();

	useEffect(() => {
		let nullSellTicker = ticker;

		if (nullSellTicker) {
			Object.keys(nullSellTicker).forEach((i) => (nullSellTicker[i] = ""));
			dispatch(
				setSellTicker({
					...nullSellTicker,
					expiryDate: new Date(),
					expiryTime: moment().utc().add(15, "minutes"),
					price: 0,
				})
			);
		}
		web3?.currentProvider && fetchPortfolioHoldings();
	}, [account, chainId, refresh, web3]);
	$(".ant-table-row").on("click", function () {
		var selected = $(this).hasClass("highlight");
		$(".ant-table-row").removeClass("highlight");
		if (!selected) $(this).addClass("highlight");
	});
	const fetchPortfolioHoldings = async () => {
		setLoading(true);
		const holdings = await fetchPortfolio(account, wrappedURL);
		const contractHoldings = await fetchContractBalances(
			account,
			exchangeURL,
			wrappedURL,
			chainId,
			web3
		);
		const combinedHoldings = [...holdings, ...contractHoldings];
		// check all the holdings and sum those who have same assetID
		const portfolioHoldings = combinedHoldings.reduce((acc, curr) => {
			const existing = acc.find((item) => item.assetID === curr.assetID);
			if (!existing) {
				return [...acc, curr];
			} else {
				existing.quantity = new BigNumber(curr.quantity)
					.plus(existing.quantity)
					.toString();
				existing.balance = new BigNumber(curr.balance)
					.plus(existing.balance)
					.toString();
				existing.maxQuantity = existing.quantity;
				return acc;
			}
		}, []);
		// convert quanityt to international currency system
		const convertedPortfolioHoldings = portfolioHoldings.map((item) => {
			const convertedItem = { ...item };
			convertedItem.quantity = item.quantity.toString();
			convertedItem.maxQuantity = convertedItem.quantity;
			convertedItem.balance = item.balance.toString();
			return convertedItem;
		});
		convertedPortfolioHoldings.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});
		setPortfolioHoldings(convertedPortfolioHoldings);
		setTokenList(convertedPortfolioHoldings);
		setLoading(false);
	};

	useEffect(() => {
		if (filter === "" || filter === undefined) {
			setTokenList(portfolioHoldings);
		} else {
			const filteredList = portfolioHoldings.filter((token) => {
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
					<Table
						dataSource={loading ? [] : tokenList}
						locale={{
							emptyText: loading ? "Loading Tokens..." : "No Token Found",
						}}
						pagination={false}
						scroll={{ y: 430 }}
						onChange={onChange}
						onRow={(record) => {
							return {
								onClick: (e) => {
									// console.log("sell", record);
									dispatch(setSellTicker(record));
									dispatch(setTickerBalance(record.maxQuantity));
								},
							};
						}}
					>
						<Column
							title="Asset"
							sorter={(a, b) => a.asset.localeCompare(b.asset)}
							showSorterTooltip={false}
							width={"30%"}
							dataIndex="asset"
							key="asset"
							render={(value, row) => {
								return (
									<div onClick={() => navigateProject(row.assetID)}>
										<p className="text-white hover:text-primary-green-400 cursor-pointer upper:text-paragraph-2 tablet:text-caption-2">
											{value}
										</p>
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
							title="Unlock Date"
							dataIndex="unlockDate"
							key="unlockDate"
							render={(value, row) => {
								return (
									<div className="upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2">
										{row.unlockDate}
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
									<div className="border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto upper:text-paragraph-2 tablet:text-caption-2">
										<img src={SellIcon} alt="deposit" className="mr-2" />

										<p className="text-error-color-400 uppercase font-bold text-caption-2 upper:text-paragraph-2 tablet:text-caption-2">
											SELL
										</p>
									</div>
								);
							}}
						/>
					</Table>
				</div>
			) : (
				<div>
					<MobileTableSell
						tokenList={tokenList}
						loading={loading}
						onChange={onChange}
						setSellTicker={setSellTicker}
						setBalance={setTickerBalance}
						navigateProject={navigateProject}
					/>
				</div>
			)}
		</div>
	);
}

export default TokenSellTable;
