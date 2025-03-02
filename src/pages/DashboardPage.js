import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Chart } from "react-google-charts";
import "../styles/Dashboard.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [communityActivity, setCommunityActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bmi, setBmi] = useState(null);
  const [sleepData, setSleepData] = useState([]);
  const [averageSleep, setAverageSleep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      setError("⚠️ No user logged in.");
      setLoading(false);
      navigate("/login");
      return;
    }
    fetchUserData(auth.currentUser.uid);
    fetchHealthData(auth.currentUser.uid);
    fetchCommunityData();
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();
        setUserData(user);

        const heightInMeters = user.height / 100;
        setBmi((user.weight / (heightInMeters * heightInMeters)).toFixed(2));

        const sleepRef = collection(db, `users/${userId}/sleepTracker`);
        const sleepSnap = await getDocs(sleepRef);
        const sleepRecords = sleepSnap.docs.map((doc) => doc.data());

        if (sleepRecords.length > 0) {
          const totalSleep = sleepRecords.reduce((sum, record) => sum + record.hours, 0);
          setAverageSleep((totalSleep / sleepRecords.length).toFixed(1));
        }
        setSleepData(sleepRecords);
      } else {
        setError("⚠️ No user data found.");
      }
    } catch (err) {
      setError("❌ Error fetching user data: " + err.message);
    }
    setLoading(false);
  };

  const fetchHealthData = async (userId) => {
    try {
      const q = query(collection(db, "customer_health"), where("userId", "==", userId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setHealthData(snapshot.docs.map((doc) => doc.data()));
      }
    } catch (error) {
      setError("❌ Error fetching health data: " + error.message);
    }
  };

  const fetchCommunityData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "community_tracker"));
      setCommunityActivity(snapshot.docs.map((doc) => doc.data()));
    } catch (error) {
      setError("❌ Error fetching community activity: " + error.message);
    }
  };

  const chartData = {
    labels: healthData.map((data) => data.name || "Unknown"),
    datasets: [
      {
        label: "Weight (kg)",
        data: healthData.map((data) => data.weight),
        borderColor: "#4A90E2",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Height (cm)",
        data: healthData.map((data) => data.height),
        borderColor: "#FF5733",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const weightHeightChartData = [
    ["Metric", "Value"],
    ["Weight (kg)", userData?.weight || 0],
    ["Height (cm)", userData?.height || 0],
  ];

  return (
    <div className="dashboard-container">
      <h2>📊 Customer Health Dashboard</h2>

      {loading && <p>⏳ Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {userData ? (
        <div className="dashboard-content">
          {/* ✅ Personal Information */}
          <div className="user-info">
            <h3>👤 Personal Information</h3>
            <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Date of Birth:</strong> {userData.dob}</p>
            <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>
          </div>

          {/* ✅ BMI Section */}
          <div className="bmi-section">
            <h3>⚖️ Body Mass Index (BMI)</h3>
            <p><strong>Height:</strong> {userData.height} cm</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>BMI:</strong> {bmi}</p>
            <p><strong>Status:</strong> {bmi < 18.5 ? "Underweight" : bmi >= 25 ? "Overweight" : "Normal"}</p>
          </div>

          {/* ✅ Weight & Height Chart */}
          <div className="chart-section">
            <h3>📊 Weight & Height Overview</h3>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={weightHeightChartData}
              options={{ legend: { position: "none" }, colors: ["#4285F4"] }}
            />
          </div>

          {/* ✅ Sleep Tracker */}
          <div className="sleep-section">
            <h3>😴 Sleep Tracking</h3>
            <p><strong>Average Sleep (hrs):</strong> {averageSleep}</p>

            {sleepData.length > 0 && (
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={[["Day", "Hours"], ...sleepData.map((d, i) => [i + 1, d.hours])]}
                options={{ hAxis: { title: "Days" }, vAxis: { title: "Sleep Hours" } }}
              />
            )}
          </div>

          {/* ✅ Health Data Table */}
          <h3>📌 Personal Details</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {healthData.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.age}</td>
                  <td>{customer.bloodGroup}</td>
                  <td>{customer.weight}</td>
                  <td>{customer.height}</td>
                  <td>{customer.healthStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Community Tracker */}
          <h3>📌 Community Tracker</h3>
          <ul className="community-list">
            {communityActivity.map((activity, index) => (
              <li key={index}>{activity.event} - {activity.date}</li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>No user data found.</p>
      )}
    </div>
  );
};

export default Dashboard;
