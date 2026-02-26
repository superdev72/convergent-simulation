/**
 * Simulation model — as specified in the assignment.
 * All calculations run server-side; clients must not compute outcomes.
 */

const INITIAL_CASH = 1_000_000;
const INITIAL_ENGINEERS = 4;
const INITIAL_SALES_STAFF = 2;
const INITIAL_QUALITY = 50;
const INDUSTRY_AVG_SALARY = 30_000; // per quarter
const HIRE_COST_PER_PERSON = 5_000;
const TOTAL_QUARTERS = 40; // 10 years

export interface SimulationState {
  quarter: number;
  cash: number;
  engineers: number;
  sales_staff: number;
  product_quality: number;
  status: "playing" | "won" | "lost";
  cumulative_profit: number;
}

export interface SimulationDecision {
  unit_price: number;
  new_engineers: number;
  new_sales_staff: number;
  salary_pct: number;
}

export interface QuarterOutcome {
  quarter: number;
  cash: number;
  revenue: number;
  net_income: number;
  engineers: number;
  sales_staff: number;
}

export function getInitialState(): SimulationState {
  return {
    quarter: 0,
    cash: INITIAL_CASH,
    engineers: INITIAL_ENGINEERS,
    sales_staff: INITIAL_SALES_STAFF,
    product_quality: INITIAL_QUALITY,
    status: "playing",
    cumulative_profit: 0,
  };
}

export function advanceQuarter(
  state: SimulationState,
  decision: SimulationDecision
): { nextState: SimulationState; outcome: QuarterOutcome } {
  const {
    unit_price,
    new_engineers,
    new_sales_staff,
    salary_pct,
  } = decision;

  // Validate and clamp decision
  const safeSalaryPct = Math.max(0, Math.min(200, salary_pct));
  const safeNewEngineers = Math.max(0, Math.floor(new_engineers));
  const safeNewSales = Math.max(0, Math.floor(new_sales_staff));

  // New hire cost (one-time)
  const newHireCost = (safeNewEngineers + safeNewSales) * HIRE_COST_PER_PERSON;
  let cash = state.cash - newHireCost;

  const engineers = state.engineers + safeNewEngineers;
  const sales_staff = state.sales_staff + safeNewSales;

  // Product quality: += engineers * 0.5 (cap: 100)
  let product_quality = state.product_quality + engineers * 0.5;
  product_quality = Math.min(100, product_quality);

  // Salary cost per person = salary_pct/100 * 30,000
  const salaryPerPerson = (safeSalaryPct / 100) * INDUSTRY_AVG_SALARY;
  const totalPayroll = salaryPerPerson * (engineers + sales_staff);

  // Market demand = quality * 10 - price * 0.0001 (floor: 0)
  const demand = Math.max(0, product_quality * 10 - unit_price * 0.0001);

  // Units sold = demand * sales_staff * 0.5 (integer)
  const units = Math.floor(demand * sales_staff * 0.5);

  // Revenue = price * units
  const revenue = unit_price * units;

  // Net income = revenue - total_payroll
  const net_income = revenue - totalPayroll;

  // Cash end of quarter = cash + net_income
  cash += net_income;

  const nextQuarter = state.quarter + 1;
  const cumulative_profit = state.cumulative_profit + net_income;

  let status: "playing" | "won" | "lost" = "playing";
  if (cash <= 0) {
    status = "lost";
  } else if (nextQuarter >= TOTAL_QUARTERS) {
    status = "won";
  }

  const nextState: SimulationState = {
    quarter: nextQuarter,
    cash,
    engineers,
    sales_staff,
    product_quality,
    status,
    cumulative_profit,
  };

  const outcome: QuarterOutcome = {
    quarter: nextQuarter,
    cash,
    revenue,
    net_income,
    engineers,
    sales_staff,
  };

  return { nextState, outcome };
}
