import React, { useEffect, useState } from "react";
import { getReports } from "../services/api";

const initialDepartments = [
  {
    name: "Auto Registered",
    bins: 5,
    avgFullness: 51,
    totalWeight: 0.0,
    needsAttention: 1,
  },
];

const initialBarData = [
  { label: "Auto Registered", fullness: 51, count: 5, weight: 0 },
];

const css = `
  

  .rp-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'Geist', 'DM Sans', sans-serif;
    color: #1a2035;
    padding: 32px;
  }

  /* HEADER */
  .rp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
  .rp-header h1 { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }
  .rp-header p  { color: #5e6a85; font-size: 0.9rem; }
  .rp-header-btns { display: flex; gap: 10px; flex-wrap: wrap; }

  .rp-btn {
    padding: 8px 16px; border-radius: 8px; border: 1px solid #e4e9f0;
    background: #fff; font-size: 0.85rem; font-weight: 500; color: #1a2035;
    cursor: pointer; transition: all .2s; font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .rp-btn:hover { background: #f0f4f8; }
  .rp-btn-green { background: #00D68F; color: #0B1A14; border-color: #00D68F; }
  .rp-btn-green:hover { background: #00A870; }
  .rp-btn-blue  { background: #1A6EFF; color: #fff; border-color: #1A6EFF; }
  .rp-btn-blue:hover { background: #0F4ECC; }

  /* CARD */
  .rp-card {
    background: #fff; border-radius: 14px;
    border: 1px solid #e4e9f0; padding: 22px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .rp-card-title {
    font-size: 1rem; font-weight: 700; margin-bottom: 18px; color: #1a2035;
  }

  /* PARAMS */
  .rp-params-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .rp-field label { font-size: 0.78rem; font-weight: 500; color: #5e6a85; display: block; margin-bottom: 6px; }
  .rp-field input,
  .rp-field select {
    width: 100%; padding: 9px 12px; border: 1px solid #e4e9f0; border-radius: 8px;
    font-family: inherit; font-size: 0.88rem; color: #1a2035; background: #f8fafc;
    outline: none; transition: border-color .2s;
  }
  .rp-field input:focus,
  .rp-field select:focus { border-color: #1A6EFF; background: #fff; }

  /* KPI GRID */
  .rp-kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 16px; }
  .rp-kpi-card {
    background: #fff; border-radius: 14px; border: 1px solid #e4e9f0;
    padding: 20px; position: relative; overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,.04); transition: transform .2s;
  }
  .rp-kpi-card:hover { transform: translateY(-3px); }
  .rp-kpi-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #1A6EFF, #00D68F);
  }
  .rp-kpi-label { font-size: 0.78rem; font-weight: 600; color: #5e6a85; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
  .rp-kpi-val   { font-size: 2rem; font-weight: 800; color: #1a2035; line-height: 1; margin-bottom: 6px; }
  .rp-kpi-sub   { font-size: 0.72rem; color: #a0aec0; }

  /* BAR CHART */
  .rp-chart-wrap { margin-top: 8px; }
  .rp-chart-row  { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .rp-chart-dept { font-size: 0.8rem; font-weight: 500; color: #5e6a85; width: 120px; flex-shrink: 0; text-align: right; }
  .rp-chart-bars { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .rp-chart-track { height: 7px; background: #e8edf5; border-radius: 99px; overflow: hidden; }
  .rp-chart-fill  { height: 100%; border-radius: 99px; transition: width .6s; }
  .rp-chart-pct   { font-size: 0.78rem; font-weight: 700; color: #1a2035; width: 36px; flex-shrink: 0; }
  .rp-chart-legend { display: flex; gap: 16px; margin-top: 14px; }
  .rp-legend-item  { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: #5e6a85; }
  .rp-legend-dot   { width: 8px; height: 8px; border-radius: 50%; }

  /* Y AXIS LABELS */
  .rp-chart-yaxis { display: flex; justify-content: space-between; font-size: 0.68rem; color: #a0aec0; margin-bottom: 4px; padding-left: 130px; padding-right: 46px; }

  /* DONUT */
  .rp-donut-wrap { display: flex; align-items: center; gap: 32px; }
  .rp-donut {
    width: 120px; height: 120px; border-radius: 50%; flex-shrink: 0;
    background: conic-gradient(#1A6EFF 0deg 360deg, #e4e9f0 360deg);
    display: flex; align-items: center; justify-content: center;
  }
  .rp-donut-inner {
    width: 80px; height: 80px; border-radius: 50%; background: #fff;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .rp-donut-pct { font-size: 1.1rem; font-weight: 800; color: #1a2035; }
  .rp-donut-sub { font-size: 0.6rem; color: #5e6a85; }
  .rp-waste-list { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .rp-waste-row  { display: flex; align-items: center; gap: 10px; }
  .rp-waste-dot  { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .rp-waste-name { font-size: 0.85rem; font-weight: 500; flex: 1; }
  .rp-waste-bar-track { width: 100px; height: 5px; background: #e8edf5; border-radius: 99px; overflow: hidden; }
  .rp-waste-bar-fill  { height: 100%; border-radius: 99px; }
  .rp-waste-pct  { font-size: 0.8rem; font-weight: 700; color: #1a2035; min-width: 36px; text-align: right; }

  /* TABLE */
  .rp-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .rp-table thead tr { border-bottom: 2px solid #f0f4f8; }
  .rp-table th { padding: 10px 14px; text-align: left; font-size: 0.72rem; font-weight: 700; color: #5e6a85; text-transform: uppercase; letter-spacing: .06em; }
  .rp-table tbody tr { border-bottom: 1px solid #f0f4f8; transition: background .15s; }
  .rp-table tbody tr:hover { background: #f8fbff; }
  .rp-table td { padding: 12px 14px; color: #1a2035; vertical-align: middle; }
  .rp-fullness-cell { display: flex; align-items: center; gap: 8px; }
  .rp-fullness-mini { width: 60px; height: 5px; background: #e8edf5; border-radius: 99px; overflow: hidden; }
  .rp-fullness-mini-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #1A6EFF, #00D68F); }
  .rp-attention-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 999px; font-size: 0.72rem; font-weight: 600;
  }
  .rp-badge-warn { background: #fff7e6; color: #D97706; }
  .rp-badge-ok   { background: #e6faf3; color: #00A870; }

  @media (max-width: 900px) {
    .rp-kpi-grid, .rp-params-grid { grid-template-columns: repeat(2,1fr); }
  }
`;

