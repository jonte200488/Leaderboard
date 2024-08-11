const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/leaderboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schemas
const playerSchema = new mongoose.Schema({
  name: String,
  image: String,
  points: Number,
});

const gameSchema = new mongoose.Schema({
  player1: String,
  player1Points: Number,
  player2: String,
  player2Points: Number,
});

const Player = mongoose.model("Player", playerSchema);
const Game = mongoose.model("Game", gameSchema);

// REST API Endpoints
app.get("/players", async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

app.post("/players", async (req, res) => {
  const player = new Player(req.body);
  await player.save();
  res.json(player);
});

app.delete("/players/:id", async (req, res) => {
  await Player.findByIdAndDelete(req.params.id);
  res.json({ message: "Player deleted" });
});

app.get("/games", async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

app.post("/games", async (req, res) => {
  const game = new Game(req.body);
  await game.save();
  res.json(game);
});

app.delete("/games/:id", async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ message: "Game deleted" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
