import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: email, // твои переменные из useState
      password: password
    });

    if (res.data.token) {
      // Сохраняем данные в сессию
      sessionStorage.setItem("mw_logged_in", "true");
      sessionStorage.setItem("mw_user", res.data.email);
      sessionStorage.setItem("mw_token", res.data.token);
      sessionStorage.setItem("mw_role", res.data.role);
      
      navigate("/dashboard");
    }
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
};

  return (
    // Обертка auth-page дает темный фон и центрирование из твоего CSS
    <div className="auth-page">
      <div className="old-style-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Login</h1>
            <p>Please log in to your account to continue.</p>
          </div>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-full-width">
              Log In
            </button>
            
            <a href="#" className="forgot-password">Forgot your password?</a>
          </form>
          
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;