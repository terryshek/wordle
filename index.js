const readline = require("readline");
// ================= Configuration =================
const config = {
  wordList: [
    "hello",
    "world",
    "quite",
    "fancy",
    "fresh",
    "panic",
    "crazy",
    "buggy",
    "scare",
  ],
  maxRounds: 6,
  players: ["Terry1", "Terry2"], // Add more names to support more players
};

// Pick a shared answer (same across players)
const answer =
  config.wordList[
    Math.floor(Math.random() * config.wordList.length)
  ].toLowerCase();

let gameOver = false;
let round = 1;

// Store each player's guesses and result
const players = config.players.map((name) => ({
  name,
  guesses: [],
  solved: false,
}));

// ================= Terminal Setup =================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ================= Utility Functions =================

function evaluateGuess(answer, guess) {
  const result = [];
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const usedIndices = new Set();

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = { status: "Hit", letter: guessArr[i] };
      usedIndices.add(i);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (!result[i]) {
      let found = false;
      for (let j = 0; j < 5; j++) {
        if (!usedIndices.has(j) && guessArr[i] === answerArr[j]) {
          result[i] = { status: "Present", letter: guessArr[i] };
          usedIndices.add(j);
          found = true;
          break;
        }
      }
      if (!found) {
        result[i] = { status: "Miss", letter: guessArr[i] };
      }
    }
  }

  return result;
}

function displayResult(result) {
  return result
    .map(({ status, letter }) => {
      if (status === "Hit")
        return `\x1b[42m\x1b[97m ${letter.toUpperCase()} \x1b[0m`; // Green
      if (status === "Present") return `\x1b[43m\x1b[30m ${letter} \x1b[0m`; // Yellow
      return `\x1b[100m\x1b[37m ${letter} \x1b[0m`; // Gray
    })
    .join(" ");
}

function showScoreboard() {
  console.log(`\n📊 Current Scoreboard:`);
  for (const player of players) {
    console.log(
      `${player.name}: ${player.guesses
        .map((g) => displayResult(g.feedback))
        .join(" / ")}`
    );
  }
  console.log(""); // spacing
}

// ================= Main Game Logic =================

function playRound(playerIndex = 0) {
  if (gameOver || round > config.maxRounds) {
    showFinalResult();
    rl.close();
    return;
  }

  const player = players[playerIndex];

  if (player.solved) {
    // skip to next player
    const nextIndex = (playerIndex + 1) % players.length;
    if (nextIndex === 0) round++;
    return playRound(nextIndex);
  }

  rl.question(
    `${player.name}, Round ${round} — Enter your guess: `,
    (input) => {
      const guess = input.trim().toLowerCase();

      if (guess.length !== 5 || !/^[a-z]{5}$/.test(guess)) {
        console.log(
          "⚠️ Invalid input. Please enter a 5-letter English word.\n"
        );
        return playRound(playerIndex);
      }

      if (!config.wordList.includes(guess)) {
        console.log("📛 This word is not in the dictionary.\n");
        return playRound(playerIndex);
      }

      const feedback = evaluateGuess(answer, guess);
      player.guesses.push({ guess, feedback });

      console.log(
        `🧩 Feedback for ${player.name}:`,
        displayResult(feedback),
        "\n"
      );

      if (guess === answer) {
        player.solved = true;
        gameOver = true;
        console.log(
          `🎉 ${player.name} guessed the word correctly in round ${round}!`
        );
        return showFinalResult();
      }

      const nextIndex = (playerIndex + 1) % players.length;
      if (nextIndex === 0) round++;

      playRound(nextIndex);
    }
  );
}

// ================= Final Result =================

function showFinalResult() {
  console.log(`📦 The correct word was: ${answer.toUpperCase()}`);
  showScoreboard();

  const winners = players.filter((p) => p.solved);
  if (winners.length === 0) {
    console.log("😢 No one guessed the word. Better luck next time.");
  } else if (winners.length === 1) {
    console.log(`🏆 Winner: ${winners[0].name}`);
  } else {
    console.log(`🤝 Tie between: ${winners.map((p) => p.name).join(", ")}`);
  }
}

// ================= Game Intro =================

console.log(`🔠 Welcome to Multiplayer Wordle!`);
console.log(`👥 Players: ${config.players.join(", ")}`);
console.log(`📝 The secret word has been chosen. It is a 5-letter word.`);
console.log(`📖 Rules:`);
console.log(`🟩 = correct letter & position`);
console.log(`🟨 = correct letter but wrong position`);
console.log(`⬛ = letter not in the word`);
console.log(`🎯 Each player has up to ${config.maxRounds} rounds\n`);

// Start Game
playRound();
