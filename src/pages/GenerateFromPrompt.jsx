import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
// https://game-backend-iipb.onrender.com
const GenerateFromPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await axios.post(
        "https://game-backend-iipb.onrender.com/api/mcqs/generate/prompt",
        {
          prompt,
          difficulty,
          numQuestions,
        }
      );
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-2">
        <h1 className="text-4xl font-bold text-center mb-6 text-purple-600">
          Create Custom Quiz
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Generate MCQ quizzes from any topic using AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Your Prompt
            </label>
            <textarea
              className="w-full p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows="4"
              placeholder="Enter a brief prompt, e.g. 'World War II overview'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a topic or concept you'd like to create a quiz about
              (minimum 10 characters)
            </p>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Difficulty Level
            </label>
            <select
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Number of Questions (1-20)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate MCQ"}
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mt-4">{error}</div>
        )}

        {questions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Generated MCQs:
            </h3>
            <ul className="space-y-4">
              {questions.map((q, index) => (
                <li key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                  <p className="font-medium text-gray-800">{q.question}</p>
                  <ul className="list-disc list-inside ml-4 mt-2 text-gray-600">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-green-600">
                    Answer: {q.correctAnswer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateFromPrompt;