function Reports() {
  const [reportType, setReportType]   = useState("overview");
  const [aggregation, setAggregation] = useState("month");
  const [period, setPeriod]           = useState("");
  const [overview, setOverview]       = useState({
    totalContainers: 5,
    avgFullness: 51,
    needAttention: 0,
    totalWeight: 0.0,
  });
  const [departments, setDepartments] = useState(initialDepartments);
  const [barData, setBarData]         = useState(initialBarData);
  const [loading, setLoading]         = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await getReports({ type: reportType, aggregation, period });
      const data = res.data;
      setOverview(data.overview || overview);
      setDepartments(data.departments || initialDepartments);
      setBarData(data.wasteTypes?.map((item) => ({
        label: item.name,
        fullness: item.pct,
        count: Math.round((item.pct / 100) * (data.overview?.totalContainers || 1)),
        weight: 0,
      })) || initialBarData);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Функция печати
const handlePrint = () => {
  window.print();
};

// 2. Функция экспорта в CSV (простой вариант "Save")
const handleExport = () => {
  const csvRows = [];
  const headers = ["Department", "Containers", "Avg Fullness", "Weight", "Attention"];
  csvRows.push(headers.join(','));

  departments.forEach(d => {
    csvRows.push([d.name, d.bins, d.avgFullness, d.totalWeight, d.needsAttention].join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `report_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="rp-root">

        {/* HEADER */}
        <div className="rp-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Data analysis and statistics for the waste management system</p>
          </div>
          <div className="rp-header-btns">
            <button className="rp-btn" onClick={handlePrint}>Print</button>
            <button className="rp-btn" onClick={handleExport}> Export (CSV)</button>
            <button className="rp-btn rp-btn-blue"  onClick={() => saveOfficialReport(overview, departments)}>  Download Form-IV (.html)</button>
          </div>
        </div>

        {/* REPORT PARAMETERS */}
        <div className="rp-card">
          <div className="rp-card-title">Report Parameters</div>
          <div className="rp-params-grid">
            <div className="rp-field">
              <label>Period</label>
              <input type="text" placeholder="e.g. Feb 2026" value={period} onChange={e => setPeriod(e.target.value)} />
            </div>
            <div className="rp-field">
              <label>Report type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)}>
                <option value="overview">General overview</option>
                <option value="dept">By department</option>
                <option value="type">By waste type</option>
                <option value="alerts">Alerts</option>
              </select>
            </div>
            <div className="rp-field">
              <label>Time aggregation</label>
              <select value={aggregation} onChange={e => setAggregation(e.target.value)}>
                <option value="day">By day</option>
                <option value="week">By week</option>
                <option value="month">By month</option>
              </select>
            </div>
            <div className="rp-field" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button className="rp-btn rp-btn-blue" style={{ width: "100%", justifyContent: "center" }} onClick={loadReports}>
                 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="rp-kpi-grid">
          {[
            { label: "Total Containers", val: overview.totalContainers, sub: "Active in the system" },
            { label: "Average Fullness", val: `${overview.avgFullness}%`, sub: "Average fill level" },
            { label: "Need Attention",   val: overview.needAttention, sub: "Containers requiring action" },
            { label: "Total Weight",     val: `${overview.totalWeight.toFixed(1)} kg`, sub: "Total waste weight" },
          ].map((k) => (
            <div className="rp-kpi-card" key={k.label}>
              <div className="rp-kpi-label">{k.label}</div>
              <div className="rp-kpi-val">{k.val}</div>
              <div className="rp-kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* FULLNESS BY DEPARTMENT */}
        <div className="rp-card">
          <div className="rp-card-title">Fullness by Department</div>
          <div className="rp-chart-yaxis">
            {[0, 20, 40, 60, 80, 100].map(v => <span key={v}>{v}</span>)}
          </div>
          <div className="rp-chart-wrap">
            {barData.map((d) => (
              <div className="rp-chart-row" key={d.label}>
                <div className="rp-chart-dept">{d.label}</div>
                <div className="rp-chart-bars">
                  <div className="rp-chart-track">
                    <div className="rp-chart-fill" style={{ width: `${d.fullness}%`, background: "linear-gradient(90deg,#1A6EFF,#00D68F)" }} />
                  </div>
                  <div className="rp-chart-track">
                    <div className="rp-chart-fill" style={{ width: `${(d.count / Math.max(overview.totalContainers, 1)) * 100}%`, background: "#8B5CF6" }} />
                  </div>
                  <div className="rp-chart-track">
                    <div className="rp-chart-fill" style={{ width: `${d.weight}%`, background: "#F59E0B" }} />
                  </div>
                </div>
                <div className="rp-chart-pct">{d.fullness}%</div>
              </div>
            ))}
          </div>
          <div className="rp-chart-legend">
            <div className="rp-legend-item"><div className="rp-legend-dot" style={{ background: "#1A6EFF" }} /> Avg. fullness</div>
            <div className="rp-legend-item"><div className="rp-legend-dot" style={{ background: "#8B5CF6" }} /> Container count</div>
            <div className="rp-legend-item"><div className="rp-legend-dot" style={{ background: "#F59E0B" }} /> Total weight</div>
          </div>
        </div>

        {/* WASTE TYPE DISTRIBUTION */}
        <div className="rp-card">
          <div className="rp-card-title">Waste Type Distribution</div>
          <div className="rp-donut-wrap">
            <div className="rp-donut">
              <div className="rp-donut-inner">
                <div className="rp-donut-pct">100%</div>
                <div className="rp-donut-sub">Sharp</div>
              </div>
            </div>
            <div className="rp-waste-list">
              {[{ name: "Sharp Medical Waste", pct: 100, color: "#1A6EFF" }].map((w) => (
                <div className="rp-waste-row" key={w.name}>
                  <div className="rp-waste-dot" style={{ background: w.color }} />
                  <span className="rp-waste-name">{w.name} ({w.pct}%)</span>
                  <div className="rp-waste-bar-track">
                    <div className="rp-waste-bar-fill" style={{ width: `${w.pct}%`, background: w.color }} />
                  </div>
                  <span className="rp-waste-pct">{w.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="rp-card">
          <div className="rp-card-title">Department Statistics</div>
          <table className="rp-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Containers</th>
                <th>Avg. Fullness</th>
                <th>Total Weight (kg)</th>
                <th>Need Attention</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dep) => (
                <tr key={dep.name}>
                  <td style={{ fontWeight: 600 }}>{dep.name}</td>
                  <td>{dep.bins}</td>
                  <td>
                    <div className="rp-fullness-cell">
                      <div className="rp-fullness-mini">
                        <div className="rp-fullness-mini-fill" style={{ width: `${dep.avgFullness}%` }} />
                      </div>
                      {dep.avgFullness}%
                    </div>
                  </td>
                  <td>{dep.totalWeight.toFixed(1)}</td>
                  <td>
                    <span className={`rp-attention-badge ${dep.needsAttention > 0 ? "rp-badge-warn" : "rp-badge-ok"}`}>
                      {dep.needsAttention > 0 ? `⚠ ${dep.needsAttention}` : "✓ All clear"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

const saveOfficialReport = (overview, departments) => {
  const now = new Date();
  const fileName = `Report_Form_IV_${now.toISOString().split('T')[0]}.html`;

  // Формируем содержимое HTML-файла
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Form IV - ${now.getFullYear()}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.5; padding: 40px; color: #000; }
        .tbl { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .tbl th, .tbl td { border: 1px solid #000; padding: 8px; font-size: 13px; text-align: left; }
        .header { text-align: center; font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 20px; }
        .footer { margin-top: 50px; display: flex; justify-content: space-between; }
        @media print { .no-save { display: none; } }
      </style>
    </head>
    <body>
      <div style="text-align:right">No.IMG/MED/${now.getFullYear()}/${Math.floor(Math.random()*10000)}</div>
      <div class="header">Form - IV <br> (See rule 13) <br> ANNUAL REPORT</div>
      
      <table class="tbl">
        <thead>
          <tr><th>SI No.</th><th>Particulars</th><th>Details</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td><b>Authorised Person</b></td><td>Dilara Galimkyzy</td></tr>
          <tr><td>2</td><td><b>Facility Name</b></td><td>MedVault KTM.0810</td></tr>
          <tr><td>3</td><td><b>Address & GPS</b></td><td>Astana, Kazakhstan (9.6814, 76.6439)</td></tr>
          <tr><td>4</td><td><b>Logistics & Collection Log</b></td>
            <td>
              <table class="tbl" style="margin:0; width: 100%;">
                <tr><th>Department</th><th>Driver</th><th>Vehicle</th><th>Fullness</th></tr>
                ${departments.map(d => `
                  <tr>
                    <td>${d.name}</td>
                    <td>${d.driver}</td>
                    <td>${d.plate}</td>
                    <td>${d.avgFullness}%</td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          <tr><td>5</td><td><b>Summary Statistics</b></td><td>Total Bins: ${overview.totalContainers} | Avg. Level: ${overview.avgFullness}% | Total Weight: ${overview.totalWeight.toFixed(1)} kg</td></tr>
        </tbody>
      </table>
      
      <div class="footer">
        <div>Date of issue: ${now.toLocaleDateString()}</div>
        <div style="text-align: center;">
          <br>__________________________<br>
          Authorized Signature
        </div>
      </div>
    </body>
    </html>
  `;

  // Создаем Blob и скачиваем его
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href); // Очищаем память
};

export default Reports;