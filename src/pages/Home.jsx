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

       <section id="about" class="section bg-light">
         <div class="container">
            <h2>About Our System</h2>
            <p>Our system is designed to revolutionize medical waste management — ensuring safety, regulatory compliance, and streamlined operations.</p>
            <div class="feature-grid">
                <div class="feature-item">
                    <h4>Smart Containers</h4>
                    <p>Containers equipped with sensors to track fill level, temperature, and location in real time.</p>
                </div>
                <div class="feature-item">
                    <h4>Real-Time Monitoring</h4>
                    <p>A centralized dashboard to track all container data, generate reports, and receive alerts.</p>
                </div>
                <div class="feature-item">
                    <h4>Enhanced Safety</h4>
                    <p>Minimize contamination risks and prevent unauthorized access to medical waste.</p>
                </div>
            </div>
        </div>
      </section>

      <section id="features" class="section">
        <div class="container">
            <h2>Key Features</h2>
            <div class="feature-grid">
                <div class="feature-item">
                    <h4>Automated Alerts</h4>
                    <p>Receive instant notifications about critical fill levels or anomalies detected by sensors.</p>
                </div>
                <div class="feature-item">
                    <h4>Location Tracking</h4>
                    <p>Precise real-time location of every container across your facility or fleet.</p>
                </div>
                <div class="feature-item">
                    <h4>Analytics & Reporting</h4>
                    <p>Detailed reports for analyzing and optimizing your waste disposal processes.</p>
                </div>
            </div>
        </div>
      </section>

      <section id="solution" class="section bg-dark">
        <div class="container">
            <h3>A Solution for Your Facility</h3>
            <p>We offer a comprehensive solution that integrates seamlessly into existing medical facility infrastructure.</p>
            <a href="#contact" class="btn btn-primary">Request a Demo</a>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
         <h2>Get in Touch</h2>
         <p>Have questions? We're ready to help!</p>
         <form onSubmit={(e) => e.preventDefault()}>
            <input 
                type="text" 
                placeholder="Your Name" 
                required 
            /> 
            
            <input 
                type="email" 
                placeholder="Your Email" 
                required 
            /> 
            
            <textarea 
                placeholder="Your Message" 
                rows="5" 
                required
            ></textarea>
            
            <button type="submit" className="btn btn-primary">
                Send Message
            </button>
         </form>
        </div>
      </section>
      
      <footer>
        <div className="container"><p>&copy; 2026 MedWaste. All rights reserved.</p></div>
      </footer>
    </div>
  );
};

export default Home;