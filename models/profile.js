// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  education: String,
  github_link: String,
  linkedin_link: String,
  portfolio_link: String,
  leetcode_link: String,
  profile_link: String,
  bio: String,
  objective: String,
  interests: String,
  availability: String
});

module.exports = mongoose.model("Profile", profileSchema);