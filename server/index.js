require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const { user_structure } = require("./types");
const { User } = require("./db");
const bcrypt = require("bcrypt");
const secret = process.env.SECRET;

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

// Signup route
app.post("/signup", async (req, res) => {
  if (!user_structure.safeParse(req.body).success) {
    return res.status(400).json({ message: "Email/password not in correct format" });
  }
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email: username, password: password });
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Signin route
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ username: user.username }, secret, {
      expiresIn: "12h",
    });
    res.json({ message: "Signin successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in" });
  }
});

// POST endpoint to handle chat
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  try {
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
app.listen(3000);
