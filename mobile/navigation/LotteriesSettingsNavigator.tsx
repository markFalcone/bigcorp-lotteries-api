import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LotteriesSettings } from '../screens/LotteriesSettings';
import { DrawerNavigationButton } from './DrawerNavigationButton';

const Stack = createNativeStackNavigator();

export const LotteriesSettingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="LotteriesSettings"
      component={LotteriesSettings}
      options={{ headerLeft: DrawerNavigationButton, title: 'Settings' }}
    />
  </Stack.Navigator>
);
