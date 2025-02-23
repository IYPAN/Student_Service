const express = require('express');
const { getBatchesByCenter, enrollStudent, getEnrolledBatches } = require('../controllers/batchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/list', authMiddleware, getBatchesByCenter);
router.post('/enroll', authMiddleware, enrollStudent);
router.get('/enrolled', authMiddleware, getEnrolledBatches);

module.exports = router;
