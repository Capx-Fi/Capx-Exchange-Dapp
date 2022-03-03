import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import SellIcon from "../../assets/sell.svg";

import { hideSideNav } from "../../redux/actions/sideNav";
import $ from "jquery";
import useWindowSize from "../../utils/windowSize";
import { fetchPortfolio } from "../../utils/fetchPortfolio";
import { useWeb3React } from "@web3-react/core";
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
import { useDispatch } from "react-redux";
import { setSellTicker, setTickerBalance } from "../../redux/actions/exchange";
import { fetchContractBalances } from "../../utils/fetchContractBalances";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { fetchProjectID } from "../../utils/fetchProjectDetails";
import BigNumber from "bignumber.js";
import moment from "moment";
import { useSelector } from "react-redux";
const format = "HH:mm";
BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 36],
});

const { Column, ColumnGroup } = Table;

function TokenSellTable({ filter, refresh }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);
  const { active, account, chainId } = useWeb3React();
  const ticker = useSelector((state) => state.exchange.sellTicker);
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

  useEffect(() => {
    let nullSellTicker = ticker;

    if (nullSellTicker) {
      Object.keys(nullSellTicker).forEach((i) => (nullSellTicker[i] = ""));
      dispatch(
        setSellTicker({
          ...nullSellTicker,
          expiryDate: new Date(),
          expiryTime: moment().utc().add(15,"minutes"),
        })
      );
    }
    fetchPortfolioHoldings();
  }, [account, chainId, refresh]);
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
      chainId
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
              console.log("sell", record);
              dispatch(setSellTicker(record));
              dispatch(setTickerBalance(record.maxQuantity));
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
                <img src={SellIcon} alt="deposit" className="mr-2" />

                <p className="text-error-color-400 uppercase font-bold text-caption-2">
                  SELL
                </p>
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
}

export default TokenSellTable;
