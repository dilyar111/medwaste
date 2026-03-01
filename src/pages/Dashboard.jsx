import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Inline styles / design tokens ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .db-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
    color: #1a2035;
  }

  /* TOP NAV */
  .db-topbar {
    background: #fff;
    border-bottom: 1px solid #e4e9f0;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 8px rgba(0,0,0,.05);
  }
  .db-brand {

    font-weight: 800;
    font-size: 1.25rem;
    background: linear-gradient(120deg, #1A6EFF, #00D68F);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .db-nav-right { display: flex; align-items: center; gap: 12px; }
  .db-user-pill {
    display: flex; align-items: center; gap: 8px;
    background: #f0f4f8; border-radius: 999px;
    padding: 5px 12px 5px 6px; font-size: 0.85rem; font-weight: 500;
  }
  .db-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #1A6EFF, #00D68F);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 0.75rem;
  }
  .db-online-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #00D68F;
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(0,214,143,.3);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(0,214,143,.3); }
    50%      { box-shadow: 0 0 0 2px #fff, 0 0 0 6px rgba(0,214,143,.15); }
  }
  .db-btn {
    padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
    transition: all .2s;
  }
  .db-btn-ghost { background: #f0f4f8; color: #5e6a85; }
  .db-btn-ghost:hover { background: #e4e9f0; }
  .db-btn-danger { background: #fff0f1; color: #e53e3e; border: 1px solid #fed7d7; }
  .db-btn-danger:hover { background: #fed7d7; }
  .db-btn-primary { background: #1A6EFF; color: #fff; }
  .db-btn-primary:hover { background: #0F4ECC; transform: translateY(-1px); }
  .db-btn-green { background: #00D68F; color: #0B1A14; }
  .db-btn-green:hover { background: #00A870; }
  .db-lang-toggle {
    display: flex; background: #f0f4f8; border-radius: 6px; overflow: hidden;
  }
  .db-lang-toggle button {
    padding: 5px 10px; border: none; background: transparent; cursor: pointer;
    font-size: 0.8rem; font-weight: 600; color: #5e6a85; transition: all .2s;
  }
  .db-lang-toggle button.active { background: #1A6EFF; color: #fff; border-radius: 6px; }

  /* PERIOD TABS */
  .db-period-tabs {
    display: flex; gap: 4px; background: #e8edf5; border-radius: 8px; padding: 3px;
  }
  .db-period-tabs button {
    padding: 5px 14px; border: none; border-radius: 6px; background: transparent;
    font-size: 0.8rem; font-weight: 500; color: #5e6a85; cursor: pointer; transition: all .2s;
  }
  .db-period-tabs button.active { background: #fff; color: #1a2035; box-shadow: 0 1px 4px rgba(0,0,0,.1); }

  /* MAIN LAYOUT */
  .db-main { padding: 28px 32px; max-width: 1400px; margin: 0 auto; }

  .db-page-header { margin-bottom: 24px; }
  .db-page-header h1 {
    font-family: sans-serif; font-size: 1.9rem; font-weight: 800;
    letter-spacing: -0.03em; color: #1a2035; margin-bottom: 2px;
  }
  .db-page-header p { color: #5e6a85; font-size: 0.9rem; }

  .db-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
  }
  .db-toolbar-left { display: flex; align-items: center; gap: 10px; }
  .db-status-badge {
    display: flex; align-items: center; gap: 6px;
    background: #e6faf3; color: #00A870; border-radius: 999px;
    padding: 4px 12px; font-size: 0.8rem; font-weight: 600;
  }
  .db-autorefresh {
    display: flex; align-items: center; gap: 6px;
    background: #fff; border: 1px solid #e4e9f0; border-radius: 8px;
    padding: 5px 12px; font-size: 0.8rem; color: #5e6a85;
  }

  /* STAT CARDS */
  .db-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;
  }
  .db-stat-card {
    background: #fff; border-radius: 14px; padding: 20px 22px;
    border: 1px solid #e4e9f0; transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .db-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  .db-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #1A6EFF, #00D68F);
  }
  .db-stat-label { font-size: 0.78rem; font-weight: 600; color: #5e6a85; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
  .db-stat-value { font-family:  sans-serif; font-size: 2rem; font-weight: 800; color: #1a2035; line-height: 1; margin-bottom: 6px; }
  .db-stat-delta {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.75rem; font-weight: 600; padding: 2px 7px; border-radius: 999px;
  }
  .db-delta-up   { background: #e6faf3; color: #00A870; }
  .db-delta-down { background: #fff0f1; color: #e53e3e; }
  .db-delta-neu  { background: #f0f4f8; color: #5e6a85; }
  .db-stat-sub { font-size: 0.78rem; color: #5e6a85; margin-top: 4px; }
  .db-stat-forecast { font-size: 0.75rem; color: #1A6EFF; margin-top: 6px; font-weight: 500; }

  /* 2-COL GRID */
  .db-two-col { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px; }
  .db-card {
    background: #fff; border-radius: 14px; border: 1px solid #e4e9f0; padding: 22px;
  }
  .db-card-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;
  }
  .db-card-title { font-family: sans-serif; font-size: 1rem; font-weight: 700; color: #1a2035; }
  .db-card-link { font-size: 0.8rem; color: #1A6EFF; text-decoration: none; cursor: pointer; font-weight: 500; }
  .db-card-link:hover { text-decoration: underline; }

  /* ANALYTICS METRICS */
  .db-analytics-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; }
  .db-analytics-item {
    text-align: center; padding: 16px 10px;
    border-right: 1px solid #e4e9f0;
  }
  .db-analytics-item:last-child { border-right: none; }
  .db-analytics-val { font-family:  sans-serif; font-size: 1.6rem; font-weight: 800; color: #1a2035; }
  .db-analytics-label { font-size: 0.78rem; color: #5e6a85; margin-top: 4px; }

  /* CHART PLACEHOLDER */
  .db-chart-area {
    height: 140px; background: linear-gradient(180deg, #f0f8ff 0%, #fff 100%);
    border-radius: 8px; border: 1px solid #e4e9f0; display: flex; align-items: flex-end;
    padding: 10px; gap: 6px; overflow: hidden;
  }
  .db-bar {
    flex: 1; background: linear-gradient(180deg, #1A6EFF, #00D68F);
    border-radius: 4px 4px 0 0; opacity: 0.7; transition: opacity .2s;
  }
  .db-bar:hover { opacity: 1; }
  .db-chart-legend { display: flex; gap: 16px; margin-top: 10px; }
  .db-legend-item { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: #5e6a85; }
  .db-legend-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* DONUT CHART PLACEHOLDER */
  .db-donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .db-donut {
    width: 100px; height: 100px; border-radius: 50%;
    background: conic-gradient(#1A6EFF 0deg 360deg, #e4e9f0 360deg);
    display: flex; align-items: center; justify-content: center; position: relative;
  }
  .db-donut-inner {
    width: 68px; height: 68px; border-radius: 50%; background: #fff;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .db-donut-pct { font-family: sans-serif; font-size: 1rem; font-weight: 800; color: #1a2035; }
  .db-donut-sub { font-size: 0.6rem; color: #5e6a85; }
  .db-waste-types { width: 100%; }
  .db-waste-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .db-waste-label { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; }
  .db-waste-dot { width: 8px; height: 8px; border-radius: 50%; background: #1A6EFF; }
  .db-waste-bar-wrap { flex: 1; height: 5px; background: #e4e9f0; border-radius: 99px; margin: 0 8px; }
  .db-waste-bar-fill { height: 100%; background: #1A6EFF; border-radius: 99px; }
  .db-waste-pct { font-size: 0.78rem; font-weight: 600; color: #1a2035; }

  /* PREDICTIONS */
  .db-predictions-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 12px; }
  .db-pred-card {
    background: #fff; border-radius: 12px; border: 1px solid #e4e9f0;
    padding: 16px; transition: transform .2s, box-shadow .2s;
  }
  .db-pred-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.07); }
  .db-pred-id { font-family:  sans-serif; font-weight: 700; font-size: 0.95rem; color: #1a2035; margin-bottom: 2px; }
  .db-pred-meta { font-size: 0.75rem; color: #5e6a85; margin-bottom: 10px; }
  .db-pred-row { display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 4px; }
  .db-pred-row-label { color: #5e6a85; }
  .db-pred-row-val { font-weight: 500; color: #1a2035; }
  .db-pred-confidence { margin-top: 10px; }
  .db-pred-conf-bar { height: 4px; background: #e4e9f0; border-radius: 99px; margin-top: 4px; }
  .db-pred-conf-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #1A6EFF, #00D68F); }
  .db-pred-btn {
    width: 100%; margin-top: 12px; padding: 8px; border-radius: 8px;
    border: 1px solid #1A6EFF; color: #1A6EFF; background: transparent;
    font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all .2s;
  }
  .db-pred-btn:hover { background: #1A6EFF; color: #fff; }
  .db-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
  .db-badge-green { background: #e6faf3; color: #00A870; }
  .db-badge-blue  { background: #eff5ff; color: #1A6EFF; }

  /* NEEDS ATTENTION */
  .db-attention-empty {
    text-align: center; padding: 24px; color: #5e6a85; font-size: 0.85rem;
  }
  .db-attention-icon { font-size: 2rem; margin-bottom: 6px; }

  /* SYSTEM METRICS */
  .db-sys-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  .db-sys-item {
    background: #f8fafc; border-radius: 10px; padding: 14px 16px;
    border: 1px solid #e4e9f0; text-align: center;
  }
  .db-sys-val { font-family:  sans-serif; font-size: 1.4rem; font-weight: 800; color: #1a2035; }
  .db-sys-unit { font-size: 0.75rem; color: #5e6a85; margin-bottom: 6px; }
  .db-sys-label { font-size: 0.78rem; color: #5e6a85; font-weight: 500; }
  .db-sys-bar { height: 3px; border-radius: 99px; background: linear-gradient(90deg, #1A6EFF, #00D68F); margin-top: 8px; }

  /* QUICK ACTIONS */
  .db-actions-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; }
  .db-action-btn {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    background: #fff; border: 1px solid #e4e9f0; border-radius: 12px;
    padding: 14px 8px; cursor: pointer; transition: all .2s; position: relative;
  }
  .db-action-btn:hover { background: #f0f4f8; transform: translateY(-2px); }
  .db-action-icon { font-size: 1.3rem; }
  .db-action-label { font-size: 0.75rem; font-weight: 500; color: #1a2035; text-align: center; }
  .db-action-new {
    position: absolute; top: 6px; right: 6px;
    background: #1A6EFF; color: #fff; border-radius: 999px;
    font-size: 0.55rem; font-weight: 700; padding: 1px 5px;
  }

  /* SETTINGS PANEL */
  .db-settings-list { display: flex; flex-direction: column; gap: 14px; }
  .db-settings-row { display: flex; align-items: center; justify-content: space-between; }
  .db-settings-info {}
  .db-settings-name { font-size: 0.85rem; font-weight: 500; color: #1a2035; }
  .db-settings-sub  { font-size: 0.75rem; color: #5e6a85; }
  .db-toggle {
    width: 36px; height: 20px; border-radius: 99px; border: none; cursor: pointer;
    transition: background .2s; position: relative; flex-shrink: 0;
  }
  .db-toggle.on  { background: #1A6EFF; }
  .db-toggle.off { background: #d1d9e6; }
  .db-toggle::after {
    content: ''; position: absolute; top: 3px; width: 14px; height: 14px;
    border-radius: 50%; background: #fff; transition: left .2s;
  }
  .db-toggle.on::after  { left: 19px; }
  .db-toggle.off::after { left: 3px; }

  /* BOTTOM GRID */
  .db-bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .db-three-col   { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px; }

  @media (max-width: 1100px) {
    .db-stats-grid { grid-template-columns: repeat(2,1fr); }
    .db-two-col, .db-three-col, .db-bottom-grid { grid-template-columns: 1fr; }
    .db-predictions-grid { grid-template-columns: repeat(2,1fr); }
    .db-actions-grid { grid-template-columns: repeat(4,1fr); }
    .db-sys-grid { grid-template-columns: repeat(2,1fr); }
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ title, value, delta, deltaType = "neu", subtitle, forecast }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-label">{title}</div>
      <div className="db-stat-value">{value}</div>
      <span className={`db-stat-delta db-delta-${deltaType}`}>
        {deltaType === "up" ? "▲" : deltaType === "down" ? "▼" : "●"} {delta}
      </span>
      <div className="db-stat-sub">{subtitle}</div>
      {forecast && <div className="db-stat-forecast"> {forecast}</div>}
    </div>
  );
}

function PredCard({ id, fillDate, collectDate, confidence }) {
  return (
    <div className="db-pred-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="db-pred-id">{id}</div>
          <div className="db-pred-meta">Unknown • Auto Registered • Sharp Medical Waste</div>
        </div>
        <span className="db-badge db-badge-green">Active</span>
      </div>
      <div className="db-pred-row">
        <span className="db-pred-row-label">100% fill date:</span>
        <span className="db-pred-row-val">{fillDate}</span>
      </div>
      <div className="db-pred-row">
        <span className="db-pred-row-label">Recommended pickup:</span>
        <span className="db-pred-row-val">{collectDate}</span>
      </div>
      <div className="db-pred-confidence">
        <div className="db-pred-row">
          <span className="db-pred-row-label">Model confidence:</span>
          <span className="db-pred-row-val" style={{ color: "#1A6EFF" }}>{confidence}</span>
        </div>
        <div className="db-pred-conf-bar">
          <div className="db-pred-conf-fill" style={{ width: confidence }} />
        </div>
      </div>
      <button className="db-pred-btn">Schedule Pickup</button>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button className={`db-toggle ${on ? "on" : "off"}`} onClick={onToggle} />
  );
}

// ── Bar chart heights (mock data) ─────────────────────────────────────────────
const barHeights = [30, 55, 45, 70, 60, 80, 51, 65, 40, 58, 72, 51];

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [period, setPeriod]   = useState("Month");
  const [settings, setSettings] = useState({
    autoRefresh: true,
    aiPredictions: true,
    analytics: true,
    compact: false,
  });

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("mw_logged_in");
    const email    = sessionStorage.getItem("mw_user");
    if (loggedIn !== "true" || !email) {
      window.location.href = "/login.html";
      return;
    }
    setUser(email);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("mw_logged_in");
    sessionStorage.removeItem("mw_user");
    window.location.href = "/login.html";
  };

  const toggleSetting = (key) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const username = user ? user.split("@")[0] : "";

  if (!user) return null;

  const predictions = [
    { id: "MED-001", fillDate: "Apr 12, 2026", collectDate: "Apr 10, 2026", confidence: "78%" },
    { id: "MED-002", fillDate: "Apr 14, 2026", collectDate: "Apr 12, 2026", confidence: "82%" },
    { id: "MED-003", fillDate: "Apr 16, 2026", collectDate: "Apr 14, 2026", confidence: "91%" },
    { id: "MED-004", fillDate: "Apr 18, 2026", collectDate: "Apr 16, 2026", confidence: "67%" },
    { id: "MED-005", fillDate: "Apr 20, 2026", collectDate: "Apr 18, 2026", confidence: "74%" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="db-root">

        {/* ── TOP BAR ── */}
        <div className="db-topbar">
          <div className="db-brand">MedWaste</div>
          <div className="db-nav-right">
            <div className="db-lang-toggle">
              <button className="active">EN</button>
              <button>RU</button>
            </div>
            <div className="db-user-pill">
              <div className="db-avatar">{username.charAt(0).toUpperCase()}</div>
              <span>{username}</span>
            </div>
            <button className="db-btn db-btn-danger" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="db-main">

          {/* Page header */}
          <div className="db-page-header">
            <h1>Monitoring Dashboard</h1>
            <p>Medical waste management with AI analytics</p>
          </div>

          {/* Toolbar */}
          <div className="db-toolbar">
            <div className="db-toolbar-left">
              <div className="db-status-badge">
                <span className="db-online-dot" />
                Online
              </div>
              <div className="db-autorefresh">
                 Auto-refresh
              </div>
              <div className="db-period-tabs">
                {["Day", "Week", "Month", "Year"].map((p) => (
                  <button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="db-btn db-btn-ghost"> Refresh</button>
              <button className="db-btn db-btn-green"> Notifications</button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="db-stats-grid">
            <StatCard title="Total Bins"       value="5"   delta="0.0%" deltaType="neu" subtitle="Active in system" />
            <StatCard title="Average Fullness" value="51%" delta="0.0%" deltaType="neu" subtitle="This month" />
            <StatCard
              title="Needs Attention" value="0" delta="3.1%" deltaType="up"
              subtitle="Threshold exceeded"
              forecast="0 overflows in next 24h"
            />
            <StatCard title="AI Efficiency"    value="92%" delta="5.2%" deltaType="up" subtitle="Prediction accuracy" />
          </div>

          {/* ── ANALYTICS + DONUT ── */}
          <div className="db-two-col">
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Analytics Metrics</span>
                <span className="db-card-link">Detailed analytics →</span>
              </div>
              <div className="db-analytics-grid">
                {[
                  { val: "12",  label: "Collections / month" },
                  { val: "87%", label: "Efficiency" },
                  { val: "4h",  label: "Avg. response time" },
                  { val: "15%", label: "Cost savings" },
                ].map((m) => (
                  <div className="db-analytics-item" key={m.label}>
                    <div className="db-analytics-val">{m.val}</div>
                    <div className="db-analytics-label">{m.label}</div>
                  </div>
                ))}
              </div>
              {/* Bar chart */}
              <div className="db-chart-area" style={{ marginTop: 16 }}>
                {barHeights.map((h, i) => (
                  <div key={i} className="db-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="db-chart-legend">
                <div className="db-legend-item">
                  <div className="db-legend-dot" style={{ background: "#1A6EFF" }} /> Avg. fullness
                </div>
                <div className="db-legend-item">
                  <div className="db-legend-dot" style={{ background: "#00D68F" }} /> Container count
                </div>
                <div className="db-legend-item">
                  <div className="db-legend-dot" style={{ background: "#8B5CF6" }} /> Total weight
                </div>
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Waste Types</span>
                <span className="db-card-link">Details →</span>
              </div>
              <div className="db-donut-wrap">
                <div className="db-donut">
                  <div className="db-donut-inner">
                    <div className="db-donut-pct">100%</div>
                    <div className="db-donut-sub">Sharp</div>
                  </div>
                </div>
                <div className="db-waste-types">
                  {[{ label: "Sharp Medical Waste", pct: 100, color: "#1A6EFF" }].map((w) => (
                    <div key={w.label}>
                      <div className="db-waste-row">
                        <div className="db-waste-label">
                          <div className="db-waste-dot" style={{ background: w.color }} />
                          <span style={{ fontSize: "0.78rem" }}>{w.label}</span>
                        </div>
                        <span className="db-waste-pct">{w.pct}%</span>
                      </div>
                      <div className="db-waste-bar-wrap">
                        <div className="db-waste-bar-fill" style={{ width: `${w.pct}%`, background: w.color }} />
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#5e6a85", marginTop: 4 }}>5 bins · 51% filled</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── AI PREDICTIONS ── */}
          <div className="db-card" style={{ marginBottom: 20 }}>
            <div className="db-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="db-card-title">AI Maintenance Predictions</span>
                <span className="db-badge db-badge-green">✓ Ready · 5 predictions</span>
              </div>
              <span className="db-card-link">View all predictions →</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#5e6a85", marginBottom: 14 }}>
              Found {predictions.length} predictions for optimization
            </div>
            <div className="db-predictions-grid">
              {predictions.map((p) => <PredCard key={p.id} {...p} />)}
            </div>
          </div>

          {/* ── NEEDS ATTENTION + SYSTEM METRICS ── */}
          <div className="db-three-col">
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Needs Attention</span>
                <span className="db-card-link">View all →</span>
              </div>
              <div className="db-attention-empty">
                <div className="db-attention-icon"></div>
                All bins are normal — no bins require attention soon
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">System Metrics</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { val: 5, label: "Active",            pct: 100, color: "#00D68F" },
                  { val: 0, label: "Under maintenance",  pct: 0,   color: "#F59E0B" },
                  { val: 0, label: "Offline",            pct: 0,   color: "#EF4444" },
                  { val: 0, label: "Decommissioned",     pct: 0,   color: "#8B5CF6" },
                ].map((m) => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.82rem", color: "#5e6a85" }}>{m.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 4, background: "#e4e9f0", borderRadius: 99 }}>
                        <div style={{ width: `${m.pct}%`, height: "100%", background: m.color, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a2035", minWidth: 24 }}>{m.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS + SETTINGS ── */}
          <div className="db-two-col">
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Quick Actions</span>
              </div>
              <div className="db-actions-grid">
                {[
                  { icon: "🗑️",  label: "Bins" },
                  { icon: "🗺️",  label: "Map" },
                  { icon: "📊",  label: "Analytics",    badge: "New" },
                  { icon: "🤖",  label: "AI Predictions", badge: "5" },
                  { icon: "📋",  label: "Reports" },
                  { icon: "⚙️",  label: "Settings" },
                  { icon: "📲",  label: "Telegram" },
                  { icon: "🚛",  label: "Collections" },
                ].map((a) => (
                  <div className="db-action-btn" key={a.label}>
                    {a.badge && <span className="db-action-new">{a.badge}</span>}
                    <span className="db-action-icon">{a.icon}</span>
                    <span className="db-action-label">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Dashboard Settings</span>
              </div>
              <div className="db-settings-list">
                {[
                  { key: "autoRefresh",   name: "Auto-refresh",    sub: "Every 5 min" },
                  { key: "aiPredictions", name: "AI Predictions",   sub: "Machine learning" },
                  { key: "analytics",     name: "Analytics",        sub: "Advanced metrics" },
                  { key: "compact",       name: "Compact view",     sub: "Save space" },
                ].map((s) => (
                  <div className="db-settings-row" key={s.key}>
                    <div className="db-settings-info">
                      <div className="db-settings-name">{s.name}</div>
                      <div className="db-settings-sub">{s.sub}</div>
                    </div>
                    <Toggle on={settings[s.key]} onToggle={() => toggleSetting(s.key)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* /db-main */}
      </div>
    </>
  );
}

export default Dashboard;