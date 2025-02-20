const express = require('express');
const { getBatchesByCenter, enrollStudent } = require('../controllers/batchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/list', authMiddleware, getBatchesByCenter);
router.post('/enroll', authMiddleware, enrollStudent);

module.exports = router;
