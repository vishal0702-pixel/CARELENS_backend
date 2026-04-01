 const mongoose = require('mongoose');

// Medical Resource Schema - Stores medical articles, guidelines, etc.
const MedicalResourceSchema = new mongoose.Schema({
  // Source Information
  source: {
    type: String,
    required: true,
    enum: ['pubmed', 'cdc', 'who', 'textbook', 'guideline'],
    index: true,
  },
  
  sourceId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // Content
  title: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: String,
  
  // Medical Information
  medicalInfo: {
    conditions: [String], // Related conditions
    symptoms: [String],   // Symptoms covered
    treatments: [String], // Treatments mentioned
    medications: [String], // Medications discussed
    
    // Medical codes
    icd10Codes: [String], // ICD-10 codes
    cptCodes: [String],   // CPT codes
    
    // Patient demographics
    ageGroup: {
      min: Number,
      max: Number,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'both'],
    },
    
    // Evidence level (A=highest, D=lowest)
    evidenceLevel: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      default: 'C',
    },
  },

}) 
  module.exports = mongoose.model('MedicalResource', MedicalResourceSchema);