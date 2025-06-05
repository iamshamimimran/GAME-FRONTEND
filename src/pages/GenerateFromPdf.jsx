import React, { useState } from "react";
import axios from "axios";
import { FaUpload, FaSpinner } from "react-icons/fa";
import Header from "./Header";

const GenerateFromPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setQuestions([]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("difficulty", difficulty);
    formData.append("numQuestions", numQuestions);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://game-backend-iipb.onrender.com/api/mcqs/generate/pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setQuestions(res.data.questions || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-full flex items-center justify-center p-2">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-2">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            Upload Your Content
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Choose a PDF document or YouTube video to create an interactive quiz
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Upload PDF
              </h3>
              <label className="cursor-pointer w-full">
                <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-10 hover:bg-gray-50 transition">
                  <FaUpload className="text-3xl text-gray-400" />
                  <p className="text-sm text-gray-600 font-medium">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF files only, max 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Selected file:{" "}
                  <span className="font-medium text-gray-700">{file.name}</span>
                </p>
              )}

              <div className="mt-4 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="mt-4 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numQuestions}
                  min={1}
                  max={20}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 border rounded-xl bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                YouTube Link
              </h3>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-3 rounded-xl border border-gray-300"
                disabled
              />
              <div className="mt-4 p-4 text-sm text-blue-700 bg-blue-50 rounded-lg border border-blue-200">
                <strong>Supported YouTube formats:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>https://youtu.be/VIDEO_ID</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Next →
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          {questions.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                Generated MCQs
              </h3>
              <ul className="space-y-4">
                {questions.map((q, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-xl shadow">
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
    </>
  );
};

export default GenerateFromPdf;
