import React, { useState, useMemo } from "react";

const mockBins = [
  { id: "MED-004", status: "Active", fullness: 78, temperature: 22.0, weight: 12.0, date: "Nov 9, 2025",  type: "Sharp Medical Waste" },
  { id: "MED-001", status: "Active", fullness: 60, temperature: 21.5, weight: 8.0,  date: "Feb 4, 2026",  type: "Sharp Medical Waste" },
  { id: "MED-003", status: "Active", fullness: 45, temperature: 22.0, weight: 12.0, date: "Feb 22, 2026", type: "Sharp Medical Waste" },
  { id: "MED-005", status: "Active", fullness: 40, temperature: 21.5, weight: 10.0, date: "Jan 8, 2026",  type: "Sharp Medical Waste" },
  { id: "MED-002", status: "Active", fullness: 33, temperature: 21.5, weight: 6.0,  date: "Feb 22, 2026", type: "Sharp Medical Waste" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .ct-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
    color: #1a2035;
    padding: 32px;
  }

  /* PAGE HEADER */
  .ct-page-header { margin-bottom: 28px; }
  .ct-page-header h1 {
    font-size: 1.9rem; font-weight: 800;
    letter-spacing: -0.03em; color: #1a2035;
    margin-bottom: 4px;
  }
  .ct-page-header p { color: #5e6a85; font-size: 0.9rem; }

  /* TOOLBAR */
  .ct-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
  }
  .ct-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .ct-btn {
    padding: 8px 16px; border-radius: 8px; border: 1px solid #e4e9f0;
    background: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500; color: #1a2035;
    cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 6px;
  }
  .ct-btn:hover { background: #f0f4f8; }
  .ct-btn-primary { background: #1A6EFF; color: #fff; border-color: #1A6EFF; }
  .ct-btn-primary:hover { background: #0F4ECC; }

  .ct-sort-select {
    padding: 8px 12px; border-radius: 8px; border: 1px solid #e4e9f0;
    background: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; color: #1a2035; cursor: pointer;
    outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e6a85' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    padding-right: 30px;
  }

  .ct-count {
    font-size: 0.82rem; color: #5e6a85;
    background: #f0f4f8; padding: 6px 12px; border-radius: 8px;
  }

  /* GRID */
  .ct-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* BIN CARD */
  .ct-card {
    background: #fff; border-radius: 14px;
    border: 1px solid #e4e9f0;
    padding: 20px; position: relative; overflow: hidden;
    transition: transform .25s, box-shadow .25s;
  }
  .ct-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.09); }

  /* Accent bar on top */
  .ct-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }

  /* CARD HEADER */
  .ct-card-head {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 4px;
  }
  .ct-card-id {
    font-size: 1.05rem; font-weight: 800; color: #1a2035;
  }
  .ct-status-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.72rem; font-weight: 600; padding: 3px 9px;
    border-radius: 999px;
  }
  .ct-status-active   { background: #e6faf3; color: #00A870; }
  .ct-status-warning  { background: #fff7e6; color: #D97706; }
  .ct-status-critical { background: #fff0f1; color: #E53E3E; }

  .ct-card-sub {
    font-size: 0.75rem; color: #5e6a85; margin-bottom: 16px;
  }

  /* FULLNESS */
  .ct-fullness-header {
    display: flex; justify-content: space-between;
    font-size: 0.78rem; font-weight: 500; margin-bottom: 6px;
    color: #5e6a85;
  }
  .ct-fullness-val { font-weight: 700; }
  .ct-bar-track {
    height: 8px; background: #e8edf5; border-radius: 99px;
    overflow: hidden; margin-bottom: 18px;
  }
  .ct-bar-fill {
    height: 100%; border-radius: 99px;
    transition: width .6s cubic-bezier(.22,1,.36,1);
  }

  /* STATS ROW */
  .ct-stats-row {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 8px; margin-bottom: 16px;
  }
  .ct-stat {
    background: #f8fafc; border-radius: 8px; padding: 10px;
    text-align: center;
  }
  .ct-stat-icon { font-size: 0.9rem; margin-bottom: 2px; }
  .ct-stat-val {
    font-size: 0.9rem; font-weight: 700; color: #1a2035;
  }
  .ct-stat-label { font-size: 0.68rem; color: #5e6a85; margin-top: 1px; }

  /* FOOTER ROW */
  .ct-card-footer {
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid #f0f4f8; padding-top: 12px;
  }
  .ct-type-badge {
    font-size: 0.72rem; font-weight: 600;
    background: #eff5ff; color: #1A6EFF;
    padding: 3px 9px; border-radius: 999px;
  }
  .ct-date { font-size: 0.72rem; color: #5e6a85; }

  @media (max-width: 700px) {
    .ct-root { padding: 16px; }
    .ct-grid { grid-template-columns: 1fr; }
  }
`;

function getBarColor(fullness) {
  if (fullness >= 80) return "linear-gradient(90deg, #EF4444, #F87171)";
  if (fullness >= 60) return "linear-gradient(90deg, #F59E0B, #FCD34D)";
  return "linear-gradient(90deg, #1A6EFF, #00D68F)";
}

function getAccentColor(fullness) {
  if (fullness >= 80) return "linear-gradient(90deg, #EF4444, #F87171)";
  if (fullness >= 60) return "linear-gradient(90deg, #F59E0B, #FCD34D)";
  return "linear-gradient(90deg, #1A6EFF, #00D68F)";
}

function getStatusClass(fullness) {
  if (fullness >= 80) return "ct-status-critical";
  if (fullness >= 60) return "ct-status-warning";
  return "ct-status-active";
}

function getStatusLabel(fullness) {
  if (fullness >= 80) return "⚠ Critical";
  if (fullness >= 60) return "! Warning";
  return "● Active";
}

const SORT_OPTIONS = [
  { value: "fullness_desc",  label: "Fullness (↓)" },
  { value: "fullness_asc",   label: "Fullness (↑)" },
  { value: "date_desc",      label: "Last update (↓)" },
  { value: "date_asc",       label: "Last update (↑)" },
  { value: "id_asc",         label: "Bin ID (A-Z)" },
  { value: "id_desc",        label: "Bin ID (Z-A)" },
];

function Containers() {
  const [sortType, setSortType] = useState("fullness_desc");
  const [filterOpen, setFilterOpen] = useState(false);

  const sorted = useMemo(() => {
    const bins = [...mockBins];
    switch (sortType) {
      case "fullness_desc": return bins.sort((a, b) => b.fullness - a.fullness);
      case "fullness_asc":  return bins.sort((a, b) => a.fullness - b.fullness);
      case "id_asc":        return bins.sort((a, b) => a.id.localeCompare(b.id));
      case "id_desc":       return bins.sort((a, b) => b.id.localeCompare(a.id));
      default:              return bins;
    }
  }, [sortType]);

  return (
    <>
      <style>{css}</style>
      <div className="ct-root">

        {/* PAGE HEADER */}
        <div className="ct-page-header">
          <h1>Bins</h1>
          <p>Manage and monitor medical waste bins</p>
        </div>

        {/* TOOLBAR */}
        <div className="ct-toolbar">
          <div className="ct-toolbar-left">
            <button className="ct-btn" onClick={() => setFilterOpen(!filterOpen)}>
              Filters {filterOpen ? "↑" : "↓"}
            </button>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#5e6a85" }}>
              Sort:
              <select
                className="ct-sort-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            <span className="ct-count">Shown {sorted.length} of {mockBins.length}</span>
          </div>

          <button className="ct-btn ct-btn-primary" onClick={() => window.location.reload()}>
             Refresh
          </button>
        </div>

        {/* BIN CARDS */}
        <div className="ct-grid">
          {sorted.map((bin) => (
            <div key={bin.id} className="ct-card">

              {/* Accent top bar */}
              <div className="ct-card-accent" style={{ background: getAccentColor(bin.fullness) }} />

              {/* Header */}
              <div className="ct-card-head">
                <span className="ct-card-id">{bin.id}</span>
                <span className={`ct-status-badge ${getStatusClass(bin.fullness)}`}>
                  {getStatusLabel(bin.fullness)}
                </span>
              </div>
              <div className="ct-card-sub">Auto Registered</div>

              {/* Fullness bar */}
              <div className="ct-fullness-header">
                <span>Fullness</span>
                <span className="ct-fullness-val">{bin.fullness}%</span>
              </div>
              <div className="ct-bar-track">
                <div
                  className="ct-bar-fill"
                  style={{ width: `${bin.fullness}%`, background: getBarColor(bin.fullness) }}
                />
              </div>

              {/* Stats */}
              <div className="ct-stats-row">
                <div className="ct-stat">
                  <div className="ct-stat-icon"></div>
                  <div className="ct-stat-val">{bin.temperature}°C</div>
                  <div className="ct-stat-label">Temp.</div>
                </div>
                <div className="ct-stat">
                  <div className="ct-stat-icon"></div>
                  <div className="ct-stat-val">{bin.weight.toFixed(1)} kg</div>
                  <div className="ct-stat-label">Weight</div>
                </div>
                <div className="ct-stat">
                  <div className="ct-stat-icon"></div>
                  <div className="ct-stat-val" style={{ fontSize: "0.72rem" }}>Auto</div>
                  <div className="ct-stat-label">Location</div>
                </div>
              </div>

              {/* Footer */}
              <div className="ct-card-footer">
                <span className="ct-type-badge">{bin.type}</span>
                <span className="ct-date"> {bin.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default Containers;