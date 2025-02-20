const express = require('express');
const { registerStudent, loginStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/update', authMiddleware, updateStudent);
router.delete('/delete', authMiddleware, deleteStudent);

module.exports = router;
