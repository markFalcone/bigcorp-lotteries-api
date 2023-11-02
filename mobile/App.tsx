import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { ToastProvider } from 'react-native-toast-notifications';
import Home from './screens/Home';
import AddLottery from './screens/AddLottery';
import RegisterModal from './screens/RegisterModal';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: NativeStackNavigationOptions = {
  title: '',
};

export default function App() {
  return (
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
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Register" component={RegisterModal} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
