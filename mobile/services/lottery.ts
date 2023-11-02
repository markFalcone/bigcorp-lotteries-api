import { Platform } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { API_URL_IOS, API_URL_ANDROID } from '@env';
import { Lottery } from '../types';

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

export async function createNewLottery({
  name,
  prize,
}: {
  name: string;
  prize: string;
}): Promise<Lottery> {
  try {
    const response = await fetch(`${API_URL}/lotteries`, {
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

export async function getLottieries() {
  try {
    const response = await fetch(`${API_URL}/lotteries`);

    const body = (await response.json()) as Array<Lottery>;

    return body;
  } catch (e) {
    console.error(e);

    throw e;
  }
}

export async function registerToLottery({
  name,
  lotteryId,
}: {
  name: string;
  lotteryId: string;
}) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, lotteryId }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (e) {
    console.error(e);

    throw e;
  }
}
