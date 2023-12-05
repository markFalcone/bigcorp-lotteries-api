import { Reducer } from 'redux';
import {
  GET_LOTTERIES_ERROR,
  GET_LOTTERIES_STARTED,
  GET_LOTTERIES_SUCCESS,
  GetLotteriesActions,
} from '../actions/lotteryActions';
import { Lottery } from '../../types';

export interface LotteryState {
  data: Lottery[];
  loading: boolean;
  error: Error | null;
}

const initialState: LotteryState = {
  data: [],
  loading: false,
  error: null,
};

// create a reducer for the lotteries state
const lotteryReducer: Reducer<LotteryState, GetLotteriesActions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case GET_LOTTERIES_STARTED:
      return {
        ...state,
        loading: true,
      };
    case GET_LOTTERIES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_LOTTERIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default lotteryReducer;
