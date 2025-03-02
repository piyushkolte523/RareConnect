import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/community">Community Forum</Link></li>
        <li><Link to="/crowdfunding">Crowdfunding</Link></li>
        <li><Link to="/sleep-tracker">Sleep Tracker</Link></li>

        <li><Link to="/multilingual-hub">Multilingual Hub</Link></li>

        <li><Link to="/seizure-control">Seizure Control</Link></li>
        
        <li><Link to="/diagnosis">Diagnosis</Link></li>  {/* Added Link */}
        <li><Link to="/education">Education Hub</Link></li>
        <li><Link to="/experts">Expert Connect</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
