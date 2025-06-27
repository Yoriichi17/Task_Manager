import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AssociateDashboard.css';

const AssociateDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [actuals, setActuals] = useState({});
  const [timesheetMap, setTimesheetMap] = useState({});
  const [isAuth, setIsAuth] = useState(true);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/timesheet/mytasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data.filter(
        (task) =>
          task.assignedTo === user.id &&
          (!selectedDate || task.taskDate.slice(0, 10) === selectedDate)
      );
      setTasks(filtered);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };


  const handleLogHours = async (task) => {
  const hours = actuals[task._id];
  if (!hours || hours <= 0) {
    alert('Please enter valid actual hours.');
    return;
  }

  try {
    const res = await axios.post(
      'http://localhost:5000/api/timesheet/log',
      {
        taskId: task._id,
        actualHours: hours,
        date: new Date(task.taskDate).toISOString(),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Hours logged!');
    const newTimesheet = res.data.timesheet;
    setTimesheetMap((prev) => ({
      ...prev,
      [task._id]: newTimesheet._id,
    }));
    setActuals((prev) => ({ ...prev, [task._id]: '' }));
  } catch (err) {
    alert('Failed to log hours');
  }
};


  const handleSubmit = async (taskId) => {
    const timesheetId = timesheetMap[taskId];
    if (!timesheetId) return;

    try {
      await axios.post(
        `http://localhost:5000/api/timesheet/submit/${timesheetId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Timesheet submitted!');
      fetchTasks();
    } catch (err) {
      alert('Submission failed');
    }
  };

useEffect(() => {
  if (!token || !user?.id) {
    setIsAuth(false);
    return; // stop here if not authenticated
  }

  const fetchAll = () => {
    fetchTasks();
  };

  fetchAll(); // initial fetch

  const interval = setInterval(fetchAll, 15000); // fetch every 15 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, [selectedDate, token, user?.id]);


  if (!isAuth) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="associate-container">
      <div className="dashboard-header">
        <h2>Associate Dashboard</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>

      <div className="filter-section">
        <label style={{marginTop : '10px'}}>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="tasks-section">
        {tasks.length === 0 ? (
          <p>No tasks found for the selected date.</p>
        ) : (
          <ul>
            {tasks.map((task) => {
              const isLogged = !!timesheetMap[task._id];
              return (
                <li key={task._id}>
                  <strong>{task.taskDescription}</strong> ({task.estimatedHours} hrs)
                  <div className="task-entry">
                    <input
                      type="number"
                      placeholder="Actual hours"
                      value={actuals[task._id] || ''}
                      onChange={(e) =>
                        setActuals({ ...actuals, [task._id]: e.target.value })
                      }
                      disabled={isLogged}
                    />
                    <button
                      onClick={() => handleLogHours(task)}
                      disabled={isLogged}
                    >
                      {isLogged ? 'Logged' : 'Log Hours'}
                    </button>
                    <button
                      onClick={() => handleSubmit(task._id)}
                      disabled={!isLogged}
                    >
                      Submit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssociateDashboard;
