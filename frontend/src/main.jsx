import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Dashboard.module.css";
import api from "../api/api";

// ─────────────────────────────────────────────
// BUDGET VIEW
// ─────────────────────────────────────────────
const BudgetView = ({ isSidebarOpen, setIsSidebarOpen, onBack, onBudgetCreated, existingBudget }) => {
  const isEditing = !!existingBudget;

  const [items, setItems]                     = useState([]);
  const [budgetName, setBudgetName]           = useState(existingBudget?.name || "Untitled");
  const [isEditingName, setIsEditingName]     = useState(false);
  const [period, setPeriod]                   = useState(existingBudget?.period || "None");
  const [name, setName]                       = useState("");
  const [expected, setExpected]               = useState("");
  const [type, setType]                       = useState("EXPENSE");
  const [saving, setSaving]                   = useState(false);
  const [loading, setLoading]                 = useState(isEditing);
  const [budgetID, setBudgetID]               = useState(existingBudget?.budgetID || null);
  const [pageError, setPageError]             = useState("");
  const [addError, setAddError]               = useState("");
  const [addingItem, setAddingItem]           = useState(false);

  const [editingItemId, setEditingItemId]     = useState(null);
  const [editFields, setEditFields]           = useState({});
  const [editError, setEditError]             = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteError, setDeleteError]         = useState("");

  // ✅ Ref guard — prevents StrictMode from firing POST /budget twice
  const budgetCreated = useRef(false);

  useEffect(() => {
    if (isEditing) {
      // Load existing items
      const loadItems = async () => {
        try {
          const res = await api.get(`/${existingBudget.budgetID}/items`);
          const loaded = (Array.isArray(res.data) ? res.data : []).map((i) => ({
            localId:     i.id,
            id:          i.id,
            name:        i.name,
            expected:    Number(i.budgetedAmount || 0),
            actual:      Number(i.actualAmount   || 0),
            type:        i.budgetItemType,
            fromBackend: true,
          }));
          setItems(loaded);
        } catch (err) {
          setPageError("Failed to load budget items. Please go back and try again.");
        } finally {
          setLoading(false);
        }
      };
      loadItems();
    } else {
      // ✅ Guard: only create once even if StrictMode fires effect twice
      if (budgetCreated.current) return;
      budgetCreated.current = true;

      const createBudget = async () => {
        try {
          const res = await api.post("/budget");
          console.log("Budget created:", res.data.budgetID);
          setBudgetID(res.data.budgetID);
        } catch (err) {
          setPageError("Failed to create budget. Please go back and try again.");
        }
      };
      createBudget();
    }
  }, []);

  // ── Add item — posts immediately to backend ──
  const handleAdd = async () => {
    setAddError("");

    if (!name.trim() || !expected) {
      setAddError("Please fill in both item name and amount.");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setAddError("Item name must contain letters only.");
      return;
    }
    if (!budgetID) {
      setAddError("Budget is still being prepared, please wait a moment.");
      return;
    }

    setAddingItem(true);
    try {
      // ✅ Post item immediately — no batching at Save
      const res = await api.post(`/addItems/${budgetID}`, [
        {
          name:           name.trim(),
          budgetedAmount: Number(expected),
          budgetItemType: type,
          period:         period === "None" ? null : period,
        },
      ]);

      // Use ID from response if available, fallback to Date.now()
      const saved = Array.isArray(res.data) ? res.data[0] : res.data;
      setItems((prev) => [
        {
          localId:     saved?.id || Date.now(),
          id:          saved?.id || null,
          name:        name.trim(),
          expected:    Number(expected),
          actual:      0,
          type,
          fromBackend: true,
        },
        ...prev,
      ]);
      setName("");
      setExpected("");
    } catch (err) {
      setAddError(
        err.response?.data?.message || "Failed to add item. Please try again."
      );
    } finally {
      setAddingItem(false);
    }
  };

  // ── Start inline edit ──
  const handleStartEdit = (item) => {
    setEditError("");
    setConfirmDeleteId(null);
    setEditingItemId(item.localId);
    setEditFields({
      name:           item.name,
      budgetedAmount: item.expected,
      actualAmount:   item.actual,
      budgetItemType: item.type,
    });
  };

  // ── Save edited item ──
  const handleSaveItemEdit = async (item) => {
    setEditError("");
    if (!editFields.name.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }
    if (item.id) {
      try {
        await api.patch(`/${budgetID}/items/${item.id}`, {
          name:           editFields.name,
          budgetedAmount: Number(editFields.budgetedAmount),
          actualAmount:   Number(editFields.actualAmount),
          budgetItemType: editFields.budgetItemType,
        });
      } catch (err) {
        setEditError(
          err.response?.data?.message || "Failed to update item. Please try again."
        );
        return;
      }
    }
    setItems((prev) =>
      prev.map((i) =>
        i.localId !== item.localId ? i : {
          ...i,
          name:     editFields.name,
          expected: Number(editFields.budgetedAmount),
          actual:   Number(editFields.actualAmount),
          type:     editFields.budgetItemType,
        }
      )
    );
    setEditingItemId(null);
  };

  // ── Delete item step 1: show confirm ──
  const handleAskDeleteItem = (item) => {
    setDeleteError("");
    setEditingItemId(null);
    setConfirmDeleteId(item.localId);
  };

  // ── Delete item step 2: confirmed ──
  const handleConfirmDeleteItem = async (item) => {
    setDeleteError("");
    if (item.id) {
      try {
        await api.delete(`/${budgetID}/items/${item.id}`);
      } catch (err) {
        setDeleteError(
          err.response?.data?.message || "Failed to delete item. Please try again."
        );
        return;
      }
    }
    setItems((prev) => prev.filter((i) => i.localId !== item.localId));
    setConfirmDeleteId(null);
  };

  // ── Save & Back — ONLY updates name + period ──
  const handleSaveAndBack = async () => {
    setPageError("");
    if (!budgetID) { setPageError("Budget not ready yet, please wait."); return; }
    setSaving(true);
    try {
      // ✅ Only PUT name/period — items are already saved individually
      await api.put(`/${budgetID}`, {
        name:   budgetName,
        period: period === "None" ? null : period,
      });

      if (onBudgetCreated) onBudgetCreated();
      onBack();
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Failed to save budget. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const budgetedBalance = items.reduce(
    (acc, i) => (i.type === "INCOME" ? acc + i.expected : acc - i.expected), 0
  );
  const actualBalance = items.reduce(
    (acc, i) => (i.type === "INCOME" ? acc + i.actual : acc - i.actual), 0
  );

  if (loading) {
    return (
      <section className={styles.contentScrollArea}>
        <p className={styles.loadingMsg}>⏳ Loading budget...</p>
      </section>
    );
  }

  return (
    <>
      <header className={styles.topNav}>
        <div className={styles.navLeft}>
          {!isSidebarOpen && (
            <button className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>☰</button>
          )}
          {isEditingName ? (
            <input
              className={styles.budgetNameInput}
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setIsEditingName(false); }}
              autoFocus
            />
          ) : (
            <h1 className={styles.pageTitle} onClick={() => setIsEditingName(true)} title="Click to rename" style={{ cursor: "pointer" }}>
              <span className={styles.budgetNameEditable}>{budgetName}</span>
            </h1>
          )}
        </div>

        <div className={styles.navRight}>
          <div className={styles.periodWrapper}>
            <label className={styles.periodLabel}>Period</label>
            <select className={styles.periodSelect} value={period} onChange={(e) => setPeriod(e.target.value)}>
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
          <button className={styles.iconButton} onClick={onBack} style={{ marginLeft: "8px" }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <section className={styles.contentScrollArea}>
        {pageError && (
          <div className={styles.errorBanner}>
            ⚠️ {pageError}
            <button className={styles.errorClose} onClick={() => setPageError("")}>✕</button>
          </div>
        )}

        {!budgetID && !isEditing && <p className={styles.loadingMsg}>⏳ Preparing budget...</p>}

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
            <span>Type</span>
            <span></span>
          </div>

          {items.length === 0 && <p className={styles.emptyMsg}>No items yet — add one below.</p>}

          {items.map((item) => (
            <React.Fragment key={item.localId}>
              {editingItemId === item.localId ? (
                <>
                  <div className={styles.editRow}>
                    <input
                      className={styles.editRowInput}
                      value={editFields.name}
                      onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Name"
                    />
                    <input
                      className={styles.editRowInput}
                      type="number"
                      value={editFields.budgetedAmount}
                      onChange={(e) => setEditFields((f) => ({ ...f, budgetedAmount: e.target.value }))}
                      placeholder="Expected"
                    />
                    <input
                      className={styles.editRowInput}
                      type="number"
                      value={editFields.actualAmount}
                      onChange={(e) => setEditFields((f) => ({ ...f, actualAmount: e.target.value }))}
                      placeholder="Actual"
                    />
                    <select
                      className={styles.editRowSelect}
                      value={editFields.budgetItemType}
                      onChange={(e) => setEditFields((f) => ({ ...f, budgetItemType: e.target.value }))}
                    >
                      <option value="EXPENSE">Expense</option>
                      <option value="INCOME">Income</option>
                    </select>
                    <div className={styles.editRowActions}>
                      <button className={styles.saveRowBtn} onClick={() => handleSaveItemEdit(item)}>✓</button>
                      <button className={styles.cancelRowBtn} onClick={() => { setEditingItemId(null); setEditError(""); }}>✕</button>
                    </div>
                  </div>
                  {editError && <div className={styles.inlineError}>⚠️ {editError}</div>}
                </>
              ) : confirmDeleteId === item.localId ? (
                <>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmText}>
                      Delete <strong>{item.name}</strong>? This cannot be undone.
                    </span>
                    <div className={styles.confirmActions}>
                      <button className={styles.confirmYesBtn} onClick={() => handleConfirmDeleteItem(item)}>Yes, delete</button>
                      <button className={styles.confirmNoBtn} onClick={() => { setConfirmDeleteId(null); setDeleteError(""); }}>Cancel</button>
                    </div>
                  </div>
                  {deleteError && <div className={styles.inlineError}>⚠️ {deleteError}</div>}
                </>
              ) : (
                <div className={styles.tableRow}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span>₦{item.expected.toLocaleString()}</span>
                  <span className={item.actual > item.expected ? styles.danger : ""}>
                    ₦{item.actual.toLocaleString()}
                  </span>
                  <span className={`${styles.typeBadge} ${item.type === "INCOME" ? styles.income : styles.expense}`}>
                    {item.type}
                  </span>
                  <div className={styles.rowActions}>
                    <button className={styles.editRowBtn} onClick={() => handleStartEdit(item)}>✏️</button>
                    <button className={styles.deleteRowBtn} onClick={() => handleAskDeleteItem(item)}>🗑</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Add item form */}
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) { setName(e.target.value); setAddError(""); } }}
          />
          <input
            type="number"
            placeholder="Budgeted amount"
            value={expected}
            onChange={(e) => { setExpected(e.target.value); setAddError(""); }}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          <button onClick={handleAdd} disabled={addingItem}>
            {addingItem ? "Adding..." : "Add Item"}
          </button>
        </div>
        {addError && <div className={styles.inlineError} style={{ marginTop: "8px" }}>⚠️ {addError}</div>}
      </section>
    </>
  );
};

