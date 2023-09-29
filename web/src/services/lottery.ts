import { Lottery } from '../types';

export async function createNewLottery({
  name,
  prize,
}: {
  name: string;
  prize: string;
}): Promise<Lottery> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/lotteries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'simple',
        name,
        prize,
      }),
    });

    const body = (await response.json()) as Lottery;

    return body;
  } catch (e) {
    console.error(e);

    throw e;
  }
}