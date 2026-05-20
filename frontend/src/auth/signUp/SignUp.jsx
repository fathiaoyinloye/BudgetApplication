import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/api";
import styles from "../Auth.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const extractError = (data) => {
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await api.post("/auth/new_user", formData);

    console.log("SIGNUP RESPONSE:", response.data); // 👈 check this

    const token =
      response.data.accessToken ||
      response.data.token ||
      response.data.jwt ||
      response.data.data?.accessToken;

    // Some backends return token on signup, some don’t
    if (token) {
      localStorage.setItem("token", token);
    }

    navigate("/dashboard");
  } catch (err) {
    console.log(err);
    if (err.response) {
      setError(extractError(err.response.data));
    } else if (err.request) {
      setError("Cannot reach the server.");
    } else {
      setError("An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.authPage}>
      <div className={styles.overlay}></div>
      <div className={styles.card}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>← Back</button>
        <h2>Create Account</h2>
        <p>Start managing your finances today</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <input type="text" name="firstName" placeholder="First Name"
              value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name"
              value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="text" name="username" placeholder="Username"
            value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email"
            value={formData.email} onChange={handleChange} required />

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (8–20 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
           <span 
  className={`${styles.eyeIcon} ${showPassword ? styles.eyeVisible : styles.eyeHidden}`} 
  onClick={() => setShowPassword(!showPassword)}
></span>
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;