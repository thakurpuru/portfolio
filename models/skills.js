// models/Skill.js
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  proficiency: { type: Number, default: 0 },
  is_top: { type: Boolean, default: false }
});

module.exports = mongoose.model("Skill", skillSchema);