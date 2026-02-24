import { useState } from "react";
import { generateReport } from "../services/api";

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleGenerate = async () => {
    await generateReport({ from, to });
    alert("Report generated");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white p-4 rounded shadow flex gap-2">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate
        </button>
      </div>
    </div>
  );
}