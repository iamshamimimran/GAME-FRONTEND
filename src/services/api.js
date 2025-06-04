// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://game-backend-iipb.onrender.com/api";

export const createGameRoom = async (hostId, mcqSetId, maxPlayers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostId,
        mcqSetId,
        maxPlayers: parseInt(maxPlayers),
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create room");
    return data;
  } catch (error) {
    throw error;
  }
};

// src/services/api.js
export const joinGameRoom = async (playerName, roomCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playerName,
        roomCode: roomCode,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to join room");

    // Return the direct response
    return data;
  } catch (error) {
    throw error;
  }
};
