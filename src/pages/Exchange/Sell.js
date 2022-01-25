import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';
import { setSellTicker } from '../../redux/actions/exchange';
import { EXCHANGE_ABI } from '../../contracts/ExchangeContract';
import { approveSellTokens } from '../../utils/approveSellTokens';
import { createOrder } from '../../utils/createOrder';
import {
  EXCHANGE_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
} from '../../constants/config';
import { CONTRACT_ABI_ERC20 } from '../../contracts/SampleERC20';
import Web3 from 'web3';

import LockIcon from '../../assets/lock-asset.svg';
import NextIcon from '../../assets/next-black.svg';
import DatePicker from 'react-date-picker';
import DropdownIcon from '../../assets/dropdown.svg';
import { useWeb3React } from '@web3-react/core';
import { TimePicker } from 'antd';
import './antd.css';
import moment from 'moment';
import RefresherInput from '../../components/RefresherInput/RefresherInput';
import WarningCard from '../../components/WarningCard/WarningCard';
const format = 'HH:mm';

function SellScreen() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const web3 = new Web3(Web3.givenProvider);
  const { active, account, chainId } = useWeb3React();
  const ticker = useSelector((state) => state.exchange.sellTicker);
  const balance = useSelector((state) => state.exchange.tickerBalance);
  const [tokenApproval, setTokenApproval] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [approveModalStatus, setApproveModalStatus] = useState('');
  const setAmount = (e) => {
    dispatch(setSellTicker({ ...ticker, price: e }));
  };
  const setDate = (e) => {
    console.log(e);
    dispatch(setSellTicker({ ...ticker, expiryDate: e }));
  };
  const setTime = (e) => {
    dispatch(setSellTicker({ ...ticker, expiryTime: moment(e, format) }));
  };
  const setQuantity = (e) => {
    dispatch(setSellTicker({ ...ticker, quantity: e }));
  };
  const initiateSwapApproval = async () => {
    setButtonClicked(true);

    const vestingTokenContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      ticker.assetID
    );
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      EXCHANGE_CONTRACT_ADDRESS
    );
    const usdtContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      USDT_CONTRACT_ADDRESS
    );
    const tokens = ticker.quantity;
    const tokenDecimal = ticker.tokenDecimal;
    await approveSellTokens(
      vestingTokenContract,
      account,
      tokens,
      tokenDecimal,
      EXCHANGE_CONTRACT_ADDRESS,
      setApproveModalStatus,
      setTokenApproval
    );
    console.log(ticker);
  };
  const finalizeSwap = async () => {
    const vestingTokenContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      ticker.assetID
    );
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      EXCHANGE_CONTRACT_ADDRESS
    );
    const usdtContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      USDT_CONTRACT_ADDRESS
    );
    const tokens = ticker.quantity;
    const tokenDecimal = ticker.tokenDecimal;
    console.log('tt', ticker);
    await createOrder(exchangeContract, account, ticker);

    console.log(ticker);
  };

  return (
    <div
      className={`exchangeScreen_rightcontainer ${
        !ticker && 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className='exchangeScreen_rightcontainer_buyContainer'>
        <div className='exchangeScreen_rightcontainer_buyContainer_header'>
          <div className='exchangeScreen_rightcontainer_buyContainer_header_title'>
            <img
              className='exchangeScreen_rightcontainer_buyContainer_header_title_icon'
              src={BuyIcon}
              alt='buy icon'
            />
            <div className='exchangeScreen_rightcontainer_buyContainer_header_title_text'>
              SELL {ticker && '- ' + ticker.asset}
            </div>
          </div>
        </div>
        <div className='exchangeScreen_rightcontainer_buyContainer_body'>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
              QUANTITY
            </div>
            <RefresherInput
              ticker={ticker}
              disabled={!ticker}
              balance={balance}
              isMax={true}
              value={ticker?.quantity}
              setTicker={(e) => setQuantity(e.target.value)}
              warningText={
                ticker &&
                ticker.quantity > balance &&
                `INSUFFICIENT BALANCE. BUY MORE $ ${ticker && ticker.asset}`
              }
            />
          </div>
          {ticker && ticker.quantity > balance && (
            <WarningCard
              text={`INSUFFICIENT BALANCE. BUY MORE $${ticker && ticker.asset}`}
            />
          )}
          <div className='exchangeScreen_rightcontainer_buyContainer_body_splitContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                PRICE
              </div>
              <div
                className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer ${
                  !ticker
                    ? 'pointer-events-none ring-dark-50'
                    : 'ring-success-color-500 '
                } `}
              >
                <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper'>
                  <input
                    className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input'
                    type='number'
                    placeholder='0'
                    value={ticker && ticker?.price}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                TOKEN
              </div>
              <RefresherInput
                value={ticker && ticker.asset}
                type={'text'}
                ticker={ticker}
                balance={null}
                disabled={true}
                icon={ticker && LockIcon}
              />
            </div>
          </div>

          <div className='exchangeScreen_rightcontainer_buyContainer_body_splitContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                EXPIRY DATE
              </div>
              <div
                className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer ${
                  !ticker
                    ? 'pointer-events-none ring-dark-50'
                    : 'ring-success-color-500 '
                } `}
              >
                <div
                  className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper w-full ${
                    !ticker
                      ? 'pointer-events-none ring-dark-50'
                      : 'ring-success-color-500 '
                  } `}
                >
                  <DatePicker
                    onChange={setDate}
                    value={ticker && ticker?.expiryDate}
                    clearIcon={null}
                    minDate={new Date()}
                    calendarIcon={
                      <>
                        <img src={DropdownIcon} alt='dropdown' />
                      </>
                    }
                    showLeadingZeros={true}
                    calendarClassName='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_dateInput'
                  />
                </div>
              </div>
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                EXPIRY TIME
              </div>
              <div
                className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer ${
                  !ticker
                    ? 'pointer-events-none ring-dark-50'
                    : 'ring-success-color-500 '
                } `}
              >
                <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper w-full'>
                  <TimePicker
                    defaultValue={ticker && ticker?.expiryTime}
                    allowClear={false}
                    disabled={!ticker}
                    bordered={false}
                    format={format}
                    onChange={(value) => setTime(value)}
                    popupClassName='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_timeInput'
                    className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input'
                    minuteStep={15}
                    showNow={false}
                    suffixIcon={
                      <>
                        <img src={DropdownIcon} alt='dropdown' />
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer'>
            {/* <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_date'>
              {' '}
              EXPIRY DATE: {moment(ticker?.expiryDate).format(
                'DD MMM YYYY'
              )}{' '}
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_time'>
              {' '}
              EXPIRY TIME: {moment(ticker?.expiryTime).format('hh:mm')}{' '}
            </div> */}
          </div>
          <div
            onClick={() =>
              tokenApproval ? finalizeSwap() : initiateSwapApproval()
            }
            className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
              !ticker && 'pointer-events-none cursor-not-allowed'
            }`}
          >
            <div className='exchangeScreen_rightcontainer_buyContainer_body_swapButton_title'>
              {tokenApproval ? 'SWAP TOKENS' : 'APPROVE TOKENS'}
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_swapButton_icon'>
              <img src={NextIcon} alt='next icon' />
            </div>
          </div>
        </div>
        <div className='exchangeScreen_rightcontainer_buyContainer_footer'></div>
      </div>
    </div>
  );
}

export default SellScreen;
