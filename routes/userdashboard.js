const express = require("express");
const agentcontroller = require("../controllers/agentcontroller");
const usermiddleware = require("../middleware/usermiddleware");

const dashboardroute = express.Router();

dashboardroute.post("/report", usermiddleware, agentcontroller);

module.exports = dashboardroute;