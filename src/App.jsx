// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SocketProvider } from "./context/SocketContext";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import HostWaitingRoom from "./components/HostWaitingRoom";
import PlayerWaitingRoom from "./components/PlayerWaitingRoom";
import GameScreen from "./components/GameScreen";
import GameOver from "./components/GameOver";
import { useSocket } from "./context/SocketContext";
import GenerateFromPdf from "./pages/GenerateFromPdf";
import GenerateFromPrompt from "./pages/GenerateFromPrompt";
import QuizLandingPage from "./pages/QuizLandingPage";

const AppContent = () => {
  const { gameState } = useSocket();
  const {
    roomCode,
    isHost,
    players,
    currentQuestion,
    correctAnswer,
    gameOver,
  } = gameState;

  if (gameOver && !isHost) return <GameOver />;
  if (currentQuestion && !isHost) return <GameScreen />;
  if (roomCode && isHost) return <HostWaitingRoom />;
  if (roomCode && players.length > 0) return <PlayerWaitingRoom />;

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <CreateRoom />
      <JoinRoom />
    </div>
  );
};

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
          <Routes>
            <Route path="/game" element={<AppContent />} />
            <Route path="/" element={<QuizLandingPage />} />
            <Route path="/g-pdf" element={<GenerateFromPdf />} />
            <Route path="/g-prompt" element={<GenerateFromPrompt />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
