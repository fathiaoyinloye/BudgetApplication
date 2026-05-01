import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./Dashboard.module.css";
import api from "../api/api";

// ─────────────────────────────────────────────
// BUDGET VIEW
// ─────────────────────────────────────────────
const BudgetView = ({ isSidebarOpen, setIsSidebarOpen, onBack, onBudgetCreated }) => {
  const [items, setItems] = useState([]);
  const [budgetName, setBudgetName] = useState("Untitled");
  const [isEditingName, setIsEditingName] = useState(false);
  const [period, setPeriod] = useState("None");
  const [name, setName] = useState("");
  const [expected, setExpected] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [saving, setSaving] = useState(false);

  // ✅ Step 1: Create budget on mount — get budgetID immediately
  const [budgetID, setBudgetID] = useState(null);

  useEffect(() => {
    const createBudget = async () => {
      try {
        const res = await api.post("/budget", { name: "Untitled", amount: 0 });
        console.log("Budget created:", res.data);
        setBudgetID(res.data.budgetID);
      } catch (err) {
        console.error("Create budget error:", err.response?.status, err.response?.data);
      }
    };
    createBudget();
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !expected) return;
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Item name must contain only letters");
      return;
    }
    setItems([
      {
        id: Date.now(),
        name: name.trim(),
        expected: Number(expected),
        actual: 0,
        type,
      },
      ...items,
    ]);
    setName("");
    setExpected("");
  };

  const handleEdit = (item) => {
    const newExpected = prompt("Update expected:", item.expected);
    const newActual = prompt("Update actual:", item.actual);
    setItems((prev) =>
      prev.map((i) =>
        i.id !== item.id
          ? i
          : {
              ...i,
              expected:
                newExpected !== null && newExpected !== ""
                  ? Number(newExpected)
                  : i.expected,
              actual:
                newActual !== null && newActual !== ""
                  ? Number(newActual)
                  : i.actual,
            }
      )
    );
  };

  // ✅ Step 2: On Save — PUT name/period + POST all items
  const handleSaveAndBack = async () => {
    if (!budgetID) {
      alert("Budget not ready yet, please wait a moment.");
      return;
    }

    setSaving(true);
    try {
      // 2a. Edit budget name + period
      await api.put(`/budget/${budgetID}`, {
        name: budgetName,
        period: period === "None" ? null : period,
      });
      console.log("Budget updated:", budgetName, period);

      // 2b. Add all items (only if there are any)
      if (items.length > 0) {
        const itemPayload = items.map((i) => ({
          name: i.name,
          budgetedAmount: i.expected,
          budgetItemType: i.type, // "EXPENSE" | "INCOME"
          period: period === "None" ? null : period,
        }));

        await api.post(`/budget/${budgetID}/items`, itemPayload);
        console.log("Items saved:", itemPayload);
      }

      // 2c. Refresh dashboard budget list
      if (onBudgetCreated) onBudgetCreated();
    } catch (err) {
      console.error("Save error:", err.response?.status, err.response?.data);
    } finally {
      setSaving(false);
      onBack();
    }
  };

  const budgetedBalance = items.reduce(
    (acc, i) => (i.type === "INCOME" ? acc + i.expected : acc - i.expected),
    0
  );
  const actualBalance = items.reduce(
    (acc, i) => (i.type === "INCOME" ? acc + i.actual : acc - i.actual),
    0
  );

  return (
    <>
      <header className={styles.topNav}>
        <div className={styles.navLeft}>
          {!isSidebarOpen && (
            <button className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
              ☰
            </button>
          )}

          {isEditingName ? (
            <input
              className={styles.budgetNameInput}
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setIsEditingName(false);
              }}
              autoFocus
            />
          ) : (
            <h1
              className={styles.pageTitle}
              onClick={() => setIsEditingName(true)}
              title="Click to rename"
              style={{ cursor: "pointer" }}
            >
              <span className={styles.budgetNameEditable}>{budgetName}</span>
            </h1>
          )}
        </div>

        <div className={styles.navRight}>
          <div className={styles.periodWrapper}>
            <label className={styles.periodLabel}>Period</label>
            <select
              className={styles.periodSelect}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="None">None</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>

          <button
            className={styles.primaryButton}
            onClick={handleSaveAndBack}
            disabled={saving || !budgetID}
            style={{ marginLeft: "8px" }}
          >
            {saving ? "Saving..." : "💾 Save & Back"}
          </button>

          <button
            className={styles.iconButton}
            onClick={onBack}
            style={{ marginLeft: "8px" }}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <section className={styles.contentScrollArea}>
        {/* Status indicator while budget is being created in background */}
        {!budgetID && (
          <p style={{ padding: "8px 16px", color: "#888", fontSize: "0.85rem" }}>
            ⏳ Preparing budget...
          </p>
        )}

        {items.length > 0 && (
          <div className={styles.balanceGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Budgeted Balance</p>
              <h2 className={styles.summaryAmount}>₦{budgetedBalance.toLocaleString()}</h2>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Actual Balance</p>
              <h2 className={styles.summaryAmount}>₦{actualBalance.toLocaleString()}</h2>
            </div>
          </div>
        )}

        <div className={styles.budgetTable}>
          <div className={styles.tableHeader}>
            <span>Name</span>
            <span>Expected</span>
            <span>Actual</span>
            <span></span>
          </div>

          {items.length === 0 && (
            <p className={styles.emptyMsg}>No items yet — add one below.</p>
          )}

          {items.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <span className={styles.itemName}>{item.name}</span>
              <span>₦{item.expected.toLocaleString()}</span>
              <span className={item.actual > item.expected ? styles.danger : ""}>
                ₦{item.actual.toLocaleString()}
              </span>
              <button className={styles.editRowBtn} onClick={() => handleEdit(item)}>
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => {
              if (/^[a-zA-Z\s]*$/.test(e.target.value)) setName(e.target.value);
            }}
          />
          <input
            type="number"
            placeholder="Budgeted amount"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          <button onClick={handleAdd}>Add Item</button>
        </div>
      </section>
    </>
  );
};

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState("dashboard");
  const [budgets, setBudgets] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get("/user-details");
      console.log("USER:", res.data);
      setUser(res.data);
    } catch (err) {
      console.error("User fetch error:", err.response?.status, err.response?.data);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets");
      console.log("BUDGETS:", res.data);
      setBudgets(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Budget fetch error:", err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBudgets();
  }, []);

  return (
    <div className={styles.appContainer}>
      {/* SIDEBAR */}
      <nav
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.brandName}>BudgetWise</h2>
          <button className={styles.iconButton} onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <div className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => navigate("/profile")}>
            <span className={styles.icon}>👤</span> View Profile
          </button>
          <button className={styles.navItem} onClick={() => navigate("/settings")}>
            <span className={styles.icon}>⚙️</span> Settings
          </button>
        </div>

        <div className={styles.sidebarFooter}>
          <button
            className={`${styles.navItem} ${styles.logoutItem}`}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <span className={styles.icon}>🚪</span> Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className={styles.mainArea}>
        {view === "dashboard" ? (
          <>
            <header className={styles.topNav}>
              <div className={styles.navLeft}>
                {!isSidebarOpen && (
                  <button className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
                    ☰
                  </button>
                )}
                <h1 className={styles.pageTitle}>Dashboard</h1>
              </div>
              <button className={styles.primaryButton} onClick={() => setView("budget")}>
                <span className={styles.btnIcon}>➕</span> Create Budget
              </button>
            </header>

            <section className={styles.contentScrollArea}>
              {user && (
                <div className={styles.summaryCard}>
                  <h2 className={styles.greetingText}>
                    Hello, {user.firstName} {user.lastName} 👋
                  </h2>
                  <p className={styles.subGreeting}>
                    Empowering your financial journey, one step at a time.
                  </p>
                </div>
              )}

              {budgets.length > 0 ? (
                <>
                  <h3 className={styles.sectionHeading}>Your Active Budgets</h3>
                  <div className={styles.grid}>
                    {budgets.map((budget, index) => (
                      <div key={budget.budgetID || index} className={styles.budgetCard}>
                        <div className={styles.cardAccent}></div>
                        <div className={styles.cardHeader}>
                          <h4 className={styles.budgetName}>{budget.name}</h4>
                          <span className={styles.cardIcon}>💰</span>
                        </div>
                        <p className={styles.cardLabel}>Amount</p>
                        <p className={styles.cardAmount}>
                          ₦{Number(budget.amount || 0).toLocaleString("en-NG")}
                        </p>
                        {budget.period && (
                          <>
                            <p className={styles.cardLabel}>Period</p>
                            <p className={styles.cardAmount}>{budget.period}</p>
                          </>
                        )}
                        <p className={styles.cardLabel}>Created</p>
                        <p className={styles.cardAmount}>
                          {new Date(budget.createdAt).toLocaleDateString("en-NG")}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className={styles.summaryCard}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <p style={{ fontSize: "2rem" }}>🗂️</p>
                  <p>
                    No budgets yet. Click <strong>➕ Create Budget</strong> to get started.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <BudgetView
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onBack={() => setView("dashboard")}
            onBudgetCreated={fetchBudgets}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;