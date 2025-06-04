import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { createGameRoom } from "../services/api";

const CreateRoom = () => {
  const { socket, updateGameState } = useSocket();
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [mcqSets, setMcqSets] = useState([]);
  const [selectedMcqSet, setSelectedMcqSet] = useState("");
  const [loading, setLoading] = useState(false);

  // Decode token to get hostId
  const getHostIdFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload._id;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchMcqs = async () => {
      try {
        const res = await fetch(
          "https://game-backend-iipb.onrender.com/api/mcqs"
        );
        const data = await res.json();
        setMcqSets(data);
        if (data.length > 0) setSelectedMcqSet(data[0]._id);
      } catch (error) {
        console.error("Failed to fetch MCQ sets:", error);
      }
    };

    fetchMcqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMcqSet) return alert("Please select an MCQ set");

    // const hostId = getHostIdFromToken();
    const hostId = "683ed21d42694eec82216113";
    if (!hostId) return alert("Invalid or missing token. Please login again.");

    setLoading(true);

    try {
      const response = await createGameRoom(hostId, selectedMcqSet, maxPlayers);
      const { room } = response;

      updateGameState({
        isHost: true,
        hostId: room.hostId,
        roomCode: room.roomCode,
        players: room.players || [],
        maxPlayers: room.maxPlayers,
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
        <div>
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

        <div>
          <label className="block mb-2 font-medium">Select MCQ Set</label>
          <select
            value={selectedMcqSet}
            onChange={(e) => setSelectedMcqSet(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/90 text-black"
          >
            {mcqSets.map((set) => (
              <option key={set._id} value={set._id}>
                {set.sourceContent}
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
