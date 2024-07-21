// models/Category.js

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  course: {
    type: String,
    enum: ["MCA", "MSC", "MCOM", "MBA"],
    required: true,
  },
  // Add any other fields as needed
});

module.exports = mongoose.model("Category", categorySchema);
