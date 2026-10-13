const express = require('express');
const {
  submitEnquiry,
  getPublicEnquiries,
  claimEnquiry,
  getMyEnquiries,
} = require('../controllers/enquiryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public endpoint
router.post('/', submitEnquiry);

// Protected endpoints
router.get('/public', authenticateToken, getPublicEnquiries);
router.patch('/:id/claim', authenticateToken, claimEnquiry);
router.get('/my', authenticateToken, getMyEnquiries);

module.exports = router;
