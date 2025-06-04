import React from "react";
import { useSocket } from "../context/SocketContext";
import Leaderboard from "./Leaderboard";

const GameOver = () => {
  const { gameState, updateGameState } = useSocket();
  const { leaderboard } = gameState;

  const resetGame = () => {
    updateGameState({
      roomCode: "",
      playerName: "",
      isHost: false,
      players: [],
      currentQuestion: null,
      selectedAnswer: null,
      timeLeft: 20,
      timerActive: false,
      questionIndex: 0,
      totalQuestions: 10,
      playerScore: 0,
      leaderboard: [],
      correctAnswer: null,
      gameOver: false,
    });
  };

  return (
    <div className="card p-6 max-w-full mx-auto">
      <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
        Game Over!
      </h1>

      <div className="mb-10">
        <Leaderboard players={leaderboard} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={resetGame}
          className="py-3 px-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-bold text-white hover:from-purple-600 hover:to-indigo-700 transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
