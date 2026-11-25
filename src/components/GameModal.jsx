function GameModal({ status, solution, onRestart }) {
  if (status === "IN_PROGRESS") {
    return null;
  }

  const won = status === "WON";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{won ? "Congratulations!" : "Game Over!"}</h2>

        <p>
          {won
            ? "You guessed the correct word!"
            : `The correct word was ${solution}.`}
        </p>

        <button onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameModal;