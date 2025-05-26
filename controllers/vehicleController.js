const Vehicle = require('../models/Vehicle');

exports.createModel = async (req, res) => {
  try {
    const { brandId, yearId } = req.params;
    const { model } = req.body;
    
    const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const yearObj = brand.years.id(yearId);
    if (!yearObj) return res.status(404).json({ error: 'Year not found' });

    yearObj.models.push({ model, variants: [] });
    await brand.save();
    
    res.status(201).json(yearObj.models[yearObj.models.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all models for a year
exports.getModels = async (req, res) => {
  try {
    const { brandId, yearId } = req.params;

    const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const yearObj = brand.years.id(yearId);
    if (!yearObj) return res.status(404).json({ error: 'Year not found' });

    res.json(yearObj.models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a model
exports.updateModel = async (req, res) => {
  try {
    const { brandId, yearId, modelId } = req.params;
    const { model } = req.body;

    const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const yearObj = brand.years.id(yearId);
    if (!yearObj) return res.status(404).json({ error: 'Year not found' });

    const modelObj = yearObj.models.id(modelId);
    if (!modelObj) return res.status(404).json({ error: 'Model not found' });

    modelObj.model = model;
    await brand.save();

    res.json(modelObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a model
exports.deleteModel = async (req, res) => {
  try {
    const { brandId, yearId, modelId } = req.params;

    const brand = await Vehicle.findById(brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const yearObj = brand.years.id(yearId);
    if (!yearObj) return res.status(404).json({ error: 'Year not found' });

    const modelObj = yearObj.models.id(modelId);
    if (!modelObj) return res.status(404).json({ error: 'Model not found' });

    modelObj.deleteOne();
    await brand.save();

    res.json({ message: 'Model deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
