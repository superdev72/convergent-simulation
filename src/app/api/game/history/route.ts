import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!game) {
    return NextResponse.json({ history: [] });
  }

  const { data: rows } = await supabase
    .from("game_history")
    .select("quarter, cash, revenue, net_income, engineers, sales_staff")
    .eq("game_id", game.id)
    .order("quarter", { ascending: false })
    .limit(4);

  const history = (rows ?? []).reverse().map((r) => ({
    quarter: r.quarter,
    cash: Number(r.cash),
    revenue: Number(r.revenue),
    net_income: Number(r.net_income),
    engineers: r.engineers,
    sales_staff: r.sales_staff,
  }));

  return NextResponse.json({ history });
}
