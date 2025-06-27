const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authR');
app.use('/api/auth', authRoutes);
const taskRoutes = require('./routes/taskR');
app.use('/api/tasks', taskRoutes);
const timesheetRoutes = require('./routes/timesheetR');
app.use('/api/timesheet', timesheetRoutes);

app.get("/", (req, res) => {
  res.send("It's Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
