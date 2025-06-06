import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { Users, Play, Copy, Check, Wifi, Settings, Home } from "lucide-react";
import Leaderboard from "./Leaderboard";

const HostWaitingRoom = () => {
  const { socket, gameState } = useSocket();
  const { roomCode, players, maxPlayers } = gameState;
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (socket && roomCode) {
      socket.emit("host-join-room", { roomCode });

      // Listen for room state updates
      socket.on("room-state", ({ isGameStarted: gameStarted }) => {
        setIsGameStarted(gameStarted);
      });

      // Listen for game started event
      socket.on("game-started", () => {
        setIsGameStarted(true);
        setIsStarting(false);
      });

      return () => {
        socket.off("room-state");
        socket.off("game-started");
      };
    }
  }, [socket, roomCode]);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room code:", err);
    }
  };

  const startGame = () => {
    if (socket && players.length >= 1 && !isGameStarted) {
      setIsStarting(true);
      socket.emit("start-game", { roomCode });

      // Reset starting state after a delay if game doesn't start
      setTimeout(() => {
        if (!isGameStarted) {
          setIsStarting(false);
        }
      }, 5000);
    }
  };

  const getPlayerStatusColor = () => {
    if (players.length === 0) return "text-gray-400";
    if (players.length < 2) return "text-yellow-400";
    if (players.length >= maxPlayers) return "text-green-400";
    return "text-blue-400";
  };

  const getReadyStatus = () => {
    if (isGameStarted) return "Game in progress...";
    if (players.length === 0) return "Waiting for players...";
    if (players.length === 1) return "Need at least 1 more player";
    return "Ready to start!";
  };

  const getRoomStatus = () => {
    if (isGameStarted) return "In Game";
    if (players.length >= maxPlayers) return "Full";
    return "Live";
  };

  const getRoomStatusColor = () => {
    if (isGameStarted) return "text-orange-400";
    if (players.length >= maxPlayers) return "text-red-400";
    return "text-green-400";
  };
  const handleClick = () => {
    window.open("/create", "_blank");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              onClick={handleClick}
              className="w-50 h-12 cursor-pointer text-white hover:text-black hover:bg-blue-400  bg-blue-300 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Home className="w-4 h-4 text-white" />
              <span className="text-md ml-1.5">Create Another Room</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
          </div>
          <p className="text-white/70 text-lg">
            Manage your game room and players
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Room Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Game Room
                </h2>

                {/* Room Code Display */}
                <div className="relative">
                  <div className="bg-black/30 rounded-xl p-6 mb-4 border-2 border-dashed border-white/30">
                    <div className="text-5xl font-mono font-bold text-white tracking-[0.3em] mb-2">
                      {roomCode}
                    </div>
                    <button
                      onClick={copyRoomCode}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white text-sm font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-white/70">
                    {isGameStarted
                      ? "Game is in progress - no new players can join"
                      : "Share this code with players to join"}
                  </p>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-white/70" />
                      <span className="text-white/70 font-medium">Players</span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getPlayerStatusColor()}`}
                    >
                      {players.length} / {maxPlayers}
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <span className="text-white/70 font-medium">Status</span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getRoomStatusColor()}`}
                    >
                      {getRoomStatus()}
                    </div>
                  </div>
                </div>

                {/* Ready Status */}
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                  <p className={`font-medium ${getPlayerStatusColor()}`}>
                    {getReadyStatus()}
                  </p>
                </div>

                {/* Start Game Button - Only show if game hasn't started */}
                {!isGameStarted && (
                  <div className="mt-8">
                    <button
                      onClick={startGame}
                      disabled={players.length < 1 || isStarting}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                               disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
                               rounded-xl font-bold text-white text-lg transition-all duration-300 
                               flex items-center justify-center gap-3 shadow-lg
                               transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isStarting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Starting Game...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Start Game
                        </>
                      )}
                    </button>
                    {players.length < 1 && (
                      <p className="text-white/50 text-sm mt-2">
                        Need at least 1 player to start
                      </p>
                    )}
                  </div>
                )}

                {/* Game Started Message */}
                {isGameStarted && (
                  <div className="mt-8 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                    <div className="flex items-center justify-center gap-2 text-orange-400">
                      <Play className="w-5 h-5" />
                      <span className="font-semibold">
                        Game is now in progress!
                      </span>
                    </div>
                    <p className="text-orange-300/80 text-sm mt-2">
                      Players are currently answering questions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <Leaderboard players={players} />
          </div>
        </div>

        {/* Instructions Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            {isGameStarted ? "Game Status:" : "How to Start:"}
          </h3>
          <div className="space-y-2 text-white/70">
            {isGameStarted ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold">
                    ⚡
                  </div>
                  <span>Game is currently running</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold">
                    🚫
                  </div>
                  <span>New players cannot join during the game</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold">
                    📊
                  </div>
                  <span>Monitor player progress in the leaderboard</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">
                    1
                  </div>
                  <span>Share the room code with your players</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">
                    2
                  </div>
                  <span>Wait for players to join (minimum 1 required)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">
                    3
                  </div>
                  <span>Click "Start Game" when ready</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostWaitingRoom;
