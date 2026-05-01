import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Dashboard.module.css";

const BudgetView = ({ isSidebarOpen, setIsSidebarOpen, onBack }) => {
  const [items, setItems] = useState([]);
  const [budgetName, setBudgetName] = useState("Untitled");
  const [isEditingName, setIsEditingName] = useState(false);
  const [period, setPeriod] = useState("None");
  const [name, setName] = useState("");
  const [expected, setExpected] = useState("");
  const [type, setType] = useState("expense");

  const handleAdd = () => {
    if (!name.trim() || !expected) return;
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Item name must contain only letters");
      return;
    }
    setItems([
      { id: Date.now(), name: name.trim(), expected: Number(expected), actual: 0, type },
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
              expected: newExpected !== null && newExpected !== "" ? Number(newExpected) : i.expected,
              actual: newActual !== null && newActual !== "" ? Number(newActual) : i.actual,
            }
      )
    );
  };

  const budgetedBalance = items.reduce(
    (acc, i) => (i.type === "income" ? acc + i.expected : acc - i.expected), 0
  );
  const actualBalance = items.reduce(
    (acc, i) => (i.type === "income" ? acc + i.actual : acc - i.actual), 0
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
            <h1 className={styles.pageTitle} onClick={() => setIsEditingName(true)} title="Click to rename">
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
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          <button className={styles.primaryButton} onClick={onBack}>
            ← Dashboard
          </button>
        </div>
      </header>

      <section className={styles.contentScrollArea}>
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
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button onClick={handleAdd}>Add Item</button>
        </div>
      </section>
    </>
  );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState("dashboard");
  const navigate = useNavigate();

  const dummyBudgets = [
    { id: 1, name: "Groceries & Food", amountRemaining: 45000 },
    { id: 2, name: "Rent & Utilities", amountRemaining: 150000 },
    { id: 3, name: "Transportation", amountRemaining: 22500 },
    { id: 4, name: "Emergency Savings", amountRemaining: 500000 },
  ];

  const totalRemaining = dummyBudgets.reduce((acc, curr) => acc + curr.amountRemaining, 0);

  return (
    <div className={styles.appContainer}>
      <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.brandName}>BudgetWise</h2>
          <button className={styles.iconButton} onClick={() => setIsSidebarOpen(false)}>✕</button>
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
          <button className={`${styles.navItem} ${styles.logoutItem}`} onClick={() => navigate("/")}>
            <span className={styles.icon}>🚪</span> Logout
          </button>
        </div>
      </nav>

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
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Total Budget Remaining</p>
                <h2 className={styles.summaryAmount}>
                  <span className={styles.currencySymbol}>₦</span>
                  {totalRemaining.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </h2>
              </div>

              <h3 className={styles.sectionHeading}>Your Active Budgets</h3>

              <div className={styles.grid}>
                {dummyBudgets.map((budget) => (
                  <div key={budget.id} className={styles.budgetCard}>
                    <div className={styles.cardAccent}></div>
                    <div className={styles.cardHeader}>
                      <h4 className={styles.budgetName}>{budget.name}</h4>
                      <span className={styles.cardIcon}>💰</span>
                    </div>
                    <p className={styles.cardLabel}>Remaining Balance</p>
                    <p className={styles.cardAmount}>
                      ₦{budget.amountRemaining.toLocaleString("en-NG")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <BudgetView
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onBack={() => setView("dashboard")}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
