import express from "express"
import { signUpUser } from "../controllers/auth.controllers.js"
const router = express.Router()

router.post('/signup', signUpUser) // on this route open singup user 

export default router 