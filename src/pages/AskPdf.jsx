import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FiSend,
  FiUser,
  FiMessageSquare,
  FiBookOpen,
  FiTool,
  FiGlobe,
  FiLoader,
  FiAlertCircle,
  FiList,
} from "react-icons/fi";

const MessageBubble = ({ text, isUser, isLoading }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? "bg-indigo-600 ml-3" : "bg-purple-600 mr-3"
          }`}
        >
          {isUser ? (
            <FiUser className="text-white text-lg" />
          ) : isLoading ? (
            <FiLoader className="text-white text-lg animate-spin" />
          ) : (
            <FiMessageSquare className="text-white text-lg" />
          )}
        </div>
        <div
          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-indigo-500 text-white rounded-tr-none"
              : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-200"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <FiLoader className="animate-spin" />
              <span>Generating response...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AskPdf = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("chat"); // "chat" or "mcq"
  const [options, setOptions] = useState({
    storyMode: false,
    realLifeExample: false,
    practicalActivity: false,
  });
  const [error, setError] = useState(null);
  const [mcqForm, setMcqForm] = useState({
    difficulty: "medium",
    numQuestions: 5,
  });
  const [mcqs, setMcqs] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, mcqs]);

  const handleAsk = async () => {
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: "", isUser: false, isLoading: true },
    ]);

    try {
      const res = await axios.post("http://localhost:5000/api/pdf/ask", {
        question: input,
        options,
      });

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: res.data.answer, isUser: false },
      ]);
    } catch (error) {
      const errMsg =
        error.response?.data?.error || "⚠️ Failed to get response.";
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: errMsg, isUser: false },
      ]);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMcq = async () => {
    setError(null);
    setIsLoading(true);
    setMcqs([]);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/pdf/mcq-from-chat",
        mcqForm
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
      const errMsg =
        error.response?.data?.error || "⚠️ Failed to generate MCQs. Try again.";
      setMcqs([errMsg]);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-3xl w-full overflow-hidden flex flex-col h-[600px]">
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FiMessageSquare /> PDF Assistant
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("chat")}
            className={`px-3 py-1 rounded-full text-sm ${
              mode === "chat"
                ? "bg-white text-indigo-700 font-semibold"
                : "bg-indigo-100 text-white bg-opacity-20"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode("mcq")}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
              mode === "mcq"
                ? "bg-white text-indigo-700 font-semibold"
                : "bg-indigo-100 text-white bg-opacity-20"
            }`}
          >
            <FiList /> MCQ
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {mode === "chat" ? (
            <>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  text={msg.text}
                  isUser={msg.isUser}
                  isLoading={msg.isLoading}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <>
              {mcqs.map((mcq, index) => (
                <div key={mcq._id || index} style={{ marginBottom: "1.5rem" }}>
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

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {mode === "chat" && (
          <div className="border-t border-gray-200">
            <div className="p-3 bg-gray-50">
              <div className="flex items-center justify-center gap-4 mb-2">
                {[
                  {
                    key: "storyMode",
                    icon: <FiBookOpen />,
                    label: "Story Mode",
                    color: "purple",
                  },
                  {
                    key: "realLifeExample",
                    icon: <FiGlobe />,
                    label: "RealLife Examples",
                    color: "blue",
                  },
                  {
                    key: "practicalActivity",
                    icon: <FiTool />,
                    label: "Practical Activities",
                    color: "green",
                  },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={options[opt.key]}
                      onChange={() =>
                        setOptions((prev) => ({
                          ...prev,
                          [opt.key]: !prev[opt.key],
                        }))
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    {opt.icon}
                    <span
                      className={
                        options[opt.key]
                          ? "font-medium text-gray-700"
                          : "text-gray-500"
                      }
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about the PDF..."
                  className="w-full min-h-[60px] max-h-32 border text-black border-gray-300 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleAsk}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-3 bottom-3 w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${
                      input.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                        : "text-gray-400 bg-gray-100"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiSend className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === "mcq" && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium">
                Difficulty:
                <select
                  value={mcqForm.difficulty}
                  onChange={(e) =>
                    setMcqForm((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="ml-2 p-1 border rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label className="text-sm font-medium">
                Number of Questions:
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={mcqForm.numQuestions}
                  onChange={(e) =>
                    setMcqForm((prev) => ({
                      ...prev,
                      numQuestions: parseInt(e.target.value),
                    }))
                  }
                  className="ml-2 p-1 border rounded w-16"
                />
              </label>
              <button
                onClick={handleGenerateMcq}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  "Generate MCQs"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 text-sm flex items-center gap-2 border-t border-red-100">
          <FiAlertCircle />
          {error}
        </div>
      )}
    </div>
  );
};

export default AskPdf;
