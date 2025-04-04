import express from "express";
import protectroute from "../middleware/protectroute.js";
import { signup,login,profile,logout } from "../controller/auth.contoller.js";

const router = express.Router()
router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.get('/profile',protectroute,profile)

export default router;