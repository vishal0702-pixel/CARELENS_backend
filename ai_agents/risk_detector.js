const { GoogleGenAI } = require("@google/genai");

async function risk(symptomsData) {

  try {

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `
User symptoms analysis:

${symptomsData}

Return JSON:

{
 "riskLevel": "",
 "riskScore": "",
 "prevention": []
}
`
    });

    let text = response.candidates[0].content.parts[0].text;

    try {
      return JSON.parse(text);
    } catch {

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "");

      return JSON.parse(cleaned);

    }

  } catch (e) {

    console.log("Risk AI error:", e);

    return {
      riskLevel: "Low",
      riskScore: 1,
      prevention: []
    };

  }

}

module.exports = risk;