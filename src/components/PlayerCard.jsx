import React from "react";

const PlayerCard = ({ player, isHost }) => {
  return (
    <div className="player-card bg-white/5 rounded-lg p-4 flex items-center">
      <div className="mr-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          {player.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1">
        <div className="font-medium">
          {player.name} {isHost && "(Host)"}
        </div>
        <div className="text-sm opacity-70">Score: {player.score}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
