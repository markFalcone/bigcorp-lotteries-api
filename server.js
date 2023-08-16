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

app.get("/", (req, res) => {
  // Send an empty object as the response.
  res.json({});
});

// Server start

app.listen(port, async () => {
  await client.connect();
  console.log(`Server listening on port ${port}`);
});