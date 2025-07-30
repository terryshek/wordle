import { useState } from "react";
import type { LetterResult } from "./type";

function App() {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<LetterResult[][]>([]);
  const [victory, setVictory] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const maxRounds = 6;

  const submitGuess = async () => {
    if (guess.length !== 5) {
      alert("Guess must be 5 letters!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess }),
      });
      const data = await res.json();

      if (res.ok) {
        setHistory((prev) => [...prev, data.result]);
        setVictory(data.correct);
        setGameOver(!data.correct && history.length + 1 >= maxRounds);
        setGuess("");
      } else {
        alert(data.error || "Error occurred");
      }
    } catch {
      alert("Network error");
    }
  };

  const resetGame = () => {
    fetch("http://localhost:3001/api/new-game");
    setGuess("");
    setHistory([]);
    setVictory(false);
    setGameOver(false);
  };

  const getBoxColor = (status: string) => {
    switch (status) {
      case "Hit":
        return "bg-green-600 text-white";
      case "Present":
        return "bg-yellow-400 text-black";
      case "Miss":
        return "bg-gray-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-xl mx-auto mb-6">
        <ul className="list-disc list-inside space-y-1 text-left">
          <h2 className="text-2xl font-bold mb-2">
            🔠 Welcome to the Wordle-style guessing game!
          </h2>
          <li>
            <span className="font-semibold">5-letter word</span>.
          </li>
          <li>
            📖 <span className="underline">Rules:</span>
          </li>
          <li>
            <span className="inline-block bg-green-600 text-white px-2 py-0.5 rounded">
              🟩
            </span>{" "}
            = correct position and letter
          </li>
          <li>
            <span className="inline-block bg-yellow-400 text-black px-2 py-0.5 rounded">
              🟨
            </span>{" "}
            = correct letter, wrong position
          </li>
          <li>
            🎯 You have <span className="font-bold">{maxRounds}</span> chances
            to guess the word.
          </li>
        </ul>
      </div>

      <div className="space-y-2 mb-4">
        {history.map((line, idx) => (
          <div key={idx} className="flex justify-center gap-2">
            {line.map((item, i) => (
              <div
                key={i}
                className={`w-14 h-14 text-2xl font-bold flex items-center justify-center rounded ${getBoxColor(
                  item.status
                )}`}
              >
                {item.letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!victory && !gameOver && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={guess}
            maxLength={5}
            onChange={(e) => setGuess(e.target.value)}
            className="uppercase border border-gray-400 rounded px-4 py-2 text-lg tracking-widest"
            placeholder="Enter word"
          />
          <button
            onClick={submitGuess}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      )}

      {victory && <h2 className="text-2xl text-green-600 mb-2">🎉 You Win!</h2>}
      {gameOver && !victory && (
        <h2 className="text-2xl text-red-500 mb-2">😢 Game Over.</h2>
      )}

      {(victory || gameOver) && (
        <button
          onClick={resetGame}
          className="mt-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition"
        >
          New Game
        </button>
      )}
    </div>
  );
}

export default App;
