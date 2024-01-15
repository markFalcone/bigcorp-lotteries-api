import { useEffect, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export function useLotteryDetails(lotteryId: string) {
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchLottery = async (id: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const data = await LotteryService.getLotteryById(id);
      setLoading(false);
      setLottery(data);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchLottery(lotteryId);
  }, [lotteryId]);

  return {
    data: lottery,
    loading,
    error,
    fetchLottery,
  };
}
