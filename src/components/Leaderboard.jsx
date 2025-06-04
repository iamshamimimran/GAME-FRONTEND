import React from "react";
import { Trophy, Medal, Award, User, Crown } from "lucide-react";

const Leaderboard = ({ players, showTitle = true, isGameOver = false }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-white/70 font-bold text-sm">
            {index + 1}
          </div>
        );
    }
  };

  const getRankStyle = (index, score) => {
    if (score === 0 && !isGameOver) {
      return "bg-white/5 border-white/10";
    }

    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/30 shadow-lg";
      case 1:
        return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-300/30";
      case 2:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default:
        return "bg-white/10 border-white/20 hover:bg-white/15 transition-colors";
    }
  };

  const getPlayerAvatar = (name, index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];

    return (
      <div
        className={`w-10 h-10 ${
          colors[index % colors.length]
        } rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (players.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
        {showTitle && (
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
          </div>
        )}
        <div className="text-center py-12">
          <User className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50 font-medium">No players joined yet</p>
          <p className="text-white/30 text-sm mt-2">
            Players will appear here once they join
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 h-fit">
      {showTitle && (
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">
            {isGameOver ? "Final Results" : "Leaderboard"}
          </h3>
        </div>
      )}

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={`${player.name}-${index}`}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${getRankStyle(
              index,
              player.score
            )}`}
          >
            {/* Rank Icon */}
            <div className="flex-shrink-0">{getRankIcon(index)}</div>

            {/* Player Avatar */}
            <div className="flex-shrink-0">
              {getPlayerAvatar(player.name, index)}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white truncate">
                  {player.name}
                </h4>
                {player.score > 0 && (
                  <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                )}
              </div>
              {isGameOver && (
                <p className="text-white/60 text-sm">
                  {index === 0
                    ? "Winner!"
                    : `${index + 1}${getOrdinalSuffix(index + 1)} Place`}
                </p>
              )}
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-right">
              <div
                className={`text-lg font-bold ${
                  index === 0 && player.score > 0
                    ? "text-yellow-400"
                    : "text-white"
                }`}
              >
                {player.score}
              </div>
              <div className="text-white/50 text-xs">
                {player.score === 1 ? "point" : "points"}
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${
                  player.socketId
                    ? "bg-green-400 shadow-lg shadow-green-400/50"
                    : "bg-red-400"
                }`}
                title={player.socketId ? "Connected" : "Disconnected"}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      {players.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex justify-between text-white/60 text-sm">
            <span>Total Players: {players.length}</span>
            <span>
              Avg Score:{" "}
              {(
                sortedPlayers.reduce((sum, p) => sum + p.score, 0) /
                players.length
              ).toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for ordinal suffixes
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export default Leaderboard;
