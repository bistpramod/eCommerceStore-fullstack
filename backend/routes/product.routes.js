import express from "express";

import {
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../controllers/product.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getProducts);

// Admin routes
router.post("/add", protect, adminOnly, upload.single("image"), createProduct);
router.put("/update/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/delete/:id", protect, adminOnly, deleteProduct);

export default router;
