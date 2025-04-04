import express from "express";
import multer from "multer";
import { convertPdfToXml } from "../controllers/pdfController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, upload.single("pdfs"), convertPdfToXml);

export default router;
