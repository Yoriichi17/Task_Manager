const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskC');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Manager routes
router.post('/assign', protect, authorizeRoles('manager'), taskController.assignTask);
router.get('/all', protect, authorizeRoles('manager'), taskController.getAllTasks);
router.get('/summary', protect, authorizeRoles('manager'), taskController.getPlannedVsActual);
router.get('/associates', protect, authorizeRoles('manager'), taskController.getAssociates)
module.exports = router;
