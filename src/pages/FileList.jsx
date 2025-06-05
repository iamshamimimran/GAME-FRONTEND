import { useEffect, useState } from "react";
import axios from "axios";
import FileCard from "../components/FileCard";
import Header from "./Header";
import { useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa";
const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        "https://game-backend-iipb.onrender.com/api/files"
      );
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">📁 Your Files</h1>
        <button
          className="px-4 flex  gap-2 items-center py-2 bg-green-300 rounded-lg shadow-2xl mb-4 hover:bg-indigo-700 hover:text-white transition-colors font-medium"
          onClick={() => navigate("/create-files")}
        >
          <FaPlus /> Create New Files
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FileList;
