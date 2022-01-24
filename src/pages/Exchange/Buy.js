import './Exchange.scss';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';
import LockIcon from '../../assets/lock-asset.svg';
import SwapIcon from '../../assets/swap.svg';
import NextIcon from '../../assets/next-black.svg';

function BuyScreen({
  payAmount,
  receiveAmount,
  balance,
  setAmount,
  setMaxAmount,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  const ticker = useSelector((state) => state.exchange.buyTicker);

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
            <p className='exchangeScreen_rightcontainer_buyContainer_header_title_text'>
              BUY {ticker ? ' - ' + ticker.asset : ''}
            </p>
          </div>
        </div>
        <div className='exchangeScreen_rightcontainer_buyContainer_body'>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_title'>
              YOU PAY {ticker && ': USDT'}
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_lockWrapper'>
                <img
                  className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_lockWrapper_icon hidden'
                  src={LockIcon}
                  alt='lock icon'
                />
                <input
                  className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_input'
                  type='number'
                  placeholder='0'
                  value={payAmount}
                  disabled={!ticker}
                  // onChange={(e) => {
                  //   setAmount(e.target.value, 8);
                  // }}
                />
              </div>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer'>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_main'>
                  <p className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_main_text'>
                    BAL
                  </p>
                  <p
                    className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_main_max'
                    // onClick={() => setMaxAmount()}
                  >
                    MAX
                  </p>
                </div>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_value'>
                  {' '}
                  {balance}
                </div>
              </div>
            </div>
          </div>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_separator'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_separator_line w-7/12'></div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_separator_iconContainer w-2/12'>
              <img
                className='exchangeScreen_rightcontainer_buyContainer_body_separator_iconContainer_icon'
                src={SwapIcon}
                alt='swap icon'
              />
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_separator_line w-3/12'></div>
          </div>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_title'>
              YOU RECEIVE {ticker && ': ' + ticker.asset}
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer'>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_lockWrapper'>
                <img
                  className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_lockWrapper_icon'
                  src={LockIcon}
                  alt='lock icon'
                />
                <input
                  className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_input'
                  type='number'
                  placeholder='0'
                  value={receiveAmount}
                  disabled
                />
              </div>
              <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer'>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_main'>
                  <p className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_main_text'>
                    BAL
                  </p>
                </div>
                <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_inputContainer_balanceContainer_value'>
                  {' '}
                  150000
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
            <div
              className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton_title ${
                !ticker && 'pointer-events-none cursor-not-allowed'
              }`}
            >
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

export default BuyScreen;
