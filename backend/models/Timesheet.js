const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  actualHours: { type: Number, required: true },
  submitted: { type: Boolean, default: false },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Timesheet || mongoose.model('Timesheet', timesheetSchema);
