import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password.length >= 4) {
      sessionStorage.setItem('mw_logged_in', 'true');
      sessionStorage.setItem('mw_user', email);
      navigate('/dashboard'); // Исправил путь на /dashboard
    } else {
      alert('Введите корректные данные (пароль от 4 символов)');
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
          
          <form className="auth-form" onSubmit={handleSubmit}>
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