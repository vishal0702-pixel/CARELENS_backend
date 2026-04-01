const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function remainingdoc(symptomsData, userLocation) {

  try {

    const specialty = symptomsData?.specialty || "General Physician";
const prompt = `
You are a medical directory assistant.

Your task is to suggest REAL and WELL-KNOWN doctors.

Conditions:
- Only suggest real doctors that are known in the city.
- Prefer famous, reputed, or highly experienced doctors.
- Doctors should exist in public directories like hospitals, clinics, or Practo.
- Do NOT generate random or fictional names.

User symptoms analysis:
Disease: ${symptomsData.disease}
Required specialty: ${specialty}

Location:
${userLocation}

Return 6 doctors who are WELL-KNOWN in this city for this specialty.

Return ONLY JSON in this format:

[
  {
    "name": "Doctor Name",
    "specialization": "${specialty}",
    "location": "city /area",
    "contact": "Phone or clinic contact if known"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt
    });

    const text = response.text;

    let result = [];

    try {

      const clean = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(clean);

    } catch (err) {

      console.log("JSON parse error:", err.message);
      console.log("Raw AI response:", text);

    }

    return result;

  } catch (error) {

    console.log("Remaining doctor error:", error);
    return [];

  }

}

module.exports = remainingdoc;