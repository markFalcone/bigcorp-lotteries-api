import * as LotteriesService from '../../services/lottery';
import { Lottery } from '../../types';

// Action types
export const GET_LOTTERIES_SUCCESS = 'GET_LOTTERIES_SUCCESS';
export const GET_LOTTERIES_STARTED = 'GET_LOTTERIES_STARTED';
export const GET_LOTTERIES_ERROR = 'GET_LOTTERIES_ERROR';
export const ADD_LOTTERY_SUCCESS = 'ADD_LOTTERY_SUCCESS';
export const ADD_LOTTERY_STARTED = 'ADD_LOTTERY_STARTED';
export const ADD_LOTTERY_ERROR = 'ADD_LOTTERY_ERROR';

// Action creator
export type GetLotteriesActions =
  | GetLotteriesStarted
  | GetLotteriesSuccess
  | GetLotteriesError
  | AddLotteryStarted
  | AddLotterySuccess
  | AddLotteryError;

interface GetLotteriesStarted {
  type: typeof GET_LOTTERIES_STARTED;
}
interface GetLotteriesSuccess {
  type: typeof GET_LOTTERIES_SUCCESS;
  payload: Lottery[];
}
interface GetLotteriesError {
  type: typeof GET_LOTTERIES_ERROR;
  payload: Error;
}
interface AddLotteryStarted {
  type: typeof ADD_LOTTERY_STARTED;
}
interface AddLotterySuccess {
  type: typeof ADD_LOTTERY_SUCCESS;
  payload: Lottery;
}
interface AddLotteryError {
  type: typeof ADD_LOTTERY_ERROR;
  payload: Error;
}

const getLotteriesStarted = () => ({
  type: GET_LOTTERIES_STARTED,
});
const getLotteriesSuccess = (res: Lottery[]) => ({
  type: GET_LOTTERIES_SUCCESS,
  payload: res,
});
const getLotteriesError = (error: Error) => ({
  type: GET_LOTTERIES_ERROR,
  payload: error,
});
const addLotteryStarted = () => ({
  type: ADD_LOTTERY_STARTED,
});
const addLotterySuccess = (res: Lottery) => ({
  type: ADD_LOTTERY_SUCCESS,
  payload: res,
});
const addLotteryError = (error: Error) => ({
  type: ADD_LOTTERY_ERROR,
  payload: error,
});

export const getLotteries = () => {
  return async (dispatch) => {
    dispatch(getLotteriesStarted());
    try {
      const lotteriesData = await LotteriesService.getLottieries();
      dispatch(getLotteriesSuccess(lotteriesData));
    } catch (error: any) {
      dispatch(getLotteriesError(error));
    }
  };
};

export const addLottery = (lotteryData: { name: string; prize: string }) => {
  return async (dispatch) => {
    dispatch(addLotteryStarted());
    try {
      const res = await LotteriesService.createNewLottery(lotteryData);
      dispatch(addLotterySuccess(res));
    } catch (error: any) {
      dispatch(addLotteryError(error));
    }
  };
};
