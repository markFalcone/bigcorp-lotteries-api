import { combineReducers } from 'redux';
import lotteriesSlice from './lotteryReducer';

const rootReducer = combineReducers({
  lotteries: lotteriesSlice.reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
