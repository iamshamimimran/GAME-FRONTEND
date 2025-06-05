// UploadPdf.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FiUpload,
  FiFile,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const UploadPdf = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/pdf/upload", formData);
      onUploaded(true);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
      setPageNumber(1);
      setNumPages(null);
      setLoadingPdf(true);
    }
  };

  // Detect page count when PDF loads
  const handleIframeLoad = () => {
    setLoadingPdf(false);
    try {
      // Extract page count from the iframe's content
      const iframeDoc =
        iframeRef.current?.contentDocument ||
        iframeRef.current?.contentWindow?.document;

      if (iframeDoc) {
        // Chrome stores page count in a specific element
        const pageCountElement = iframeDoc.querySelector(".toolbar .pages");
        if (pageCountElement) {
          const countText = pageCountElement.textContent || "";
          const match = countText.match(/\d+/g);
          if (match && match.length >= 2) {
            setNumPages(parseInt(match[1], 10));
            return;
          }
        }

        // Firefox stores page count in a different element
        const firefoxCountElement = iframeDoc.querySelector("#pageNumber");
        if (firefoxCountElement) {
          const max = firefoxCountElement.getAttribute("max");
          if (max) {
            setNumPages(parseInt(max, 10));
            return;
          }
        }
      }

      // Fallback: estimate page count based on scroll height
      if (iframeRef.current?.contentWindow?.document?.body) {
        const bodyHeight =
          iframeRef.current.contentWindow.document.body.scrollHeight;
        const pageHeight = 1000; // Approximate page height
        const estimatedPages = Math.round(bodyHeight / pageHeight);
        if (estimatedPages > 0) {
          setNumPages(estimatedPages);
          return;
        }
      }

      // If all else fails, show unknown page count
      setNumPages(null);
    } catch (error) {
      console.error("Error detecting page count:", error);
      setNumPages(null);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 max-w-md w-full">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-indigo-900 mb-1">Upload PDF</h2>
        <p className="text-indigo-600/80">Drop your knowledge base here</p>
      </div>

      <div className="border-2 border-dashed border-indigo-300 rounded-xl p-2 text-center mb-2 transition-all hover:bg-indigo-50/50 cursor-pointer relative">
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          onChange={handleFileChange}
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

      {/* PDF Preview Section */}
      {pdfUrl && (
        <div className="mb-4 border border-indigo-200 rounded-xl overflow-hidden bg-white">
          <div className="h-64 overflow-hidden relative">
            {loadingPdf && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                  <p className="text-indigo-600">Loading PDF...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#page=${pageNumber}`}
              title="PDF Preview"
              className="w-full h-full"
              onLoad={handleIframeLoad}
              style={{ display: loadingPdf ? "none" : "block" }}
            />
          </div>
        </div>
      )}

      {/* {file && (
        <div className="flex items-center bg-indigo-100 rounded-lg p-3 mb-4 animate-fadeIn">
          <FiFile className="text-indigo-600 mr-2 flex-shrink-0" />
          <span className="text-indigo-800 font-medium truncate">
            {file.name}
          </span>
        </div>
      )} */}

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
