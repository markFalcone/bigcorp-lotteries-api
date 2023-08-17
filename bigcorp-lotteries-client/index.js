import { onRegisterClick } from "./src/onRegisterClick";
import { updateLotteries } from "./src/updateLotteries";

const POLLING_INVERVAL_IN_MS = 10_000;

const registerButton = document.getElementById("register");
registerButton.onclick = onRegisterClick;

updateLotteries(); // Initial lottery data fetch

setInterval(() => updateLotteries(), POLLING_INVERVAL_IN_MS); // Setting up data polling