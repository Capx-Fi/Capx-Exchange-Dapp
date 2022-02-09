import { Tooltip, withStyles } from '@material-ui/core';
import React from 'react';
import liquidDiamond from '../../assets/Capx-Diamond-Liquid.svg';
import tickerDefault from '../../assets/tickerDefault.svg';

import './ProjectInfo.scss';

function InfoHeader({ ticker, lastSellingPrice, averageSellingPrice }) {
  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      background: '#2A383C',
      color: '#F1FAF2',
      maxWidth: 800,
      fontSize: theme.typography.pxToRem(12),
      borderRadius: '4px',
      zIndex: 100,
    },
  }))(Tooltip);
  return (
    <div className='infoHeader'>
      <div className='flex flex-row'>
        <div className='infoHeader_innerDiv'>
          <p className='infoHeader_innerDiv_title'>{'PROJECT NAME'}</p>
          {ticker !== 'undefined (undefined)' ? (
            <>
              <div className='flex flex-row'>
                <div>
                  <img src={tickerDefault} className='mr-2' />
                </div>
                <HtmlTooltip
                  arrow
                  placement='right-start'
                  title={
                    <React.Fragment className='flex justify-between'>
                      <span className='flex justify-between items-center font-bold pr-2'>
                        {ticker}
                      </span>
                    </React.Fragment>
                  }
                >
                  <div>
                    <p className='infoHeader_innerDiv_value'>
                      {ticker.length > 20
                        ? ticker.substring(0, 20).concat('...')
                        : ticker}
                    </p>
                  </div>
                </HtmlTooltip>
              </div>
            </>
          ) : (
            <div className='h-8 bg-loadingBG text-loadingBG animate-pulse w-full'></div>
          )}
        </div>
        <div className='infoHeader_innerDiv'>
          <p className='infoHeader_innerDiv_title'>{'Last Sale Price'}</p>
          <p className='infoHeader_innerDiv_value'>${lastSellingPrice}</p>
        </div>
        <div className='infoHeader_innerDiv'>
          <p className='infoHeader_innerDiv_title'>{'Average Price'}</p>
          <p className='infoHeader_innerDiv_value'>${averageSellingPrice}</p>
        </div>
      </div>
      <img src={liquidDiamond} className='infoHeader_illustration' />
    </div>
  );
}

export default InfoHeader;
