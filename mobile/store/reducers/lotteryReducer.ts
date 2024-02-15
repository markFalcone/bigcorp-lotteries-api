import { Reducer } from 'redux';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_LOTTERIES_ERROR,
  GET_LOTTERIES_STARTED,
  GET_LOTTERIES_SUCCESS,
  GetLotteriesActions,
} from '../actions/lotteryActions';
import { Lottery } from '../../types';
import * as LotteriesService from '../../services/lottery';

export interface LotteryState {
  data: Lottery[];
  loading: boolean;
  error: Error | null;
  isAddingNewLotteriesEnabled: boolean;
}

const initialState: LotteryState = {
  data: [],
  loading: false,
  error: null,
  isAddingNewLotteriesEnabled: true,
};

// Define a thunk that dispatches those action creators
export const getLotteries = createAsyncThunk('lotteries/get', async () => {
  const response = await LotteriesService.getLottieries();
  return response;
});

export const addLottery = createAsyncThunk(
  'lotteries/add',
  async (data: { name: string; prize: string }) => {
    const response = await LotteriesService.createNewLottery(data);
    return response;
  },
);

const lotteriesSlice = createSlice({
  name: 'lotteries',
  initialState,
  reducers: {
    lotteriesLoading(state) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    lotteriesReceived(state, action) {
      if (state.loading) {
        state.loading = false;
        state.data = action.payload;
      }
    },
    toggleAddingNewLotteriesEnabled(state) {
      state.isAddingNewLotteriesEnabled = !state.isAddingNewLotteriesEnabled;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getLotteries.fulfilled, (state, action) => {
      // Add user to the state array
      state.data = action.payload;
    });
    builder.addCase(addLottery.fulfilled, (state, action) => {
      // do nothing since we will refetch lotteries on going back to the screen
      return;
    });
  },
});

// Destructure and export the plain action creators
export const {
  lotteriesLoading,
  lotteriesReceived,
  toggleAddingNewLotteriesEnabled,
} = lotteriesSlice.actions;
export default lotteriesSlice;

// NOTE: Previous implementation
// const lotteryReducer: Reducer<LotteryState, GetLotteriesActions> = (
//   state = initialState,
//   action,
// ) => {
//   switch (action.type) {
//     case GET_LOTTERIES_STARTED:
//       return {
//         ...state,
//         loading: true,
//       };
//     case GET_LOTTERIES_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         data: action.payload,
//       };
//     case GET_LOTTERIES_ERROR:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//       };
//     default:
//       return state;
//   }
// };
