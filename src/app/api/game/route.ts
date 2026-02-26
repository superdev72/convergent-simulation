import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import {
  getInitialState,
  type SimulationState,
} from "@/lib/simulation";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (game) {
    const state: SimulationState = {
      quarter: game.quarter,
      cash: Number(game.cash),
      engineers: game.engineers,
      sales_staff: game.sales_staff,
      product_quality: Number(game.product_quality),
      status: game.status,
      cumulative_profit: Number(game.cumulative_profit),
    };
    return NextResponse.json({ state });
  }

  // No game yet — return initial state (client will call advance to create)
  const initialState = getInitialState();
  return NextResponse.json({ state: initialState });
}
