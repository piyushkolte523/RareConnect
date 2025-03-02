import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "../styles/SeizureControlPage.css";


const SeizureControlPage = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [severity, setSeverity] = useState("");
  const [trigger, setTrigger] = useState("");
  const [notes, setNotes] = useState("");
  const [seizureLogs, setSeizureLogs] = useState([]);

  useEffect(() => {
    fetchSeizureLogs();
  }, []);

  const fetchSeizureLogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "seizures"));
      const logs = querySnapshot.docs.map((doc) => doc.data());
      setSeizureLogs(logs);
    } catch (error) {
      console.error("Error fetching seizure logs:", error);
    }
  };

  const handleLogSeizure = async () => {
    if (!date || !time || !severity) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "seizures"), {
        date,
        time,
        severity,
        trigger,
        notes,
      });

      alert("Seizure logged successfully!");
      setDate("");
      setTime("");
      setSeverity("");
      setTrigger("");
      setNotes("");
      fetchSeizureLogs();
    } catch (error) {
      alert("Failed to log seizure.");
    }
  };

  return (
    <div className="seizure-container">
      <h2 className="seizure-title">
    <span role="img" aria-label="seizure-icon">⚡</span> 
      Seizure Control & Tracking</h2>

      <p>Track and manage seizures effectively.</p>

      <div className="seizure-form">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Select Severity</option>
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
        
        <input type="text" placeholder="Possible Trigger (Optional)" value={trigger} onChange={(e) => setTrigger(e.target.value)} />
        
        <textarea placeholder="Additional Notes (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        
        <button className="log-seizure-btn" onClick={handleLogSeizure}>
          Log Seizure
        </button>
      </div>

      <div className="past-seizure-logs">
        <h3>📋 Past Seizure Logs</h3>
        {seizureLogs.length === 0 ? (
          <p>No logs available.</p>
        ) : (
          seizureLogs.map((log, index) => (
            <div key={index} className="log-card">
              <p className="log-item"><span>📅 Date:</span> {log.date}</p>
              <p className="log-item"><span>⏰ Time:</span> {log.time}</p>
              <p className="log-item"><span>⚠️ Severity:</span> {log.severity}</p>
              <p className="log-item"><span>💡 Trigger:</span> {log.trigger || "N/A"}</p>
              <p className="log-item"><span>📝 Notes:</span> {log.notes || "No additional notes"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SeizureControlPage;
