const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  closeProperty,
  deleteProperty,
} = require('../controllers/realEstatePropertyController');

const {
  getRequirements,
  getRequirement,
  createRequirement,
  updateRequirement,
  deleteRequirement,
} = require('../controllers/realEstateRequirementController');

const {
  getRevenue,
  getTransactions,
} = require('../controllers/realEstateRevenueController');

// ✅ All routes protected + admin/super_admin only
router.use(verifyToken);
router.use(checkRole(['super_admin', 'admin']));

// ============================================================
// PROPERTIES
// ============================================================
router.get('/properties', getProperties);
router.get('/properties/:id', getProperty);
router.post('/properties', upload.array('propertyPhotos', 10), createProperty);
router.put('/properties/:id', upload.array('propertyPhotos', 10), updateProperty);
router.patch('/properties/:id/close', closeProperty);
router.delete('/properties/:id', deleteProperty);

// ============================================================
// REQUIREMENTS
// ============================================================
router.get('/requirements', getRequirements);
router.get('/requirements/:id', getRequirement);
router.post('/requirements', createRequirement);
router.put('/requirements/:id', updateRequirement);
router.delete('/requirements/:id', deleteRequirement);

// ============================================================
// REVENUE
// ============================================================
router.get('/revenue', getRevenue);
router.get('/revenue/transactions', getTransactions);

module.exports = router;