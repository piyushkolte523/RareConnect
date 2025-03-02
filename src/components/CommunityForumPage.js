import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";  // Fixing the import path
import { collection, addDoc, getDocs } from "firebase/firestore";

const diseases = ["Mitochondrial Disorder", "Duchenne Muscular Dystrophy", "Cystic Fibrosis"];

const CommunityForumPage = () => {
  const [selectedDisease, setSelectedDisease] = useState(diseases[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, [selectedDisease]);

  const submitMessage = async () => {
    if (!message) return alert("Enter a message!");
    try {
      await addDoc(collection(db, `community_${selectedDisease.replace(/\s/g, "_")}`), {
        text: message,
        timestamp: new Date(),
      });
      setMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const snapshot = await getDocs(collection(db, `community_${selectedDisease.replace(/\s/g, "_")}`));
      setMessages(snapshot.docs.map((doc) => doc.data()));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="community-container">
      <h2>👥 Community Support Groups</h2>
      <select onChange={(e) => setSelectedDisease(e.target.value)}>
        {diseases.map((disease) => (
          <option key={disease}>{disease}</option>
        ))}
      </select>

      <h3>Group Chat for {selectedDisease}</h3>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index} className="chat-message">🗨️ {msg.text}</p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={submitMessage}>Send</button>
    </div>
  );
};

export default CommunityForumPage;
