import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import Form from '../components/Form';
import { AddLotteryNavigationProp } from '../types';
import { colors } from '../colors';

const AddLottery = () => {
  const navigation = useNavigation<AddLotteryNavigationProp>();
  const toast = useToast();

  const onSubmit = () => {
    toast.show('New lottery added successfully!');
  };

  const onNavigateBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Form onSubmit={onSubmit} onNavigateBack={onNavigateBack} />
    </View>
  );
};

export default AddLottery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
  },
});
