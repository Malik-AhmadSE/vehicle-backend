const Vehicle = require('../models/Vehicle');

// Get all brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Vehicle.find({}, 'brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error getting brands' });
  }
};

// Create a new brand
exports.createBrand = async (req, res) => {
  const { brand } = req.body;
  if (!brand) return res.status(400).json({ message: 'Brand name is required' });

  try {
    const exists = await Vehicle.findOne({ brand });
    if (exists) return res.status(400).json({ message: 'Brand already exists' });

    const newBrand = new Vehicle({ brand, years: [] });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating brand' });
  }
};

// Update brand name by ID
exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brand } = req.body;
  if (!brand) return res.status(400).json({ message: 'Brand name is required' });
    const updated = await Vehicle.findByIdAndUpdate(id, { brand },{new:true});
    if (!updated) return res.status(404).json({ message: 'Brand not found' });
  try {
  
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating brand' });
  }
};

// Delete brand by ID
exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Vehicle.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Brand not found' });

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting brand' });
  }
};
