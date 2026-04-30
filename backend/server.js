import express from "express";
import allRoutes from "./src/routes/allRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", allRoutes);

async function startServer() {
  try {
    await pool.query("SELECT NOW()"); // test is it live
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server started...");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}
startServer();
