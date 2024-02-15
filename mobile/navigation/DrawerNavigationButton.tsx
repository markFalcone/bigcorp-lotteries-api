import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export const DrawerNavigationButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => navigation.openDrawer()}
    >
      <MaterialIcons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
};
