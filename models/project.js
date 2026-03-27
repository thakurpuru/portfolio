// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tech_stack: [String],
  live_link: String,
  github_link: String
});

module.exports = mongoose.model("Project", projectSchema);