import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js"
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/products',productRoutes)
app.use('/cart',cartRoutes)
connectDB();

app.listen(5002, () => {
    console.log("server is running");
});