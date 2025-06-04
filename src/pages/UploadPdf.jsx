// UploadPdf.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiUpload, FiFile } from "react-icons/fi";

const UploadPdf = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "https://game-backend-iipb.onrender.com/api/pdf/upload",
        formData
      );
      onUploaded(true);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 max-w-md w-full">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-indigo-900 mb-1">Upload PDF</h2>
        <p className="text-indigo-600/80">Drop your knowledge base here</p>
      </div>

      <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center mb-4 transition-all hover:bg-indigo-50/50 cursor-pointer relative">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center">
          <FiUpload className="text-indigo-400 text-3xl mb-3" />
          <p className="text-indigo-800 font-medium">
            {file ? file.name : "Click or drag file here"}
          </p>
          <p className="text-indigo-600/70 text-sm mt-1">
            {file ? "Change file?" : "PDF files only"}
          </p>
        </div>
      </div>

      {file && (
        <div className="flex items-center bg-indigo-100 rounded-lg p-3 mb-4 animate-fadeIn">
          <FiFile className="text-indigo-600 mr-2 flex-shrink-0" />
          <span className="text-indigo-800 font-medium truncate">
            {file.name}
          </span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center
          ${
            file
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }
          ${isUploading ? "opacity-80" : ""}`}
      >
        {isUploading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading...
          </>
        ) : (
          "Process Document"
        )}
      </button>
    </div>
  );
};

export default UploadPdf;
