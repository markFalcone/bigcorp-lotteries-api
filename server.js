const express = require("express");
const redis = require("redis");
const ulid = require("ulid");

// Redis setup

const { REDIS_URL } = process.env;
const client = redis.createClient({ url: REDIS_URL });
// This is going to write any Redis error to console.
client.on("error", (error) => {
  console.error(error);
});

// Express setup

const app = express();
const port = 3000;
app.use(express.json({ limit: "10kb" }));

// API routes
app.get("/lotteries", async (req, res) => {
  try {
    const lotteryIds = await client.lRange("lotteries", 0, -1);

    const transaction = client.multi();
    lotteryIds.forEach((id) => transaction.hGetAll(`lottery.${id}`));
    const lotteries = await transaction.exec();

    res.json(lotteries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read the lotteries data" });
  }
});

app.post("/lotteries", async (req, res) => {
  const { type, name, prize } = req.body;

  if (type !== "simple") {
    res.status(422).json({ error: "Invalid lottery type" });
    return;
  }

  if (typeof name !== "string" || name.length < 3) {
    res.status(422).json({ error: "Invalid lottery name" });
    return;
  }

  if (typeof prize !== "string" || prize.length < 3) {
    res.status(422).json({ error: "Invalid lottery prize" });
    return;
  }

  const id = ulid.ulid();
  const newLottery = { // Create a new lottery object
    id,
    name,
    prize,
    type,
    status: "running",
  };

  try {
    await client
      .multi() // multi() starts a transaction
      .hSet(`lottery.${id}`, newLottery) // hSet() sets a hash field they key is lottery.id and the value is the newLottery object
      .lPush("lotteries", id) // lPush() pushes an element to a list
      .exec(); // exec() executes the transaction
    res.json(newLottery); // Send the new lottery as the response.
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create the lottery" });
  }
});

app.get("/lottery/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const lottery = await client.hGetAll(`lottery.${id}`); // hGetAll() gets all the fields and values of a hash

    if (!Object.keys(lottery).length) { // If the lottery object is empty, it means that the lottery with the given ID does not exist.
      res
        .status(404)
        .json({ error: "A lottery with the given ID does not exist" });
      return;
    }

    res.json(lottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read the lottery data" });
  }
});

app.post("/lotteries", async (req, res) => {
  const { type, name, prize } = req.body;

  if (type !== "simple") {
    res.status(422).json({ error: "Invalid lottery type" });
    return;
  }

  if (typeof name !== "string" || name.length < 3) {
    res.status(422).json({ error: "Invalid lottery name" });
    return;
  }

  if (typeof prize !== "string" || prize.length < 3) {
    res.status(422).json({ error: "Invalid lottery prize" });
    return;
  }

  const id = ulid.ulid();
  const newLottery = {
    id,
    name,
    prize,
    type,
    status: "running",
  };

  try {
    await client
      .multi()
      .hSet(`lottery.${id}`, newLottery)
      .lPush("lotteries", id)
      .exec();

    res.json(newLottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create the lottery" });
  }
});








// Server start

app.listen(port, async () => {
  await client.connect();
  console.log(`Server listening on port ${port}`);
});