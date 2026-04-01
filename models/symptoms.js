const  mongoose =  require ("mongoose");

const {Schema}= mongoose ;

const syptoms_Schema =  new Schema(
    { 

    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Analysis Session
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // User Input
  symptoms: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Detailed Symptoms (Optional)
  symptomDetails: {
    duration: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
    },
    location: [String], // e.g., ['head', 'chest']
    timing: String, // e.g., 'morning', 'after eating'
  },
  
  // AI Analysis Results
  analysis: {
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    
    // Possible conditions with probabilities
    possibleConditions: [{
      name: String,
      probability: Number, // 0 to 1
      confidence: Number, // 0 to 1
      description: String,
    }],
    
    // Key findings from AI
    keyFindings: [String],
    
    // Recommendations
    recommendations: [{
      type: {
        type: String,
        enum: ['self-care', 'see-doctor', 'emergency', 'monitor'],
      },
      text: String,
      priority: Number, // 1 to 5 (1 = highest)
    }],
    
    // Emergency flags (if any)
    emergencyFlags: [{
      type: String,
      description: String,
    }],
    
    // Analysis summary
    summary: {
      type: String,
      required: true,
    },
    
    // Confidence in analysis
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8,
    },
  },
  
  // RAG System Information
  ragContext: {
    sources: [{
      type: String,
      enum: ['pubmed', 'cdc', 'textbook', 'guideline'],
      title: String,
      relevance: Number, // 0 to 1
    }],
    
    // Search queries used
    searchQueries: [String],
    
    // Number of documents retrieved
    documentsRetrieved: {
      type: Number,
      default: 0,
    },
  },
  
  // Doctor Recommendations (if any)
  doctorRecommendations: [{
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    reason: String,
    matchScore: Number, // 0 to 100
  }],
  
  // Follow-up Information
  followUp: {
    needed: Boolean,
    suggestedDate: Date,
    questions: [String],
  },
  
    }
)

const Syptoms = mongoose.model("syptoms" , syptoms_Schema );
module.exports = Syptoms ; 