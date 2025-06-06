import React, { useState } from "react";
import {
  FaUpload,
  FaSpinner,
  FaFilePdf,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";
import Header from "./Header";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const UploadPage = ({ onNext, file, setFile }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNext = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          "https://game-backend-iipb.onrender.com/api/pdf/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("PDF uploaded successfully:", res.data);
        onNext();
      } catch (error) {
        console.error("Error uploading PDF:", error);
        alert("Failed to upload PDF. Please try again.");
      }
    } else if (youtubeUrl) {
      onNext();
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-4">
          Upload Your Content
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Choose a PDF document or YouTube video to create an interactive quiz
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Upload Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Upload PDF
            </h2>

            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <FaUpload className="text-4xl text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF files only, max 10MB
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Selected file:{" "}
                  <span className="font-medium">{file.name}</span>
                </p>
              </div>
            )}
          </div>

          {/* YouTube Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              YouTube Link
            </h2>

            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800 mb-2">
                Supported YouTube formats:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                <li>• https://youtu.be/VIDEO_ID</li>
                <li>• Both http and https protocols are supported</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!file && !youtubeUrl}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

const PDFViewer = ({ file }) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      text: "Hello! I can help you ask questions about your uploaded content. What would you like to know?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [options, setOptions] = useState({
    storyMode: false,
    realLifeExample: false,
    practicalActivity: false,
  });

  const handleAsk = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: "", isUser: false, isLoading: true },
    ]);

    try {
      const res = await axios.post(
        "https://game-backend-iipb.onrender.com/api/pdf/ask",
        {
          question: input,
          options,
        }
      );

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          text: res.data.answer || "No answer received.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          text: "⚠️ Failed to get response.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const [mcqs, setMcqs] = useState([]);
  const handleGenerateQuiz = async () => {
    setMcqs([]);

    try {
      const res = await axios.post(
        "https://game-backend-iipb.onrender.com/api/pdf/mcq-from-chat",
        {
          difficulty,
          numQuestions,
        }
      );
      if (Array.isArray(res.data.questions)) {
        setMcqs(res.data.questions); // use the array directly
      } else if (typeof res.data.questions === "string") {
        const parsedQuestions = res.data.questions
          .split("\n\n")
          .filter((q) => q.trim().length > 0);
        setMcqs(parsedQuestions);
      } else {
        setMcqs(["⚠️ Unexpected MCQ response format."]);
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Request Failed:", error.message);
      }
    }
  };

  return (
    <div className="min-h-full p-2 flex flex-col lg:flex-row gap-6 max-w-screen-xl mx-auto">
      {/* PDF Viewer Section */}
      <div className="w-full lg:w-1/2 bg-white p-4 lg:p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Document Viewer
          </h2>

          {/* PDF Controls */}
          <div className="flex flex-wrap items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <button className="p-2 hover:bg-gray-200 rounded">←</button>
              <span className="text-sm font-medium">Page 1 of 5</span>
              <button className="p-2 hover:bg-gray-200 rounded">→</button>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-200 rounded">-</button>
              <span className="text-sm font-medium">100%</span>
              <button className="p-2 hover:bg-gray-200 rounded">+</button>
            </div>
          </div>
        </div>

        {/* PDF Display Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl h-96 flex flex-col items-center justify-center bg-gray-50">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <FaFilePdf className="text-6xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            PDF Document
          </h3>
          <p className="text-gray-600 mb-4">{file?.name}</p>
          {/* <p className="text-sm text-gray-500">
            PDF viewing functionality would be implemented here
          </p> */}
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white p-4 lg:p-6 border border-gray-200 rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 px-4 rounded-l-lg font-medium transition-colors ${
              activeTab === "chat"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chat with PDF
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-3 px-4 rounded-r-lg font-medium transition-colors ${
              activeTab === "quiz"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Generate MCQ Quiz
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[32rem]">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ask questions about your content
              </h3>
              <p className="text-sm text-gray-600">
                I can answer questions based on the uploaded PDF or YouTube
                video content.
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg ${
                      message.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 border"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{message.text}</p>
                        {message.timestamp && (
                          <p
                            className={`text-xs mt-1 ${
                              message.isUser ? "text-blue-200" : "text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="mb-2 gap-2 flex items-center justify-center text-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.storyMode}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      storyMode: e.target.checked,
                    }))
                  }
                />
                Story mode
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.realLifeExample}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      realLifeExample: e.target.checked,
                    }))
                  }
                />
                Real-life example
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.practicalActivity}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      practicalActivity: e.target.checked,
                    }))
                  }
                />
                Practical activity
              </label>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Type your question..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleAsk}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === "quiz" && (
          <div className="space-y-6">
            {mcqs.length === 0 ? (
              <>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Generate MCQ Quiz
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create multiple choice questions based on your uploaded
                    content.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions (1–20)
                  </label>
                  <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={handleGenerateQuiz}
                  disabled={!difficulty}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Generate Quiz
                </button>
              </>
            ) : (
              <>
                {mcqs.map((mcq, index) => (
                  <div
                    key={mcq._id || index}
                    style={{ marginBottom: "1.5rem" }}
                  >
                    <p>
                      <strong>Q{index + 1}:</strong> {mcq.question}
                    </p>
                    <ul>
                      {mcq.options.map((option, i) => (
                        <li
                          key={i}
                          style={{
                            color:
                              option === mcq.correctAnswer ? "green" : "black",
                            fontWeight:
                              option === mcq.correctAnswer ? "bold" : "normal",
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Correct Answer:</strong> {mcq.correctAnswer}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("upload");
  const [file, setFile] = useState(null);

  const handleNext = () => {
    setCurrentPage("viewer");
  };

  return (
    <div>
      <Header />
      {currentPage === "upload" ? (
        <UploadPage onNext={handleNext} file={file} setFile={setFile} />
      ) : (
        <PDFViewer file={file} />
      )}
    </div>
  );
};

export default App;
