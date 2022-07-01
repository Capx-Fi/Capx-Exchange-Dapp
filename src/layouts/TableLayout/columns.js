import GainIcon from "../../assets/gain.svg";
import LossIcon from "../../assets/loss.svg";

import WithdrawIcon from "../../assets/WithdrawIcon.svg";
import DepositIcon from "../../assets/DepositIcon.svg";

import SellIcon from "../../assets/sell.svg";

import WithdrawArrow from "../../assets/WithdrawArrow.svg";
import DepositArrow from "../../assets/DepositArrow.svg";

import dummyToken from "../../assets/dummyToken.svg";
import { Link } from "react-router-dom";

export const HOME_COLUMNS = [
	{
		Header: "MARKET",
		accessor: "market",
		Cell: ({ value }) => {
			return (
				<div className="text-dark-150 text-left font-light text-paragraph-2 flex flex-row justify-start desktop:ml-6 desktop:pl-0 desktop:text-caption-1 tracking-normal">
					<img src={dummyToken} className="mr-3" alt="loss" /> <p>{value}</p>
				</div>
			);
		},
	},
	{
		Header: "INDEX PRICE",
		accessor: "indexPrice",
		Cell: ({ value }) => {
			return (
				<p className="text-paragraph-2 flex flex-row justify-start desktop:ml-6 desktop:pl-0 text-dark-150 font-light desktop:text-caption-1">
					{"$" + value}
				</p>
			);
		},
	},
	{
		Header: "24H CHANGE",
		accessor: "24hChange",
		Cell: ({ value, row }) => {
			return value > 0 ? (
				<div className="text-success-color-400 text-center flex flex-row justify-start desktop:ml-6 desktop:pl-0">
					<img src={GainIcon} className="mr-2" alt="gain" />{" "}
					<p className="text-paragraph-2 desktop:text-caption-1">
						{value + "% "}
						{"(" + ((row.original.indexPrice * value) / 100).toFixed(2) + ")"}
					</p>
				</div>
			) : (
				<div className="text-error-color-300 text-center flex flex-row justify-start desktop:ml-6 desktop:pl-0">
					<img src={LossIcon} className="mr-2" alt="loss" />{" "}
					<p className="text-paragraph-2 desktop:text-caption-1">
						{-value + "% "}
						{"(" + ((row.original.indexPrice * -value) / 100).toFixed(2) + ")"}
					</p>
				</div>
			);
		},
	},
	{
		Header: "24H VOLUME",
		accessor: "24hVolume",
		Cell: ({ value }) => {
			return (
				<p className="text-paragraph-2 flex flex-row justify-start desktop:ml-6 desktop:pl-0 text-dark-150 desktop:text-caption-1">
					{value}
				</p>
			);
		},
	},
	{
		Header: "24H TRADES",
		accessor: "24hTrades",
		Cell: ({ value }) => {
			return (
				<p className="text-paragraph-2 flex flex-row justify-start desktop:ml-6 desktop:pl-0 text-dark-150 desktop:text-caption-1">
					{value}
				</p>
			);
		},
	},
];

export const HOLDINGS_COLUMNS = [
	{
		Header: "ASSET",
		accessor: "asset",
		Cell: ({ value }) => {
			return (
				<div className="text-left font-normal text-paragraph-2 flex flex-row justify-start ">
					<img src={dummyToken} className="mr-3" alt="loss" />{" "}
					<p className="text-caption-1 font-medium">{value}</p>
				</div>
			);
		},
	},
	{
		Header: "BALANCE",
		accessor: "balance",
		Cell: ({ value }) => {
			return (
				<p className="text-caption-1 font-normal flex flex-row justify-start pl-8">
					{"$ " + value}
				</p>
			);
		},
	},
	{
		Header: "DEPOSIT",
		accessor: "deposit_id",
		Cell: ({ value, row }) => {
			return (
				<div className="border cursor-pointer border-success-color-400 px-3 py-2 rounded-lg flex flex-row justify-start w-8/12 mx-auto">
					<img src={DepositIcon} alt="deposit" className="mr-2" />
					<Link to="/deposit">
						<p className="text-success-color-400 uppercase font-bold text-caption-3">
							Deposit More
						</p>
					</Link>
				</div>
			);
		},
	},
	{
		Header: "WITHDRAW",
		accessor: "withdraw_id",
		Cell: ({ value, row }) => {
			return (
				<div
					className={`flex flex-row justify-start border-l-2 cursor-pointer border-dark-50 desktop:pl-8`}
				>
					<img src={WithdrawIcon} alt="deposit" className="mr-2" />
					<Link to="/withdraw">
						<p className="text-warning-color-400 uppercase font-bold text-caption-3">
							Withdraw
						</p>
					</Link>
				</div>
			);
		},
	},
];

