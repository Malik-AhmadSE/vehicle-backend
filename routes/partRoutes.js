const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');

// Parts under Model
router.post('/brands/:brandId/years/:yearId/models/:modelId/parts', partController.createPart);
router.get('/brands/:brandId/years/:yearId/models/:modelId/parts', partController.getParts);
router.put('/brands/:brandId/years/:yearId/models/:modelId/parts/:partId', partController.updatePart);
router.delete('/brands/:brandId/years/:yearId/models/:modelId/parts/:partId', partController.deletePart);

module.exports = router;
