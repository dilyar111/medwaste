import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 1. ДОБАВИЛИ ИМПОРТ

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Достаем данные из formData для удобства
    const { username, email, password, confirmPassword } = formData;

    // 1. Простая валидация
    if (!email || !password) {
      return alert("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      // 2. Отправляем запрос (теперь переменные email и password определены)
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email: email,
        password: password
      });

      if (response.status === 201 || response.data.ok) {
        alert("Registration successful! Now you can log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error detail:", err.response?.data);
      alert(err.response?.data?.error || "Registration failed. Check console.");
    }
  };

  return (
    <div className="auth-page">
      <div className="old-style-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Register</h1>
            <p>Create a new account to access the system.</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Full Name</label>
              <input 
                type="text" 
                id="username" 
                placeholder="Enter username" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter Email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter Password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Repeat Password" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full-width">
              Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;