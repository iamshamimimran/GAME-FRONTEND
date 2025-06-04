import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const GameScreen = () => {
  const { socket, gameState } = useSocket();
  const {
    roomCode,
    currentQuestion,
    timeLeft,
    timerActive,
    questionIndex,
    totalQuestions,
    playerScore,
    selectedAnswer,
    correctAnswer,
    answerSubmitted,
  } = gameState;

  const submitAnswer = (answer) => {
    // Prevent multiple submissions
    if (answerSubmitted || !socket || timeLeft <= 0) return;

    socket.emit("submit-answer", {
      roomCode,
      name: gameState.playerName,
      answer,
    });
  };

  if (!currentQuestion) {
    return (
      <div className="card bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-2xl mx-auto text-center">
        <h2 className="text-2xl mb-4">Loading next question...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-4xl mx-auto">
      <div className="status-bar bg-black/20 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          Room: <span className="font-bold">{roomCode}</span>
        </div>
        <div>
          Question: <span className="font-bold">{questionIndex + 1}</span>/
          <span className="font-bold">{totalQuestions}</span>
        </div>
        <div>
          Score: <span className="font-bold">{playerScore}</span>
        </div>
      </div>

      <div className="question-container">
        <div className="question-header flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Question</h2>
          <div
            className={`timer text-2xl font-bold px-6 py-2 rounded-full ${
              timeLeft <= 5 ? "bg-red-500/50 animate-pulse" : "bg-black/20"
            }`}
          >
            {timeLeft}s
          </div>
        </div>

        <div className="question-text bg-black/20 rounded-lg p-6 mb-8 text-xl">
          {currentQuestion.question}
        </div>

        {/* Show submission status */}
        {answerSubmitted && !correctAnswer && (
          <div className="mb-4 p-3 bg-blue-500/30 rounded-lg text-center">
            Answer submitted! Waiting for other players...
          </div>
        )}

        {/* Show correct answer when revealed */}
        {correctAnswer && (
          <div className="mb-4 p-3 bg-green-500/30 rounded-lg text-center">
            Correct Answer: <span className="font-bold">{correctAnswer}</span>
          </div>
        )}

        <div className="options-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = correctAnswer === option;
            const showResults = correctAnswer !== null;
            const isDisabled = answerSubmitted || timeLeft <= 0;

            return (
              <button
                key={index}
                onClick={() => submitAnswer(option)}
                disabled={isDisabled}
                className={`option-btn text-left p-4 rounded-lg transition-all ${
                  isSelected
                    ? showResults
                      ? isCorrect
                        ? "bg-green-500/70"
                        : "bg-red-500/70"
                      : "bg-blue-500/50"
                    : showResults && isCorrect
                    ? "bg-green-500/50"
                    : isDisabled
                    ? "bg-white/5 opacity-60 cursor-not-allowed"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-3 font-bold text-lg">
                    {String.fromCharCode(65 + index)}.
                  </div>
                  <div className="flex-1">{option}</div>
                  {isSelected && !showResults && (
                    <div className="ml-2 text-blue-300">✓</div>
                  )}
                  {showResults && isCorrect && (
                    <div className="ml-2 text-green-300">✓</div>
                  )}
                  {showResults && isSelected && !isCorrect && (
                    <div className="ml-2 text-red-300">✗</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Timer progress bar */}
        <div className="mt-6">
          <div className="w-full bg-black/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeLeft <= 5 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
