import Row from "./Row";

function GameBoard({ guesses, currentGuess, results }) {
  return (
    <div className="game-board">
      {Array.from({ length: 6 }).map((_, index) => {
        const guess = guesses[index] || (
          index === guesses.length ? currentGuess : ""
        );

        return (
          <Row
            key={index}
            guess={guess}
            result={results[index]}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;