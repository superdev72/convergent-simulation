"use client";

import type { QuarterHistory } from "@/app/GameClient";

interface DashboardProps {
  cash: number;
  engineers: number;
  salesStaff: number;
  productQuality: number;
  year: number;
  quarter: number;
  history: QuarterHistory[];
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function Dashboard({
  cash,
  engineers,
  salesStaff,
  productQuality,
  year,
  quarter,
  history,
}: DashboardProps) {
  const lastQuarter = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">
        Year {year}, Quarter {quarter}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Cash
          </p>
          <p className="mt-1 text-lg font-semibold text-emerald-800">
            {formatCurrency(cash)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Engineers
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-800">{engineers}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Sales Staff
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {salesStaff}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Product Quality
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {Math.round(productQuality)}
          </p>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">
            Quarter
          </p>
          <p className="mt-1 text-lg font-semibold text-indigo-800">
            Y{year} Q{quarter}
          </p>
        </div>
        {lastQuarter && (
          <>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Last Q Revenue
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {formatCurrency(lastQuarter.revenue)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Last Q Net Income
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  lastQuarter.net_income >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {formatCurrency(lastQuarter.net_income)}
              </p>
            </div>
          </>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-700">
            Last 4 Quarters History
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-2 pr-4 font-medium text-slate-600">Quarter</th>
                  <th className="py-2 pr-4 font-medium text-slate-600">Cash</th>
                  <th className="py-2 pr-4 font-medium text-slate-600">
                    Revenue
                  </th>
                  <th className="py-2 pr-4 font-medium text-slate-600">
                    Net Income
                  </th>
                  <th className="py-2 font-medium text-slate-600">Headcount</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => {
                  const y = Math.floor(h.quarter / 4) + 1;
                  const q = (h.quarter % 4) + 1;
                  return (
                    <tr
                      key={h.quarter}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-2 pr-4 text-slate-800">Y{y} Q{q}</td>
                      <td className="py-2 pr-4 text-slate-800">
                        {formatCurrency(h.cash)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {formatCurrency(h.revenue)}
                      </td>
                      <td
                        className={`py-2 pr-4 font-medium ${
                          h.net_income >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(h.net_income)}
                      </td>
                      <td className="py-2 text-slate-800">
                        {h.engineers} eng, {h.sales_staff} sales
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
