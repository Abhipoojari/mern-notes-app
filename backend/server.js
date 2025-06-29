// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create an Express app
const app = express();

// Middleware to parse JSON and allow cross-origin requests
app.use(cors());
app.use(express.json());

//Routes
const notesRoutes = require("./routes/notesroute");
app.use("/api/notes", notesRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the Notes App API!");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
