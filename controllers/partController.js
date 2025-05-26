const Vehicle = require('../models/Vehicle');

exports.createPart = async (req, res) => {
  const { brandId, yearId, modelId } = req.params;
  const { part } = req.body;

  try {
    const vehicle = await Vehicle.findById(brandId);
    const year = vehicle?.years.id(yearId);
    const model = year?.models.id(modelId);

    if (!model) return res.status(404).json({ message: 'Model not found' });

    model.parts.push({ part });
    await vehicle.save();

    res.status(201).json({ message: 'Part added', part });
  } catch (error) {
    res.status(500).json({ message: 'Error adding part', error });
  }
};

// Get Parts
exports.getParts = async (req, res) => {
  const { brandId, yearId, modelId } = req.params;

  try {
    const vehicle = await Vehicle.findById(brandId);
    const year = vehicle?.years.id(yearId);
    const model = year?.models.id(modelId);

    if (!model) return res.status(404).json({ message: 'Model not found' });

    res.status(200).json(model.parts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parts', error });
  }
};

// Update Part
exports.updatePart = async (req, res) => {
  const { brandId, yearId, modelId, partId } = req.params;
  const { part } = req.body;

  try {
    const vehicle = await Vehicle.findById(brandId);
    const year = vehicle?.years.id(yearId);
    const model = year?.models.id(modelId);
    const partItem = model?.parts.id(partId);

    if (!partItem) return res.status(404).json({ message: 'Part not found' });

    partItem.part = part;
    await vehicle.save();

    res.status(200).json({ message: 'Part updated', part: partItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating part', error });
  }
};

// Delete Part
exports.deletePart = async (req, res) => {
  const { brandId, yearId, modelId, partId } = req.params;

  try {
    const vehicle = await Vehicle.findById(brandId);
    const year = vehicle?.years.id(yearId);
    const model = year?.models.id(modelId);
    const partItem = model?.parts.id(partId);

    if (!partItem) return res.status(404).json({ message: 'Part not found' });

    partItem.deleteOne();
    await vehicle.save();

    res.status(200).json({ message: 'Part deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting part', error });
  }
};
