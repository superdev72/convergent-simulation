import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import {
  getInitialState,
  advanceQuarter,
  type SimulationState,
  type SimulationDecision,
} from "@/lib/simulation";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    unit_price?: number;
    new_engineers?: number;
    new_sales_staff?: number;
    salary_pct?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const decision: SimulationDecision = {
    unit_price: Number(body.unit_price) || 0,
    new_engineers: Number(body.new_engineers) || 0,
    new_sales_staff: Number(body.new_sales_staff) || 0,
    salary_pct: Number(body.salary_pct) ?? 100,
  };

  let currentState: SimulationState;
  let gameId: string;

  const { data: existingGame } = await supabase
    .from("games")
    .select("id, quarter, cash, engineers, sales_staff, product_quality, status, cumulative_profit")
    .eq("user_id", user.id)
    .single();

  if (existingGame) {
    if (existingGame.status !== "playing") {
      return NextResponse.json(
        { error: "Game already ended", status: existingGame.status },
        { status: 400 }
      );
    }
    currentState = {
      quarter: existingGame.quarter,
      cash: Number(existingGame.cash),
      engineers: existingGame.engineers,
      sales_staff: existingGame.sales_staff,
      product_quality: Number(existingGame.product_quality),
      status: existingGame.status,
      cumulative_profit: Number(existingGame.cumulative_profit),
    };
    gameId = existingGame.id;
  } else {
    currentState = getInitialState();
    const { data: newGame, error: insertErr } = await supabase
      .from("games")
      .insert({
        user_id: user.id,
        quarter: currentState.quarter,
        cash: currentState.cash,
        engineers: currentState.engineers,
        sales_staff: currentState.sales_staff,
        product_quality: currentState.product_quality,
        status: currentState.status,
        cumulative_profit: currentState.cumulative_profit,
      })
      .select("id")
      .single();

    if (insertErr || !newGame) {
      return NextResponse.json(
        { error: insertErr?.message ?? "Failed to create game" },
        { status: 500 }
      );
    }
    gameId = newGame.id;
  }

  const { nextState, outcome } = advanceQuarter(currentState, decision);

  const { error: updateErr } = await supabase
    .from("games")
    .update({
      quarter: nextState.quarter,
      cash: nextState.cash,
      engineers: nextState.engineers,
      sales_staff: nextState.sales_staff,
      product_quality: nextState.product_quality,
      status: nextState.status,
      cumulative_profit: nextState.cumulative_profit,
      updated_at: new Date().toISOString(),
    })
    .eq("id", gameId);

  if (updateErr) {
    return NextResponse.json(
      { error: updateErr.message },
      { status: 500 }
    );
  }

  await supabase.from("game_history").upsert(
    {
      game_id: gameId,
      quarter: outcome.quarter,
      cash: outcome.cash,
      revenue: outcome.revenue,
      net_income: outcome.net_income,
      engineers: outcome.engineers,
      sales_staff: outcome.sales_staff,
    },
    { onConflict: "game_id,quarter" }
  );

  const { data: historyRows } = await supabase
    .from("game_history")
    .select("quarter, cash, revenue, net_income, engineers, sales_staff")
    .eq("game_id", gameId)
    .order("quarter", { ascending: false })
    .limit(4);

  const history = (historyRows ?? [])
    .reverse()
    .map((r) => ({
      quarter: r.quarter,
      cash: Number(r.cash),
      revenue: Number(r.revenue),
      net_income: Number(r.net_income),
      engineers: r.engineers,
      sales_staff: r.sales_staff,
    }));

  return NextResponse.json({
    state: {
      id: gameId,
      quarter: nextState.quarter,
      cash: nextState.cash,
      engineers: nextState.engineers,
      sales_staff: nextState.sales_staff,
      product_quality: nextState.product_quality,
      status: nextState.status,
      cumulative_profit: nextState.cumulative_profit,
    },
    history,
  });
}
