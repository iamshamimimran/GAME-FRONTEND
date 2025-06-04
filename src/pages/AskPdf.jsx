// AskPdf.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiSend, FiUser, FiMessageSquare } from "react-icons/fi";

const MessageBubble = ({ text, isUser }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
    <div className={`flex items-start ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-indigo-600 ml-3" : "bg-purple-600 mr-3"
        }`}
      >
        {isUser ? (
          <FiUser className="text-white" />
        ) : (
          <FiMessageSquare className="text-white" />
        )}
      </div>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-indigo-500 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  </div>
);

const AskPdf = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://game-backend-iipb.onrender.com/api/pdf/ask",
        {
          question: input,
        }
      );

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { text: res.data.answer, isUser: false },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Failed to get response. Please try again.",
          isUser: false,
        },
      ]);
      console.error("Ask error:", error);
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-2xl w-full overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600">
        <h2 className="text-xl font-bold text-white">PDF Assistant</h2>
      </div>

      <div className="p-1">
        <div className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-white to-indigo-50/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <div className="bg-indigo-100/70 rounded-full p-5 mb-4">
                <FiMessageSquare className="text-indigo-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-indigo-800 mb-2">
                Ask about your document
              </h3>
              <p className="max-w-md">
                Upload a PDF and ask questions about its content. Try asking:
              </p>
              <ul className="mt-2 text-gray-600 text-sm">
                <li className="mb-1">• "Summarize the key points"</li>
                <li className="mb-1">• "Explain the main concept"</li>
                <li>• "What does this document recommend?"</li>
              </ul>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={index} text={msg.text} isUser={msg.isUser} />
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the PDF..."
              className="w-full min-h-[60px] max-h-32 border text-black border-gray-300 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={handleAsk}
              disabled={!input.trim() || isLoading}
              className={`absolute right-3 bottom-3 w-9 h-9 rounded-full flex items-center justify-center transition-all
                ${
                  input.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "text-gray-400"
                }`}
            >
              <FiSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskPdf;
