import {
  CLOSE_SIDENAV,
  HIDE_SIDENAV,
  OPEN_SIDENAV,
  SHOW_SIDENAV,
} from '../actions/types';

const initState = {
  visible: true,
  open: true,
};

const sideNavReducer = (state = initState, action) => {
  switch (action.type) {
    case HIDE_SIDENAV:
      return {
        ...state,
        visible: false,
      };

    case SHOW_SIDENAV:
      return {
        ...state,
        visible: true,
      };

    case OPEN_SIDENAV:
      return {
        ...state,
        open: true,
      };

    case CLOSE_SIDENAV:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

export default sideNavReducer;
