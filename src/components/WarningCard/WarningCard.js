import React from 'react';
import './WarningCard.scss';

import WarningIcon from '../../assets/warning-orange.svg';
import DoubleArrow from '../../assets/redirect.svg';
import { useHistory } from 'react-router-dom';

function WarningCard({ text, redirect }) {
  const history = useHistory();
  return (
    <div className='px-4 py-2 flex items-start text-warning-color-400 warning_gradient flex-row'>
      <div>
        <img src={WarningIcon} className='h-5' />
      </div>
      <div className='text-caption-3 font-semibold px-2'>{text}</div>
      {/* <div onClick={() => history.push(redirect)}>
        <img src={DoubleArrow} />
      </div> */}
    </div>
  );
}

export default WarningCard;
