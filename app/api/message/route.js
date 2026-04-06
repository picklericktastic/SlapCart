import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { message, booking } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "SlapCart <bookings@slapcarts.com>",
      to: "mikeswalker21@gmail.com",
      subject: `💬 Customer Message – ${booking?.game || "SlapCart"} – ${booking?.name || "Customer"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a;">
          <div style="background:#002D6D;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="color:#D4A017;margin:0;font-size:22px;">💬 New Customer Message</h1>
          </div>
          <div style="padding:28px;background:#f9f9f9;border:1px solid #e0e0e0;">
            <div style="background:#fff;border-left:4px solid #D4A017;padding:16px;border-radius:4px;margin-bottom:20px;">
              <p style="margin:0;font-size:15px;color:#1a1a1a;">${message}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:8px 0;color:#666;width:40%;">From</td>
                <td style="padding:8px 0;font-weight:bold;">${booking?.name || "Customer"}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:8px 0;color:#666;">Reply To</td>
                <td style="padding:8px 0;"><a href="mailto:${booking?.email || ""}" style="color:#002D6D;">${booking?.email || "N/A"}</a></td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:8px 0;color:#666;">Game</td>
                <td style="padding:8px 0;">${booking?.game || "N/A"}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:8px 0;color:#666;">Spot</td>
                <td style="padding:8px 0;font-weight:bold;">${booking?.spot || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666;">Drop-Off</td>
                <td style="padding:8px 0;">${booking?.dropoffTime || "N/A"}</td>
              </tr>
            </table>
            <p style="margin-top:20px;font-size:13px;color:#888;">Reply directly to this email to respond to the customer.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Message route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
