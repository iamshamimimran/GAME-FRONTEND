// src/App.jsx
import React, { useState } from "react";
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
import QuizLandingPage from "./pages/LandingPage";
import PdfQnA from "./pages/PdfQnA";
import QuizLibrary from "./pages/QuizLibrary";
// import PDFUploader from "./pages/PDFUploader";
import FileList from "./pages/FileList";
import CreateFile from "./pages/CreateFile";
import { useLocation } from "react-router";
const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;
  const { gameState } = useSocket();
  const { roomCode, isHost, players, currentQuestion, gameOver } = gameState;

  if (gameOver && !isHost) return <GameOver />;
  if (currentQuestion && !isHost) return <GameScreen />;
  if (roomCode && isHost) return <HostWaitingRoom />;
  if (roomCode && players.length > 0) return <PlayerWaitingRoom />;

  if (path === "/create") {
    return <CreateRoom />;
  }

  if (path === "/join") {
    return <JoinRoom />;
  }
};

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<QuizLandingPage />} />
            <Route path="/g-pdf" element={<GenerateFromPdf />} />
            <Route path="/g-prompt" element={<GenerateFromPrompt />} />
            <Route path="/pdf-QnA" element={<PdfQnA />} />
            <Route path="/quiz-library" element={<QuizLibrary />} />
            <Route path="/library" element={<FileList />} />
            <Route path="/create-files" element={<CreateFile />} />
            <Route path="/join" element={<AppContent />} />
            <Route path="/create" element={<AppContent />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
