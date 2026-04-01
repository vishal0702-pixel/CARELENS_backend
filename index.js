require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const redisclient = require("./config/redis");

const authroutes = require("./routes/userauthroute");
const dashboardroute = require("./routes/userdashboard");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://carelens-frontend-cv4q.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

let isConnected = false;

async function initializeConnection() {
  try {
    if (!isConnected) {
      await connectDB();

      // connect redis only if not already connected
      if (!redisclient.isOpen) {
        await redisclient.connect();
      }

      console.log("MongoDB and Redis connected");
      isConnected = true;
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await initializeConnection();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/user", authroutes);
app.use("/symptom", dashboardroute);

app.get("/", (req, res) => {
  res.send("CareLens Backend Running 🚀");
});

module.exports = app;