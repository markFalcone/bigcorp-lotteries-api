import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FAB from '../components/Fab';
import Loader from '../components/Loader';
import { AddLotteryNavigationProp } from '../types';
import { colors } from '../colors';
import LotteryList from '../components/LotteryList';
import useLotteries from '../hooks/useLotteries';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { HomeHeader } from '../components/HomeHeader';
import { LotteriesSortingContextProvider } from '../context/lotteries-sorting-context';

const Home = () => {
  const [selectedLotteries, setSelectedLotteries] = useState<Array<string>>([]);
  const navigation = useNavigation<AddLotteryNavigationProp>();
  const lotteries = useLotteries();
  const isFocused = useIsFocused();
  const { storedData: registeredLotteries } = useAsyncStorage();

  useEffect(() => {
    if (isFocused) {
      lotteries.fetchLotteries();
      setSelectedLotteries([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  if (lotteries.loading) {
    return <Loader />;
  }

  const handleSelect = (lotteryId: string) => {
    setSelectedLotteries((lotteries) => {
      if (lotteries.includes(lotteryId)) {
        const index = lotteries.indexOf(lotteryId);
        return [...lotteries.slice(0, index), ...lotteries.slice(index + 1)];
      } else {
        return [...lotteries, lotteryId];
      }
    });
  };

  return (
    <LotteriesSortingContextProvider>
      <View style={styles.container}>
        <HomeHeader selectedLotteries={selectedLotteries} />
        <LotteryList
          lotteries={lotteries.data}
          loading={lotteries.loading}
          onPress={handleSelect}
          selectedLotteries={selectedLotteries}
          registeredLotteries={registeredLotteries || []}
        />
        <FAB onPress={() => navigation.navigate('AddLottery')} />
      </View>
    </LotteriesSortingContextProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingTop: 50,
  },
});
