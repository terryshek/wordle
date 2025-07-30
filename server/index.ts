import express from "express";
import cors from "cors";
import { evaluateGuess, selectWord } from "./game";
import { wordList } from "./wordlist";

const app = express();
app.use(cors());
app.use(express.json());

let answer = selectWord(wordList);
const maxRounds = 6;

app.get("/api/new-game", (req, res) => {
  answer = selectWord(wordList);
  res.json({ message: "Game restarted!", maxRounds });
});

app.post("/api/guess", (req, res) => {
  const { guess } = req.body;
  if (!guess || typeof guess !== "string" || guess.length !== 5) {
    return res.status(400).json({ error: "Invalid guess" });
  }
  const evaluation = evaluateGuess(answer, guess);
  const isCorrect = guess.toLowerCase() === answer;
  res.json({ result: evaluation, correct: isCorrect });
});

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
