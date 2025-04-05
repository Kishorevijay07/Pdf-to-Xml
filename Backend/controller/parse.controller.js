import path from "path";
import PDFParser from "pdf2json";
import js2xmlparser from "js2xmlparser";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const convertPdfToXml = async(req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const pdfParser = new PDFParser();
  const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
  console.log(req.file.filename)
  pdfParser.on("pdfParser_dataError", (errData) => {
    console.error("PDF parse error:", errData.parserError);
    res
      .status(500)
      .json({ message: "Failed to parse PDF", error: errData.parserError });
  });

  pdfParser.on("pdfParser_dataReady", async(pdfData) => {
    const xml = js2xmlparser.parse("pdfData", pdfData);
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

  pdfParser.loadPDF(filePath);
};
