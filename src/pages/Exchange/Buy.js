import './Exchange.scss';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';
import LockIcon from '../../assets/lock-asset.svg';
import SwapIcon from '../../assets/swap.svg';
import NextIcon from '../../assets/next-black.svg';
import { setBuyTicker } from '../../redux/actions/exchange';
import RefresherInput from '../../components/RefresherInput/RefresherInput';
import { EXCHANGE_ABI } from '../../contracts/ExchangeContract';
import { approveSellTokens } from '../../utils/approveSellTokens';
import { fulfillOrder } from '../../utils/fulfillOrder';
import BigNumber from 'bignumber.js';

import {
  EXCHANGE_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
} from '../../constants/config';
import { CONTRACT_ABI_ERC20 } from '../../contracts/SampleERC20';
import { useWeb3React } from '@web3-react/core';

import Web3 from 'web3';

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
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, chainId } = useWeb3React();
  const [tokenApproval, setTokenApproval] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [approveModalStatus, setApproveModalStatus] = useState('');
  const ticker = useSelector((state) => state.exchange.buyTicker);
  const initiateSwapApproval = async () => {
    setButtonClicked(true);

    const vestingTokenContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      USDT_CONTRACT_ADDRESS
    );
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      EXCHANGE_CONTRACT_ADDRESS
    );
    const usdtContract = new web3.eth.Contract(
      CONTRACT_ABI_ERC20,
      USDT_CONTRACT_ADDRESS
    );
    const tokens = ticker.amountGive;
    const tokenDecimal = 18;
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
    console.log('tt', ticker);
    let totalTokens = ticker.amountGive;
    let totalAmount = new BigNumber(totalTokens).multipliedBy(Math.pow(10, 18));
    let tradeID = ticker.tradeID;
    await fulfillOrder(exchangeContract, account, tradeID, totalAmount);

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
            <RefresherInput
              ticker={ticker}
              disabled={!ticker}
              setTicker={(e) =>
                dispatch(
                  setBuyTicker({
                    ...ticker,
                    amountGive: e.target.value,
                    amountGet: e.target.value / ticker.price,
                  })
                )
              }
              setMaxAmount={setMaxAmount}
              isMax={true}
              balance={ticker?.balance}
              value={ticker && ticker.amountGive}
            />
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
            <RefresherInput
              icon={ticker && LockIcon}
              ticker={ticker}
              disabled={true}
              isMax={false}
              balance={null}
              value={ticker && ticker.amountGet}
            />
          </div>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_date'>
              {' '}
              EXPIRY DATE: {ticker?.displayExpiryDate}
            </div>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer_time'>
              {' '}
              EXPIRY TIME: {ticker?.displayExpiryTime}
            </div>
          </div>
          <div
            onClick={() =>
              tokenApproval ? finalizeSwap() : initiateSwapApproval()
            }
            className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
              !ticker && 'pointer-events-none cursor-not-allowed'
            }`}
          >
            <div
              className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton_title ${
                !ticker && 'pointer-events-none cursor-not-allowed'
              }`}
            >
              {tokenApproval ? 'SWAP TOKENS' : 'APPROVE TOKENS'}
              {console.log(tokenApproval)}
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
