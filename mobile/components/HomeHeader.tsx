import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { AddLotteryNavigationProp } from '../types';
import { colors } from '../colors';
import {
  LotteryListSortingOptions,
  useLotteriesSortingContext,
} from '../context/lotteries-sorting-context';

const LotteriesSortingButton = () => {
  const { selectedSorting, switchSorting } = useLotteriesSortingContext();

  const iconName =
    selectedSorting === LotteryListSortingOptions.Ascending
      ? 'arrowup'
      : 'arrowdown';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.sortingButton}
      onPress={switchSorting}
    >
      <Text style={styles.sortingButtonText}>Prices</Text>
      <AntDesign name={iconName} size={16} color="black" />
    </TouchableOpacity>
  );
};

interface HomeHeaderProps {
  selectedLotteries: string[];
}

export const HomeHeader = ({ selectedLotteries }: HomeHeaderProps) => {
  const navigation = useNavigation<AddLotteryNavigationProp>();

  const backgroundColor =
    selectedLotteries.length === 0 ? colors.grey : colors.secondary;

  return (
    <>
      <LotteriesSortingButton />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('Register', { selectedLotteries })}
        style={[styles.button, { backgroundColor }]}
        disabled={selectedLotteries.length === 0}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    top: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    color: colors.buttonSecondary,
  },
  sortingButton: {
    position: 'absolute',
    left: 16,
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sortingButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 3,
  },
});
