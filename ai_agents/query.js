require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function chatting(symptoms) {

  try {

    const response = await ai.models.generateContent({
      model: "	gemini-3.1-flash-lite-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze the symptoms and return JSON.

Symptoms:
${symptoms}

Return JSON:

{
 "disease": "",
 "risk_level": "",
 "specialty": "",
 "explanation": "",
 "advice": ""
}

Allowed specialties:
Cardiology
Dermatology
Neurology
Orthopedics
Gastroenterology
General Physician
Psychiatry
ENT
Pulmonology
`
            }
          ]
        }
      ]
    });

    const text = response.candidates[0].content.parts[0].text;

    try {
      return JSON.parse(text);
    } catch {

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "");

      return JSON.parse(cleaned);

    }

  } catch (err) {

    console.log("Gemini error:", err);

    return {
      disease: "Unknown",
      risk_level: "Low",
      specialty: "General Physician",
      explanation: "AI service unavailable",
      advice: "Consult a doctor"
    };

  }

}

module.exports = { chatting };