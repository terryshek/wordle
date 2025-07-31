
const constants = require("./constants.js");

// Create input interface
const rl = constants.rl
// Game settings
const config = constants.config;
// Pick a random answer from the list
const answer = constants.answer;

let currentRound = 0;

console.log(`🔠 Welcome to the Wordle-style guessing game!`);
console.log(`📝 The secret word has been chosen. It is a 5-letter word.`);
console.log(`📖 Here are the rules:`);
console.log("Hit Character in 🟩 means you guessed it right.");
console.log(
  "Present Character in 🟨 means it is in the word but in the wrong position."
);
console.log(
  `🎯 You have ${config.maxRounds} chances to guess the 5-letter word. Good luck!\n`
);

// Evaluate guess against the correct answer
function evaluateGuess(answer, guess) {
  const result = [];
  const answerArr = answer.split("");
  const guessArr = guess.split("");

  const usedIndices = new Set();

  // Step 1: Check for Hits
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = { status: "Hit", letter: guessArr[i] };
      usedIndices.add(i);
    }
  }

  // Step 2: Check for Present or Miss
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

// Format feedback result for user
function displayResult(result) {
  return result
    .map(({ status, letter }) => {
      if (status === "Hit")
        // green background, white text
        return `\x1b[42m\x1b[97m ${letter.toUpperCase()} \x1b[0m`;
      if (status === "Present")
        // yellow background, black text
        return `\x1b[43m\x1b[30m ${letter} \x1b[0m`;
      return ` ${letter} `; // default, no color
    })
    .join(" ");
}

// Main game loop
function askGuess() {
  if (currentRound >= config.maxRounds) {
    console.log(`❌ Game over! The correct word was: ${answer.toUpperCase()}`);
    rl.close();
    return;
  }

  rl.question(
    `Round ${currentRound + 1} — Enter your 5-letter guess: `,
    (input) => {
      const guess = input.trim().toLowerCase();

      // Input validation
      if (guess.length !== 5 || !/^[a-z]{5}$/.test(guess)) {
        console.log("⚠️ Please enter a valid 5-letter English word.\n");
        askGuess();
        return;
      }

      if (!config.wordList.includes(guess)) {
        console.log("📛 That word is not in the dictionary. Try another.\n");
        askGuess();
        return;
      }

      currentRound++;
      const result = evaluateGuess(answer, guess);
      console.log("🧩 Feedback: ", displayResult(result), "\n");

      if (guess === answer) {
        console.log(
          `🎉 Congratulations! You guessed the word in ${currentRound} round(s). Answer: ${answer.toUpperCase()}`
        );
        rl.close();
        return;
      }

      askGuess();
    }
  );
}

// Start the game
askGuess();
