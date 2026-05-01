import React from "react";
import { useNavigate } from "react-router";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.logo}>BudgetWise</div>
          <h1>Take Control of Your Finances</h1>
          <p>Track spending, save smarter, and reach your financial goals effortlessly.</p>
          <div className={styles.buttons}>
            <button className={`${styles.btn} ${styles.primary}`} onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button className={`${styles.btn} ${styles.secondary}`} onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;