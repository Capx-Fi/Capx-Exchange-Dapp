import './Withdraw.scss';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch, useSelector } from 'react-redux';
import BuyIcon from '../../assets/buy.svg';
import NextIcon from '../../assets/next-black.svg';
import RefresherInput from '../../components/RefresherInput/RefresherInput';
import { EXCHANGE_ABI } from '../../contracts/ExchangeContract';
import BigNumber from 'bignumber.js';
import { useSnackbar } from 'notistack';

import {
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  MATIC_CHAIN_ID,
  USDT_CONTRACT_ADDRESS,
  GRAPHAPIURL_EXCHANGE_BSC,
  GRAPHAPIURL_EXCHANGE_MATIC,
  GRAPHAPIURL_EXCHANGE_ETHEREUM,
} from "../../constants/config";
import { CONTRACT_ABI_ERC20 } from '../../contracts/SampleERC20';
import { useWeb3React } from '@web3-react/core';


import Web3 from 'web3';
import WarningCard from '../../components/WarningCard/WarningCard';
import ApproveModal from '../../components/Modals/VestAndApproveModal/ApproveModal';
import { withdrawToken } from '../../utils/withdrawToken';
import { setWithdrawTicker } from '../../redux/actions/withdraw';
import WithdrawModal from '../../components/Modals/VestAndApproveModal/WithdrawModal';

// New Import 

import { validateWithdrawAmount } from '../../utils/validateWithdrawAmount';

function WithdrawContainer({
  withdrawModalOpen,
  setWithdrawModalOpen,
  refetch,
  setRefetch,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, chainId } = useWeb3React();
  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID?.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM;
  const [withdrawModalStatus, setWithdrawModalStatus] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [checkWithdraw, setCheckWithdraw] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [warningCheck, setWarningCheck] = useState(false);
  const ticker = useSelector((state) => state.withdraw.withdrawTicker);
  const setQuantity = (e) => {
    dispatch(setWithdrawTicker({ ...ticker, quantity: e }));
  };
  const resetValue = () => {
    dispatch(setWithdrawTicker(null));
  };
    const checkValidWithdraw = async () => {
      const checkValidity = await validateWithdrawAmount(ticker);
      console.log(checkValidity);
      setCheckWithdraw(checkValidity);
    };
  const tryWithdraw = async () => {
    const exchangeContract = new web3.eth.Contract(
      EXCHANGE_ABI,
      CHAIN_EXCHANGE_CONTRACT_ADDRESS
    );
    let totalTokens = ticker.quantity;
    console.log("My withdraw - ",ticker)
    let totalAmount = new BigNumber(totalTokens).multipliedBy(Math.pow(10, ticker.tokenDecimal));
    
    // if(ticker.assetID === "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"){
    //   totalAmount = new BigNumber(totalTokens).multipliedBy(Math.pow(10, 6));
    // }
    
    console.log(await validateWithdrawAmount(ticker));

    let assetID = ticker.assetID;
    await withdrawToken(
      exchangeContract,
      account,
      assetID,
      totalAmount,
      setWithdrawModalOpen,
      setWithdrawModalStatus,
      setButtonDisabled,
      enqueueSnackbar,
      resetValue
    );

    setTimeout(() => {
      setRefetch(!refetch);
    }, 6000);
  };
    useEffect(() => {
      checkValidWithdraw();
    }, [ticker?.quantity, ticker?.price]);
  useEffect(() => {
    if (ticker?.quantity === "" || ticker?.quantity <= 0 || ticker?.quantity === null) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [ticker?.quantity]);
  return (
    <div
      className={`exchangeScreen_rightcontainer ${
        !ticker && 'opacity-60 cursor-not-allowed'
      }`}
    >
      <WithdrawModal
        open={withdrawModalOpen}
        setOpen={setWithdrawModalOpen}
        withdrawModalStatus={withdrawModalStatus}
        setWithdrawModalStatus={setWithdrawModalStatus}
      />
      <div className='exchangeScreen_rightcontainer_buyContainer'>
        <div className='exchangeScreen_rightcontainer_buyContainer_header'>
          <div className='exchangeScreen_rightcontainer_buyContainer_header_title'>
            <img
              className='exchangeScreen_rightcontainer_buyContainer_header_title_icon'
              src={BuyIcon}
              alt='buy icon'
            />
            <p className='exchangeScreen_rightcontainer_buyContainer_header_title_text'>
              WITHDRAW {ticker ? ' - ' + ticker.asset : ''}
            </p>
          </div>
        </div>
        <div className='exchangeScreen_rightcontainer_buyContainer_body'>
          <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer'>
            <div className='exchangeScreen_rightcontainer_buyContainer_body_payContainer_title'>
              Enter Withdraw Amount
            </div>
            <RefresherInput
              ticker={ticker}
              disabled={!ticker}
              setTicker={(e) => {
                if (BigNumber(e.target.value).isGreaterThan(ticker?.balance)) {
                  dispatch(
                    setWithdrawTicker({
                      ...ticker,
                      quantity: ticker?.balance,
                    })
                  );
                } else {
                  dispatch(
                    setWithdrawTicker({
                      ...ticker,
                      quantity: e.target.value,
                    })
                  );
                }
              }}
              warningText={warningCheck && "You don't have enough balance"}
              isMax={true}
              setMaxAmount={() => {
                setQuantity(ticker?.balance);
              }}
              balance={ticker?.balance}
              value={ticker ? ticker.quantity : ''}
            />
          </div>
          {warningCheck && (
            <WarningCard
              text={`Not enough balance on DEX! Approve the difference amount to fulfill your order.`}
            />
          )}
          <div className='exchangeScreen_rightcontainer_buyContainer_body_expiryDetailsContainer'></div>
          <div
            onClick={() => tryWithdraw()}
            className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton ${
              (!ticker || disabled) &&
              'pointer-events-none cursor-not-allowed opacity-50'
            }`}
          >
            <div
              className={`exchangeScreen_rightcontainer_buyContainer_body_swapButton_title ${
                (!ticker || disabled) &&
                'pointer-events-none cursor-not-allowed'
              }`}
            >
              WITHDRAW TOKENS
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

export default WithdrawContainer;
