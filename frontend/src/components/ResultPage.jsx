import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../urls/Constant";
const ResultPage = () => {
  const location = useLocation();
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);

  const { fileName } = location.state || {}; 

  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log(fileName)
        const res = await fetch(`${baseUrl}/api/user/getfile/${fileName}`);
        if (!res.ok) throw new Error("Failed to fetch file");
        const text = await res.text(); 
        setFileContent(text);
      } catch (err) {
        console.error("Error loading file:", err);
        setFileContent("Failed to load file.");
      } finally {
        setLoading(false);
      }
    };

    if (fileName) fetchFile();
  }, [fileName]);

  return (
    <div className="p-6 ml-48">
      <h2 className="text-2xl font-bold mb-4">File: {fileName}</h2>
      {loading ? (
        <p>Loading file...</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto max-h-[80vh]">
          {fileContent}
        </pre>
      )}
    </div>
  );
};

export default ResultPage;
