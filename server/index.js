const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI
// const openai = new OpenAI({ 
//   organization: process.env.OPENAI_ORGANIZATION,
//   apiKey: process.env.OPENAI_API_KEY
// });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST endpoint to handle chat
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  try{
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return res.json({ response: result.response.text() });
  } catch (error) {
    return res.status(500).json({ response: "Something went wrong" });
  }
});

// GET endpoint to handle chat
app.get("/stream", async (req, res) => {
  // TODO: Stream the response back to the client
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
