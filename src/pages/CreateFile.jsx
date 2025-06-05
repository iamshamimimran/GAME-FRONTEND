import { useState, useRef } from "react";
import axios from "axios";
import {
  FaFileUpload,
  FaCheckCircle,
  FaTimes,
  FaFilePdf,
} from "react-icons/fa";
import Header from "./Header";
import { useNavigate } from "react-router";
const CreateFile = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setPdfs(Array.from(e.target.files));
  };
  const navigate = useNavigate();
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length > 0) {
      setPdfs(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || pdfs.length === 0) {
      alert("Please provide a title and at least one PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    pdfs.forEach((pdf) => formData.append("pdfs", pdf));

    try {
      setUploading(true);
      const res = await axios.post(
        "https://game-backend-iipb.onrender.com/api/files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess(true);
      setTitle("");
      setDescription("");
      setPdfs([]);

      // Auto-reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      navigate("/library");
    }
  };

  const removeFile = (index) => {
    const newFiles = [...pdfs];
    newFiles.splice(index, 1);
    setPdfs(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaFileUpload className="text-white" />
              Upload New Files
            </h2>
            <p className="text-indigo-100 mt-1">
              Upload PDFs to create new learning resources
            </p>
          </div>

          <div className="p-6">
            {success && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 border border-green-200">
                <FaCheckCircle className="text-green-600" />
                <span>Files uploaded successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your files"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description (optional)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDFs
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                    ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                    }
                    ${pdfs.length > 0 ? "border-indigo-500 bg-indigo-50" : ""}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaFileUpload className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {pdfs.length > 0
                          ? `${pdfs.length} file${
                              pdfs.length > 1 ? "s" : ""
                            } selected`
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF files only (max 10 files)
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                      onClick={triggerFileInput}
                    >
                      Browse Files
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {pdfs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {pdfs.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <FaFilePdf className="text-red-500" />
                            <span className="text-sm text-gray-700 truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-red-500 transition"
                            onClick={() => removeFile(index)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition
                  ${
                    uploading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }
                `}
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <>
                    <FaFileUpload />
                    Upload Files
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Supported file types: PDF only</p>
          <p className="mt-1">Maximum file size: 10MB per file</p>
        </div>
      </div>
    </>
  );
};

export default CreateFile;
