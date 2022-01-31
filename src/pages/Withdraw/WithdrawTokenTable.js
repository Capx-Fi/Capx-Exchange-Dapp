import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import WithdrawIcon from "../../assets/DepositIcon.svg";

import { hideSideNav } from "../../redux/actions/sideNav";
import $ from "jquery";
import useWindowSize from "../../utils/windowSize";
import { fetchPortfolio } from "../../utils/fetchPortfolio";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { setSellTicker, setTickerBalance } from "../../redux/actions/exchange";
import { fetchContractBalances } from "../../utils/fetchContractBalances";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { fetchProjectID } from "../../utils/fetchProjectDetails";
import { fetchWithdrawableTokens } from "../../utils/fetchWithdrawableTokens";
import {
  setAssetBalance,
  setWithdrawTicker,
} from "../../redux/actions/withdraw";


const { Column, ColumnGroup } = Table;

function WithdrawTokenTable({ filter, refetch }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);
  const { active, account, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  useEffect(() => {
    fetchPortfolioHoldings();
  }, [account, chainId, refetch]);
  $(".ant-table-row").on("click", function () {
    var selected = $(this).hasClass("highlight");
    $(".ant-table-row").removeClass("highlight");
    if (!selected) $(this).addClass("highlight");
  });
  const fetchPortfolioHoldings = async () => {
    setLoading(true);
    const holdings = await fetchContractBalances(account.toString());
    holdings.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    setPortfolioHoldings(holdings);
    console.log(holdings);
    setLoading(false);
  };

  useEffect(() => {
    console.log(filter);
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
    console.log("params", pagination, filters, sorter, extra);
  }

  const dispatch = useDispatch();
  const navigateProject = async (address) => {
    const projectAddress = await fetchProjectID(address);
    history.push(`/info/${projectAddress}`);
  };
  return (
    <div className="tokenListTableContainer">
      <Table
        dataSource={portfolioHoldings}
        locale={{ emptyText: loading ? "Loading Tokens..." : "No Token Found" }}
        pagination={false}
        scroll={{ y: 500 }}
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: (e) => {
              dispatch(setWithdrawTicker(record));
              dispatch(setAssetBalance(record.quantity));
            },
          };
        }}
      >
        <Column
          title="Asset"
          sorter={(a, b) => a.asset - b.asset}
          showSorterTooltip={false}
          width={"30%"}
          dataIndex="asset"
          key="asset"
          render={(value, row) => {
            return (
              <div onClick={() => navigateProject(row.assetID)}>
                <p className="text-white hover:text-primary-green-400">
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
            return <div>{convertToInternationalCurrencySystem(value)}</div>;
          }}
        />
        <Column title="Unlock Date" dataIndex="unlockDate" key="unlockDate" />
        <Column
          title=""
          dataIndex="asset"
          key="asset"
          render={(value, row) => {
            return (
              <div className="border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto">
                <img src={WithdrawIcon} alt="deposit" className="mr-2" />

                <p className="text-success-color-400 uppercase font-bold text-caption-2">
                  WITHDRAW
                </p>
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
}

export default WithdrawTokenTable;
