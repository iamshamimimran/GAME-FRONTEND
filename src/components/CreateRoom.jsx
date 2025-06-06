import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { createGameRoom } from "../services/api";
import Header from "../pages/Header";
import Loader from "./Loader";

const CreateRoom = () => {
  const { socket, updateGameState } = useSocket();
  const [mcqSets, setMcqSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxPlayersBySet, setMaxPlayersBySet] = useState({});
  const [fetchingMcqs, setFetchingMcqs] = useState(true); // New state for MCQ loading

  // Static hostId for now
  const hostId = "683ed21d42694eec82216113";

  useEffect(() => {
    const fetchMcqs = async () => {
      try {
        setFetchingMcqs(true);
        const res = await fetch(
          "https://game-backend-iipb.onrender.com/api/mcqs"
        );
        const data = await res.json();
        setMcqSets(data);

        // Set default max players per set
        const initialPlayers = {};
        data.forEach((set) => {
          initialPlayers[set._id] = 4;
        });
        setMaxPlayersBySet(initialPlayers);
      } catch (error) {
        console.error("Failed to fetch MCQ sets:", error);
      } finally {
        setFetchingMcqs(false);
      }
    };

    fetchMcqs();
  }, []);

  const handleCreateRoom = async (mcqSetId) => {
    if (!hostId) return alert("Invalid or missing token. Please login again.");

    setLoading(mcqSetId);
    try {
      const maxPlayers = maxPlayersBySet[mcqSetId] || 4;
      const response = await createGameRoom(hostId, mcqSetId, maxPlayers);
      const { room } = response;

      updateGameState({
        isHost: true,
        hostId: room.hostId,
        roomCode: room.roomCode,
        players: room.players || [],
        maxPlayers: room.maxPlayers,
      });

      socket.emit("host-join-room", { roomCode: room.roomCode });
      window.open("_blank");
    } catch (error) {
      alert("❌ Failed to create room: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (fetchingMcqs) {
    return (
      <>
        <Header />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="h-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mx-auto p-4">
          {mcqSets.map((set) => (
            <div
              key={set._id}
              className="bg-gray-400  backdrop-blur-md rounded-xl p-6 shadow-xl"
            >
              <h3 className="text-md uppercase font-semibold mb-2 ">
                {set.sourceContent}
              </h3>
              <label className="block mb-2 italic text-sm">
                Room With Max Players
              </label>
              <select
                value={maxPlayersBySet[set._id]}
                onChange={(e) =>
                  setMaxPlayersBySet((prev) => ({
                    ...prev,
                    [set._id]: Number(e.target.value),
                  }))
                }
                className="w-full p-3 rounded-lg bg-white/90 text-black mb-4"
              >
                {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} Players
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleCreateRoom(set._id)}
                disabled={loading == set._id}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg font-bold text-white hover:from-orange-600 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                {loading == set._id ? "Creating..." : "Create Room"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CreateRoom;
