import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";  // Fix Firebase import path
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import "../styles/CrowdfundingPage.css";  // Ensure CSS exists

const CrowdfundingPage = () => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => { fetchFundraisers(); }, []);

  const submitFundraiser = async () => {
    if (!title || !goal) return alert("⚠️ Please enter a title and goal amount!");
    try {
      await addDoc(collection(db, "fundraisers"), { title, goal: parseFloat(goal), raised: 0 });
      setTitle("");
      setGoal("");
      fetchFundraisers();
    } catch (error) {
      console.error("Error adding fundraiser:", error);
    }
  };

  const fetchFundraisers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "fundraisers"));
      setFundraisers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    }
  };

  const donate = async (id, currentRaised, donationAmount) => {
    const fundraiserRef = doc(db, "fundraisers", id);
    try {
      await updateDoc(fundraiserRef, { raised: currentRaised + donationAmount });
      fetchFundraisers();  // Refresh after donation
    } catch (error) {
      console.error("Error updating fundraiser:", error);
    }
  };

  return (
    <div className="crowdfunding-container">
      <h2>💰 Crowdfunding for Rare Diseases</h2>

      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Fundraiser Title" />
      <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal Amount ($)" />
      <button onClick={submitFundraiser}>Start Fundraiser</button>

      <h3>Active Fundraisers</h3>
      {fundraisers.map(fund => (
        <div key={fund.id} className="fundraiser-card">
          <h4>{fund.title}</h4>
          <p>🎯 Goal: <strong>${fund.goal}</strong></p>
          <p>💰 Raised: <strong>${fund.raised}</strong></p>
          <button onClick={() => donate(fund.id, fund.raised, 10)}>Donate $10</button>
          <button onClick={() => donate(fund.id, fund.raised, 50)}>Donate $50</button>
          <button onClick={() => donate(fund.id, fund.raised, 100)}>Donate $100</button>
        </div>
      ))}
    </div>
  );
};

export default CrowdfundingPage;
