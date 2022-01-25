import React from 'react';
import { useDispatch } from 'react-redux';
import WarningCard from '../WarningCard/WarningCard';

import './RefresherInput.scss';

function RefresherInput({
  ticker,
  setTicker,
  disabled,
  icon,
  balance,
  isMax,
  setMaxAmount,
  value,
  warningText,
  warningRedirect,
  type,
}) {
  return (
    <>
      <div
        className={`refresherInput_inputContainer ${disabled && 'opacity-50'} ${
          ticker
            ? warningText
              ? 'warning_gradient_bg ring-warning-color-500'
              : 'ring-success-color-500'
            : 'ring-dark-50'
        }`}
      >
        <div className='refresherInput_inputContainer_lockWrapper'>
          <img
            className={`refresherInput_inputContainer_lockWrapper_icon ${
              !icon && 'hidden'
            }`}
            src={icon}
            alt='lock icon'
          />
          <input
            className='refresherInput_inputContainer_input'
            type={type ? type : 'number'}
            placeholder='0'
            value={ticker && value}
            disabled={disabled}
            onChange={(e) => {
              setTicker(e);
            }}
          />
        </div>
        {balance !== null && (
          <div className='refresherInput_inputContainer_balanceContainer'>
            <div className='refresherInput_inputContainer_balanceContainer_main'>
              <p className='refresherInput_inputContainer_balanceContainer_main_text'>
                BAL
              </p>
              {isMax && (
                <p
                  className='refresherInput_inputContainer_balanceContainer_main_max'
                  onClick={() => setMaxAmount()}
                >
                  MAX
                </p>
              )}
            </div>
            <div className='refresherInput_inputContainer_balanceContainer_value'>
              {' '}
              {balance}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RefresherInput;
