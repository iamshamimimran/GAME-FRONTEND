import { useState } from "react";
import axios from "axios";

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [answer, setAnswer] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("pdf", file);

    const res = await axios.post(
      "https://game-backend-iipb.onrender.com/api/pdfs/upload",
      formData
    );
    setSelectedFiles([...selectedFiles, res.data]);
  };

  const handleQuery = async () => {
    const res = await axios.post(
      "https://game-backend-iipb.onrender.com/api/pdfs/query",
      {
        question,
        fileIds: selectedFiles.map((f) => f.id),
      }
    );
    setAnswer(res.data.answer);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload PDF</button>

      <div>
        <h3>Uploaded Files:</h3>
        {selectedFiles.map((file) => (
          <div key={file.id}>{file.originalName}</div>
        ))}
      </div>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question"
      />
      <button onClick={handleQuery}>Ask</button>

      {answer && (
        <div className="answer">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};
export default PDFUploader;
