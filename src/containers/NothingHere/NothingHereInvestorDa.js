import React from 'react';
import NothingHereIcon from '../../assets/InvestorEmptyState.svg';
import './NothingHere.scss';
import NextIcon from '../../assets/next-black.svg';

import { useHistory } from 'react-router';
import DeskCTA from '../../components/CTA/DeskCTA';

function NothingHereTrades() {
  const history = useHistory();
  return (
    <article className='nothinghere'>
      <section className='nothinghere_maincontainer'>
        <div className='nothinghere_maincontainer_herocontainer'>
        <figure>
          <img
            className='nothinghere_maincontainer_herocontainer_notfoundillustration'
            src={NothingHereIcon}
            alt='Nothing Here Illustration'
          />
          <figcaption className='nothinghere_maincontainer_herocontainer_subtitle'>
            No Trades Found
          </figcaption>
        </figure>
          {/* <DeskCTA
            onClick={() => history.push('/')}
            title='Add Tardes'
            classes='button'
            icon={NextIcon}
          /> */}
        </div>
      </section>
    </article>
  );
}

export default NothingHereTrades;
