import React, { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    weight: "",
    height: "",
    bloodGroup: "",
    age: "",
    healthStatus: "",
  });

  const [error, setError] = useState("");

  // ✅ Handle Form Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle User Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // ✅ Step 2: Store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        weight: formData.weight,
        height: formData.height,
        bloodGroup: formData.bloodGroup,
        age: formData.age,
        healthStatus: formData.healthStatus,
        createdAt: new Date(),
        role: "patient",
      });

      console.log("✅ User registered successfully:", user);

      // ✅ Redirect to Login Page After Successful Registration
      navigate("/login");

    } catch (error) {
      console.error("❌ Registration error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>📝 Register</h2>
      {error && <p className="error-message">❌ {error}</p>}

      <form onSubmit={handleRegister}>
        <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input type="date" name="dob" required onChange={handleChange} />
        <input type="number" name="weight" placeholder="Weight (kg)" required onChange={handleChange} />
        <input type="number" name="height" placeholder="Height (cm)" required onChange={handleChange} />
        <input type="text" name="bloodGroup" placeholder="Blood Group" required onChange={handleChange} />
        <input type="number" name="age" placeholder="Age" required onChange={handleChange} />
        <textarea name="healthStatus" placeholder="Health Status (Describe any conditions)" required onChange={handleChange}></textarea>
        
        <button type="submit">✅ Register</button>
      </form>
      
      <p>Already have an account? <Link to="/dashboard">Dashboard</Link></p>
    </div>
  );
};

export default Register;
