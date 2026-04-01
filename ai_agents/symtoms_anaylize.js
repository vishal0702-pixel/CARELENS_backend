require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const path = require("path");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenAI } = require("@google/genai");

// -----------------------
// Config
// -----------------------
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

const PDF_FILE = path.join(__dirname, "..", "data.pdf");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// -----------------------
// Main function
// -----------------------

async function run() {
  try {

    console.log("Loading PDF...");

    const loader = new PDFLoader(PDF_FILE);
    const rawDocs = await loader.load();

    console.log("Pages:", rawDocs.length);

    // Split text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP
    });

    const chunkedDocs = await splitter.splitDocuments(rawDocs);

    const cleanChunks = chunkedDocs.filter(
      doc => doc.pageContent && doc.pageContent.trim().length > 20
    );

    console.log("Total chunks:", cleanChunks.length);

    // Connect Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    console.log("Connected to Pinecone");

    const vectors = [];

    // Create embeddings using Gemini
    for (let i = 0; i < cleanChunks.length; i++) {

      const text = cleanChunks[i].pageContent.trim();

      const response = await ai.models.embedContent({
        model: "embedding-001",
        contents: text
      });

      const embedding = response.embeddings[0].values;

      vectors.push({
        id: "chunk-" + i,
        values: embedding,
        metadata: { text }
      });
    }

    console.log("Vectors prepared:", vectors.length);

    // Batch upload
    const BATCH_SIZE = 50;

    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {

      const batch = vectors.slice(i, i + BATCH_SIZE);

      await pineconeIndex.upsert(batch);

      console.log(`Uploaded batch ${i / BATCH_SIZE + 1}`);
    }

    console.log("Upload successful");

  } catch (error) {

    console.error("ERROR:");
    console.error(error);

  }
}

run();