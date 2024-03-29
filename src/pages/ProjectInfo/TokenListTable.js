import { Table } from "antd";
import { useState, useEffect } from "react";
import "./TokenListTable.scss";

import dummyDataExchange from "../../layouts/TableLayout/dummyDataExchange.json";
import DepositIcon from "../../assets/DepositIcon.svg";
import { useDispatch } from "react-redux";
import { setProjectBuyTicker } from "../../redux/actions/exchange";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import MobileTableBuy from "../../components/MobileTable/MobileTableBuy";
import useWindowSize from "../../utils/windowSize";

const { Column, ColumnGroup } = Table;

function TokenListTable({ activeOrders, loading, projectDetails }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);

  function onChange(pagination, filters, sorter, extra) {
    // console.log("params", pagination, filters, sorter, extra);
  }
  const dispatch = useDispatch();
  const windowWidth = useWindowSize().width;
  return (
    <>
      {windowWidth > 767 ? (
        <Table
          dataSource={activeOrders}
          pagination={false}
          locale={{ emptyText: "No Token Found" }}
          scroll={{ y: 480 }}
          onChange={onChange}
          onRow={(record) => {
            return {
              onClick: (e) => {
                dispatch(setProjectBuyTicker(record));
              },
            };
          }}
        >
          <Column
            title="Asset"
            sorter={(a, b) => a.asset.localeCompare(b.asset)}
            showSorterTooltip={false}
            width={"22%"}
            dataIndex="asset"
            key="asset"
            render={(value, row) => {
              return <p className="text-white">{value}</p>;
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
      ) : (
        <>
          {activeOrders && (
            <MobileTableBuy
              projectDetails={projectDetails}
              tokenList={activeOrders}
              onChange={onChange}
              isInfo={true}
              loading={loading}
              setBuyTicker={setProjectBuyTicker}
              navigateProject={() => {
                console.log("");
              }}
              setBalance={() => {
                console.log("");
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export default TokenListTable;
