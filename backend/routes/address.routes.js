import express from "express";
import { saveAddress, getAddress } from "../controllers/address.controller.js";

const router = express.Router();

router.post("/add", saveAddress);
router.get("/:userId", getAddress);

export default router;