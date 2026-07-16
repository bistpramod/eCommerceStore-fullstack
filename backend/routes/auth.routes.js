import express from "express"
import { signupUser, loginUser } from "../controllers/auth.controller.js"
const router = express.Router()

router.post('/signup', signupUser) // on this route open singup user 
router.post('/login',loginUser)

export default router 