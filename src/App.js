import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CommunityForumPage from "./pages/CommunityForumPage";
import CrowdfundingPage from "./pages/CrowdfundingPage";
import SeizureControlPage from "./pages/SeizureControlPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import MultilingualHub from "./pages/MultilingualHub";
import SleepTrackerPage from "./pages/SleepTrackerPage";  // ✅ FIX: Use SleepTrackerPage
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import EducationHubPage from "./pages/EducationHubPage";  // ✅ Ensure this is correct
import ExpertConnect from "./pages/ExpertConnect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout"



const App = () => {
  return (
    <Router>
      <Navbar /> {/* ✅ FIX: If Navbar exists, render it properly */}

      {/*<nav>
        <Link to="/community">Community Tracker</Link>
        <Link to="/crowdfunding">Crowdfunding</Link>
        <Link to="/sleep-tracker">Sleep Tracker</Link>
        <Link to="/seizure-control">Seizure Control</Link>
        <Link to="/diagnosis">Disease Diagnosis</Link>
        <Link to="/multilingual-hub">Multilingual Hub</Link>
        <Link to="/education-hub">Education Hub</Link>
        <Link to="/dashboard">dashboard</Link>
      </nav>*/}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default page */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/community" element={<CommunityForumPage />} />
        <Route path="/dashboard" element={<Dashboard />} />


        <Route path="/crowdfunding" element={<CrowdfundingPage />} />
        <Route path="/sleep-tracker" element={<SleepTrackerPage />} />  {/* ✅ FIX: Corrected import */}
        <Route path="/seizure-control" element={<SeizureControlPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/multilingual-hub" element={<MultilingualHub />} />
        <Route path="/experts" element={<ExpertConnect/>}/>
        <Route path="/education" element={<EducationHubPage />} />  {/* ✅ Fix */} 
      </Routes>
    </Router>
  );
};

export default App;
