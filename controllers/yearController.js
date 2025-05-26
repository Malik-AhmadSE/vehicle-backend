const Vehicle = require('../models/Vehicle');
const mongoose =require("mongoose")
// Get years for a brand
exports.getYears = async (req, res) => {
  const { brandId } = req.params;
  try {
    const brand = await Vehicle.findById(brandId, 'years');
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand.years);
  } catch (error) {
    res.status(500).json({ message: 'Server error getting years' });
  }
};

// Add a year to a brand
exports.addYear = async (req, res) => {
  const { brandId } = req.params;
  const { year } = req.body;

  if (!year) return res.status(400).json({ message: 'Year is required' });

  try {
    const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    // Check if year exists
    if (brand.years.some(y => y.year === year))
      return res.status(400).json({ message: 'Year already exists' });

    brand.years.push({ year, models: [] });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding year' });
  }
};

// Update a year by id
exports.updateYear = async (req, res) => {
  const { brandId, yearId } = req.params;
  const { year } = req.body;
  if (!year) return res.status(400).json({ message: 'Year is required' });

  try {
    const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    const yearItem = brand.years.id(yearId);
    if (!yearItem) return res.status(404).json({ message: 'Year not found' });

    yearItem.year = year;
    await brand.save();

    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating year' });
  }
};

// Delete a year by id
exports.deleteYear = async (req, res) => {
  const { brandId, yearId } = req.params;
  
  try {
   const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    const yearItem = brand.years.id(yearId);
    if (!yearItem) return res.status(404).json({ message: 'Year not found' });
    yearItem.deleteOne();
    await brand.save();
    res.json({ message: 'Year deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting year' });
  }
};
