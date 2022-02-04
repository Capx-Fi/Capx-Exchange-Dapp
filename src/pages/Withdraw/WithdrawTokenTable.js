import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import WithdrawIcon from "../../assets/DepositIcon.svg";

import $ from "jquery";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchContractBalances } from "../../utils/fetchContractBalances";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { fetchProjectID } from "../../utils/fetchProjectDetails";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
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
import {
  setAssetBalance,
  setWithdrawTicker,
} from "../../redux/actions/withdraw";
import BigNumber from "bignumber.js";
import Web3 from "web3";
BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 36],
});

const { Column } = Table;

function WithdrawTokenTable({ filter, refetch }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);
  const { active, account, chainId } = useWeb3React();
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
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  const web3 = new Web3(Web3.givenProvider);

  const exchangeContract = new web3.eth.Contract(
    EXCHANGE_ABI,
    CHAIN_EXCHANGE_CONTRACT_ADDRESS
  );
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
    const holdings = await fetchContractBalances(
      account.toString(),
      exchangeURL,
      wrappedURL
    );
    let balance = await exchangeContract.methods
      .unlockBalance(CHAIN_USDT_CONTRACT_ADDRESS, account)
      .call();
    balance = new BigNumber(balance).dividedBy(Math.pow(10, 18)).toString();
    // make a USDT object and add it to the holdings
    const usdt = {
      asset: "USDT",
      balance: balance,
      quantity: balance,
      price: null,
      tokenDecimal: 18,
      isContract: true,
      assetID: CHAIN_USDT_CONTRACT_ADDRESS,
    };
    holdings.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    setPortfolioHoldings([usdt, ...holdings]);
    setTokenList([usdt, ...holdings]);
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
    console.log("params", pagination, filters, sorter, extra);
  }

  const dispatch = useDispatch();
  const navigateProject = async (address) => {
    const projectAddress = await fetchProjectID(address, wrappedURL, masterURL);
    history.push(`/info/${projectAddress}`);
  };
  return (
    <div className="tokenListTableContainer">
      <Table
        dataSource={tokenList}
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
                <p className="text-white hover:text-primary-green-400 cursor-pointer">
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
