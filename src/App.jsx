import { useState, useEffect, useCallback } from "react";
import "./styles.css";

import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import GameModal from "./components/GameModal";

import { SOLUTION, VALID_WORDS } from "./words";
import { evaluateGuess } from "./utils";

function App() {
  const [solutionWord, setSolutionWord] = useState(SOLUTION);
  const [currentGuess, setCurrentGuess] = useState("");
  const [pastGuesses, setPastGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("IN_PROGRESS");
  const [message, setMessage] = useState("");

  // Calculate colour feedback for submitted guesses
  const results = pastGuesses.map((guess) =>
    evaluateGuess(guess, solutionWord)
  );

  // Update virtual keyboard colours
  const keyboardStatus = {};

  pastGuesses.forEach((guess, index) => {
    const feedback = results[index];

    guess.split("").forEach((letter, position) => {
      const status = feedback[position];

      const priority = {
        absent: 1,
        present: 2,
        correct: 3,
      };

      if (
        !keyboardStatus[letter] ||
        priority[status] > priority[keyboardStatus[letter]]
      ) {
        keyboardStatus[letter] = status;
      }
    });
  });

  // Handle keyboard input
  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== "IN_PROGRESS") return;

    setMessage("");

    if (key === "BACKSPACE") {
      setCurrentGuess((previous) => previous.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        setMessage("Enter a five-letter word!");
        return;
      }

      if (!VALID_WORDS.includes(currentGuess)) {
        setMessage("Not a valid word!");
        return;
      }

      const updatedGuesses = [...pastGuesses, currentGuess];

      setPastGuesses(updatedGuesses);
      setCurrentGuess("");

      if (currentGuess === solutionWord) {
        setGameStatus("WON");
      } else if (updatedGuesses.length === 6) {
        setGameStatus("LOST");
      }

      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((previous) => previous + key);
    }
  }, [gameStatus, currentGuess, pastGuesses, solutionWord]);

  // Listen to physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      if (event.key === "Enter") {
        handleKeyPress("ENTER");
      } else if (event.key === "Backspace") {
        handleKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  // Restart the game
  const restartGame = () => {
    setSolutionWord(SOLUTION);
    setCurrentGuess("");
    setPastGuesses([]);
    setGameStatus("IN_PROGRESS");
    setMessage("");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>WORDLE</h1>
        <p>Guess the five-letter word!</p>
      </header>

      {message && <div className="message">{message}</div>}

      <GameBoard
        guesses={pastGuesses}
        currentGuess={currentGuess}
        results={results}
      />

      <Keyboard
        onKeyPress={handleKeyPress}
        keyboardStatus={keyboardStatus}
      />

      <GameModal
        status={gameStatus}
        solution={solutionWord}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;