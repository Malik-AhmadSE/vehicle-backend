const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Create model
router.post('/brands/:brandId/years/:yearId/models', vehicleController.createModel);

// Get all models for a year
router.get('/brands/:brandId/years/:yearId/models', vehicleController.getModels);

// Update model
router.put('/brands/:brandId/years/:yearId/models/:modelId', vehicleController.updateModel);

// Delete model
router.delete('/brands/:brandId/years/:yearId/models/:modelId', vehicleController.deleteModel);
module.exports = router;