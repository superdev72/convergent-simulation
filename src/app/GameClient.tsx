"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DecisionPanel } from "@/components/DecisionPanel";
import { Dashboard } from "@/components/Dashboard";
import { OfficeViz } from "@/components/OfficeViz";
import { WinLoseOverlay } from "@/components/WinLoseOverlay";

export interface GameState {
  id: string | null;
  quarter: number;
  cash: number;
  engineers: number;
  sales_staff: number;
  product_quality: number;
  status: "playing" | "won" | "lost";
  cumulative_profit: number;
}

export interface QuarterHistory {
  quarter: number;
  cash: number;
  revenue: number;
  net_income: number;
  engineers: number;
  sales_staff: number;
}

interface GameClientProps {
  initialState: GameState;
  initialHistory: QuarterHistory[];
}

export function GameClient({ initialState, initialHistory }: GameClientProps) {
  const [state, setState] = useState<GameState>(initialState);
  const [history, setHistory] = useState<QuarterHistory[]>(initialHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdvance = useCallback(
    async (decision: {
      unit_price: number;
      new_engineers: number;
      new_sales_staff: number;
      salary_pct: number;
    }) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/advance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(decision),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to advance");
          return;
        }
        setState(data.state);
        setHistory(data.history ?? []);
        router.refresh();
      } catch (e) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const handleReset = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/reset-game", { method: "POST" });
      setState({
        id: null,
        quarter: 0,
        cash: 1_000_000,
        engineers: 4,
        sales_staff: 2,
        product_quality: 50,
        status: "playing",
        cumulative_profit: 0,
      });
      setHistory([]);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }, [router]);

  const year = Math.floor(state.quarter / 4) + 1;
  const quarter = (state.quarter % 4) + 1;

  return (
    <div className="space-y-6">
      {state.status !== "playing" && (
        <WinLoseOverlay
          status={state.status}
          cumulativeProfit={state.cumulative_profit}
          onReset={handleReset}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Dashboard
            cash={state.cash}
            engineers={state.engineers}
            salesStaff={state.sales_staff}
            productQuality={state.product_quality}
            year={year}
            quarter={quarter}
            history={history}
          />
          <OfficeViz engineers={state.engineers} salesStaff={state.sales_staff} />
        </div>
        <div>
          <DecisionPanel
            onAdvance={handleAdvance}
            loading={loading}
            disabled={state.status !== "playing"}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
