require("dotenv").config();

const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { TaskType } = require("@google/generative-ai");

async function testEmbedding() {
  try {

    console.log("API KEY:", process.env.GOOGLE_API_KEY ? "Loaded ✅" : "Missing ❌");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Medical document"
    });

    console.log("Testing embedding...\n");

    const vector = await embeddings.embedQuery(
      "fever headache vomiting"
    );

    console.log("Embedding vector length:", vector.length);
    console.log("\nFirst 10 values of vector:");
    console.log(vector.slice(0, 10));

  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  }
}

testEmbedding();