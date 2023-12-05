import { useState } from 'react';
import * as LotteryService from '../services/lottery';
import useAsyncStorage from '../hooks/useAsyncStorage';

export default function useLotteryRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { storeData } = useAsyncStorage();

  const registerToLotteries = async ({
    name,
    lotteries,
  }: {
    name: string;
    lotteries: Array<string>;
  }) => {
    setLoading(true);
    setError(undefined);

    try {
      const registerToLottery = await Promise.all(
        lotteries.map((lotteryId) =>
          LotteryService.registerToLottery({ name, lotteryId }),
        ),
      );

      setLoading(false);
      storeData(lotteries);
      return registerToLottery;
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  };

  return {
    loading,
    error,
    registerToLotteries,
  };
}
