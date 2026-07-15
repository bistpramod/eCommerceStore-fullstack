import express from "express"
import { signupUser } from "../controllers/auth.controllers.js"
const router = express.Router()

router.post('/signup', signupUser) // on this route open singup user 

export default router 