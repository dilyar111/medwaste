import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirm: '' });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return alert("Пароли не совпадают");
    
    sessionStorage.setItem('mw_logged_in', 'true');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleRegister}>
        <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
        <input type="password" placeholder="Confirm" required onChange={e => setFormData({...formData, confirm: e.target.value})} />
        <button type="submit" className="btn btn-primary btn-full-width">Create Account</button>
      </form>
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  );
};

export default Register;