import express from "express";
import { saveAddress, getAddress } from "../controllers/address.controller.js";
import { protect, sameUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, sameUser, saveAddress);
router.get("/:userId", protect, sameUser, getAddress);

export default router;
