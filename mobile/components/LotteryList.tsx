import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LotteryDetailsNavigationProp, Lottery } from '../types';
import { colors } from '../colors';
import {
  LotteryListSortingOptions,
  useLotteriesSortingContext,
} from '../context/lotteries-sorting-context';
import SearchInput from './SearchInput';

type Props = {
  lotteries: Lottery[];
  loading: boolean;
  onPress: (id: string) => void;
  selectedLotteries: Array<string>;
  registeredLotteries: Array<string>;
  registered?: boolean;
};

const LotteryList = ({
  lotteries,
  loading,
  onPress,
  selectedLotteries,
  registeredLotteries,
}: Props) => {
  const [filter, setFilter] = useState('');
  const { width } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<LotteryDetailsNavigationProp>();

  const { selectedSorting } = useLotteriesSortingContext();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 60],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const filteredLotteries = useMemo(
    () =>
      lotteries
        ?.filter((lottery) => lottery.name.includes(filter))
        .sort((a, b) =>
          selectedSorting === LotteryListSortingOptions.Ascending
            ? Number(a.prize) - Number(b.prize)
            : Number(b.prize) - Number(a.prize),
        ),
    [filter, lotteries, selectedSorting],
  );

  const renderItem = ({ item }: { item: Lottery }) => {
    const isDisabled = item.status === 'finished';
    const selected = selectedLotteries?.includes(item.id);
    const background = isDisabled ? colors.grey : colors.secondary;
    const registered = registeredLotteries?.includes(item.id);
    return (
      <Pressable
        accessibilityRole="button"
        style={[
          styles.container,
          {
            backgroundColor: registered ? colors.lightBlue : background,
            borderColor: selected ? colors.buttonSecondary : colors.borderColor,
          },
        ]}
        onPress={() => onPress(item.id)}
        disabled={isDisabled || registered}
      >
        <View style={styles.iconsContainer}>
          {item.status === 'running' && (
            <AntDesign name="sync" size={24} color="black" />
          )}
          {item.status == 'finished' && (
            <MaterialIcons name="done" size={24} color="black" />
          )}
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.navigate('LotteryDetails', { id: item.id })}
        >
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.prize}>{item.prize}</Text>
        <Text style={styles.id}>{item.id}</Text>
      </Pressable>
    );
  };

  const SearchNoResult = () => (
    <View>
      {lotteries.length !== 0 && filteredLotteries?.length === 0 && (
        <Text style={styles.text}> No search results for `{filter}`</Text>
      )}
      {lotteries.length === 0 && !loading && (
        <View style={styles.wrapper}>
          <MaterialIcons
            name="sentiment-very-dissatisfied"
            size={24}
            color="black"
          />
          <Text style={styles.text}>There are no lotteries currently</Text>
        </View>
      )}
    </View>
  );

  const Header = () => (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          opacity,
          transform: [
            {
              scale,
            },
          ],
        },
      ]}
    >
      <View style={styles.title}>
        <Text style={styles.titleText}>Lotteries</Text>
        <MaterialIcons name="casino" size={36} color="black" />
      </View>
      <SearchInput value={filter} onSearch={(val) => setFilter(val)} />
      <SearchNoResult />
    </Animated.View>
  );

  return (
    <>
      <Animated.FlatList
        data={filteredLotteries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: width - 24 }}
        ListHeaderComponent={Header}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginBottom: 16,
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
  },
  iconsContainer: {
    alignSelf: 'flex-end',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prize: {
    fontSize: 16,
    marginBottom: 8,
  },
  id: {
    fontSize: 16,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginTop: 16,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  titleText: {
    fontSize: 36,
    marginRight: 16,
  },
});

export default LotteryList;
