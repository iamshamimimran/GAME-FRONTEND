import { useNavigate } from "react-router";
import {
  Gamepad2,
  Crown,
  Zap,
  Trophy,
  Users,
  Brain,
  Newspaper,
  Terminal,
} from "lucide-react";

export default function QuizLandingPage() {
  const navigate = useNavigate();

  const handleGame = () => {
    navigate("/game");
  };
  const handlePDF = () => {
    navigate("/g-pdf");
  };
  const handlePrompt = () => {
    navigate("/g-prompt");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-cyan-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            A GAME
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGame}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-6 py-3 rounded-full font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Gamepad2 className="h-5 w-5" />
            Play Game
          </button>
          {/* <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 px-6 py-3 rounded-full font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Host Login
          </button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 pt-12 pb-20">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🔥 Most Lit Quiz Platform
            </span>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                QUIZ
              </span>
              <br />
              <span className="text-white">BATTLES</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                AWAIT
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Step into the ultimate quiz arena where knowledge meets swag.
              <span className="text-cyan-400 font-semibold"> Compete</span>,
              <span className="text-purple-400 font-semibold"> dominate</span>,
              and
              <span className="text-pink-400 font-semibold"> flex</span> your
              brain power! 🧠✨
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handlePDF}
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-8 py-4 rounded-full font-bold text-xl text-white shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Newspaper className="h-6 w-6" />
              Question from PDF
            </button>
            <button
              onClick={handlePrompt}
              className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 rounded-full font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Terminal className="h-6 w-6" />
              Question from PROMPT
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-300">Active Players</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">100K+</div>
              <div className="text-gray-300">Games Played</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-300">Questions Answered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/20 backdrop-blur-lg py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Everyone's{" "}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Obsessed
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-2xl p-8 border border-pink-500/30">
              <Zap className="h-12 w-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-300">
                Real-time multiplayer action that keeps you on your toes. No
                cap! ⚡
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border border-cyan-500/30">
              <Trophy className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Epic Rewards</h3>
              <p className="text-gray-300">
                Climb leaderboards, earn badges, and flex your achievements! 🏆
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl p-8 border border-purple-500/30">
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Squad Goals</h3>
              <p className="text-gray-300">
                Team up with friends or battle solo. Your choice, your vibe! 🤝
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400">
        <p>&copy; 2025 A Game. Built different. 💯</p>
      </footer>
    </div>
  );
}
