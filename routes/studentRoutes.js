const express = require('express');
const { registerStudent, loginStudent, updateStudent, deleteStudent, getStates, getCentersByState} = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/states', getStates);
router.get('/centers', getCentersByState);
router.put('/update', authMiddleware, updateStudent);
router.delete('/delete', authMiddleware, deleteStudent);

module.exports = router;
