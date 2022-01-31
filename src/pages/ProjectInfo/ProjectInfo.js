import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideSideNav } from '../../redux/actions/sideNav';
import BuyScreen from './Buy';
import ProjectDescription from './ProjectDescription';

import liquidDiamond from '../../assets/Capx-Diamond-Liquid.svg';
import InfoHeader from './InfoHeader';
import { fetchProjectDetails } from '../../utils/fetchProjectDetails';
import { useState } from 'react';
import { fetchOrderForTicker } from '../../utils/fetchOrderForTicker';
import { useWeb3React } from '@web3-react/core';
import MetamaskModal from '../../components/Modals/MetamaskModal/MetamaskModal';

function ProjectInfo({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const [projectDetails, setProjectDetails] = useState({});
  const [activeOrders, setActiveOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const { active, account, chainId } = useWeb3React();

  useEffect(() => {
    getProjectDetails(match.params.ticker);
  }, [match.params.ticker, active, account, chainId]);
  const getProjectDetails = async () => {
    if(active) {
    const _projectDetails = await fetchProjectDetails(match.params.ticker);

    setProjectDetails(_projectDetails);
    const _activeOrders = await fetchOrderForTicker(
      _projectDetails.id,
      setActiveOrders,
      setCompleteOrders,
      account
    );
    console.log(projectDetails);
    console.log(activeOrders);
    console.log(completeOrders);
    }
  };
  return (
    <>
      {!active ? (
        <MetamaskModal />
      ) : (
        <div className='w-82v mx-auto '>
          <div className='main-container'>
            <div className='main-container_left'>
              <InfoHeader
                ticker={`${projectDetails?.projectName} (${projectDetails.projectTokenTicker})`}
              />
              <ProjectDescription
                projectDetails={projectDetails}
                activeOrders={activeOrders}
                completeOrders={completeOrders}
              />
            </div>
            <BuyScreen />
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectInfo;
