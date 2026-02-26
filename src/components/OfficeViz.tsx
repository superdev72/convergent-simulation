"use client";

/** Office visualization: desks for engineers and sales. Empty desks visible. */
const TOTAL_DESKS = 20;
const ENGINEER_COLOR = "bg-blue-500";
const SALES_COLOR = "bg-amber-500";
const EMPTY_COLOR = "bg-slate-200";

export function OfficeViz({
  engineers,
  salesStaff,
}: {
  engineers: number;
  salesStaff: number;
}) {
  const totalFilled = engineers + salesStaff;
  const emptyCount = Math.max(0, TOTAL_DESKS - totalFilled);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Office</h2>
      <p className="mt-1 text-sm text-slate-500">
        {engineers} engineers, {salesStaff} sales
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: engineers }).map((_, i) => (
          <div
            key={`eng-${i}`}
            className={`h-10 w-10 rounded-lg ${ENGINEER_COLOR}`}
            title="Engineer"
          />
        ))}
        {Array.from({ length: salesStaff }).map((_, i) => (
          <div
            key={`sales-${i}`}
            className={`h-10 w-10 rounded-lg ${SALES_COLOR}`}
            title="Sales"
          />
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`h-10 w-10 rounded-lg border-2 border-dashed border-slate-300 ${EMPTY_COLOR}`}
            title="Empty desk"
          />
        ))}
      </div>

      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded ${ENGINEER_COLOR}`} />
          <span className="text-slate-600">Engineering</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded ${SALES_COLOR}`} />
          <span className="text-slate-600">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded border border-slate-300 ${EMPTY_COLOR}`} />
          <span className="text-slate-600">Empty</span>
        </div>
      </div>
    </div>
  );
}
