// PdfQnA.jsx
import React, { useState } from "react";
import UploadPdf from "./UploadPdf";
import AskPdf from "./AskPdf";

const PdfQnA = () => {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="min-h-screen  px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-6">
          <p className="text-lg text-white max-w-xl mx-auto">
            Upload documents and chat with them in real-time. <br /> Get instant
            answers powered by AI.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <div
            className={`transition-all duration-500 ${
              uploaded ? "md:w-2/5" : "md:w-1/2 mx-auto"
            }`}
          >
            <UploadPdf onUploaded={setUploaded} />
          </div>

          {uploaded && (
            <div className="md:w-3/5 transition-all duration-500 animate-fadeIn">
              <AskPdf />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfQnA;
