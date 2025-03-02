import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import "../styles/CommunityForum.css";

const CommunityForumPage = () => {
  // ✅ Define State
  const [communities, setCommunities] = useState([]); // Holds community list
  const [selectedCommunity, setSelectedCommunity] = useState(""); // Selected community
  const [posts, setPosts] = useState([]); // Discussion posts
  const [newPost, setNewPost] = useState(""); // New post content
  const [newCommunity, setNewCommunity] = useState(""); // New community input
  const [facebookLink, setFacebookLink] = useState(""); // Facebook Group link
  const [showPopup, setShowPopup] = useState(false); // Confirmation popup

  // ✅ Fetch Communities from Firestore
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        console.log("📡 Fetching available communities from Firestore...");
        const querySnapshot = await getDocs(collection(db, "forums"));

        if (!querySnapshot.empty) {
          const communityList = querySnapshot.docs.map((doc) => ({
            name: doc.id,
            fbLink: doc.data().facebookLink || "", // Fetch Facebook link
          }));
          console.log("✅ Communities Found:", communityList);
          setCommunities(communityList);
        } else {
          console.warn("⚠️ No communities found in Firestore!");
        }
      } catch (error) {
        console.error("❌ Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  // ✅ Fetch Posts and Facebook Link when a Community is Selected
  useEffect(() => {
    if (!selectedCommunity) return;

    console.log(`📡 Fetching data for ${selectedCommunity}...`);

    const fetchCommunityData = async () => {
      try {
        const communityDoc = await getDoc(doc(db, "forums", selectedCommunity));

        if (communityDoc.exists()) {
          setFacebookLink(communityDoc.data().facebookLink || "");
        } else {
          setFacebookLink("");
        }

        // Fetch Posts
        const querySnapshot = await getDocs(
          collection(db, `forums/${selectedCommunity}/posts`)
        );

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
      }
    };

    fetchCommunityData();
  }, [selectedCommunity]);

  // ✅ Post a Message
  const postMessage = async () => {
    if (!selectedCommunity || !newPost)
      return alert("⚠️ Select a community & write a message!");

    try {
      console.log(`📝 Posting in: ${selectedCommunity}`);

      await addDoc(collection(db, `forums/${selectedCommunity}/posts`), {
        message: newPost,
        timestamp: new Date(),
      });

      setPosts([...posts, { message: newPost, timestamp: new Date() }]);
      setNewPost("");

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("❌ Error posting message:", error);
    }
  };

  // ✅ Create a New Community with Facebook Link
  const createCommunity = async () => {
    if (!newCommunity.trim()) return alert("⚠️ Enter a valid community name!");

    const fbLink = prompt("Enter Facebook Group Link (or leave empty):");

    try {
      console.log(`➕ Adding new community: ${newCommunity}`);

      await setDoc(doc(db, "forums", newCommunity), {
        facebookLink: fbLink || "", // Store Facebook link
      });

      setCommunities([...communities, { name: newCommunity, fbLink: fbLink || "" }]);
      setNewCommunity("");
      alert("✅ Community Created Successfully!");
    } catch (error) {
      console.error("❌ Error creating community:", error);
    }
  };

  // ✅ Open Facebook Community
  const openFacebookCommunity = () => {
    if (!facebookLink) return alert("⚠️ No Facebook Group linked!");
    window.open(facebookLink, "_blank");
  };

  return (
    <div className="community-forum-container">
      <h2>🌍 Community Forum</h2>

      {/* ✅ Select Community */}
      <label>Select Community:</label>
      <select
        value={selectedCommunity}
        onChange={(e) => setSelectedCommunity(e.target.value)}
      >
        <option value="">-- Choose a Community --</option>
        {communities.map((community) => (
          <option key={community.name} value={community.name}>
            {community.name}
          </option>
        ))}
      </select>

      {/* ✅ Create New Community */}
      <div className="create-community">
        <input
          type="text"
          placeholder="Enter new community name..."
          value={newCommunity}
          onChange={(e) => setNewCommunity(e.target.value)}
        />
        <button className="create-btn" onClick={createCommunity}>
          ➕ Create Community
        </button>
      </div>

      {/* ✅ Post a Message */}
      <label>Post a Message:</label>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Write your message..."
      ></textarea>
      <button className="post-message-btn" onClick={postMessage}>
        📩 Post Message
      </button>

      {/* ✅ Popup Confirmation */}
      {showPopup && <div className="popup">✅ Discussion Posted!</div>}

      {/* ✅ Facebook Community Button */}
      <button
        className="facebook-btn"
        onClick={openFacebookCommunity}
        disabled={!facebookLink}
      >
        🔗 Join Facebook Community
      </button>

      {/* ✅ Discussion Section */}
      <h3>🗨️ Discussion Section</h3>
      <div className="discussion-section">
        {posts.length === 0 ? (
          <p>No messages yet. Be the first to start a discussion!</p>
        ) : (
          <ul>
            {posts.map((post, index) => (
              <li key={index} className="discussion-item">
              🗨️ {post.message}
              <br />
              <span className="timestamp">
{post.timestamp?.seconds
  ? new Date(post.timestamp.seconds * 1000).toLocaleString()
  : "No Timestamp"}
</span>

            </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommunityForumPage;
