import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game");

    if (!game) {
      return NextResponse.json({ takenSpots: [] });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("spot")
      .eq("game", game);

    if (error) {
      console.error("Availability query error:", error.message);
      return NextResponse.json({ takenSpots: [] });
    }

    const takenSpots = data.map((row) => row.spot).filter(Boolean);
    return NextResponse.json({ takenSpots });
  } catch (err) {
    console.error("Availability route error:", err);
    return NextResponse.json({ takenSpots: [] });
  }
}
