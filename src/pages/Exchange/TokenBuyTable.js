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

const { Column, ColumnGroup } = Table;

function TokenBuyTable({ filter, setBalance, refresh }) {
  const [tokenList, setTokenList] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const { active, account, chainId } = useWeb3React();
  let history = useHistory();

  useEffect(() => {
    fetchListings();
  }, [account, chainId, refresh]);
  const fetchListings = async () => {
    setLoading(true);
    const listingData = await fetchListedTokens(account);
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
    console.log(filter);
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
        dataSource={tokenList}
        pagination={false}
        locale={{ emptyText: loading ? "Loading Tokens..." : "No Token Found" }}
        scroll={{ y: 480 }}
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: (e) => {
              console.log("onTableBuy", record);
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
          width={"22%"}
          dataIndex="asset"
          key="asset"
          render={(value, row) => {
            return (
              <div className="cursor-pointer" onClick={()=>navigateProject(row.assetID)}>
                <p className="text-white hover:text-primary-green-400">
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
