import { combineReducers } from 'redux';
import exchangeReducer from './exchange';
import sideNavReducer from './sideNav';

const rootReducer = combineReducers({
  sideNav: sideNavReducer,
  exchange : exchangeReducer
});

export default rootReducer;