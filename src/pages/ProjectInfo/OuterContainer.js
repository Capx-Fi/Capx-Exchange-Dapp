import React from 'react';
import './ProjectInfo.scss';

import infoIcon from '../../assets/info.svg';
import './ProjectInfo.scss';

function OuterContainer({ icon, content, title }) {
  return (
    <div className='outerContainer'>
      <div className='outerContainer_maincontainer'>
        <div className='outerContainer_maincontainer_body'>
          <div className='outerContainer_maincontainer_body_title'>
            <img src={icon} className='mr-2 h-4' /> {title}
          </div>
          <div className='outerContainer_maincontainer_body_innercontainer'>
            <div className='outerContainer_maincontainer_body_innercontainer_box'>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OuterContainer;
