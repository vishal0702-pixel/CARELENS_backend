const Doctor = require("../models/doctor");

async function find_doctor(symptomsData) {

  try {

    const specialty = symptomsData?.specialty;

    if (!specialty) {
      console.log("No specialty provided");
      return [];
    }

    console.log("Searching doctors for:", specialty);

    const doctors = await Doctor.find({
      specialty: { $regex: specialty, $options: "i" }
    })
      .limit(5)
      .select("-password");

    console.log("Doctors found:", doctors.length);

    return doctors.map((doc) => ({
      id: doc._id,
      name: doc.firstname,
      specialty: doc.specialty,
      experience: doc.profile?.yearsExperience || 0,
      rating: doc.ratings?.overall || 0,
      city: doc.location?.address?.city || "",
      contact: doc.contact || "",
      image: doc.image || "",
      bookingUrl: doc.availability?.bookingUrl || ""
    }));

  } catch (err) {

    console.log("Doctor search error:", err);
    return [];

  }

}

module.exports = find_doctor;