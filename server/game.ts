import { LetterResult } from "./type";

export function evaluateGuess(answer: string, guess: string): LetterResult[] {
  const output: LetterResult[] = [];
  const used: boolean[] = Array(5).fill(false);
  const answerLower = answer.toLowerCase();
  const guessLower = guess.toLowerCase();

  const answerLetters = answerLower.split("");

  // Hit
  for (let i = 0; i < 5; i++) {
    if (guessLower[i] === answerLetters[i]) {
      output[i] = { letter: guess[i], status: "Hit" };
      used[i] = true;
    } else {
      output[i] = { letter: guess[i], status: "Miss" };
    }
  }

  // Present
  for (let i = 0; i < 5; i++) {
    if (output[i].status === "Miss") {
      const idx = answerLetters.findIndex(
        (ch, j) => ch === guessLower[i] && !used[j]
      );
      if (idx !== -1) {
        output[i].status = "Present";
        used[idx] = true;
      }
    }
  }

  return output;
}

export function selectWord(words: string[]): string {
  const pool = words.filter((w) => w.length === 5);
  return pool[Math.floor(Math.random() * pool.length)].toLowerCase();
}
