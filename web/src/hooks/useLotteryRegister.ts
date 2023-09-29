import { useState } from 'react';
import * as LotteryService from '../services/lottery';

export default function useLotteryRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const registerToLotteries = ({
    name,
    lotteries,
  }: {
    name: string;
    lotteries: Array<string>;
  }) => {
    setLoading(true);
    setError(undefined);

    return Promise.all(
      lotteries.map((lotteryId) =>
        LotteryService.registerToLottery({ name, lotteryId }),
      ),
    )
      .then(() => {
        setLoading(false);
      })
      .catch((e: Error) => {
        setLoading(false);
        setError(e.message);

        throw e;
      });
  };

  return {
    loading,
    error,
    registerToLotteries,
  };
}
