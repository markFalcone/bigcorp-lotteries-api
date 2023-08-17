import { appState } from "./appState";

function createRow(name, value) {
  const div = document.createElement("div");
  div.textContent = `${name}: ${value}`;
  return div;
}

function getLotteryHtml(lottery) {
  const lotteryContainer = document.createElement("div");
  lotteryContainer.id = `container-${lottery.id}`;
  lotteryContainer.className = "lottery";

  const rows = Object.entries(lottery)
    .sort()
    .map(([key, val]) => createRow(key, val));

  lotteryContainer.append(...rows);

  if (lottery.status === "running") {
    const checkbox = document.createElement("input");
    checkbox.id = lottery.id;
    checkbox.type = "checkbox";
    lotteryContainer.appendChild(checkbox);
  }

  return lotteryContainer;
}

function addNewLottery(lottery) {
  appState.lotteries.set(lottery.id, lottery);

  const lotteriesContainer = document.getElementById("lotteries");
  const lotteryHtml = getLotteryHtml(lottery);
  lotteriesContainer.appendChild(lotteryHtml);
}

function updateExistingLottery(lottery) {
  const current = appState.lotteries.get(lottery.id);

  const currentData = JSON.stringify(Object.entries(current).sort());
  const newData = JSON.stringify(Object.entries(lottery).sort());

  // Rudimental lottery object data equality check
  if (currentData !== newData) {
    appState.lotteries.set(lottery.id, lottery);

    const lotteryContainer = document.getElementById(`container-${lottery.id}`);
    lotteryContainer.innerHTML = "";
    const lotteryHtml = getLotteryHtml(lottery);
    lotteryContainer.appendChild(lotteryHtml);
  }
}

function updateLottery(lottery) {
  if (!appState.lotteries.has(lottery.id)) {
    addNewLottery(lottery);
  } else {
    updateExistingLottery(lottery);
  }
}

export async function updateLotteries() {
  // TODO: Obtain the lottery data from the GET /lotteries endpoint.
  // 1. Use the `fetch` API to make the request.
  // 2. Update each lottery using the `updateLottery` function above.
}