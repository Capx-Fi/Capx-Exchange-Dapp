import React from 'react';
import liquidDiamond from '../../assets/Capx-Diamond-Liquid.svg';
import tickerDefault from '../../assets/tickerDefault.svg';

import './ProjectInfo.scss';

function InfoHeader({ ticker }) {
  return (
    <div className='infoHeader'>
      <div className='flex flex-row'>
        <div className='infoHeader_innerDiv'>
          <p className='infoHeader_innerDiv_title'>{'PROJECT NAME'}</p>
          {ticker ? (
            <>
              <div className='flex flex-row'>
                <div>
                  <img src={tickerDefault} className='mr-2' />
                </div>
                <div>
                  <p className='infoHeader_innerDiv_value'>{ticker}</p>
                </div>
              </div>
            </>
          ) : (
            <div className='h-8 bg-loadingBG text-loadingBG animate-pulse w-full'></div>
          )}
        </div>
        <div className='infoHeader_innerDiv'>
          <p className='infoHeader_innerDiv_title'>{'LSP'}</p>
          <p className='infoHeader_innerDiv_value'>{'9.72'}</p>
        </div>
        <div className='infoHeader_innerDiv'>
          <p className='infoHeader_innerDiv_title'>{'LSP'}</p>
          <p className='infoHeader_innerDiv_value'>{'9.72'}</p>
        </div>
      </div>
      <img src={liquidDiamond} className='infoHeader_illustration' />
    </div>
  );
}

export default InfoHeader;
