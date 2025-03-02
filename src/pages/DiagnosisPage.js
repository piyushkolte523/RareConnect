import React, { useState } from "react";
import axios from "axios";
import Select from "react-select"; // Importing Multi-Select Dropdown
import "../styles/DiagnosisPage.css";

const DiagnosisPage = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);

  // List of available symptoms
  const symptomOptions = [
    { value: "Seizures", label: "Seizures" },
    { value: "Speech Delay", label: "Speech Delay" },
    { value: "Sleep Disturbances", label: "Sleep Disturbances" },
    { value: "Hypotonia", label: "Hypotonia" },
    { value: "Anxiety", label: "Anxiety" },
    { value: "Motor Regression", label: "Motor Regression" },
    { value: "Hyperactivity", label: "Hyperactivity" },
    { value: "Feeding Issues", label: "Feeding Issues" },
    { value: "Sensory Processing Issues", label: "Sensory Processing Issues" },
    { value: "Aggression", label: "Aggression" },
    { value: "Learning Disabilities", label: "Learning Disabilities" },
  ];

  // Handle symptom selection
  const handleSymptomChange = (selectedOptions) => {
    setSelectedSymptoms(selectedOptions ? selectedOptions.map((s) => s.value) : []);
  };

  // Fetch AI-based Diagnosis
  const getDiagnosis = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        symptoms: selectedSymptoms
      });
      setDiagnosis(response.data);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
    }
  };

  return (
    <div className="diagnosis-container">
      <h2>🧠 AI-Powered Symptom & Syndrome Prediction System</h2>

      <h3 className="select-title">🔍 Select Symptoms to Get Predictions</h3>
      <Select
        options={symptomOptions}
        isMulti
        placeholder="Select Symptoms..."
        onChange={handleSymptomChange}
        className="symptom-dropdown"
      />

      <button className="diagnosis-button" onClick={getDiagnosis}>
        Get AI Predictions
      </button>

      {diagnosis && (
        <>
          <div className="result-section">
            <h3>🎯 Probable Syndromes:</h3>
            <div className="syndrome-badge-container">
              {diagnosis.syndromes.map((syndrome, index) => (
                <span key={index} className="syndrome-badge">{syndrome}</span>
              ))}
            </div>
          </div>

          <div className="result-section">
            <h3>💊 AI-Based Recommended Treatments:</h3>
            <table className="treatment-table">
              <thead>
                <tr>
                  <th>Medications</th>
                  <th>Therapies</th>
                  <th>Assistive Tools</th>
                </tr>
              </thead>
              <tbody>
                {diagnosis.treatments.slice(0, 8).map((treatment, index) => (
                  <tr key={index}>
                    <td>{treatment.Medications || "-"}</td>
                    <td>{treatment.Therapies || "-"}</td>
                    <td>{treatment.Assistive_Tools || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="feedback-section">
            <h3>🙌 Was this recommendation helpful?</h3>
            <div className="feedback-buttons">
              <button className="feedback-button yes-button">👍 Yes</button>
              <button className="feedback-button no-button">👎 No</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiagnosisPage;
