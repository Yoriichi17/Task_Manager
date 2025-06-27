import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } catch (err) {
      setErrMsg(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="page-container">
      <h1>TASK MANAGER</h1>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button type="submit">Login</button>
          {errMsg && <p>{errMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
