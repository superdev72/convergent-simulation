import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function POST() {
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

  if (game) {
    await supabase.from("game_history").delete().eq("game_id", game.id);
    await supabase.from("games").delete().eq("id", game.id);
  }

  return NextResponse.json({ ok: true });
}
