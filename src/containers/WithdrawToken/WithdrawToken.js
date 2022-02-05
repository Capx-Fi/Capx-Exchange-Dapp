import React, { useEffect, useState } from 'react';
import './WithdrawToken.scss';
import NextIcon from '../../assets/next-black.svg';

import Header from '../AddNewMarketPair/Header';
import InputField from './InputField';

function WithdrawToken({ location }) {
  const [tokenInputValue, setTokenInputValue] = useState(null);
  const ticker = location.state.token
  useEffect(() => {
    verifyInput();
  }, [tokenInputValue]);
  const verifyInput = () => {
    if (tokenInputValue === null) {
      return false;
    } else if (tokenInputValue?.length < 42) {
      return false;
    } else {
      // verifyAddress(tokenInputValue);
    }
  };

  const [value, setValue] = useState(null);


  return (
    <div className='WithdrawTokenScreen'>
      <div className='WithdrawTokenScreen_maincontainer'>
        <Header />
        <div className='WithdrawTokenScreen_maincontainer_body'>
          <div className='WithdrawTokenScreen_maincontainer_body_title'>
            Withdraw Token
          </div>
          <div className='WithdrawTokenScreen_maincontainer_body_innercontainer'>
            <div className='WithdrawTokenScreen_maincontainer_body_innercontainer_box'>
              <div className='WithdrawTokenScreen_maincontainer_body_innercontainer_box_title'>
                WITHDRAW
              </div>
              <p>Balance : {location.state.balance}</p>
              <div className='WithdrawTokenScreen_maincontainer_body_innercontainer_box_value'>
                <InputField
                  value
                  setValue={setValue}
                  ticker={ticker}
                  valid={true}
                  className={`pb-4 w-full`}
                />
               
              </div>
            </div>
            <div className='WithdrawTokenScreen_maincontainer_body_innercontainer_button'>
              <div className='WithdrawTokenScreen_maincontainer_body_innercontainer_button_title'>
                APPROVE
              </div>
              <div className='WithdrawTokenScreen_maincontainer_body_innercontainer_button_logo'>
                <img src={NextIcon} alt='next icon' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawToken;
