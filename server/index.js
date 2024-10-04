require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const { user_structure } = require("./types");
const { User, Chat } = require("./db");
const bcrypt = require("bcrypt");
const { userMiddleware } = require("./middlewares");
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
    return res
      .status(400)
      .json({ message: "Email/password not in correct format" });
  }
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email: email, password: hashedPassword });
  res.json({ message: "User created successfully" });
});

// Signin route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password).then(result => result);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ email: user.email }, secret, {
    expiresIn: "12h",
  });
  res.json({ message: "Signin successful", token });
});

// POST endpoint to handle chat
app.post("/chat", userMiddleware, async (req, res) => {
  const { prompt } = req.body.prompt;
  try {
    const result = await model.generateContent(prompt);
    Chat.create({
      user: req.body.email,
      query: prompt,
      response: result.response.text(),
    });
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

app.get("/history", userMiddleware, async (req, res) => {
  const chats = await Chat.find({ user: req.body.email });
  res.json(chats);
});

// Start the server
app.listen(3000);
