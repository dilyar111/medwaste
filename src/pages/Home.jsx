import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="landing-page">
      <header>
        <div className="container">
          <div className="logo"><h1>MedWaste</h1></div>
          <nav>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><Link to="/login" className="btn-login">Log In</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <h2>Medical Waste Monitoring</h2>
          <p>An intelligent system with smart containers.</p>
          <Link to="/login" className="btn btn-primary">Get Started</Link>
        </div>
      </section>

      {/* ... Остальные секции (about, features) копируй сюда так же ... */}
      
      <footer>
        <div className="container"><p>&copy; 2026 MedWaste. All rights reserved.</p></div>
      </footer>
    </div>
  );
};

export default Home;