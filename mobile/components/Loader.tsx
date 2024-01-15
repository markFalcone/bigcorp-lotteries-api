import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../colors';

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1976d2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
});

export default Loader;
