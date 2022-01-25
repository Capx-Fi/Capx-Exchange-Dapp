import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import SellIcon from "../../assets/sell.svg";
import TokenLink from "../../assets/token-link.svg";

import { hideSideNav } from "../../redux/actions/sideNav";
import useWindowSize from "../../utils/windowSize";

const { Column, ColumnGroup } = Table;

function TokenActivityTable({ completeOrders }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);

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
              <a href="https://shreyas.io" className="ml-2">
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
