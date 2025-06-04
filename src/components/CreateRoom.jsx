import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { createGameRoom } from "../services/api";

const CreateRoom = () => {
  const { socket, updateGameState } = useSocket();
  const [hostName, setHostName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      // 🎯 Create room via API
      const response = await createGameRoom(hostName, Number(maxPlayers));
      const { room } = response;

      // 🧠 Save to context
      updateGameState({
        playerName: hostName,
        isHost: true,
        hostId: response.room.hostId,
        roomCode: response.room.roomCode,
        players: response.room.players || [],
        maxPlayers: response.room.maxPlayers,
      });

      socket.emit("host-join-room", { roomCode: room.roomCode });
    } catch (error) {
      alert("❌ Failed to create room: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Game Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="block mb-2 font-medium">Your Name (Host)</label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/90 text-black"
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 font-medium">Max Players</label>
          <select
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-white/90 text-black"
          >
            {[2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num} Players
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg font-bold text-white hover:from-orange-600 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {loading ? "Creating Room..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
