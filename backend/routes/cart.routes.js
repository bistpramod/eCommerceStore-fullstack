import express from "express";

import {
  addToCart,
  removeItem,
  getCart,
  updateCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

//* Add item to cart
router.post("/add", addToCart);

//* Remove item from cart
router.post("/remove", removeItem);

//* Update item quantity in cart
router.post("/update", updateCart);

//* Get user cart
router.get("/:userId", getCart);

export default router;