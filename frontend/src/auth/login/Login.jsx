import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/api";
import styles from "../Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
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
    const response = await api.post("auth/login", formData);

    console.log("LOGIN RESPONSE:", response.data); // 👈 check this once

    // Try common token keys (covers most backend setups)
    const token =
      response.data.accessToken ||
      response.data.token ||
      response.data.jwt ||
      response.data.data?.accessToken;

    if (!token) {
      throw new Error("No token returned from server");
    }

    localStorage.setItem("token", token);

    navigate("/dashboard");
  } catch (err) {
    console.log(err);
    if (err.response) {
      setError(extractError(err.response.data));
    } else if (err.request) {
      setError("Cannot reach the server.");
    } else {
      setError(err.message || "Something went wrong.");
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
        <h2>Welcome Back</h2>
        <p>Login to continue</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username"
            value={formData.username} onChange={handleChange} required />

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.switch}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;