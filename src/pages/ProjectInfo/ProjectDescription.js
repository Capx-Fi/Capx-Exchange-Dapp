import React from 'react';
import './ProjectInfo.scss';

import infoIcon from '../../assets/info.svg';
import marketActivity from '../../assets/marketActivity.svg';

import OuterContainer from './OuterContainer';
import TokenListTable from './TokenListTable';
import TokenActivityTable from './TokenActivityTable';

function ProjectDescription() {
  return (
    <>
      <OuterContainer
        title={'PROJECT DESCRIPTION'}
        icon={infoIcon}
        content={
          <p className='p-4 max-h-32 overflow-y-scroll'>
            Capx is a suite of products in Decentralized Finance (DeFi) designed
            to unlock trillions of dollars locked in vesting tokens. The Capx
            Protocol will serve as a trustless and highly decentralized
            financial infrastructure. The protocol enables individuals to
            effortlessly execute smart-contract-base agreements at a fractional
            cost compared to services provided by any financial institution.
            Capx is a suite of products in Decentralized Finance (DeFi) designed
            to unlock trillions of dollars locked in vesting tokens. The Capx
            Protocol will serve as a trustless and highly decentralized
            financial infrastructure. The protocol enables individuals to
            effortlessly execute smart-contract-base agreements at a fractional
            cost compared to services provided by any financial institution.
            Capx is a suite of products in Decentralized Finance (DeFi) designed
            to unlock trillions of dollars locked in vesting tokens. The Capx
            Protocol will serve as a trustless and highly decentralized
            financial infrastructure. The protocol enables individuals to
            effortlessly execute smart-contract-base agreements at a fractional
            cost compared to services provided by any financial institution.
            Capx is a suite of products in Decentralized Finance (DeFi) designed
            to unlock trillions of dollars locked in vesting tokens. The Capx
            Protocol will serve as a trustless and highly decentralized
            financial infrastructure. The protocol enables individuals to
            effortlessly execute smart-contract-base agreements at a fractional
            cost compared to services provided by any financial institution.
          </p>
        }
      />
      <OuterContainer
        title={'MARKET ACTIVITY'}
        icon={marketActivity}
        content={<TokenActivityTable />}
      />
      <OuterContainer
        title={'TOKENS WITH $CAPX'}
        icon={marketActivity}
        content={<TokenListTable />}
      />
    </>
  );
}

export default ProjectDescription;
