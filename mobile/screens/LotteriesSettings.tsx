import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleAddingNewLotteriesEnabled } from '../store/reducers/lotteryReducer';
import { colors } from '../colors';

export const LotteriesSettings = () => {
  const dispatch = useDispatch();

  const isAddingNewLotteriesEnabled = useSelector(
    (state: RootState) => state.lotteries.isAddingNewLotteriesEnabled,
  );
  const onIsAddingNewLotteriesEnabledValueChange = () => {
    dispatch(toggleAddingNewLotteriesEnabled());
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Switch
          value={isAddingNewLotteriesEnabled}
          onValueChange={onIsAddingNewLotteriesEnabledValueChange}
        />
        <Text style={styles.settingRowText}>Enable adding new lotteries</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRowText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
