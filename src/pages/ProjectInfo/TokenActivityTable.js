import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import SellIcon from "../../assets/sell.svg";
import TokenLink from "../../assets/token-link.svg";

import { hideSideNav } from "../../redux/actions/sideNav";
import useWindowSize from "../../utils/windowSize";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import {
  BSC_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  MATIC_CHAIN_ID,
  EXPLORER_BSC,
  EXPLORER_MATIC,
  EXPLORER_ETHEREUM
} from "../../constants/config";
import { useWeb3React } from '@web3-react/core';

const { Column, ColumnGroup } = Table;

function TokenActivityTable({ completeOrders }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);
  const { active, account, chainId } = useWeb3React();
  // useEffect(() => {
  //   console.log(filter);
  //   if (filter === "" || filter === undefined) {
  //     setTokenList(dummyDataExchange);
  //   } else {
  //     const filteredList = dummyDataExchange.filter((token) => {
  //       return token.asset.toLowerCase().includes(filter?.toLowerCase());
  //     });
  //     setTokenList(filteredList);
  //   }
  // }, [filter]);

  const EXPLORER_URL =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? EXPLORER_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? EXPLORER_MATIC
      : EXPLORER_ETHEREUM;
  


  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }
  return (
    // <div className="tokenListTableContainer">
    <Table
      dataSource={completeOrders}
      pagination={false}
      scroll={{ y: 440 }}
      onChange={onChange}
    >
      <Column
        title="Asset"
        sorter={(a, b) => a.asset - b.asset}
        showSorterTooltip={false}
        width={"28%"}
        dataIndex="asset"
        key="asset"
        render={(value, row) => {
          return (
            <div className="flex flex-row items-center mx-auto">
              {value}
              <a target="_blank" rel="noreferrer" href={`${EXPLORER_URL}${row.assetID}`} className="ml-2">
                <img src={TokenLink} alt="deposit" />
              </a>
            </div>
          );
        }}
      />
      <Column
        title="Price"
        dataIndex="price"
        key="price"
        render={(value, row) => {
          return (
            <div>
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
        dataIndex="completedQuantity"
        key="completedQuantity"
        render={(value, row) => {
          return <div>{convertToInternationalCurrencySystem(value)}</div>;
        }}
      />
      <Column
        title="Fulfilled Date"
        dataIndex="fulfillOrderTimestamp"
        key="fulfillOrderTimestamp"
      />
    </Table>
  );
}

export default TokenActivityTable;
