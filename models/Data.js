const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DataSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  mw: {
    type: Number,
    required: true
  }
});

module.exports = Data = mongoose.model("dbsubsts", DataSchema);