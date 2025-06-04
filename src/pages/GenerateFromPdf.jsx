import React, { useState } from "react";
import axios from "axios";
import { FaUpload, FaSpinner } from "react-icons/fa";

const GenerateFromPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

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

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/mcqs/generate/pdf",
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
    <div className="max-w-full mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Generate MCQs from PDF
      </h2>

      <div className="flex items-center justify-center gap-4 mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 w-full"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FaUpload />
            Upload PDF
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
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
  );
};

export default GenerateFromPdf;
