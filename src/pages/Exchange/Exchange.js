import './Exchange.scss';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';
import ScrollableTableInstance from '../../layouts/TableLayout/ScrollableTableInstance';
import { ExchangeContractAddress } from '../../constants/config';
import { useWeb3React } from '@web3-react/core';

import SellScreen from './Sell';
import BuyScreen from './Buy';
import GlobalSearchBox from '../../layouts/TableLayout/GlobalSearchBox';
import TokenSellTable from './TokenSellTable';
import TokenBuyTable from './TokenBuyTable';
import MetamaskModal from '../../components/Modals/MetamaskModal/MetamaskModal';
const format = 'HH:mm';

function ExchangeScreen({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const { active, account, chainId } = useWeb3React();
  const [payAmount, setPayAmount] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState(null);
  const [assetPrice, setAssetPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [filter, setFilter] = useState("");
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [refresh , setRefresh] = useState(false);

  console.log(payAmount, receiveAmount);

  var mode = useSelector((state) => state.exchange.exchangeMode);

  const setAmount = (quantity, price) => {
    setReceiveAmount(quantity);
    setPayAmount(quantity * Number(price));
    setAssetPrice(price);
  };
  const setMaxAmount = () => {
    const maxPay = Math.min(balance, payAmount);
    console.log(maxPay);
    console.log(Number(assetPrice));
    setReceiveAmount(maxPay / Number(assetPrice));
    setPayAmount(maxPay);
  };

  return (
    <>
      {!active ? (
        <MetamaskModal />
      ) : (
        <div
          style={{
            filter: approveModalOpen || sellModalOpen || buyModalOpen ? "blur(10000px)" : "none",
          }}
          className="exchangeScreen"
        >
          <div className="exchangeScreen_maincontainer">
            <div className="exchangeScreen_leftcontainer">
              <div className="exchangeScreen_header">
                <div className="exchangeScreen_header_titlecontainer">
                  <p className="exchangeScreen_header_titlecontainer_title">
                    {mode === "sell"
                      ? "Your Portfolio"
                      : filter === "" || filter === undefined
                      ? "Trending Tokens"
                      : "Listed Tokens"}
                  </p>
                  <p className='exchangeScreen_header_titlecontainer_subtitle text-left'>
                    {mode === 'sell'
                      ? 'Sell your tokens on Capx'
                      : 'Buy available tokens listed on Capx'}
                  </p>
                </div>
                <GlobalSearchBox filter={filter} setFilter={setFilter} />
              </div>
              {mode === "sell" ? (
                <TokenSellTable filter={filter} refresh={refresh}/>
              ) : (
                <TokenBuyTable
                  filter={filter}
                  setBalance={setBalance}
                  refresh={refresh}
                />
              )}
            </div>
            {mode === "sell" ? (
              <SellScreen
                ticker={match.params.ticker}
                sellModalOpen={sellModalOpen}
                setSellModalOpen={setSellModalOpen}
                approveModalOpen={approveModalOpen}
                setApproveModalOpen={setApproveModalOpen}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ) : (
              <BuyScreen
                ticker={match.params.ticker}
                payAmount={payAmount}
                receiveAmount={receiveAmount}
                setAmount={setAmount}
                balance={balance}
                setMaxAmount={setMaxAmount}
                buyModalOpen={buyModalOpen}
                setBuyModalOpen={setBuyModalOpen}
                approveModalOpen={approveModalOpen}
                setApproveModalOpen={setApproveModalOpen}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ExchangeScreen;
