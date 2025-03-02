import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";  // Fix Firebase import path
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Chart } from "chart.js/auto";
import "../styles/SleepTrackerPage.css";  // Ensure CSS exists

const SleepTrackerPage = () => {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [sleepData, setSleepData] = useState([]);

  useEffect(() => { fetchSleepData(); }, []);

  // Function to submit sleep data
  const submitSleepData = async () => {
    if (!date || !hours) return alert("⚠️ Enter valid data!");
    try {
      await addDoc(collection(db, "sleepTracker"), { date, hours: parseInt(hours) });
      setDate(""); setHours("");
      fetchSleepData();  // Refresh data after saving
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Fetch stored sleep records
  const fetchSleepData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "sleepTracker"));
      const data = snapshot.docs.map(doc => doc.data());
      setSleepData(data);
      drawChart(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Render sleep chart
  const drawChart = (data) => {
    const ctx = document.getElementById("sleepChart").getContext("2d");
    if (window.sleepChart) window.sleepChart.destroy(); // Destroy previous chart instance

    window.sleepChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map(entry => entry.date),
        datasets: [{
          label: "Hours Slept",
          data: data.map(entry => entry.hours),
          borderColor: "#4A90E2",
          borderWidth: 2,
          fill: false
        }]
      },
      options: { responsive: true }
    });
  };

  return (
    <div className="sleep-tracker-container">
      <h2>😴 Child Sleep Tracker</h2>
  
