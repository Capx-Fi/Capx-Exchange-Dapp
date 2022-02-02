import React from 'react';
import TableInstanceWithSearch from '../../layouts/TableLayout/TableInstanceWithSearch';

import dummyDataOverview from '../../layouts/TableLayout/dummyDataOverview.json';
import { HOME_COLUMNS } from '../../layouts/TableLayout/columns';
import SingleOverviewCard from '../../components/OverviewCard/SingleOverviewCard';
import ExtendedOverviewCard from '../../components/OverviewCard/ExtendedOverviewCard';
import ConnectWalletCard from '../../components/OverviewCard/ConnectWalletCard';



function Overview() {
  let component = (
    <TableInstanceWithSearch
      tableData={dummyDataOverview}
      columnName={HOME_COLUMNS}
      title={"overview"}
    />

  );
  return (
    <div className="w-auto md:w-full bg-dark-400 ml-4">
      <div className="flex-row flex gap-x-10 mt-14 ml-20 mr-0 pr-48 desktop:w-12/12 desktop:p-0 desktop:pr-0 desktop:ml-16">
        <ConnectWalletCard />

        <SingleOverviewCard
          title='EXPLORE CAPX GAMES'
          value='Earn $CAPX tokens'
          change='Start CapX Games'
        />

        <SingleOverviewCard
          title='LIQUIDATED'
          value='Unlocking liquidity'
          change='Learn More'
        />
      </div>
      <div className="text-white text-left pl-2 ml-20 mt-12 mb-5 pr-40 desktop:pl-0 desktop:mt-6 desktop:ml-16 desktop:pl-1">
        <p className="text-subheading font-normal desktop:text-paragraph-1">Market Trades</p>
        <p className="text-caption-1 text-grayLabel font-medium mb-5 desktop:pt-2">
          Discover new derivative assets to trade on Capx
        </p>
      </div>
      <div className="text-white text-left pl-0 ml-20 mt-6 mb-5 pr-40 w-full">
        <hr className="divider-capx w-full" />
      </div>
      {component !== null && component}
    </div>
  );
}

export default Overview;
