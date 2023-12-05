import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-redux';
import Home from './screens/Home';
import AddLottery from './screens/AddLottery';
import RegisterModal from './screens/RegisterModal';
import { RootStackParamList } from './types';
import { LotteryDetails } from './screens/LotteryDetails';
import store from './store';

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: NativeStackNavigationOptions = {
  title: '',
};

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen name="Home" component={Home} options={options} />
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
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  );
}
