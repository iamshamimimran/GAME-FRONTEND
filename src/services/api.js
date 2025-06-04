const API_BASE_URL = "http://localhost:5000/api";

export const createGameRoom = async (hostName, maxPlayers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostId: "683e956e14f3a6a1b157a8f9",
        mcqSetId: "6839d4b74cd026a69fbab9f9", // You need to implement MCQ set selection
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
