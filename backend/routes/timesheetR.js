const express = require('express');
const router = express.Router();
const controller = require('../controllers/timesheetC');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/log', protect, authorizeRoles('associate'), controller.logHours);
router.post('/submit/:timesheetId', protect, authorizeRoles('associate'), controller.submitSingleTimesheet);
router.get('/mytasks', protect, authorizeRoles('associate'), controller.getAllAssignedTasks);
router.get('/submitted', protect, authorizeRoles('manager'), controller.getSubmittedTimesheets);

module.exports = router;
