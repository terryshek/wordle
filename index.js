const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Configuration
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
};

let candidates = config.wordList.slice();
let history = [];
let currentRound = 0;

console.log(`🔠 Welcome to the Wordle-style guessing game (Cheating Mode)!`);
console.log(`📝 The host is *pretending* to choose a 5-letter word.`);
console.log(`📖 Rules:`);
console.log(`🟩 = correct letter in correct position (Hit)`);
console.log(`🟨 = correct letter in wrong position (Present)`);
console.log(`⬜ = letter not in the word (Miss)`);
console.log(
  `🎯 You have ${config.maxRounds} chances to guess the 5-letter word.\n`
);

// Evaluate guess against an answer
function evaluateGuess(answer, guess) {
  const result = Array(5).fill(null);
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = new Set();

  // First pass - Hits
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = { letter: guessArr[i], status: "Hit" };
      used.add(i);
    }
  }

  // Second pass - Present or Miss
  for (let i = 0; i < 5; i++) {
    if (!result[i]) {
      let found = false;
      for (let j = 0; j < 5; j++) {
        if (!used.has(j) && guessArr[i] === answerArr[j]) {
          result[i] = { letter: guessArr[i], status: "Present" };
          used.add(j);
          found = true;
          break;
        }
      }
      if (!found) {
        result[i] = { letter: guessArr[i], status: "Miss" };
      }
    }
  }

  return result;
}

// Display colored result
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

// Convert feedback to a string key
function feedbackKey(feedback) {
  return feedback.map((f) => f.status[0]).join(""); // e.g., "HPMMM"
}

// Scoring function: fewer Hits and Presents = lower score (harder for player)
function getScore(feedback) {
  let hit = 0,
    present = 0;
  for (const f of feedback) {
    if (f.status === "Hit") hit++;
    if (f.status === "Present") present++;
  }
  return hit * 100 + present; // Higher => more correct
}

// Return best cheating feedback and filtered candidates
function getCheatingFeedback(guess, candidates) {
  const map = {};

  for (const word of candidates) {
    const fb = evaluateGuess(word, guess);
    const key = feedbackKey(fb);
    if (!map[key]) {
      map[key] = { feedback: fb, words: [] };
    }
    map[key].words.push(word);
  }

  // Find feedback group with lowest score (to give worst feedback)
  const groups = Object.values(map);
  groups.sort((a, b) => getScore(a.feedback) - getScore(b.feedback));

  return {
    feedback: groups[0].feedback,
    newCandidates: groups[0].words,
  };
}

// Main game logic
function askGuess() {
  if (currentRound >= config.maxRounds) {
    console.log(`❌ Game over! The host never settled on a word.`);
    console.log(
      `🎭 Final remaining candidates: ${candidates
        .map((w) => w.toUpperCase())
        .join(", ")}`
    );
    rl.close();
    return;
  }

  rl.question(
    `Round ${currentRound + 1} — Enter your 5-letter guess: `,
    (input) => {
      const guess = input.trim().toLowerCase();

      if (!/^[a-z]{5}$/.test(guess)) {
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
      const { feedback, newCandidates } = getCheatingFeedback(
        guess,
        candidates
      );
      candidates = newCandidates;
      history.push({ guess, feedback });

      console.log("🧩 Feedback:", displayResult(feedback), "\n");

      // If only one candidate left and guess matches it exactly
      if (candidates.length === 1 && guess === candidates[0]) {
        console.log(
          `🎉 You forced the host to commit! The word is: ${guess.toUpperCase()}`
        );
        console.log(`You win in ${currentRound} rounds.`);
        rl.close();
        return;
      }

      askGuess();
    }
  );
}

// Start the game
askGuess();
