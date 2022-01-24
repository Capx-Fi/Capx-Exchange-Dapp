import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';

import LockIcon from '../../assets/lock-asset.svg';
import NextIcon from '../../assets/next-black.svg';
import DatePicker from 'react-date-picker';
import DropdownIcon from '../../assets/dropdown.svg';
import { TimePicker } from 'antd';
import './antd.css';
import moment from 'moment';
const format = 'HH:mm';

function SellScreen() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const [payAmount, setPayAmount] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const ticker = useSelector((state) => state.exchange.sellTicker);

  console.log(payAmount, receiveAmount);
  const setAmount = (e) => {
    setPayAmount(e);
    setReceiveAmount(e * 0.8);
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
              TOKEN
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper'>
                <img
                  className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper_icon'
                  src={LockIcon}
                  alt='lock icon'
                />
                <input
                  className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input'
                  type='text'
                  disabled={!ticker}
                  value={ticker && ticker.asset}
                />
              </div>
            </div>
          </div>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_splitContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                QUANTITY
              </div>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer'>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper'>
                  <img
                    className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper_icon hidden'
                    src={LockIcon}
                    alt='lock icon'
                  />
                  <input
                    className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input'
                    type='number'
                    placeholder='0'
                    value={receiveAmount}
                    disabled={!ticker}
                  />
                </div>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_balanceContainer'>
                  <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_balanceContainer_main'>
                    <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_balanceContainer_main_text'>
                      BAL
                    </div>
                    <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_balanceContainer_main_max'>
                      MAX
                    </div>
                  </div>
                  <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_balanceContainer_value'>
                    {' '}
                    {ticker && ticker.quantity}
                  </div>
                </div>
              </div>
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                PRICE
              </div>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer'>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper'>
                  <input
                    className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_input'
                    type='number'
                    placeholder='0'
                    value={receiveAmount}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='exchangeScreen_rightcontainer_buyContainer_body_splitContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_title'>
                EXPIRY DATE
              </div>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer'>
                <div
                  className={`exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper w-full ${
                    !ticker && 'pointer-events-none'
                  } `}
                >
                  <DatePicker
                    onChange={setDate}
                    value={date}
                    clearIcon={null}
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
              <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer'>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_tokenContainer_inputContainer_lockWrapper w-full'>
                  <TimePicker
                    defaultValue={moment('12:15', format)}
                    allowClear={false}
                    disabled={!ticker}
                    bordered={false}
                    format={format}
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
            <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_date'>
              {' '}
              EXPIRY DATE: 28/02/2022
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_time'>
              {' '}
              EXPIRY TIME: 23:05
            </div>
          </div>
          <div
            className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
              !ticker && 'pointer-events-none cursor-not-allowed'
            }`}
          >
            <div className='exchangeScreen_rightcontainer_buyContainer_body_swapButton_title'>
              SWAP TOKENS
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
