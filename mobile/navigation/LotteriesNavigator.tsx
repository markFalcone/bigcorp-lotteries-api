import React from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Home from '../screens/Home';
import AddLottery from '../screens/AddLottery';
import { LotteryDetails } from '../screens/LotteryDetails';
import RegisterModal from '../screens/RegisterModal';
import { DrawerNavigationButton } from './DrawerNavigationButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: NativeStackNavigationOptions = {
  title: '',
};

export const LotteriesNavigator = () => (
  <Stack.Navigator>
    <Stack.Group>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Lotteries', headerLeft: DrawerNavigationButton }}
      />
      <Stack.Screen
        name="AddLottery"
        component={AddLottery}
        options={options}
      />
      <Stack.Screen
        name="LotteryDetails"
        component={LotteryDetails}
        options={options}
      />
    </Stack.Group>
    <Stack.Group screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="Register" component={RegisterModal} />
    </Stack.Group>
  </Stack.Navigator>
);
