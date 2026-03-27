// models/Experience.js
const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  organization: { type: String, required: true },
  duration: String,
  description: [String]
});

module.exports = mongoose.model("Experience", experienceSchema);