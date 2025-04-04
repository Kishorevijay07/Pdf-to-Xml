import express from "express";

import protectroute from "../middleware/protectroute.js";
import { getFeedback, postFeedback } from "../controller/feedback.controller.js";

const router = express.Router()
router.post('/feedback',protectroute,postFeedback)
router.get('/getfeedback',getFeedback)

export default router;