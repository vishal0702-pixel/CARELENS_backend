const mongoose = require("mongoose");

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    firstname: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "doctor"],
      default: "doctor",
    },

    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },

    specialty: {
      type: String,
      required: true,
      index: true,
      
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    licenseState: {
      type: String,
      trim: true,
    },

    // Contact Information
    contact: {
      type: Number,
      required: true,
      unique: true,
    },

    website: {
      type: String,
      trim: true,
    },

    // Location
    location: {
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
          type: String,
          default: "INDIA",
        },
      },
    },

    // Coordinates for geo search
    coordinates: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    // Availability
    availability: {
      schedule: [
        {
          day: {
            type: String,
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
          },
          slots: [
            {
              start: String,
              end: String,
              type: {
                type: String,
                enum: ["in-person", "telemedicine"],
              },
            },
          ],
        },
      ],

      nextAvailable: Date,
      bookingUrl: String,
    },

    // Ratings
    ratings: {
      overall: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // Profile
    profile: {
      yearsExperience: Number,

      education: [
        {
          degree: String,
          institution: String,
          year: Number,
        },
      ],

      certifications: [String],

      bio: String,
    },

    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    },
  },
  { timestamps: true }
);

// Index for faster specialist search


// Geo index for location search
doctorSchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;