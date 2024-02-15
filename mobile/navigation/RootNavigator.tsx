import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { About } from '../screens/About';
import { LotteriesDrawerNavigator } from './LotteriesDrawerNavigator';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="LotteriesTab"
      component={LotteriesDrawerNavigator}
      options={{
        title: 'Lotteries',
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="dice" size={24} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="About"
      component={About}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="info" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
