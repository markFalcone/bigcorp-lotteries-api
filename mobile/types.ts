import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
export type Status = 'running' | 'finished';

export interface Lottery {
  id: string;
  name: string;
  prize: string;
  type: string;
  status: Status;
}

// navigation types
export type RootStackParamList = {
  Home: undefined;
  AddLottery: undefined;
  Register: { selectedLotteries: Array<string> };
  LotteryDetails: { id: string };
};

export type AddLotteryNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddLottery',
  'Register'
>;

export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

export type LotteryDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LotteryDetails'
>;

export type LotteryDetailsRouteProp = RouteProp<
  RootStackParamList,
  'LotteryDetails'
>;
