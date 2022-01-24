import './Exchange.scss';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';
import ScrollableTableInstance from '../../layouts/TableLayout/ScrollableTableInstance';
import { ExchangeContractAddress } from '../../constants/config';

import dummyDataExchange from '../../layouts/TableLayout/dummyDataExchange.json';

import {
  EXCHANGE_COLUMNS,
  EXCHANGE_COLUMNS_BUY,
  EXCHANGE_COLUMNS_SELL,
} from '../../layouts/TableLayout/columns';
import LockIcon from '../../assets/lock-asset.svg';
import SwapIcon from '../../assets/swap.svg';
import NextIcon from '../../assets/next-black.svg';
import DatePicker from 'react-date-picker';
import DropdownIcon from '../../assets/dropdown.svg';
import { TimePicker } from 'antd';
import './antd.css';
import moment from 'moment';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import SellScreen from './Sell';
import BuyScreen from './Buy';
import TokenListTable from './TokenBuyTable';
import GlobalSearchBox from '../../layouts/TableLayout/GlobalSearchBox';
import TokenSellTable from './TokenSellTable';
import TokenBuyTable from './TokenBuyTable';
const format = 'HH:mm';

function ExchangeScreen({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const [payAmount, setPayAmount] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState(null);
  const [assetPrice, setAssetPrice] = useState(null);
  const [balance, setBalanceState] = useState(2000);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [filter, setFilter] = useState('');

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
    <div className='exchangeScreen'>
      <div className='exchangeScreen_maincontainer'>
        <div className='exchangeScreen_leftcontainer'>
          <div className='exchangeScreen_header'>
            <div className='exchangeScreen_header_titlecontainer'>
              <p className='exchangeScreen_header_titlecontainer_title'>
                {mode === 'sell'
                  ? 'Your Portfolio'
                  : filter === '' || filter === undefined
                  ? 'Trending Tokens'
                  : 'Listed Tokens'}
              </p>
              <p className='exchangeScreen_header_titlecontainer_subtitle'>
                {mode === 'sell'
                  ? 'Sell your tokens on Capx'
                  : 'Buy available tokens listed on Capx'}
              </p>
            </div>
            <GlobalSearchBox filter={filter} setFilter={setFilter} />
          </div>
          {mode === 'sell' ? (
            <TokenSellTable filter={filter} />
          ) : (
            <TokenBuyTable setAmount={setAmount} filter={filter} />
          )}
        </div>
        {mode === 'sell' ? (
          <SellScreen ticker={match.params.ticker} />
        ) : (
          <BuyScreen
            ticker={match.params.ticker}
            payAmount={payAmount}
            receiveAmount={receiveAmount}
            setAmount={setAmount}
            balance={balance}
            setMaxAmount={setMaxAmount}
          />
        )}
      </div>
    </div>
  );
}

export default ExchangeScreen;
