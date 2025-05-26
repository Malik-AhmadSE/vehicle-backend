const express = require('express');
const router = express.Router({ mergeParams: true });
const yearController = require('../controllers/yearController');

router.get('/', yearController.getYears);
router.post('/', yearController.addYear);
router.put('/:yearId', yearController.updateYear);
router.delete('/:yearId', yearController.deleteYear);

module.exports = router;
