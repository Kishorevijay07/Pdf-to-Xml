import React from "react";

const PdfToWordGuide = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-6">
     
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/image.png" 
          alt="PDF to Word Conversion"
          className="max-w-md w-full"
        />
      </div>

      
      <div className="md:w-1/2 text-center md:text-left mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4">
          How to Convert PDF to Word Online for Free
        </h2>
        <ol className="list-decimal list-inside text-lg text-gray-700 space-y-2">
          <li>Drag & drop your PDF into the converter at the top of this page.</li>
          <li>For scanned PDFs, select the ‘OCR’ option (Pro feature).</li>
          <li>Wait just a second as your PDF transforms to DOCX.</li>
          <li>Download or share your converted Word doc—done!</li>
        </ol>
      </div>
    </div>
  );
};

export default PdfToWordGuide;
