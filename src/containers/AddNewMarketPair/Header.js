import React, { useEffect, useState } from 'react';
import './AddNewMarketPair.scss';
import BackIcon from '../../assets/previous-cyan.svg';
import CloseIcon from '../../assets/close-cyan.svg';
import { useHistory } from 'react-router-dom';

// import { connect } from 'react-redux';
import { hideSideNav, showSideNav } from '../../redux/actions/sideNav';
import { useDispatch } from 'react-redux';

export default function AddNewMarketPairHeader() {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  return (
    <div className='addNewMarketPairScreen_maincontainer_header'>
      <div
        onClick={() => {
          dispatch(showSideNav());
          history.goBack();
        }}
        className='addNewMarketPairScreen_maincontainer_header_left'
      >
        <div className='addNewMarketPairScreen_maincontainer_header_left_logo'>
          <img src={BackIcon} alt='back icon' />
        </div>
        <div className='addNewMarketPairScreen_maincontainer_header_left_title'>
          Back
        </div>
      </div>
      <div
        onClick={() => {
          dispatch(showSideNav());
          history.goBack();
        }}
        className='addNewMarketPairScreen_maincontainer_header_right'
      >
        <div className='addNewMarketPairScreen_maincontainer_header_right_title'>
          Close
        </div>
        <div className='addNewMarketPairScreen_maincontainer_header_right_logo'>
          <img src={CloseIcon} alt='close icon' />
        </div>
      </div>
    </div>
  );
}

// const mapStateToProps = (state) => {
//   return {
//     sideNavState: state.sideNav,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     hideSideNav: () => dispatch(hideSideNav()),
//     showSideNav: () => dispatch(showSideNav()),
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(AddNewMarketPairHeader);
