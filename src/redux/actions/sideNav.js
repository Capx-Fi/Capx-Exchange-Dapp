import {
  CLOSE_SIDENAV,
  HIDE_SIDENAV,
  OPEN_SIDENAV,
  SHOW_SIDENAV,
} from './types';

export const showSideNav = () => {
  return function (dispatch) {
    dispatch({
      type: SHOW_SIDENAV,
    });
  };
};

export const hideSideNav = () => {
  return function (dispatch) {
    dispatch({
      type: HIDE_SIDENAV,
    });
  };
};

export const openSideNav = () => {
  return function (dispatch) {
    dispatch({
      type: OPEN_SIDENAV,
    });
  };
};

export const closeSideNav = () => {
  return function (dispatch) {
    dispatch({
      type: CLOSE_SIDENAV,
    });
  };
};
