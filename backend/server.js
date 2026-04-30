import express from "express";
import allRoutes from "./src/routes/allRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import pool from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", allRoutes);



async function startServer() {
  try { 
    await pool.query('SELECT NOW()');  // test is it live
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}
startServer();
