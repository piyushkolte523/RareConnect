import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ Logout Function (Only One Instance)
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Logged out successfully!");
      navigate("/login"); // Redirect to Login page
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/community">Community Forum</Link></li>
        <li><Link to="/crowdfunding">Crowdfunding</Link></li>
        <li><Link to="/sleep-tracker">Sleep Tracker</Link></li>
        <li><Link to="/multilingual-hub">Multilingual Hub</Link></li>
        <li><Link to="/seizure-control">Seizure Control</Link></li>
        <li><Link to="/diagnosis">Diagnosis</Link></li>
        <li><Link to="/education">Education Hub</Link></li>
        <li><Link to="/expertconnect">Expert Connect</Link></li>

        {/* ✅ Logout Button */}
        <li>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
