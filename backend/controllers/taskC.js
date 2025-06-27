const Task = require('../models/Task');
const User = require('../models/User');
const Timesheet = require('../models/Timesheet')

// Create a new task (Manager only)
exports.assignTask = async (req, res) => {
  const { taskDescription, estimatedHours, taskDate, assignedTo } = req.body;

  try {
    const user = await User.findById(assignedTo);
    if (!user || user.role !== 'associate') {
      return res.status(400).json({ msg: 'Invalid associate ID' });
    }

    const newTask = new Task({ taskDescription, estimatedHours, taskDate, assignedTo });
    await newTask.save();
    res.status(201).json({ msg: 'Task assigned successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all tasks (Manager view - grouped by associate)
exports.getAllTasks = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.taskDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name email').sort({ taskDate: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


exports.getPlannedVsActual = async (req, res) => {
  try {
    // Get all tasks with assigned user details
    const tasks = await Task.find().populate('assignedTo', 'name email').lean();

    // Get all submitted timesheets in one go
    const timesheets = await Timesheet.find({ submitted: true }).lean();

    // Create a map from taskId -> array of timesheets
    const taskTimesheetMap = {};
    timesheets.forEach((entry) => {
      const tid = entry.task.toString();
      if (!taskTimesheetMap[tid]) {
        taskTimesheetMap[tid] = [];
      }
      taskTimesheetMap[tid].push(entry);
    });

    // Build the final report
    const report = tasks.map((task) => {
      const taskId = task._id.toString();
      const relatedTimesheets = taskTimesheetMap[taskId] || [];
      const totalActual = relatedTimesheets.reduce((sum, t) => sum + t.actualHours, 0);

      return {
        associate: task.assignedTo?.name || 'N/A',
        email: task.assignedTo?.email || 'N/A',
        task: task.taskDescription,
        taskDate: task.taskDate,
        estimatedHours: task.estimatedHours,
        actualHours: totalActual,
      };
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: 'Error generating report', error: err.message });
  }
};


exports.getAssociates = async (req, res) => {
  try {
    const associates = await User.find({ role: 'associate' }).select('name email _id');
    res.json(associates);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
    