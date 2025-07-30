# 🧩 Wordle Game by Terry Shek (TypeScript + Node.js + React + Tailwind)

- Frontend: Vite + React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Communication via RESTful API

## 🎮 How to Play

1. The game picks a random 5-letter English word from the word list.
2. You have 6 attempts to guess the word correctly.
3. After each guess, each letter is scored:

| Color     | Status  | Meaning                                  |
| --------- | ------- | ---------------------------------------- |
| 🟩 Green  | Hit     | Correct letter in the correct position   |
| 🟨 Yellow | Present | Correct letter but in the wrong position |
| ⬛️ Gray  | Miss    | Letter not in the answer                 |

4. Guess the word within your attempts to win 🎉. Otherwise, the game ends 😢.

## 📦 Installation & Setup

### ✅ Prerequisites

- Node.js ≥ 18.x
- npm or pnpm

### 🏗️ Project Structure

## Run the game

- backend : npm dev:server
  Server running on http://localhost:3001
- fontend: cd client && npm run dev
  ➜ Local: http://localhost:5173/
