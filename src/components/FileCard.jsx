import { useState } from "react";
import {
  FaFilePdf,
  FaCommentDots,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";
import axios from "axios";

const FileCard = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user question to conversation
    const userMessage = { type: "user", content: question };
    setConversation((prev) => [...prev, userMessage]);

    setLoading(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately

    try {
      const res = await axios.post(
        `https://game-backend-iipb.onrender.com/api/files/${file._id}/analyze`,
        {
          question: currentQuestion,
        }
      );

      // Add AI response to conversation
      const aiMessage = { type: "ai", content: res.data.answer };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error asking question:", err);
      const errorMessage = { type: "ai", content: "Something went wrong!" };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setConversation([]);
    setQuestion("");
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-5 space-y-4 border border-gray-100">
        <div>
          <h2 className="text-xl font-semibold">{file.title}</h2>
          <p className="text-sm text-gray-600">{file.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
          {file.pdfs.map((pdf, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
            >
              <FaFilePdf className="text-red-500" /> {pdf.filename}
            </span>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaCommentDots />
            Ask Questions
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {file.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ask questions about this document
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[400px]">
              {conversation.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <FaCommentDots
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p className="text-lg">Start a conversation!</p>
                  <p className="text-sm mt-2">
                    Ask any question about the uploaded documents.
                  </p>
                </div>
              ) : (
                conversation.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your question here..."
                  disabled={loading}
                />
                <button
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <FaPaperPlane />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileCard;
