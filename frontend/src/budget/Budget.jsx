import React, { useState } from "react";
import styles from "./Budget.module.css";
import dashboardStyles from "../dashboard/Dashboard.module.css";
import { useNavigate } from "react-router";


const Budget = () => {
  const [items, setItems] = useState([]);
  const [budgetName, setBudgetName] = useState("Untitled");
  const [period, setPeriod] = useState("None");

  const [name, setName] = useState("");
  const [expected, setExpected] = useState("");
  const [type, setType] = useState("expense");

  // ✅ ADD ITEM
  const handleAdd = () => {
    if (!name.trim() || !expected) return;

    // enforce letters only
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Item name must contain only letters");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: name.trim(),
      expected: Number(expected),
      actual: 0,
      type,
    };

    setItems([newItem, ...items]);
    setName("");
    setExpected("");
  };


  const handleEditName = () => {
  const value = prompt("Enter budget name:", budgetName);

  if (value && value.trim()) {
    setBudgetName(value.trim());
  }
};

const handleEditPeriod = () => {
  const value = prompt(
    "Enter period (None, Weekly, Monthly, Annual):",
    period
  );

  const allowed = ["None", "Weekly", "Monthly", "Annual"];

  if (allowed.includes(value)) {
    setPeriod(value);
  } else {
    alert("Invalid period. Use: None, Weekly, Monthly, or Annual");
  }
};

  // ✅ EDIT ITEM (FIXED)
  const handleEdit = (item) => {
    const newExpected = prompt("Update expected:", item.expected);
    const newActual = prompt("Update actual:", item.actual);

    setItems((prevItems) =>
      prevItems.map((i) => {
        if (i.id !== item.id) return i;

        return {
          ...i,
          expected:
            newExpected !== null && newExpected !== ""
              ? Number(newExpected)
              : i.expected,
          actual:
            newActual !== null && newActual !== ""
              ? Number(newActual)
              : i.actual,
        };
      })
    );
  };

  // ✅ TOTALS
  const budgetedBalance = items.reduce((acc, item) => {
    return item.type === "income"
      ? acc + item.expected
      : acc - item.expected;
  }, 0);

  const actualBalance = items.reduce((acc, item) => {
    return item.type === "income"
      ? acc + item.actual
      : acc - item.actual;
  }, 0);

  return (
    <div className={dashboardStyles.appContainer}>
      <main className={dashboardStyles.mainArea}>
        <section className={dashboardStyles.contentScrollArea}>




          <div className={styles.header}>

  <div className={styles.headerRow}>
    <h2>{budgetName}</h2>
    <button onClick={handleEditName} className={styles.editSmall}>
      Edit
    </button>
  </div>

  <div className={styles.headerRow}>
    <span>Period: {period}</span>
    <button onClick={handleEditPeriod} className={styles.editSmall}>
      Change
    </button>
  </div>

</div>

          {/* TOP BALANCES */}
          {items.length > 0 && (
            <div className={styles.balanceGrid}>
              <div className={dashboardStyles.summaryCard}>
                <p>Budgeted Balance</p>
                <h2>₦{budgetedBalance.toLocaleString()}</h2>
              </div>

              <div className={dashboardStyles.summaryCard}>
                <p>Actual Balance</p>
                <h2>₦{actualBalance.toLocaleString()}</h2>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className={styles.table}>

            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Expected</span>
              <span>Actual</span>
              <span></span>
            </div>

            {items.map((item) => (
              <div key={item.id} className={styles.row}>

                <span className={styles.name}>{item.name}</span>

                <span>₦{item.expected.toLocaleString()}</span>

                <span
                  className={
                    item.actual > item.expected ? styles.danger : ""
                  }
                >
                  ₦{item.actual.toLocaleString()}
                </span>

                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

              </div>
            ))}

          </div>

          {/* FORM */}
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;

                // allow only letters and spaces
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setName(value);
                }
              }}
            />

            <input
              type="number"
              placeholder="Budgeted amount"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button onClick={handleAdd}>
              Add Budget Item
            </button>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Budget;