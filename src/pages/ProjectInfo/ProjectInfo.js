import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideSideNav } from '../../redux/actions/sideNav';
import BuyScreen from '../Exchange/Buy';
import ProjectDescription from './ProjectDescription';

import liquidDiamond from '../../assets/Capx-Diamond-Liquid.svg';
import InfoHeader from './InfoHeader';

function ProjectInfo({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);

  return (
    <div className='w-82v mx-auto'>
      <div className='main-container'>
        <div className='main-container_left'>
          <InfoHeader ticker={match.params.ticker} />
          <ProjectDescription />
        </div>
        <BuyScreen />
      </div>
    </div>
  );
}

export default ProjectInfo;
