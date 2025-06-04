import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
// import { joinGameRoom } from "../services/api";

const JoinRoom = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket, updateGameState } = useSocket();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playerName.trim()) return alert("Please enter your name");
    if (!roomCode.trim() || roomCode.length !== 6) {
      return alert("Please enter a valid 6-character room code");
    }

    setLoading(true);

    try {
      const upperRoomCode = roomCode.toUpperCase();

      // Emit to socket FIRST
      if (socket) {
        socket.emit("join-room", {
          name: playerName,
          roomCode: upperRoomCode,
        });
      } else {
        console.warn("Socket not connected yet");
      }

      // THEN call API
      // const response = await joinGameRoom(playerName, upperRoomCode);

      updateGameState({
        playerName,
        roomCode: upperRoomCode,
        players: [],
        maxPlayers: null,
      });
    } catch (error) {
      alert(error.message || "Failed to join room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Join Game Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="block mb-2 font-medium">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/90 text-black"
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 font-medium">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-full p-3 rounded-lg bg-white/90 text-black uppercase tracking-widest font-mono"
            placeholder="Enter room code"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg font-bold text-white hover:from-orange-600 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {loading ? "Joining Room..." : "Join Room"}
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
