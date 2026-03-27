// models/Education.js
const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  start_year: String,
  end_year: String,
  cgpa: String,
  coursework: [String]
});

module.exports = mongoose.model("Education", educationSchema);