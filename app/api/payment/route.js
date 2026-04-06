// Square sandbox mode — swap SQUARE_ACCESS_TOKEN and app/location IDs to go live
import { NextResponse } from "next/server";

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

    return NextResponse.json({ success: true, paymentId: data.payment.id });
  } catch (err) {
    console.error("Payment route error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
