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
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

let isConnected = false;

async function initializeConnection() {
  if (!isConnected) {
    await connectDB();

    if (!redisclient.isOpen) {
      await redisclient.connect();
    }

    console.log("MongoDB and Redis connected");
    isConnected = true;
  }
}

app.use(async (req,res,next)=>{
  try{
    await initializeConnection();
    next();
  }catch(err){
    console.error("DB error:",err);
    res.status(500).json({error:"Database connection failed"});
  }
});

app.use("/user", authroutes);
app.use("/symptom", dashboardroute);

app.get("/",(req,res)=>{
  res.send("CareLens Backend Running 🚀");
});

module.exports = app;