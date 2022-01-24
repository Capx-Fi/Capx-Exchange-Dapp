import GainIcon from "../../assets/gain.svg";
import LossIcon from "../../assets/loss.svg";

import WithdrawIcon from "../../assets/WithdrawIcon.svg";
import DepositIcon from "../../assets/DepositIcon.svg";

import SellIcon from "../../assets/sell.svg";

import WithdrawArrow from "../../assets/WithdrawArrow.svg";
import DepositArrow from "../../assets/DepositArrow.svg";

import dummyToken from "../../assets/dummyToken.svg";
import ToTransaction from "../../assets/ToTransaction.svg";
import { Link } from "react-router-dom";

export const HOME_COLUMNS = [
  {
    Header: "Market",
    accessor: "market",
    sticky: "left",
    Cell: ({ value }) => {
      return (
        <div className="text-left font-normal text-paragraph-2 flex flex-row justify-start ">
          <img src={dummyToken} className="mr-3" alt="loss" /> <p>{value}</p>
        </div>
      );
    },
  },
  {
    Header: "Index Price",
    accessor: "indexPrice",
    sticky: "left",
    Cell: ({ value }) => {
      return <p className="text-paragraph-2">{"$" + value}</p>;
    },
  },
  {
    Header: "24h Change",
    accessor: "24hChange",
    sticky: "left",
    Cell: ({ value, row }) => {
      return value > 0 ? (
        <div className="text-success-color-400 text-left flex flex-row justify-start ">
          <img src={GainIcon} className="mr-2" alt="gain" />{" "}
          <p className="text-paragraph-2">
            {value + "% "}
            {"(" + ((row.original.indexPrice * value) / 100).toFixed(2) + ")"}
          </p>
        </div>
      ) : (
        <div className="text-error-color-300 text-left flex flex-row justify-start ">
          <img src={LossIcon} className="mr-2" alt="loss" />{" "}
          <p className="text-paragraph-2">
            {-value + "% "}
            {"(" + ((row.original.indexPrice * -value) / 100).toFixed(2) + ")"}
          </p>
        </div>
      );
    },
  },
  {
    Header: "24h Volume",
    accessor: "24hVolume",
    sticky: "left",
    Cell: ({ value }) => {
      return <p className="text-paragraph-2">{value}</p>;
    },
  },
  {
    Header: "24h Trades",
    accessor: "24hTrades",
    sticky: "left",
    Cell: ({ value }) => {
      return <p className="text-paragraph-2">{value}</p>;
    },
  },
];

export const HOLDINGS_COLUMNS = [
  {
    Header: "Asset",
    accessor: "asset",
    Cell: ({ value }) => {
      return (
        <div className="text-left font-normal text-paragraph-2 flex flex-row justify-start ">
          <img src={dummyToken} className="mr-3" alt="loss" />{" "}
          <p className="text-paragraph-2 font-medium">{value}</p>
        </div>
      );
    },
  },
  {
    Header: "Balance",
    accessor: "actualBalance",
    Cell: ({ value }) => {
      return (
        <p className="text-paragraph-2 font-normal">
          {" "}
          {new Intl.NumberFormat("en-IN", {
            maximumSignificantDigits: 6,
          }).format(Number(value))}
        </p>
      );
    },
  },
  {
    Header: "Deposit",
    accessor: "assetID",
    Cell: ({ value, row }) => {
      return (
        <div className="border cursor-pointer border-success-color-400 px-3 py-2 rounded-lg flex flex-row justify-start w-7/12 mx-auto">
          <img src={DepositIcon} alt="deposit" className="mr-2" />
          <Link to="/deposit">
            <p className="text-success-color-400 uppercase font-bold text-caption-2">
              Deposit More
            </p>
          </Link>
        </div>
      );
    },
  },
  {
    Header: "Withdraw",
    accessor: "lockedBalance",
    Cell: ({ value, row }) => {
      return (
        <div className="flex flex-row justify-start border-l-2 cursor-pointer border-dark-50 ">
          <img src={WithdrawIcon} alt="deposit" className="mr-2" />
          <p className="text-warning-color-400 uppercase font-bold text-caption-2">
            Withdraw
          </p>
        </div>
      );
    },
  },
];

export const TRANSACTION_COLUMNS = [
  {
    Header: "Asset",
    accessor: "asset",
    Cell: ({ value }) => {
      return (
        <div className="text-left font-normal text-paragraph-2 flex flex-row justify-start ">
          <img src={dummyToken} className="mr-3" alt="loss" />{" "}
          <p className="text-paragraph-2 font-medium">{value}</p>
        </div>
      );
    },
  },
  {
    Header: "Timestamp",
    accessor: "timestamp",
    Cell: ({ value }) => {
      return <p className="text-paragraph-2 font-normal">{value}</p>;
    },
  },
  {
    Header: "Amount",
    accessor: "amount",
    Cell: ({ value }) => {
      return <p className="text-paragraph-2 font-normal">{value}</p>;
    },
  },
  {
    Header: "Actions",
    accessor: "type",
    Cell: ({ value }) => {
      return (
        <div
          className={`px-3 rounded-xl py-1 w-fit-content mx-auto ${
            value === "Deposited"
              ? "bg-primary-green-300 bg-opacity-20"
              : "bg-error-color-300 bg-opacity-20"
          }`}
        >
          <p className="text-caption-2 font-normal">{value}</p>
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
