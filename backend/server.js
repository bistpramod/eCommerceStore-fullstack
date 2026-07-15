import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("api are running");
});

connectDB();

app.listen(5002, () => {
    console.log("server is running");
});