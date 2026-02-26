"use client";

import { useState } from "react";

interface DecisionPanelProps {
  onAdvance: (decision: {
    unit_price: number;
    new_engineers: number;
    new_sales_staff: number;
    salary_pct: number;
  }) => void;
  loading: boolean;
  disabled: boolean;
  error: string | null;
}

export function DecisionPanel({
  onAdvance,
  loading,
  disabled,
  error,
}: DecisionPanelProps) {
  const [unitPrice, setUnitPrice] = useState(100);
  const [newEngineers, setNewEngineers] = useState(0);
  const [newSalesStaff, setNewSalesStaff] = useState(0);
  const [salaryPct, setSalaryPct] = useState(100);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdvance({
      unit_price: unitPrice,
      new_engineers: newEngineers,
      new_sales_staff: newSalesStaff,
      salary_pct: salaryPct,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Quarterly Decisions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Set your strategy and advance to the next quarter.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Unit Price ($)
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            New Engineers to Hire
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={newEngineers}
            onChange={(e) => setNewEngineers(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            New Sales Staff to Hire
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={newSalesStaff}
            onChange={(e) => setNewSalesStaff(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Salary (% of industry avg, default 100)
          </label>
          <input
            type="number"
            min={0}
            max={200}
            step={5}
            value={salaryPct}
            onChange={(e) => setSalaryPct(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Advancing…" : "Advance Turn"}
        </button>
      </form>
    </div>
  );
}
