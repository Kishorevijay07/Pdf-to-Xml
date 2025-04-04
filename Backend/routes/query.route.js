import express from "express";
import { previousuploaded,queryformclient,getquery} from "../controller/query.controller.js";
import protectroute from "../middleware/protectroute.js";

const router = express.Router()
router.get('/peviousfiles',protectroute,previousuploaded)
router.post('/query',protectroute,queryformclient)
router.get('/getquery',protectroute,getquery)
export default router;