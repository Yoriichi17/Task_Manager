const Timesheet = require('../models/Timesheet');
const Task = require('../models/Task');

// Associate logs hours
exports.logHours = async (req, res) => {
  const { taskId, actualHours, date } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findById(taskId);
    if (!task || task.assignedTo.toString() !== userId)
      return res.status(403).json({ msg: 'Not authorized for this task' });

    const timesheet = new Timesheet({
      user: userId,
      task: taskId,
      actualHours,
      date,
    });

    await timesheet.save();
    res.status(201).json({ msg: 'Hours logged successfully', timesheet });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Submit a specific timesheet entry by ID
exports.submitSingleTimesheet = async (req, res) => {
  const userId = req.user.id;
  const { timesheetId } = req.params;

  try {
    const timesheet = await Timesheet.findOne({ _id: timesheetId });

    if (!timesheet) {
      return res.status(404).json({ msg: 'Timesheet entry not found' });
    }

    if (timesheet.user.toString() !== userId) {
      return res.status(403).json({ msg: 'You are not authorized to submit this entry' });
    }

    if (timesheet.submitted) {
      return res.status(400).json({ msg: 'Timesheet entry already submitted' });
    }

    timesheet.submitted = true;
    await timesheet.save();

    res.json({ msg: 'Timesheet entry submitted', timesheet });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all tasks assigned to the current associate
exports.getAllAssignedTasks = async (req, res) => {
  const userId = req.user.id;

  try {

    const submittedTimesheets = await Timesheet.find({ user: userId, submitted: true }).select('task');
    const submittedTaskIds = submittedTimesheets.map(entry => entry.task.toString());
    const tasks = await Task.find({
      assignedTo: userId,
      _id: { $nin: submittedTaskIds }
    }).sort({ taskDate: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Manager: View all submitted timesheets
exports.getSubmittedTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ submitted: true })
      .populate('user', 'name email')
      .populate('task', 'taskDescription taskDate estimatedHours');
      
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
