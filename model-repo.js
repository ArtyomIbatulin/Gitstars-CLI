const mongoose = require("mongoose");

const repoModel = new mongoose.Schema({
  idRepo: { type: Number, required: true },
  name: { type: String, required: true },
  owner_login: { type: String, required: true },
  html_url: { type: String, required: true },
  stargazers_count: { type: Number, required: true },
});

module.exports = mongoose.model("repoModel", repoModel);
