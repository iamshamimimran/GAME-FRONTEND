import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    roomCode: "",
    playerName: "",
    isHost: false,
    players: [],
    maxPlayers: 4,
    currentQuestion: null,
    selectedAnswer: null,
    timeLeft: 20,
    timerActive: false,
    questionIndex: 0,
    totalQuestions: 0,
    playerScore: 0,
    leaderboard: [],
    correctAnswer: null,
    gameOver: false,
    gameStarted: false,
    answerSubmitted: false,
  });

  useEffect(() => {
    const newSocket = io("https://game-backend-iipb.onrender.com");
    // const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Event listeners
    newSocket.on("players-update", (players) => {
      console.log("Players updated:", players);
      setGameState((prev) => ({
        ...prev,
        players: players.filter((p) => p.socketId),
        maxPlayers: prev.maxPlayers || 4,
      }));
    });

    newSocket.on("game-started", () => {
      setGameState((prev) => ({ ...prev, gameStarted: true }));
    });

    newSocket.on("new-question", (questionData) => {
      const startTime = questionData.startTime;
      const timeLimit = questionData.timeLimit;
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      const initialTimeLeft = Math.max(0, timeLimit - elapsed);

      setGameState((prev) => ({
        ...prev,
        currentQuestion: {
          question: questionData.question,
          options: questionData.options,
        },
        questionIndex: questionData.index,
        totalQuestions: questionData.totalQuestions,
        selectedAnswer: null,
        correctAnswer: null,
        timerActive: true,
        timeLeft: initialTimeLeft,
        answerSubmitted: false,
      }));
    });

    // Use server timer updates for better sync
    newSocket.on("timer-update", ({ timeLeft }) => {
      setGameState((prev) => ({
        ...prev,
        timeLeft,
        timerActive: timeLeft > 0,
      }));
    });

    newSocket.on("answer-submitted", ({ answer }) => {
      setGameState((prev) => ({
        ...prev,
        selectedAnswer: answer,
        answerSubmitted: true,
      }));
    });

    newSocket.on("show-answer", (data) => {
      setGameState((prev) => ({
        ...prev,
        correctAnswer: data.correctAnswer,
        players: data.players,
        timerActive: false,
      }));
    });

    newSocket.on("update-leaderboard", (players) => {
      setGameState((prev) => {
        const currentPlayer = players.find((p) => p.name === prev.playerName);
        return {
          ...prev,
          players,
          playerScore: currentPlayer?.score || prev.playerScore,
        };
      });
    });

    newSocket.on("game-over", (data) => {
      setGameState((prev) => ({
        ...prev,
        leaderboard: data.leaderboard,
        gameOver: true,
        timerActive: false,
      }));
    });

    newSocket.on("error", (errorMessage) => {
      alert(`Error: ${errorMessage}`);
    });

    return () => newSocket.disconnect();
  }, []);

  const updateGameState = (newState) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <SocketContext.Provider value={{ socket, gameState, updateGameState }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
