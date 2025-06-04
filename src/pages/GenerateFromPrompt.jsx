// src/pages/GenerateFromPrompt.jsx
import React, { useState } from "react";
import axios from "axios";

const GenerateFromPrompt = () => {
  const [prompt, setPrompt] = useState("");
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
        "http://localhost:5000/api/mcqs/generate/prompt",
        { prompt }
      );
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          Generate MCQs from Prompt
        </h1>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <textarea
            className="w-full p-4 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Enter your topic or prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate MCQs"}
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>
        )}

        {questions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
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
    </div>
  );
};

export default GenerateFromPrompt;
