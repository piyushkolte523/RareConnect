import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/MultilingualHub.css";

const MultilingualHub = () => {
  const [language, setLanguage] = useState("English");
  const [diseaseMaterials, setDiseaseMaterials] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "disease_materials"));
      const data = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data().content;
      });
      setDiseaseMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multilingual-container">
      <h2>📖 Rare Disease Information</h2>
      <select onChange={(e) => setLanguage(e.target.value)}>
        {Object.keys(diseaseMaterials).map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      {loading ? <p>🔄 Loading information...</p> : <p>{diseaseMaterials[language]}</p>}
    </div>
  );
};

export default MultilingualHub;
