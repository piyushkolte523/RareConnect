import React, { useEffect, useState } from "react";
import { db } from "../services/firebase"; // Import Firebase
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import "../styles/CrowdfundingPage.css";

function CrowdfundingPage() {
    const [fundraisers, setFundraisers] = useState([]);
    const [title, setTitle] = useState("");
    const [goalAmount, setGoalAmount] = useState("");
    const [description, setDescription] = useState("");
    const [donationAmounts, setDonationAmounts] = useState({});

    // ✅ Fetch Fundraisers from Firestore
    useEffect(() => {
        const fetchFundraisers = async () => {
            const querySnapshot = await getDocs(collection(db, "fundraisers"));
            const fundraisersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFundraisers(fundraisersList);
        };
        fetchFundraisers();
    }, []);

    // ✅ Create a New Fundraiser
    const createFundraiser = async () => {
        if (!title || !goalAmount || !description) {
            alert("All fields are required!");
            return;
        }
        
        const goal = parseFloat(goalAmount);
        if (goal <= 0) {
            alert("Goal amount must be greater than 0!");
            return;
        }

        try {
            await addDoc(collection(db, "fundraisers"), {
                title,
                goalAmount: goal,
                description,
                raisedAmount: 0
            });
            alert("Fundraiser created successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error creating fundraiser:", error);
            alert("Error creating fundraiser: " + error.message);
        }
    };

    // ✅ Donate to a Fundraiser
    const donateToFundraiser = async (id, currentAmount) => {
        const amount = donationAmounts[id] ? parseFloat(donationAmounts[id]) : 0;
        if (amount <= 0) {
            alert("Please enter a valid donation amount!");
            return;
        }

        const fundraiserRef = doc(db, "fundraisers", id);

        try {
            await updateDoc(fundraiserRef, {
                raisedAmount: currentAmount + amount
            });

            alert("Donation successful!");
            setDonationAmounts({ ...donationAmounts, [id]: "" });
            window.location.reload();
        } catch (error) {
            console.error("Donation Error:", error);
            alert("Error processing donation: " + error.message);
        }
    };

    return (
        <div className="crowdfunding-container">
            <h2>💰 <span className="highlight">Crowdfunding for Rare Diseases</span></h2>

            {/* ✅ Fundraiser Creation Form */}
            <div className="create-fundraiser">
                <input
                    type="text"
                    placeholder="Fundraiser Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Goal Amount ($)"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                />
                <textarea
                    placeholder="Fundraiser Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button onClick={createFundraiser} className="start-fundraiser-btn">Start Fundraiser</button>
            </div>

            {/* ✅ Active Fundraisers List */}
            <h3>📢 <span className="highlight">Active Fundraisers</span></h3>
            <div className="fundraiser-list">
                {fundraisers.map((fundraiser) => (
                    <div key={fundraiser.id} className="fundraiser-card">
                        <h4 className="fundraiser-title">{fundraiser.title}</h4>
                        <p className="fundraiser-description">{fundraiser.description}</p>
                        <p className="fundraiser-goal">🎯 Goal: ${fundraiser.goalAmount.toLocaleString()}</p>
                        <p className="fundraiser-raised">💰 Raised: ${fundraiser.raisedAmount ? fundraiser.raisedAmount.toLocaleString() : "N/A"}</p>

                        {/* ✅ Donation Input */}
                        
                        
                        
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CrowdfundingPage;
