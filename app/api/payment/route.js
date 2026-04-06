import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { token, booking } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing payment token" }, { status: 400 });
    }

    const response = await fetch("https://connect.squareup.com/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        "Square-Version": "2024-02-22",
      },
      body: JSON.stringify({
        source_id: token,
        idempotency_key: crypto.randomUUID(),
        amount_money: {
          amount: 100000, // $1,000.00 in cents
          currency: "USD",
        },
        location_id: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
        buyer_email_address: booking?.email || undefined,
        note: `SlapCart – LSU vs ${booking?.game || "TBD"} – ${booking?.spot || ""}`,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error("Square payment error:", data.errors);
      const msg = data.errors?.[0]?.detail || "Payment failed. Please try again.";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const paymentId = data.payment.id;

    // Save booking to Supabase (non-blocking — don't fail payment if DB write fails)
    supabase.from("bookings").insert({
      game: `LSU vs. ${booking?.game || "TBD"}`,
      opponent: booking?.game || "TBD",
      drop_off_time: booking?.dropoffTime || null,
      zone: booking?.spot?.charAt(0) || null,
      spot: booking?.spot || null,
      first_name: booking?.firstName || null,
      last_name: booking?.lastName || null,
      email: booking?.email || null,
      phone: booking?.phone || null,
      payment_id: paymentId,
    }).then(({ error }) => {
      if (error) console.error("Supabase insert error:", error.message);
    });

    // Fire confirmation email (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, paymentId }),
    }).catch((e) => console.error("Email send error:", e));

    return NextResponse.json({ success: true, paymentId });
  } catch (err) {
    console.error("Payment route error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
