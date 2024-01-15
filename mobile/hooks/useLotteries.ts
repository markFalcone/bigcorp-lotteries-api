import { useEffect, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export default function useLotteries() {
  const [lotteries, setLotteries] = useState<Array<Lottery>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchLotteries = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const lotteriesData = await LotteryService.getLottieries();
      setLoading(false);
      setLotteries(lotteriesData);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchLotteries();
  }, []);

  return {
    data: lotteries,
    loading,
    error,
    fetchLotteries,
  };
}
