const Vehicle = require('../models/Vehicle');

exports.getVehicleTree = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    console.error("Error fetching vehicle tree", err);
    res.status(500).json({ error: "Server error" });
  }
};
