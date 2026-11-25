export function evaluateGuess(guess, solution) {
    const result = Array(5).fill("absent");
    const solutionLetters = solution.split("");

    // First check letters in the correct position
    for (let i = 0; i < 5; i++) {
        if (guess[i] === solution[i]) {
            result[i] = "correct";
            solutionLetters[i] = null;
        }
    }

    // Then check letters in the wrong position
    for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;

        const index = solutionLetters.indexOf(guess[i]);

        if (index !== -1) {
            result[i] = "present";
            solutionLetters[index] = null;
        }
    }

    return result;
}