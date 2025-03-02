import React, { useState } from "react";
import { db } from "../services/firebase";  // Ensure correct Firebase import
import { collection, getDocs } from "firebase/firestore";
import "../styles/DiagnosisPage.css";  // Ensure CSS exists

const symptomsList = [
  "Fatigue", "Shortness of breath", "Chest pain", 
  "Dizziness", "Weakness", "Cough", "Fever"
];

const DiagnosisPage = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSymptomChange = (e) => {
    const selectedValue = e.target.value;
    if (!selectedSymptoms.includes(selectedValue)) {
      setSelectedSymptoms([...selectedSymptoms, selectedValue]);
    }
  };

  const fetchDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      alert("⚠️ Please select at least one symptom!");
      return;
    }
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "disease_diagnosis"));
      const diseases = snapshot.docs.map(doc => doc.data());

      let matchedDisease = "No matching disease found";
      diseases.forEach((disease) => {
        if (selectedSymptoms.every(symptom => disease.symptoms.includes(symptom))) {
          matchedDisease = disease.name;
        }
      });

      setDiagnosisResult(matchedDisease);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diagnosis-container">
      <h2>🩺 Disease Diagnosis Tool</h2>
      <select onChange={handleSymptomChange}>
        <option value="">Select a symptom</option>
        {symptomsList.map((symptom, index) => (
          <option key={index} value={symptom}>{symptom}</option>
        ))}
      </select>

      <div className="selected-symptoms">
        <h3>Selected Symptoms:</h3>
        {selectedSymptoms.map((symptom, index) => (
          <span key={index} className="symptom-badge">{symptom}</span>
        ))}
      </div>

      <button onClick={fetchDiagnosis}>Get Diagnosis</button>

      {loading && <p>🔄 Analyzing symptoms...</p>}
      {diagnosisResult && <p>📋 Possible Diagnosis: <strong>{diagnosisResult}</strong></p>}
    </div>
  );
};

export default DiagnosisPage;
