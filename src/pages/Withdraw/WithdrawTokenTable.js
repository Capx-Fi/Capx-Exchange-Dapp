import { Table } from "antd";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./TokenListTable.scss";
import MobileWithdraw from "./MobileWithdraw";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import WithdrawIcon from "../../assets/DepositIcon.svg";

import $ from "jquery";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchContractBalances } from "../../utils/fetchContractBalances";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { fetchProjectID } from "../../utils/fetchProjectDetails";
import { EXCHANGE_ABI } from "../../contracts/ExchangeContract";
import { CONTRACT_ABI_ERC20 } from "../../contracts/SampleERC20";
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
  USDT_CONTRACT_ADDRESS,
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
  const ticker = useSelector((state) => state.withdraw.withdrawTicker);
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
    let nullBuyTicker = ticker;
    if (nullBuyTicker) {
      Object.keys(nullBuyTicker).forEach((i) => (nullBuyTicker[i] = ""));
      dispatch(setWithdrawTicker({ ...nullBuyTicker }));
    }
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
      wrappedURL,
      chainId
    );
    let balance = await exchangeContract.methods
      .unlockBalance(CHAIN_USDT_CONTRACT_ADDRESS, account)
      .call();

    const stableCoinContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      CHAIN_USDT_CONTRACT_ADDRESS
    );

    let stableCoinDecimal = await stableCoinContract.methods.decimals().call();
    let stableCoinSymbol = await stableCoinContract.methods.symbol().call();

    // HARDCODING FOR USDT MATIC AT THE MOMENT... Need a cleaner fix

    balance = new BigNumber(balance)
      .dividedBy(Math.pow(10, stableCoinDecimal))
      .toString();
    // make a USDT object and add it to the holdings
    const usdt = {
      asset: stableCoinSymbol,
      balance: balance,
      quantity: balance,
      price: null,
      tokenDecimal: stableCoinDecimal,
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
    // console.log("params", pagination, filters, sorter, extra);
  }

  const dispatch = useDispatch();
  const navigateProject = async (address) => {
    const projectAddress = await fetchProjectID(address, wrappedURL, masterURL);
    history.push(`/info/${projectAddress}`);
  };
  return (
    <>
      <div className="tokenListTableContainer phone:hidden tablet:block">
        <Table
          dataSource={tokenList}
          locale={{
            emptyText: loading ? "Loading Tokens..." : "No Token Found",
          }}
          pagination={false}
          scroll={{ y: 500 }}
          onChange={onChange}
          onRow={(record) => {
            return {
              onClick: (e) => {
                record.quantity !== "0" &&
                dispatch(setWithdrawTicker(record)) &&
                dispatch(setAssetBalance(record.quantity))
              }
              }
            }
          }
        >
          <Column
            title="Asset"
            sorter={(a, b) => a.asset.localeCompare(b.asset)}
            showSorterTooltip={false}
            width={"30%"}
            dataIndex="asset"
            key="asset"
            render={(value, row) => {
              // // console.log("row", row, CHAIN_USDT_CONTRACT_ADDRESS);
              return (
                <>
                  {row.assetID === CHAIN_USDT_CONTRACT_ADDRESS.toString() ? (
                    <div>
                      <p className="text-white cursor-pointer upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2">
                        {value}
                      </p>
                    </div>
                  ) : (
                    <div onClick={() => navigateProject(row.assetID)}>
                      <p className="text-white hover:text-primary-green-400 cursor-pointer upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2">
                        {value}
                      </p>
                    </div>
                  )}
                </>
              );
            }}
          />
          <Column
            title="Quantity"
            dataIndex="quantity"
            key="quantity"
            render={(value, row) => {
              return (
                <div className="upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2">
                  {convertToInternationalCurrencySystem(value)}
                </div>
              );
            }}
          />
          <Column 
          title="Unlock Date" 
          dataIndex="unlockDate" 
          key="unlockDate"
          render={(value, row) => {
            console.log(row);
            return (
              <>
                <div className="upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2">{row.unlockDate}</div>
              </>
            )
          }} />
          <Column
            title=""
            dataIndex="asset"
            key="asset"
            render={(value, row) => {
              // console.log(row)
              return (
                <div className={`border ${row.quantity === "0" ? "cursor-not-allowed" : "cursor-pointer"} border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto upper:text-paragraph-2 desktop:text-caption-1 tablet:text-caption-2`}>
                  <img src={WithdrawIcon} alt="deposit" className="mr-2" />

                  <p className={` ${row.quantity === "0" ? "text-success-color-500" : "text-success-color-400"}  uppercase font-bold text-caption-2 upper:text-caption-1`}>
                    WITHDRAW
                  </p>
                </div>
              );
            }}
          />
        </Table>
      </div>

      <div className="tablet:hidden">
        <MobileWithdraw
          tokenList={tokenList}
          loading={loading}
          setWithdrawTicker={setWithdrawTicker}
          setAssetBalance={setAssetBalance}
          isUSDT={CHAIN_USDT_CONTRACT_ADDRESS.toString()}
        />
      </div>
    </>
  );
}

export default WithdrawTokenTable;
