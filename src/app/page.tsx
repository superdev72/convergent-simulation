import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { GameClient } from "./GameClient";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)
    .single();

  let state = null;
  let history: {
    quarter: number;
    cash: number;
    revenue: number;
    net_income: number;
    engineers: number;
    sales_staff: number;
  }[] = [];

  if (game) {
    state = {
      id: game.id,
      quarter: game.quarter,
      cash: Number(game.cash),
      engineers: game.engineers,
      sales_staff: game.sales_staff,
      product_quality: Number(game.product_quality),
      status: game.status,
      cumulative_profit: Number(game.cumulative_profit),
    };

    const { data: historyRows } = await supabase
      .from("game_history")
      .select("quarter, cash, revenue, net_income, engineers, sales_staff")
      .eq("game_id", game.id)
      .order("quarter", { ascending: false })
      .limit(4);

    history = (historyRows ?? [])
      .reverse()
      .map((r) => ({
        quarter: r.quarter,
        cash: Number(r.cash),
        revenue: Number(r.revenue),
        net_income: Number(r.net_income),
        engineers: r.engineers,
        sales_staff: r.sales_staff,
      }));
  } else {
    state = {
      id: null,
      quarter: 0,
      cash: 1_000_000,
      engineers: 4,
      sales_staff: 2,
      product_quality: 50,
      status: "playing",
      cumulative_profit: 0,
    };
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-800">
            Startup Simulation
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <GameClient initialState={state} initialHistory={history} />
      </main>
    </div>
  );
}
