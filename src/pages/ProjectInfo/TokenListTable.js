import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import DepositIcon from "../../assets/DepositIcon.svg";

import { hideSideNav } from "../../redux/actions/sideNav";
import useWindowSize from "../../utils/windowSize";

const { Column, ColumnGroup } = Table;

function TokenListTable({ filter }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);

  useEffect(() => {
    console.log(filter);
    if (filter === "" || filter === undefined) {
      setTokenList(dummyDataExchange);
    } else {
      const filteredList = dummyDataExchange.filter((token) => {
        return token.asset.toLowerCase().includes(filter?.toLowerCase());
      });
      setTokenList(filteredList);
    }
  }, [filter]);

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }
  return (
    // <div className="tokenListTableContainer">
      <Table
        dataSource={tokenList}
        pagination={false}
        scroll={{ y: 440 }}
        onChange={onChange}
      >
        <Column
          title="Asset"
          sorter={(a, b) => a.asset - b.asset}
          showSorterTooltip={false}
          width={"22%"}
          dataIndex="asset"
          key="asset"
        />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Quantity" dataIndex="quantity" key="quantity" />
        <Column title="Unlock Date" dataIndex="unlockDate" key="unlockDate" />
        <Column
          title=""
          dataIndex="asset"
          key="asset"
          render={(value, row) => {
            return (
              <Link to={`/info/${value}`}>
                <div className="border cursor-pointer border-grayLabel py-2 rounded-lg flex flex-row justify-center w-fit-content px-3 mx-auto">
                  <img src={DepositIcon} alt="deposit" className="mr-2" />
                  <p className="text-success-color-400 uppercase font-bold text-caption-2">
                    BUY
                  </p>
                </div>
              </Link>
            );
          }}
        />
      </Table>
  );
}

export default TokenListTable;
