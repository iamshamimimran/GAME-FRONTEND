import React from "react";
import { useSocket } from "../context/SocketContext";
import PlayerCard from "./PlayerCard";
import Leaderboard from "./Leaderboard";

const PlayerWaitingRoom = () => {
  const { gameState } = useSocket();
  const { roomCode, players, maxPlayers } = gameState;

  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">Game Room</h2>
      <div className="room-code text-4xl font-bold text-center my-6 tracking-widest bg-black/20 py-4 rounded-lg">
        {roomCode}
      </div>

      <div className="status-bar bg-black/20 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          Players: <span className="font-bold">{players.length}</span>
          {/* <span className="font-bold">{maxPlayers}</span> */}
        </div>
        <div>
          Status: <span className="font-bold">Waiting for host to start</span>
        </div>
      </div>

      {/* <h3 className="text-xl font-bold mb-4">Players in Room</h3>
      <div className="player-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {players.map((player, index) => (
          <PlayerCard key={index} player={player} isHost={index === 0} />
        ))}
      </div> */}

      <Leaderboard players={players} />

      <div className="mt-8 text-center py-8 bg-black/20 rounded-lg">
        <p className="text-xl">Waiting for host to start the game...</p>
      </div>
    </div>
  );
};

export default PlayerWaitingRoom;
