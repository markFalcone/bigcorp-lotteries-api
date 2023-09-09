import { Lottery } from '../../types';
import { appState } from './appState';

function createRow(name: string, value: string): HTMLDivElement {
  const div = document.createElement('div');
  div.textContent = `${name}: ${value}`;
  return div;
}

function getLotteryHtml(lottery: Lottery): HTMLDivElement {
  const lotteryContainer = document.createElement('div');
  lotteryContainer.id = `container-${lottery.id}`;
  lotteryContainer.className = 'lottery';

  const rows = Object.entries(lottery)
    .sort()
    .map(([key, val]) => createRow(key, val));

  lotteryContainer.append(...rows);

  if (lottery.status === 'running') {
    const checkbox = document.createElement('input');
    checkbox.id = lottery.id;
    checkbox.type = 'checkbox';
    lotteryContainer.appendChild(checkbox);
  }

  return lotteryContainer;
}

function addNewLottery(lottery: Lottery): void {
  appState.lotteries.set(lottery.id, lottery);

  const lotteriesContainer: HTMLElement | null =
    document.getElementById('lotteries');
  const lotteryHtml = getLotteryHtml(lottery);

  if (lotteriesContainer) {
    lotteriesContainer.appendChild(lotteryHtml);
  }
}

function updateExistingLottery(lottery: Lottery): void {
  const current = appState.lotteries.get(lottery.id) as Lottery;

  const currentData = JSON.stringify(Object.entries(current).sort());
  const newData = JSON.stringify(Object.entries(lottery).sort());

  // Rudimental lottery object data equality check
  if (currentData !== newData) {
    appState.lotteries.set(lottery.id, lottery);

    const lotteryContainer: HTMLElement | null = document.getElementById(
      `container-${lottery.id}`,
    );

    if (!lotteryContainer) {
      return;
    }

    lotteryContainer.innerHTML = '';
    const lotteryHtml = getLotteryHtml(lottery);
    lotteryContainer.appendChild(lotteryHtml);
  }
}

function updateLottery(lottery: Lottery): void {
  if (!appState.lotteries.has(lottery.id)) {
    addNewLottery(lottery);
  } else {
    updateExistingLottery(lottery);
  }
}

export async function updateLotteries(): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/lotteries`);
    const lotteries = await response.json();
    console.log('New lottery data:', lotteries);

    lotteries.forEach((lottery: Lottery) => updateLottery(lottery));
  } catch (e) {
    // Because JavaScript allows throwing any value, TypeScript
    // does not support declaring the type of an error
    if (e instanceof Error) {
      console.error('Error updating lotteries:', e.message);
    }
  }
}
