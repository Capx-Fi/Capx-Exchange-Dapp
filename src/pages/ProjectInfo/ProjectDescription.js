import React from 'react';
import './ProjectInfo.scss';

import infoIcon from '../../assets/info.svg';
import marketActivity from '../../assets/marketActivity.svg';

import OuterContainer from './OuterContainer';
import TokenListTable from './TokenListTable';
import TokenActivityTable from './TokenActivityTable';
import MobileMarketActivity from "./MobileMarketActivity";
import MobileBuyTable from '../../components/MobileTable/MobileTableBuy';

function ProjectDescription({ projectDetails, completeOrders, activeOrders, loading }) {
  return (
    <>
    <div className="tablet:block phone:hidden">
      <OuterContainer
        title={'PROJECT DESCRIPTION'}
        icon={infoIcon}
        content={
          projectDetails?.projectDescription ? (
            <p className='p-4 max-h-32 w-full overflow-y-scroll'>
              {projectDetails?.projectDescription}
            </p>
          ) : (
            <div className='h-20 bg-loadingBG text-loadingBG bg-opacity-40 animate-pulse w-full'></div>
          )
        }
      />
      <OuterContainer
        title={'MARKET ACTIVITY'}
        icon={marketActivity}
        completeOrders={completeOrders}
        content={<TokenActivityTable completeOrders={completeOrders} />}
      />
      <OuterContainer
        title={'TOKENS WITH $CAPX'}
        icon={marketActivity}
        activeOrders={activeOrders}
        content={<TokenListTable activeOrders={activeOrders} />}
      />
      </div>

      <div className="phone:block tablet:hidden">
      <OuterContainer
        title={'PROJECT DESCRIPTION'}
        icon={infoIcon}
        content={
          projectDetails?.projectDescription ? (
            <p className='p-4 max-h-32 w-full overflow-y-scroll'>
              {projectDetails?.projectDescription}
            </p>
          ) : (
            <div className='h-20 bg-loadingBG text-loadingBG bg-opacity-40 animate-pulse w-full'></div>
          )
        }
      />
        <MobileMarketActivity />
        <TokenListTable activeOrders={activeOrders} loading={loading} />
      </div>
    </>
  );
}

export default ProjectDescription;
