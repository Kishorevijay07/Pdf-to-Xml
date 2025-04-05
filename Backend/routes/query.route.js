import express from "express";
import { previousuploaded,queryformclient,getquery, deleteFile, getfiles,getparticularfile, storefile} from "../controller/query.controller.js";
import protectroute from "../middleware/protectroute.js";

const router = express.Router()
router.get('/peviousfiles',protectroute,previousuploaded)
router.post('/query',protectroute,queryformclient)
router.get('/getquery',protectroute,getquery)

router.post('/storefile',protectroute,storefile)
router.get('/getfiles',protectroute,getfiles)
router.post('/deletefile',protectroute,deleteFile)

router.get("/getfile/:filename", getparticularfile);
export default router;