const mongoose = require("mongoose");
const { Schema } = mongoose;

const HealthReportSchema = new Schema({

  symptoms: {
    disease: { type: String, default: "" },
    risk_level: { type: String, default: "Unknown" },
    specialty: { type: String, default: "" },
    explanation: { type: String, default: "" },
    advice: { type: String, default: "" }
  },

  riskLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  doctors: [
    {
      id: { type: Schema.Types.ObjectId },
      name: String,
      specialty: String,
      experience: Number,
      rating: Number,
      city: String,
      contact: String,
      image: String,
      bookingUrl: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});


const userSchema = new Schema({

  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },

  lastname: {
    type: String,
    minlength: 3,
    maxlength: 10
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin", "doctor"],
    default: "user"
  },

  photo: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  bloodgroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
    default: "unknown"
  },

  location: {
    type: String
  },

  healthReports: [HealthReportSchema]

});

const User = mongoose.model("User", userSchema);

module.exports = User;