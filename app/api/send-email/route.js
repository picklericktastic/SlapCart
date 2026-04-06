import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request) {
  try {
        const resend = new Resend(process.env.RESEND_API_KEY);
    const { booking, paymentId } = await request.json();

    const gameLabel = `LSU vs. ${booking?.game || "TBD"}`;
    const dropoff  = booking?.dropoffTime || "TBD";
    const spot     = booking?.spot || "TBD";
    const name     = `${booking?.firstName || ""} ${booking?.lastName || ""}`.trim() || "Customer";
    const email    = booking?.email || null;
    const phone    = booking?.phone || "N/A";

    // ── 1. Customer confirmation email ──────────────────────────────────────
    if (email) {
      await resend.emails.send({
        from: "SlapCart <bookings@slapcarts.com>",
        to: email,
        subject: `You're booked! SlapCart – ${gameLabel}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a;">
            <div style="background:#002D6D;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="color:#D4A017;margin:0;font-size:28px;">SlapCart</h1>
              <p style="color:#fff;margin:4px 0 0;">Rent-a-Tailgate · LSU Game Day</p>
            </div>
            <div style="padding:32px;background:#f9f9f9;border:1px solid #e0e0e0;">
              <h2 style="margin-top:0;">You're Booked, ${name}! 🎉</h2>
              <p>Your SlapCart is reserved. Here's your booking summary:</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr style="border-bottom:1px solid #e0e0e0;">
                  <td style="padding:10px 0;color:#666;width:40%;">Game</td>
                  <td style="padding:10px 0;font-weight:bold;">${gameLabel}</td>
                </tr>
                <tr style="border-bottom:1px solid #e0e0e0;">
                  <td style="padding:10px 0;color:#666;">Drop-Off Time</td>
                  <td style="padding:10px 0;font-weight:bold;">${dropoff}</td>
                </tr>
                <tr style="border-bottom:1px solid #e0e0e0;">
                  <td style="padding:10px 0;color:#666;">Location</td>
                  <td style="padding:10px 0;font-weight:bold;">${spot}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#666;">Total Paid</td>
                  <td style="padding:10px 0;font-weight:bold;color:#002D6D;">$1,000.00</td>
                </tr>
              </table>
              <div style="background:#fff;border-left:4px solid #D4A017;padding:16px;margin:20px 0;border-radius:4px;">
                <strong>What happens next:</strong>
                <ul style="margin:8px 0;padding-left:20px;">
                  <li>Our team sets up your SlapCart at spot <strong>${spot}</strong></li>
                  <li>We'll call/text you <strong>30 min before arrival</strong></li>
                  <li>We handle full pickup after the game — you do nothing</li>
                </ul>
              </div>
              <p style="font-size:13px;color:#888;">Payment ID: ${paymentId || "N/A"} · Questions? Reply to this email or chat us at slapcarts.com</p>
            </div>
            <div style="text-align:center;padding:16px;font-size:12px;color:#aaa;">
              © 2026 SlapCart · Baton Rouge, LA
            </div>
          </div>
        `,
      });
    }

    // ── 2. Owner alert email (always sent to Mike) ───────────────────────────
    await resend.emails.send({
      from: "SlapCart Bookings <bookings@slapcarts.com>",
      to: "mikeswalker21@gmail.com",
      subject: `🎉 New Booking – ${gameLabel} – ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a;">
          <div style="background:#002D6D;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="color:#D4A017;margin:0;">New SlapCart Booking!</h1>
          </div>
          <div style="padding:28px;background:#f9f9f9;border:1px solid #e0e0e0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px 0;color:#666;width:40%;">Customer</td>
                <td style="padding:10px 0;font-weight:bold;">${name}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px 0;color:#666;">Email</td>
                <td style="padding:10px 0;">${email || "Guest (no email)"}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px 0;color:#666;">Phone</td>
                <td style="padding:10px 0;">${phone}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px 0;color:#666;">Game</td>
                <td style="padding:10px 0;font-weight:bold;">${gameLabel}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px 0;color:#666;">Drop-Off</td>
                <td style="padding:10px 0;">${dropoff}</td>
              </tr>
              <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px 0;color:#666;">Spot</td>
                <td style="padding:10px 0;font-weight:bold;">${spot}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#666;">Payment ID</td>
                <td style="padding:10px 0;font-size:12px;">${paymentId || "N/A"}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    // Non-fatal — don't fail the booking if email fails
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
