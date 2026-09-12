import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect, sameUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/place", protect, sameUser, createOrder);

export default router;
