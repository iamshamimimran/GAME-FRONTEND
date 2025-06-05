import { useNavigate } from "react-router";
import Header from "./Header";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">
            Welcome to QuizMaster
          </h1>
          <p className="text-md text-center text-gray-700 mb-12">
            Create engaging quizzes from PDFs, YouTube videos, or custom
            prompts.
            <br />
            Host live quiz sessions and track progress in real-time.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate("/g-pdf")}
            >
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                Upload Content
              </h2>
              <p className="text-gray-600">
                Upload PDFs or YouTube links to generate interactive quizzes
                automatically.
              </p>
            </div>

            {/* Create Custom Quiz */}
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate("/g-prompt")}
            >
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                Create Custom Quiz
              </h2>
              <p className="text-gray-600">
                Generate quizzes from any topic using AI with custom prompts and
                difficulty levels.
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate("/library")}
            >
              <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                Quiz Library
              </h2>
              <p className="text-gray-600">
                Access your saved quizzes and host live quiz sessions with
                real-time leaderboards.
              </p>
            </div>

            <div
              className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-8 text-white cursor-pointer"
              onClick={() => navigate("/game")}
            >
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Live Multiplayer</h2>
              <p className="">
                Host interactive quiz sessions with real-time player
                participation and live leaderboards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
