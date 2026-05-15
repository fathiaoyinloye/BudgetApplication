import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./Dashboard.module.css";
import api from "../api/api";

// ─────────────────────────────────────────────
// MARKDOWN RENDERER
// ─────────────────────────────────────────────
const parseBold = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className={styles.aiBold}>{part}</strong> : part
  );
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.replace(/\\n/g, "\n").split("\n");
  const elements = [];
  let key = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("### ") || line.startsWith("## ")) {
      const content = line.replace(/^#{2,3}\s+/, "");
      elements.push(<p key={key++} className={styles.aiHeading}>{parseBold(content)}</p>);
    } else if (/^[\*\-]\s+/.test(line)) {
      elements.push(
        <div key={key++} className={styles.aiBullet}>
          <span className={styles.aiBulletDot}>•</span>
          <span>{parseBold(line.replace(/^[\*\-]\s+/, ""))}</span>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className={styles.aiSpacer} />);
    } else {
      elements.push(<p key={key++} className={styles.aiParagraph}>{parseBold(line)}</p>);
    }
  }
  return elements;
};



// ─────────────────────────────────────────────
// REPORT PANEL — slides in from the right
// ─────────────────────────────────────────────
const ReportPanel = ({ report, onClose, loading, error }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [panelWidth, setPanelWidth] = useState(null); // null = use CSS default 50vw
  const dragging = React.useRef(false);
  const startX = React.useRef(0);
  const startWidth = React.useRef(0);
  const panelRef = React.useRef(null);

  // Drag-to-resize from the left edge
  const handleDragStart = (e) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = panelRef.current?.offsetWidth || window.innerWidth * 0.5;

    const onMove = (ev) => {
      if (!dragging.current) return;
      const delta = startX.current - ev.clientX;
      const newWidth = Math.min(Math.max(startWidth.current + delta, 360), window.innerWidth);
      setPanelWidth(newWidth);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const statusColor = {
    Healthy:  { color: "#34d399", bg: "rgba(52, 211, 153, 0.1)",  border: "rgba(52, 211, 153, 0.3)"  },
    Warning:  { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)",  border: "rgba(251, 191, 36, 0.3)"  },
    Critical: { color: "#f87171", bg: "rgba(248, 113, 113, 0.1)", border: "rgba(248, 113, 113, 0.3)" },
  }[report?.status] || { color: "#c4b5fd", bg: "rgba(196, 181, 253, 0.1)", border: "rgba(196, 181, 253, 0.3)" };

  const usedColor = (pct) => {
    if (pct >= 90) return "#f87171";
    if (pct >= 70) return "#fbbf24";
    return "#34d399";
  };

  const perfColor = (pct) => {
    if (pct >= 80) return "#34d399";
    if (pct >= 50) return "#fbbf24";
    return "#f87171";
  };

  // Compute final width: expanded trumps drag, drag trumps CSS default
  const computedWidth = isExpanded ? "100vw" : panelWidth ? `${panelWidth}px` : "50vw";

  return (
    <div className={styles.reportOverlay} onClick={onClose}>
      <div
        ref={panelRef}
        className={styles.reportPanel}
        style={{ width: computedWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle on the left edge */}
        <div className={styles.reportDragHandle} onMouseDown={handleDragStart} title="Drag to resize" />

        <div className={styles.reportHeader}>
          <h3 className={styles.reportTitle}>Budget Report</h3>
          <div className={styles.reportHeaderActions}>
            <button
              className={styles.reportExpandBtn}
              onClick={() => { setIsExpanded((v) => !v); setPanelWidth(null); }}
              title={isExpanded ? "Collapse" : "Expand to full screen"}
            >
              {isExpanded ? "⤡" : "⤢"}
            </button>
            <button className={styles.reportClose} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.reportBody}>
          {loading && <p className={styles.loadingMsg}>⏳ Generating report...</p>}

          {error && (
            <div className={styles.errorBanner} style={{ margin: "0" }}>
              ⚠️ {error}
            </div>
          )}

          {report && !loading && (
            <>
              <p className={styles.reportBudgetName}>{report.budgetName}</p>

              {/* Status badge */}
              <div className={styles.reportStatusBadge} style={{ background: statusColor.bg, border: `1px solid ${statusColor.border}`, color: statusColor.color }}>
                {report.status}
              </div>

              {/* Bar 1 — Budget Used (higher = worse) */}
              <div className={styles.reportProgressWrapper}>
                <div className={styles.reportProgressLabel}>
                  <span>Budget used</span>
                  <span style={{ color: usedColor(report.percentageUsed) }}>
                    {report.percentageUsed}%
                  </span>
                </div>
                <div className={styles.reportProgressTrack}>
                  <div
                    className={styles.reportProgressFill}
                    style={{
                      width: `${Math.min(report.percentageUsed, 100)}%`,
                      background: usedColor(report.percentageUsed),
                    }}
                  />
                </div>
              </div>

              {/* Bar 2 — Budget Performance (higher = better) */}
              <div className={styles.reportProgressWrapper}>
                <div className={styles.reportProgressLabel}>
                  <span>Balance performance</span>
                  <span style={{ color: perfColor(report.budgetPerformancePercentage) }}>
                    {report.budgetPerformancePercentage}%
                  </span>
                </div>
                <div className={styles.reportProgressTrack}>
                  <div
                    className={styles.reportProgressFill}
                    style={{
                      width: `${Math.min(Math.max(report.budgetPerformancePercentage, 0), 100)}%`,
                      background: perfColor(report.budgetPerformancePercentage),
                    }}
                  />
                </div>
                <p className={styles.reportProgressHint}>
                  How well your actual balance tracks your planned balance — higher is better
                </p>
              </div>

              {/* Amount breakdown */}
              <div className={styles.reportAmounts}>
                <div className={styles.reportAmountRow}>
                  <span className={styles.reportAmountLabel}>Budgeted</span>
                  <span className={styles.reportAmountValue}>₦{Number(report.budgetedAmount).toLocaleString("en-NG")}</span>
                </div>
                <div className={styles.reportAmountRow}>
                  <span className={styles.reportAmountLabel}>Actual Spent</span>
                  <span className={styles.reportAmountValue}>₦{Number(report.actualAmount).toLocaleString("en-NG")}</span>
                </div>
                <div className={`${styles.reportAmountRow} ${styles.reportAmountRowHighlight}`}>
                  <span className={styles.reportAmountLabel}>Remaining</span>
                  <span className={styles.reportAmountValue} style={{ color: statusColor.color }}>
                    ₦{Number(report.remainingAmount).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>

              {/* Insights */}
              {report.insights?.length > 0 && (
                <div className={styles.reportInsights}>
                  <p className={styles.reportInsightsTitle}>💡 Insights</p>
                  {report.insights.map((insight, i) => {
                    const isUnavailable = insight.startsWith("Our AI Advisor is currently");
                    return (
                      <div key={i} className={`${styles.reportInsightItem} ${isUnavailable ? styles.reportInsightUnavailable : ""}`}>
                        <span
                          className={styles.reportInsightDot}
                          style={{ background: isUnavailable ? "#555" : statusColor.color }}
                        />
                        <span>{insight}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* AI Analysis */}
              {report.aiResponse && (
                <div className={styles.reportAiSection}>
                  <p className={styles.reportAiTitle}>🤖 AI Analysis</p>
                  <div className={styles.reportAiBody}>
                    {renderMarkdown(report.aiResponse)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BUDGET VIEW
// ─────────────────────────────────────────────
const BudgetView = ({ isSidebarOpen, setIsSidebarOpen, onBack, onBudgetCreated, existingBudget }) => {
  const isEditing = !!existingBudget;

  const [items, setItems]                     = useState([]);
  const [budgetName, setBudgetName]           = useState(existingBudget?.name || "");
  const [isEditingName, setIsEditingName]     = useState(false);
  const [period, setPeriod]                   = useState(existingBudget?.period || "NONE");
  const [name, setName]                       = useState("");
  const [expected, setExpected]               = useState("");
  const [type, setType]                       = useState("EXPENSE");
  const [saving, setSaving]                   = useState(false);
  const [loading, setLoading]                 = useState(isEditing);
  const [budgetID]                            = useState(existingBudget?.budgetID);
  const [pageError, setPageError]             = useState("");
  const [addError, setAddError]               = useState("");
  const [addingItem, setAddingItem]           = useState(false);

  // ✅ Balances come from backend — not calculated on frontend
  const [budgetedBalance, setBudgetedBalance] = useState(Number(existingBudget?.budgetedAmount || 0));
  const [actualBalance, setActualBalance]     = useState(Number(existingBudget?.actualAmount   || 0));

  const [editingItemId, setEditingItemId]     = useState(null);
  const [editFields, setEditFields]           = useState({});
  const [editError, setEditError]             = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteError, setDeleteError]         = useState("");

  // Report panel state
  const [showReport, setShowReport]           = useState(false);
  const [report, setReport]                   = useState(null);
  const [reportLoading, setReportLoading]     = useState(false);
  const [reportError, setReportError]         = useState("");

  // ✅ Re-fetch budget to get updated balances from backend
  const refreshBalances = async () => {
    try {
      const res = await api.get(`/budget/${budgetID}`);
      setBudgetedBalance(Number(res.data.budgetedAmount || 0));
      setActualBalance(Number(res.data.actualAmount     || 0));
    } catch (err) {
      console.error("Failed to refresh balances:", err.response?.status);
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    const loadItems = async () => {
      try {
        // Load items and refresh balances in parallel
        const [itemsRes, budgetRes] = await Promise.all([
          api.get(`/${existingBudget.budgetID}/items`),
          api.get(`/budget/${existingBudget.budgetID}`),
        ]);
        const loaded = (Array.isArray(itemsRes.data) ? itemsRes.data : []).map((i) => ({
          localId:     i.id,
          id:          i.id,
          name:        i.name,
          expected:    Number(i.budgetedAmount || 0),
          actual:      Number(i.actualAmount   || 0),
          type:        i.budgetItemType,
          fromBackend: true,
        }));
        setItems(loaded);
        // Always get fresh balances from backend on open
        setBudgetedBalance(Number(budgetRes.data.budgetedAmount || 0));
        setActualBalance(Number(budgetRes.data.actualAmount || 0));
      } catch (err) {
        setPageError("Failed to load budget items. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  // ── Generate report ──
  const handleGenerateReport = async () => {
    setReportError("");
    setReport(null);
    setShowReport(true);
    setReportLoading(true);
    try {
      const res = await api.get(`/${budgetID}/report`);
      setReport(res.data);
    } catch (err) {
      setReportError(err.response?.data?.message || "Failed to generate report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  // ── Add item ──
  const handleAdd = async () => {
    setAddError("");
    if (!name.trim() || !expected) { setAddError("Please fill in both item name and amount."); return; }
    if (!/^[a-zA-Z\s]+$/.test(name)) { setAddError("Item name must contain letters only."); return; }

    setAddingItem(true);
    try {
      const res = await api.post(`/addItems/${budgetID}`, [
        {
          name:           name.trim(),
          budgetedAmount: Number(expected),
          budgetItemType: type,
          period:         period === "NONE" ? null : period,
        },
      ]);
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
      await refreshBalances();
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add item. Please try again.");
    } finally {
      setAddingItem(false);
    }
  };

  // ── Inline edit ──
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

  const handleSaveItemEdit = async (item) => {
    setEditError("");
    if (!editFields.name.trim()) { setEditError("Name cannot be empty."); return; }
    if (item.id) {
      try {
        await api.patch(`/${budgetID}/items/${item.id}`, {
          name:           editFields.name,
          budgetedAmount: Number(editFields.budgetedAmount),
          actualAmount:   Number(editFields.actualAmount),
          budgetItemType: editFields.budgetItemType,
        });
        await refreshBalances();
      } catch (err) {
        setEditError(err.response?.data?.message || "Failed to update item. Please try again.");
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

  // ── Delete item ──
  const handleAskDeleteItem = (item) => {
    setDeleteError("");
    setEditingItemId(null);
    setConfirmDeleteId(item.localId);
  };

  const handleConfirmDeleteItem = async (item) => {
    setDeleteError("");
    if (item.id) {
      try {
        await api.delete(`/${budgetID}/items/${item.id}`);
        await refreshBalances();
      } catch (err) {
        setDeleteError(err.response?.data?.message || "Failed to delete item. Please try again.");
        return;
      }
    }
    setItems((prev) => prev.filter((i) => i.localId !== item.localId));
    setConfirmDeleteId(null);
  };

  // ── Save & Back ──
  const handleSaveAndBack = async () => {
    setPageError("");
    setSaving(true);
    try {
      await api.put(`/${budgetID}`, {
        name:   budgetName,
        period: period === "NONE" ? null : period,
      });
      if (onBudgetCreated) onBudgetCreated();
      onBack();
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to save budget. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.contentScrollArea}>
        <p className={styles.loadingMsg}>⏳ Loading budget...</p>
      </section>
    );
  }

  return (
    <>
      {/* Report panel */}
      {showReport && (
        <ReportPanel
          report={report}
          loading={reportLoading}
          error={reportError}
          onClose={() => { setShowReport(false); setReport(null); setReportError(""); }}
        />
      )}

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
          {/* Generate Report button */}
          <button className={styles.reportBtn} onClick={handleGenerateReport}>
            📊 Report
          </button>

          <div className={styles.periodWrapper}>
            <label className={styles.periodLabel}>Period</label>
            <select className={styles.periodSelect} value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="NONE">None</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>
          <button className={styles.primaryButton} onClick={handleSaveAndBack} disabled={saving} style={{ marginLeft: "8px" }}>
            {saving ? "Saving..." : "💾 Save & Back"}
          </button>
          <button className={styles.iconButton} onClick={onBack} style={{ marginLeft: "8px" }}>← Dashboard</button>
        </div>
      </header>

      <section className={styles.contentScrollArea}>
        {pageError && (
          <div className={styles.errorBanner}>
            ⚠️ {pageError}
            <button className={styles.errorClose} onClick={() => setPageError("")}>✕</button>
          </div>
        )}

        {/* ✅ Balances always from backend */}
        <div className={styles.balanceGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Budgeted Balance</p>
            <h2 className={styles.summaryAmount}>₦{budgetedBalance.toLocaleString("en-NG")}</h2>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Actual Balance</p>
            <h2 className={styles.summaryAmount}>₦{actualBalance.toLocaleString("en-NG")}</h2>
          </div>
        </div>

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
                    <input className={styles.editRowInput} value={editFields.name}
                      onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))} placeholder="Name" />
                    <input className={styles.editRowInput} type="number" value={editFields.budgetedAmount}
                      onChange={(e) => setEditFields((f) => ({ ...f, budgetedAmount: e.target.value }))} placeholder="Expected" />
                    <input className={styles.editRowInput} type="number" value={editFields.actualAmount}
                      onChange={(e) => setEditFields((f) => ({ ...f, actualAmount: e.target.value }))} placeholder="Actual" />
                    <select className={styles.editRowSelect} value={editFields.budgetItemType}
                      onChange={(e) => setEditFields((f) => ({ ...f, budgetItemType: e.target.value }))}>
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
                    <span className={styles.confirmText}>Delete <strong>{item.name}</strong>? This cannot be undone.</span>
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
                  <span>₦{item.actual.toLocaleString()}</span>
                  <span className={`${styles.typeBadge} ${item.type === "INCOME" ? styles.income : styles.expense}`}>{item.type}</span>
                  <div className={styles.rowActions}>
                    <button className={styles.editRowBtn} onClick={() => handleStartEdit(item)}>✏️</button>
                    <button className={styles.deleteRowBtn} onClick={() => handleAskDeleteItem(item)}>🗑</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.addForm}>
          <input type="text" placeholder="Item name" value={name}
            onChange={(e) => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) { setName(e.target.value); setAddError(""); } }} />
          <input type="number" placeholder="Budgeted amount" value={expected}
            onChange={(e) => { setExpected(e.target.value); setAddError(""); }} />
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
    try { await onDelete(budget.budgetID); }
    catch { setDeleteError("Failed to delete. Please try again."); }
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
  const [isSidebarOpen, setIsSidebarOpen]     = useState(true);
  const [view, setView]                       = useState("dashboard");
  const [budgets, setBudgets]                 = useState([]);
  const [user, setUser]                       = useState(null);
  const [selectedBudget, setSelectedBudget]   = useState(null);
  const [fetchError, setFetchError]           = useState("");
  const [showCreateForm, setShowCreateForm]   = useState(false);
  const [newBudgetName, setNewBudgetName]     = useState("");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState("");
  const [createError, setCreateError]         = useState("");
  const [creating, setCreating]               = useState(false);
  const navigate = useNavigate();

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets");
      setBudgets(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setFetchError("Failed to load budgets. Please refresh the page.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, budgetsRes] = await Promise.all([
          api.get("/user-details"),
          api.get("/budgets"),
        ]);
        setUser(userRes.data);
        setBudgets(Array.isArray(budgetsRes.data) ? budgetsRes.data : budgetsRes.data.data || []);
      } catch (err) {
        setFetchError("Failed to load data. Please refresh the page.");
      }
    };
    load();
  }, []);

  const handleCreateBudget = async () => {
    setCreateError("");
    if (!newBudgetName.trim()) { setCreateError("Budget name is required."); return; }
    if (!newBudgetPeriod)      { setCreateError("Please select a period."); return; }

    setCreating(true);
    try {
      const res = await api.post("/budget", {
        name:   newBudgetName.trim(),
        period: newBudgetPeriod,
      });
      setNewBudgetName("");
      setNewBudgetPeriod("");
      setShowCreateForm(false);
      setSelectedBudget(res.data);
      setView("budget");
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create budget. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBudget = async (budgetID) => {
    await api.delete(`/budget/${budgetID}`);
    setBudgets((prev) => prev.filter((b) => b.budgetID !== budgetID));
  };

  const handleOpenBudget = (budget) => { setSelectedBudget(budget); setView("budget"); };
  const handleBack = () => { setSelectedBudget(null); setView("dashboard"); fetchBudgets(); };

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
          <button className={`${styles.navItem} ${styles.logoutItem}`}
            onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
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
              <button
                className={styles.primaryButton}
                onClick={() => { setShowCreateForm((v) => !v); setCreateError(""); }}
              >
                <span className={styles.btnIcon}>{showCreateForm ? "✕" : "➕"}</span>
                {showCreateForm ? "Cancel" : "Create Budget"}
              </button>
            </header>

            <section className={styles.contentScrollArea}>
              {user && (
                <div className={styles.summaryCard}>
                  <h2 className={styles.greetingText}>Hello, {user.firstName} {user.lastName} 👋</h2>
                  <p className={styles.subGreeting}>Empowering your financial journey, one step at a time.</p>
                </div>
              )}

              {showCreateForm && (
                <div className={styles.createBudgetBar}>
                  <input
                    className={styles.createBudgetInput}
                    type="text"
                    placeholder="Budget name"
                    value={newBudgetName}
                    onChange={(e) => { setNewBudgetName(e.target.value); setCreateError(""); }}
                  />
                  <select
                    className={styles.createBudgetSelect}
                    value={newBudgetPeriod}
                    onChange={(e) => { setNewBudgetPeriod(e.target.value); setCreateError(""); }}
                  >
                    <option value="" disabled>Select period</option>
                    <option value="NONE">None</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                  <button className={styles.createBudgetBtn} onClick={handleCreateBudget} disabled={creating}>
                    {creating ? "Creating..." : "Create →"}
                  </button>
                  {createError && <span className={styles.createBudgetError}>⚠️ {createError}</span>}
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