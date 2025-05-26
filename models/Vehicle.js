const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
  part: String,
});

const ModelSchema = new mongoose.Schema({
  model: String,
  parts: [PartSchema],
});

const YearSchema = new mongoose.Schema({
  year: String,
  models: [ModelSchema],
});

const VehicleSchema = new mongoose.Schema({
  brand: String,
  years: [YearSchema],
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
