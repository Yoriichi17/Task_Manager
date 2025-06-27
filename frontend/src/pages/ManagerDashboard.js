import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [report, setReport] = useState([]);
  const [errors, setErrors] = useState({});
  const [taskForm, setTaskForm] = useState({
    taskDescription: '',
    estimatedHours: '',
    taskDate: '',
    assignedTo: '',
  });

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/associates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setErrors((prev) => ({ ...prev, users: null }));
    } catch (err) {
      setUsers([]);
      setErrors((prev) => ({ ...prev, users: 'Failed to load associates' }));
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setErrors((prev) => ({ ...prev, tasks: null }));
    } catch (err) {
      setTasks([]);
      setErrors((prev) => ({ ...prev, tasks: 'Failed to load tasks' }));
    }
  };

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/timesheet/submitted', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimesheets(res.data);
      setErrors((prev) => ({ ...prev, timesheets: null }));
    } catch (err) {
      setTimesheets([]);
      setErrors((prev) => ({ ...prev, timesheets: 'Failed to load timesheets' }));
    }
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data);
      setErrors((prev) => ({ ...prev, report: null }));
    } catch (err) {
      setReport([]);
      setErrors((prev) => ({ ...prev, report: 'Failed to load report' }));
    }
  };

useEffect(() => {
  const fetchAll = () => {
    fetchUsers();
    fetchTasks();
    fetchTimesheets();
    fetchReport();
  };

  fetchAll();

  const interval = setInterval(fetchAll, 15000); 

  return () => clearInterval(interval); 
}, []);


  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks/assign', taskForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskForm({ taskDescription: '', estimatedHours: '', taskDate: '', assignedTo: '' });
      fetchTasks();
      fetchReport();
    } catch (err) {
      alert('Failed to assign task');
    }
  };

  return (
    <div className="manager-container">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>

      <section className="section">
        <h3>Assign Task</h3>
        <form onSubmit={handleAssignTask}>
          <input
            type="text"
            placeholder="Task Description"
            value={taskForm.taskDescription}
            onChange={(e) => setTaskForm({ ...taskForm, taskDescription: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Estimated Hours"
            value={taskForm.estimatedHours}
            onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
            required
          />
          <input
            type="date"
            value={taskForm.taskDate}
            onChange={(e) => setTaskForm({ ...taskForm, taskDate: e.target.value })}
            required
          />
          <select
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            required
            style={{width : 912}}
          >
            <option value="">Select Associate</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))
            ) : (
              <option disabled>No associates found</option>
            )}
          </select>
          <button type="submit">Assign</button>
        </form>
      </section>

      <section className="section">
        <h3>All Tasks</h3>
        {errors.tasks ? (
          <p>{errors.tasks}</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.taskDescription}</strong> - {task.estimatedHours} hrs on{' '}
                {new Date(task.taskDate).toLocaleDateString()} for{' '}
                {task.assignedTo?.name} ({task.assignedTo?.email})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <h3>Submitted Timesheets</h3>
        {errors.timesheets ? (
          <p>{errors.timesheets}</p>
        ) : timesheets.length === 0 ? (
          <p>No timesheets submitted</p>
        ) : (
          <ul>
            {timesheets.map((t) => (
              <li key={t._id}>
                {t.user.name} | {t.task.taskDescription} | {t.actualHours} hrs on{' '}
                {new Date(t.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <h3>Planned vs Actual Report</h3>
        {errors.report ? (
          <p>{errors.report}</p>
        ) : report.length === 0 ? (
          <p>No report data found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Associate</th>
                <th>Task</th>
                <th>Date</th>
                <th>Estimated</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody style={{textAlign : 'center'}}>
              {report.map((r, i) => (
                <tr key={i}>
                  <td>{r.associate}</td>
                  <td>{r.task}</td>
                  <td>{new Date(r.taskDate).toLocaleDateString()}</td>
                  <td>{r.estimatedHours}</td>
                  <td>{r.actualHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ManagerDashboard;
