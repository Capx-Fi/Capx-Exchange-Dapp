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
import { useSelector } from "react-redux";

const { Column, ColumnGroup } = Table;

function TokenBuyTable({ filter, setBalance, refresh }) {
  const [tokenList, setTokenList] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const ticker = useSelector((state) => state.exchange.buyTicker);

  const { active, account, chainId } = useWeb3React();
  let history = useHistory();
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
  useEffect(() => {
    let nullBuyTicker = ticker;
    if (nullBuyTicker) {
      Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ""));
      dispatch(setBuyTicker({ ...nullBuyTicker }));
    }
    fetchListings();
    // console.log("refresh", refresh);
  }, [account, chainId, refresh]);
  const fetchListings = async () => {
    setLoading(true);
    const listingData = await fetchListedTokens(
      account,
      chainId,
      exchangeURL,
      CHAIN_USDT_CONTRACT_ADDRESS
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
  return (
    <div className="tokenListTableContainer">
      <Table
        dataSource={tokenList}
        pagination={false}
        locale={{ emptyText: loading ? "Loading Tokens..." : "No Token Found" }}
        scroll={{ y: 480 }}
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
          sorter={(a, b) => a.asset - b.asset}
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
                <p className="text-white hover:text-primary-green-400 cursor-pointer">
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
          dataIndex="quantity"
          key="quantity"
          render={(value, row) => {
            return <div>{convertToInternationalCurrencySystem(value)}</div>;
          }}
        />
        <Column title="Expiry Time" dataIndex="expiryTime" key="expiryTime" />
        <Column
          title=""
          dataIndex="asset"
          key="asset"
          render={(value, row) => {
            return (
              <div className="border cursor-pointer border-grayLabel py-2 rounded-lg flex flex-row justify-center w-fit-content px-3 mx-auto">
                <img src={DepositIcon} alt="deposit" className="mr-2" />
                <p className="text-success-color-400 uppercase font-bold text-caption-2">
                  BUY
                </p>
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
}

export default TokenBuyTable;
