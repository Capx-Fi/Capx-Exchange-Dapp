import React, { useEffect, useState } from 'react';
import './DepositToken.scss';
import WalletIcon from '../../assets/wallet-icon.svg';
import Select from 'react-select';
import Header from '../AddNewMarketPair/Header';
import InputField from './InputField';

function DepositToken() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTokenA, setSelectedTokenA] = useState(null);
  const [selectedTokenB, setSelectedTokenB] = useState(null);
  const [tokenInputValue, setTokenInputValue] = useState(null);
  const [dropdownData, setDropdownData] = useState();
  useEffect(() => {
    verifyInput();
  }, [tokenInputValue]);
  const verifyInput = () => {
    console.log(tokenInputValue);
    if (tokenInputValue === null) {
      return false;
    } else if (tokenInputValue?.length < 42) {
      return false;
    } else {
      // verifyAddress(tokenInputValue);
    }
  };

  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    setSelectedOption(e);
  };
  const handleChangeA = (e) => {
    setSelectedTokenA(e);
  };
  const handleChangeB = (e) => {
    setSelectedTokenB(e);
  };
  const handleInputChange = (inputValue) => {
    setTokenInputValue(inputValue);
  };
  return (
    <div className='DepositTokenScreen'>
      <div className='DepositTokenScreen_maincontainer'>
        <Header />
        <div className='DepositTokenScreen_maincontainer_body'>
          <div className='DepositTokenScreen_maincontainer_body_title'>
            Deposit Token
          </div>
          <div className='DepositTokenScreen_maincontainer_body_innercontainer'>
            <div className='DepositTokenScreen_maincontainer_body_innercontainer_box'>
              <div className='DepositTokenScreen_maincontainer_body_innercontainer_box_title'>
                DEPOSIT
              </div>
              <div className='DepositTokenScreen_maincontainer_body_innercontainer_box_value'>
                <InputField
                  value
                  setValue={setValue}
                  valid={true}
                  className={`pb-4 w-full`}
                />
              </div>
            </div>
            <div className='DepositTokenScreen_maincontainer_body_innercontainer_button'>
              <div className='DepositTokenScreen_maincontainer_body_innercontainer_button_title'>
                DEPOSIT
              </div>
              <div className='DepositTokenScreen_maincontainer_body_innercontainer_button_logo'>
                <img src={WalletIcon} alt='next icon' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepositToken;
