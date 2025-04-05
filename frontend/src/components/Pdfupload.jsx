
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/solid";
import Header from "../pages/Header";
import Sidebar from "./Sidebar.jsx";
import pdftoxml from "./../images/pdf-xml.png";
import toast from "react-hot-toast";
import { baseUrl } from "../urls/Constant.js";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
const Pdfupload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [xml, setXml] = useState("");
  const navigate = useNavigate();

  const queryClient = useQueryClient()
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    setXml(""); 
  };

  const removeFile = () => {
    setFile(null);
    setXml("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file.");
    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file); 


    try {
      const res = await fetch("http://localhost:3000/api/convert", {
        method: "POST",
        body: formData,
      });
    
      if (!res.ok) throw new Error("Conversion failed");
    
      const resultXml = await res.text();
      setXml(resultXml);


      const filename = file?.name.replace(".pdf", ".xml") || "converted.xml";
 
      const storeRes = await fetch(`${baseUrl}/api/user/storefile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fileName: filename,     
          xmlData: resultXml,     
        }),
      });
    
      const storeData = await storeRes.json();
      if (!storeRes.ok) throw new Error(storeData.error || "Not saved");
      queryClient.invalidateQueries({ queryKey: ["authUser"]});
      console.log("Saved file info:", storeData);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed to convert or store file.");
    } finally {
      setLoading(false);
    }
    
  };

  const handleDownload = async () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = file?.name.replace(".pdf", ".xml") || "converted.xml";
  
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center p-6">
        <Header />

        <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full text-center mt-10">
          <label htmlFor="file-upload" className="cursor-pointer hover:text-gray-500 transition-transform hover:translate-y-1">
            <CloudArrowUpIcon className="h-16 w-16 text-red-500 mx-auto" />
            <p className="text-gray-600 mt-2">Click to upload a PDF</p>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-4 w-full text-left">
              <p className="text-green-500 font-medium mb-2">Selected File:</p>
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                📄 {file.name}
                <button onClick={removeFile} className="ml-2 text-red-500 hover:text-red-700">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleUpload}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full"
                disabled={loading}
              >
                {loading ? "Converting..." : "Convert PDF to XML"}
              </button>
            </div>
          )}
        </div>

        {xml && (
          <div className="bg-white mt-10 p-6 rounded-lg w-full max-w-4xl shadow-lg overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Converted XML:</h3>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap max-h-[300px] overflow-y-auto border p-3 rounded">{xml}</pre>
            <button
              onClick={handleDownload}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download XML
            </button>
          </div>
        )}

<div className="flex flex-col md:flex-row items-center justify-center bg-white p-6 mt-10 rounded-lg shadow-lg w-full max-w-4xl">
  <div className="md:w-1/2 flex justify-center">
    <img
      src={pdftoxml}
      alt="PDF to XML Conversion"
      className="w-full max-w-[350px] rounded-lg" // <-- Reduced max-width here
    />
  </div>
  <div className="md:w-1/2 text-center md:text-left mt-6 md:mt-0">
    <h2 className="text-2xl font-bold mb-4">
      How to Convert PDF to XML Online for Free
    </h2>
    <ol className="list-decimal list-inside text-lg text-gray-700 space-y-2">
      <li>Select a PDF file to upload.</li>
      <li>Click "Convert PDF to XML".</li>
      <li>Preview the XML result.</li>
      <li>Click "Download XML" to save the file.</li>
    </ol>
  </div>
</div>

      </div>
    </div>
  );
};

export default Pdfupload;