export const TRANSACTION_COLUMNS = [
	{
		Header: "ASSET",
		accessor: "asset",
		Cell: ({ value }) => {
			return (
				<div className="text-left font-light text-paragraph-2 flex flex-row justify-start desktop:pl-6 desktop:text-caption-2">
					<img src={dummyToken} className="mr-3" alt="loss" />{" "}
					<p className="text-paragraph-2 font-medium desktop:text-caption-1">
						{value}
					</p>
				</div>
			);
		},
	},
	{
		Header: "TIMESTAMP",
		accessor: "timestamp",
		Cell: ({ value }) => {
			return (
				<p className="text-paragraph-2 font-normal desktop:text-caption-1 flex flex-row justify-start desktop:pl-20">
					{value}
				</p>
			);
		},
	},
	{
		Header: "AMOUNT",
		accessor: "amount",
		Cell: ({ value }) => {
			return (
				<p className="text-paragraph-2 font-normal desktop:text-caption-1 flex flex-row justify-start desktop:pl-4">
					{value}
				</p>
			);
		},
	},
	{
		Header: "ACTIONS",
		accessor: "type",
		Cell: ({ value }) => {
			return (
				<div
					className={`px-3 rounded-xl py-1 w-fit-content mx-auto desktop:text-caption-1 flex flex-row justify-start desktop:-pl-14 ${
						value === "Deposited"
							? "bg-primary-green-300 bg-opacity-20 desktop:px-6 desktop:py-2"
							: "bg-error-color-300 bg-opacity-20 desktop:px-6 desktop:py-2"
					}`}
				>
					<p className="text-caption-2 font-normal desktop:text-caption-1 flex flex-row justify-start">
						{value}
					</p>
				</div>
			);
		},
	},
	{
		Header: "",
		accessor: "_id",
		disableSortBy: true,
		Cell: ({ row }) => {
			return (
				<div className="cursor-pointer">
					<img
						src={
							row.original.type === "Deposited" ? DepositArrow : WithdrawArrow
						}
						alt="transaction"
					/>
				</div>
			);
		},
	},
];

export const EXCHANGE_COLUMNS_BUY = [
	{
		Header: "TOKENS",
		accessor: "asset",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "PRICE",
		accessor: "price",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "QUANTITY",
		accessor: "quantity",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "UNLOCK DATE",
		accessor: "unlockDate",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "",
		accessor: "_id",
		disableSortBy: true,
		Cell: ({ value, row }) => {
			return (
				<div className="border cursor-pointer border-grayLabel py-2 rounded-lg flex flex-row justify-center w-fit-content px-3 mx-auto">
					<img src={DepositIcon} alt="deposit" className="mr-2" />
					<Link to={`/exchange/buy/${value}`}>
						<p className="text-success-color-400 uppercase font-bold text-caption-2">
							BUY
						</p>
					</Link>
				</div>
			);
		},
	},
];

export const EXCHANGE_COLUMNS_SELL = [
	{
		Header: "TOKENS",
		accessor: "asset",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "PRICE",
		accessor: "price",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "QUANTITY",
		accessor: "quantity",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "UNLOCK DATE",
		accessor: "unlockDate",
		Cell: ({ value }) => {
			return <p className="text-paragraph-2 font-normal">{value}</p>;
		},
	},
	{
		Header: "",
		accessor: "_id",
		disableSortBy: true,
		Cell: ({ value, row }) => {
			return (
				<div className="border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto">
					<img src={SellIcon} alt="deposit" className="mr-2" />
					<Link to={`/exchange/buy/${value}`}>
						<p className="text-error-color-400 uppercase font-bold text-caption-2">
							SELL
						</p>
					</Link>
				</div>
			);
		},
	},
];
