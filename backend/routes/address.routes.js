import express from "express"


import { saveAddress,getAddress } from "../controllers/address.controller"

const router = express.Router()

router.post('/add',saveAddress)
router.post('/:userId', getAddress)

export default routerl;