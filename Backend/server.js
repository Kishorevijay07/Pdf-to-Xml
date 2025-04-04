import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import authFunction from "./routes/auth.route.js";
import queryFunction from "./routes/query.route.js";
import feedbackFunction from "./routes/feedback.route.js";
import parseRouter from "./routes/parse.route.js";
import connectdb from "./db/connectdb.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json(
    { 
        limit: "7mb"
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use("/api/convert", parseRouter);
app.use('/api/auth', authFunction);
app.use('/api/user', queryFunction);
app.use('/api/all', feedbackFunction);




app.listen(port, () => {
    console.log(`Server running successfully on http://localhost:${port}`);
    connectdb();
});
