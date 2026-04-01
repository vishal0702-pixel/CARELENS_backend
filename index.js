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
    "https://carelens-frontend-wqxz.vercel.app/"
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", authroutes);
app.use("/symptom", dashboardroute);

let isConnected = false;

async function initializeConnection() {
  if (!isConnected) {
    await connectDB();
    await redisclient.connect();
    console.log("MongoDB and Redis connected");
    isConnected = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await initializeConnection();
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("CareLens Backend Running");
});

module.exports = app;