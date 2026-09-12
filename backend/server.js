import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import { createAdmin } from "./controllers/auth.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  createAdmin();

  app.listen(5002, () => {
    console.log("server is running");
  });
});