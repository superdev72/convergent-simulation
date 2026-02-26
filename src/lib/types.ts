/** Simulation state and decision types */

export interface GameState {
  id: string;
  user_id: string;
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

export interface AdvanceDecision {
  unit_price: number;
  new_engineers: number;
  new_sales_staff: number;
  salary_pct: number;
}

export interface AdvanceResult {
  state: GameState;
  history: QuarterHistory[];
}
