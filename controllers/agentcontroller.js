const risk = require("../ai_agents/risk_detector");
const findDoctor = require("../ai_agents/find_doctor");
const { chatting } = require("../ai_agents/query");
const remainingdoc = require("../ai_agents/remainingdocter");
const User = require("../models/user");

const agentcontroller = async (req, res) => {

  try {

    console.log("=========== AGENT CONTROLLER START ===========");

    const { symptoms } = req.body;
    const userLocation = req.result?.location || "unknown";

    console.log("Received symptoms:", symptoms);

    if (!symptoms) {
      return res.status(400).json({
        message: "Symptoms required"
      });
    }

    

    console.log("User location:", userLocation);

    // STEP 1
    console.log("Running symptom analysis...");
    const symptomsData = await chatting(symptoms);
    console.log("SymptomsData:", symptomsData);

    // STEP 2
    console.log("Running risk detector...");
    const riskData = await risk(JSON.stringify(symptomsData));
    console.log("RiskData:", riskData);

    // STEP 3
    console.log("Searching doctors in DB...");
    const doctors = await findDoctor(symptomsData);
    console.log("DB Doctors:", doctors);
    console.log("DB Doctors Count:", doctors?.length);

    // STEP 4 (ALWAYS CALL AI)
    console.log("Calling remaining doctor AI...");
    const remdoc = await remainingdoc(symptomsData, userLocation);
    console.log("AI Doctors:", remdoc);
    console.log("AI Doctors Count:", remdoc?.length);

    console.log("=========== AGENT CONTROLLER END ===========");

    res.status(200).json({
      symptoms: symptomsData,
      riskLevel: riskData,
      doctors: doctors || [],
      remainingdocter: remdoc || []
    });

  } catch (error) {

    console.log("Controller Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = agentcontroller;