// ─────────────────────────────────────────────
// BUDGET CARD
// ─────────────────────────────────────────────
const BudgetCard = ({ budget, onClick, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError]     = useState("");

  const formattedDate = new Date(budget.createdAt).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });

  const handleDeleteClick = (e) => { e.stopPropagation(); setConfirmDelete(true); setDeleteError(""); };

  const handleConfirm = async (e) => {
    e.stopPropagation();
    setDeleteError("");
    try {
      await onDelete(budget.budgetID);
    } catch {
      setDeleteError("Failed to delete. Please try again.");
    }
  };

  const handleCancel = (e) => { e.stopPropagation(); setConfirmDelete(false); setDeleteError(""); };

  return (
    <div
      className={`${styles.budgetCard} ${confirmDelete ? styles.budgetCardExpanded : ""}`}
      onClick={!confirmDelete ? onClick : undefined}
    >
      <div className={styles.cardAccent} />

      {!confirmDelete && (
        <button className={styles.deleteCardBtn} onClick={handleDeleteClick} title="Delete budget">🗑</button>
      )}

      <h4 className={styles.budgetCardName}>{budget.name}</h4>
      <p className={styles.budgetCardBalanceLabel}>Balance</p>
      <p className={styles.budgetCardBalance}>
        ₦{Number(budget.budgetedAmount || 0).toLocaleString("en-NG")}
      </p>
      <p className={styles.budgetCardDate}>{formattedDate}</p>

      {confirmDelete && (
        <div className={styles.cardConfirm} onClick={(e) => e.stopPropagation()}>
          <p className={styles.cardConfirmText}>Delete this budget?<br /><span>This cannot be undone.</span></p>
          {deleteError && <p className={styles.cardConfirmError}>⚠️ {deleteError}</p>}
          <div className={styles.cardConfirmActions}>
            <button className={styles.confirmYesBtn} onClick={handleConfirm}>Yes, delete</button>
            <button className={styles.confirmNoBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen]   = useState(true);
  const [view, setView]                     = useState("dashboard");
  const [budgets, setBudgets]               = useState([]);
  const [user, setUser]                     = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [fetchError, setFetchError]         = useState("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get("/user-details");
      setUser(res.data);
    } catch (err) {
      console.error("User fetch error:", err.response?.status);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets");
      setBudgets(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setFetchError("Failed to load budgets. Please refresh the page.");
    }
  };

  const handleDeleteBudget = async (budgetID) => {
    await api.delete(`/budget/${budgetID}`);
    setBudgets((prev) => prev.filter((b) => b.budgetID !== budgetID));
  };

  useEffect(() => {
    fetchUser();
    fetchBudgets();
  }, []);

  const handleOpenBudget = (budget) => { setSelectedBudget(budget); setView("budget"); };
  const handleCreateNew  = ()       => { setSelectedBudget(null);   setView("budget"); };
  const handleBack       = ()       => { setSelectedBudget(null);   setView("dashboard"); };

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
          <button className={`${styles.navItem} ${styles.logoutItem}`} onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
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
                  <button className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>☰</button>
                )}
                <h1 className={styles.pageTitle}>Dashboard</h1>
              </div>
              <button className={styles.primaryButton} onClick={handleCreateNew}>
                <span className={styles.btnIcon}>➕</span> Create Budget
              </button>
            </header>

            <section className={styles.contentScrollArea}>
              {user && (
                <div className={styles.summaryCard}>
                  <h2 className={styles.greetingText}>Hello, {user.firstName} {user.lastName} 👋</h2>
                  <p className={styles.subGreeting}>Empowering your financial journey, one step at a time.</p>
                </div>
              )}

              {fetchError && (
                <div className={styles.errorBanner}>
                  ⚠️ {fetchError}
                  <button className={styles.errorClose} onClick={() => setFetchError("")}>✕</button>
                </div>
              )}

              {budgets.length > 0 ? (
                <>
                  <h3 className={styles.sectionHeading}>Your Active Budgets</h3>
                  <div className={styles.grid}>
                    {budgets.map((budget, index) => (
                      <BudgetCard
                        key={budget.budgetID || index}
                        budget={budget}
                        onClick={() => handleOpenBudget(budget)}
                        onDelete={handleDeleteBudget}
                      />
                    ))}
                  </div>
                </>
              ) : !fetchError ? (
                <div className={styles.summaryCard} style={{ textAlign: "center", padding: "40px" }}>
                  <p style={{ fontSize: "2rem" }}>🗂️</p>
                  <p>No budgets yet. Click <strong>➕ Create Budget</strong> to get started.</p>
                </div>
              ) : null}
            </section>
          </>
        ) : (
          <BudgetView
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onBack={handleBack}
            onBudgetCreated={fetchBudgets}
            existingBudget={selectedBudget}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;