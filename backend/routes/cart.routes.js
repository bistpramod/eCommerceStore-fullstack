import express from "express";

import {
  addToCart,
  removeItem,
  getCart,
  updateCart,
} from "../controllers/cart.controller.js";

import { protect, sameUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

//* Cart routes need login
router.post("/add", protect, sameUser, addToCart);
router.post("/remove", protect, sameUser, removeItem);
router.post("/update", protect, sameUser, updateCart);
router.get("/:userId", protect, sameUser, getCart);

export default router;
