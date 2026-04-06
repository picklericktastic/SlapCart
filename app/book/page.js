"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { format, addMinutes, setHours, setMinutes } from "date-fns";
import { ChevronRight, ChevronLeft, Calendar, MapPin, User, CreditCard, CheckCircle, Clock, AlertCircle, Loader2, MessageCircle, Send } from "lucide-react";
import ZoneMap from "@/components/ZoneMap";

const GAMES = [
  { id: 1, opponent: "Clemson",           date: "2026-09-05", kickoff: "19:00" },
  { id: 2, opponent: "Louisiana Tech",    date: "2026-09-12", kickoff: "15:00" },
  { id: 3, opponent: "Texas A&M",         date: "2026-09-26", kickoff: "19:30" },
  { id: 4, opponent: "McNeese",           date: "2026-10-03", kickoff: "15:00" },
  { id: 5, opponent: "Mississippi State", date: "2026-10-17", kickoff: "15:00" },
  { id: 6, opponent: "Alabama",           date: "2026-11-07", kickoff: "19:30" },
  { id: 7, opponent: "Texas",             date: "2026-11-14", kickoff: "19:30" },
];

function getAvailableTimes(gameDate, kickoffTime) {
  const kickoffDate = new Date(`${gameDate}T${kickoffTime}:00`);
  const latestDropoff = new Date(kickoffDate.getTime() - 8 * 60 * 60 * 1000);
  const hardCap = setMinutes(setHours(new Date(gameDate), 8), 30);
  const cutoff = latestDropoff < hardCap ? latestDropoff : hardCap;
  const times = [];
  let current = setMinutes(setHours(new Date(gameDate), 6), 0);
  while (current <= cutoff) {
    times.push(new Date(current));
    current = addMinutes(current, 30);
  }
  return times;
}

const STEPS = [
  { id: 1, label: "Game & Time", icon: Calendar },
  { id: 2, label: "Location",   icon: MapPin },
  { id: 3, label: "Account",    icon: User },
  { id: 4, label: "Payment",    icon: CreditCard },
];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    game: null, dropoffTime: null,
    zone: null, spot: null,
    isGuest: null, email: "", firstName: "", lastName: "", phone: "", password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [takenSpots, setTakenSpots] = useState([]);

  // Fetch already-booked spots when game changes
  useEffect(() => {
    if (!booking.game) { setTakenSpots([]); return; }
    const game = GAMES.find((g) => g.id === booking.game);
    if (!game) return;
    fetch(`/api/availability?game=${encodeURIComponent("LSU vs. " + game.opponent)}`)
      .then((r) => r.json())
      .then((data) => setTakenSpots(data.takenSpots || []))
      .catch(() => setTakenSpots([]));
  }, [booking.game]);


  const [cardInstance, setCardInstance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const cardAttached = useRef(false);
  const sdkLoaded = useRef(false);

  const selectedGame = GAMES.find((g) => g.id === booking.game);
  const availableTimes = selectedGame ? getAvailableTimes(selectedGame.date, selectedGame.kickoff) : [];

  useEffect(() => {
    if (sdkLoaded.current) return;
    sdkLoaded.current = true;
    const script = document.createElement("script");
    const isSandbox = (process.env.NEXT_PUBLIC_SQUARE_APP_ID || "").startsWith("sandbox-");
    script.src = isSandbox
      ? "https://sandbox.web.squarecdn.com/v1/square.js"
      : "https://web.squarecdn.com/v1/square.js";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (step !== 4 || cardAttached.current) return;
    const initSquare = async () => {
      if (!window.Square) { setTimeout(initSquare, 400); return; }
      try {
        cardAttached.current = true;
        const payments = window.Square.payments(
          process.env.NEXT_PUBLIC_SQUARE_APP_ID,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
        );
        const card = await payments.card({
          style: {
            ".input-container": { borderRadius: "12px", borderColor: "#e5e7eb" },
            ".input-container.is-focus": { borderColor: "#002D6D" },
            ".input-container.is-error": { borderColor: "#ef4444" },
            input: { fontSize: "15px", color: "#111827" },
            "input::placeholder": { color: "#9ca3af" },
          },
        });
        await card.attach("#square-card-container");
        setCardInstance(card);
      } catch (err) {
        console.error("Square init error:", err);
        cardAttached.current = false;
        setPaymentError("Could not load payment form. Please refresh and try again.");
      }
    };
    initSquare();
  }, [step]);

  const handlePayment = async () => {
    if (!cardInstance || isProcessing) return;
    setIsProcessing(true);
    setPaymentError("");
    try {
      const result = await cardInstance.tokenize();
      if (result.status !== "OK") {
        setPaymentError(result.errors?.[0]?.message || "Card error. Please check your details.");
        setIsProcessing(false);
        return;
      }
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: result.token,
          booking: {
            game: selectedGame?.opponent,
            spot: booking.spot,
            email: booking.email,
            dropoffTime: booking.dropoffTime,
            firstName: booking.firstName,
            lastName: booking.lastName,
            phone: booking.phone,
          },
        }),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); }
      else { setPaymentError(data.error || "Payment failed. Please try again."); }
    } catch (err) {
      setPaymentError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return booking.game && booking.dropoffTime;
    if (step === 2) return booking.zone && booking.spot;
    if (step === 3) return booking.email && booking.firstName && booking.lastName && booking.phone;
    return true;
  };

  const update = (field, value) => setBooking((prev) => ({ ...prev, [field]: value }));

  if (submitted) return <ConfirmationPage booking={booking} selectedGame={selectedGame} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-blue px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-gold rounded-lg flex items-center justify-center">
              <span className="text-brand-blue-dark font-black text-xs">SC</span>
            </div>
            <span className="text-white font-bold">Slap<span className="text-brand-gold">Cart</span></span>
          </Link>
          <span className="text-white/60 text-sm">Secure Booking</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`step-indicator ${step === s.id ? "bg-brand-blue text-white shadow-md scale-110" : step > s.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === s.id ? "text-brand-blue" : step > s.id ? "text-green-600" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > s.id ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue">Select Your Game</h2>
              <p className="text-gray-500 mt-1">Choose which LSU home game you&apos;re tailgating.</p>
            </div>
            <div className="space-y-3">
              {GAMES.map((game) => (
                <button key={game.id} onClick={() => { update("game", game.id); update("dropoffTime", null); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${booking.game === game.id ? "border-brand-blue bg-brand-blue/5 shadow-md" : "border-gray-200 bg-white hover:border-brand-blue/40"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-blue">LSU vs. {game.opponent}</p>
                      <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(game.date + "T12:00:00"), "EEEE, MMMM d, yyyy")}
                        {" · "}
                        <Clock className="w-3.5 h-3.5 ml-1" />
                        Kickoff {game.kickoff}
                      </p>
                    </div>
                    {booking.game === game.id && <CheckCircle className="w-6 h-6 text-brand-blue flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
            {booking.game && availableTimes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-brand-blue mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-gold" /> Select Drop-Off Time
                </h3>
                <div className="flex items-start gap-2 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs">Drop-off only available <strong>8+ hours before kickoff</strong> to avoid stadium traffic.</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map((time) => {
                    const timeStr = format(time, "h:mm a");
                    return (
                      <button key={timeStr} onClick={() => update("dropoffTime", timeStr)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${booking.dropoffTime === timeStr ? "bg-brand-blue text-white border-brand-blue shadow-md" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-blue/50"}`}>
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue">Choose Your Drop-Off Zone</h2>
              <p className="text-gray-500 mt-1">Select the area near Tiger Stadium where you&apos;ll be set up.</p>
            </div>
            <ZoneMap selectedZone={booking.zone} onZoneSelect={(z) => { update("zone", z); update("spot", null); }} selectedSpot={booking.spot} onSpotSelect={(s) => update("spot", s)} />
              takenSpots={takenSpots}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue">Your Information</h2>
              <p className="text-gray-500 mt-1">Create an account to track bookings, or continue as a guest.</p>
            </div>
            {booking.isGuest === null && (
              <div className="grid sm:grid-cols-2 gap-4">
                <button onClick={() => update("isGuest", false)} className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-brand-blue text-left transition-all hover:shadow-md">
                  <User className="w-8 h-8 text-brand-blue mb-3" />
                  <p className="font-bold text-brand-blue text-lg">Create Account</p>
                  <p className="text-gray-500 text-sm mt-1">Save your info, track bookings, and re-book fast next game.</p>
                </button>
                <button onClick={() => update("isGuest", true)} className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-brand-gold text-left transition-all hover:shadow-md">
                  <ChevronRight className="w-8 h-8 text-brand-gold mb-3" />
                  <p className="font-bold text-brand-blue text-lg">Continue as Guest</p>
                  <p className="text-gray-500 text-sm mt-1">Quick checkout. No account needed.</p>
                </button>
              </div>
            )}
            {booking.isGuest !== null && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <button onClick={() => update("isGuest", null)} className="text-sm text-brand-blue hover:underline flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Change</button>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name *</label>
                    <input type="text" value={booking.firstName} onChange={(e) => update("firstName", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none" placeholder="Mike" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name *</label>
                    <input type="text" value={booking.lastName} onChange={(e) => update("lastName", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none" placeholder="Walker" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" value={booking.email} onChange={(e) => update("email", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none" placeholder="mike@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" value={booking.phone} onChange={(e) => update("phone", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none" placeholder="(225) 555-0100" />
                </div>
                {!booking.isGuest && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Create Password</label>
                    <input type="password" value={booking.password} onChange={(e) => update("password", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none" placeholder="Min. 8 characters" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue">Review & Pay</h2>
              <p className="text-gray-500 mt-1">Double-check your booking, then pay securely with Square.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-brand-blue px-5 py-3"><p className="text-white font-bold">Booking Summary</p></div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Game</span><span className="font-semibold text-gray-800">LSU vs. {selectedGame?.opponent}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Drop-Off</span><span className="font-semibold text-gray-800">{booking.dropoffTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Location</span><span className="font-semibold text-gray-800">{booking.spot}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-1.5"><User className="w-4 h-4" /> Name</span><span className="font-semibold text-gray-800">{booking.firstName} {booking.lastName}</span></div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base"><span className="font-bold text-brand-blue">Total</span><span className="font-black text-brand-blue text-lg">$1,000.00</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="font-bold text-brand-blue mb-1 flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-gold" /> Secure Payment</p>
              <p className="text-gray-500 text-sm mb-4">Powered by Square. All major cards accepted.</p>
              <div id="square-card-container" className="mb-4 min-h-[56px]">
                {!cardInstance && !paymentError && (
                  <div className="flex items-center justify-center gap-2 py-4 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading payment form…
                  </div>
                )}
              </div>
              {paymentError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{paymentError}</p>
                </div>
              )}
              <button onClick={handlePayment} disabled={!cardInstance || isProcessing}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base transition-all ${cardInstance && !isProcessing ? "bg-brand-blue text-white hover:bg-brand-blue-light shadow-md hover:shadow-lg hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><CreditCard className="w-5 h-5" /> Pay $1,000.00 Securely</>}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">🔒 Secured by Square · SSL encrypted</p>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-500 hover:text-brand-blue font-semibold transition-colors px-4 py-2"><ChevronLeft className="w-5 h-5" /> Back</button>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-brand-blue font-semibold transition-colors px-4 py-2"><ChevronLeft className="w-5 h-5" /> Back to Home</Link>
          )}
          {step < 4 && (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base transition-all ${canProceed() ? "bg-brand-blue text-white hover:bg-brand-blue-light shadow-md hover:shadow-lg hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmationPage({ booking, selectedGame }) {
  const [message, setMessage] = useState("");
  const [msgStatus, setMsgStatus] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim() || msgStatus === "sending") return;
    const text = message.trim();
    setMessage("");
    setMsgStatus("sending");
    setMessages((prev) => [...prev, { from: "customer", text }]);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          booking: {
            name: `${booking.firstName} ${booking.lastName}`,
            email: booking.email,
            game: `LSU vs. ${selectedGame?.opponent || "TBD"}`,
            spot: booking.spot,
            dropoffTime: booking.dropoffTime,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsgStatus("sent");
        setMessages((prev) => [...prev, { from: "slapcart", text: "Got it! We'll reply to your email shortly. Go Tigers! 🐯" }]);
      } else { setMsgStatus("error"); }
    } catch { setMsgStatus("error"); }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="font-display font-black text-2xl text-brand-blue mb-2">You&apos;re Booked! 🎉</h2>
          <p className="text-gray-500 mb-6">
            Your SlapCart is reserved. We&apos;ll see you at <strong className="text-brand-blue">{booking.spot}</strong> on{" "}
            <strong className="text-brand-blue">{selectedGame && format(new Date(selectedGame.date + "T12:00:00"), "MMMM d")}</strong>{" "}
            at <strong className="text-brand-blue">{booking.dropoffTime}</strong>.
          </p>
          <div className="bg-brand-blue/5 rounded-2xl p-4 text-sm text-left space-y-1 mb-6">
            <p className="font-semibold text-brand-blue mb-2">What to Expect:</p>
            <p className="text-gray-600">✓ Confirmation email sent to {booking.email}</p>
            <p className="text-gray-600">✓ Our team sets up everything at your spot</p>
            <p className="text-gray-600">✓ We call/text 30 min before arrival</p>
            <p className="text-gray-600">✓ We handle pickup after the game</p>
          </div>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">Back to Home</Link>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-brand-blue px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-brand-blue-dark" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">SlapCart Support</p>
              <p className="text-white/60 text-xs">We reply via email · usually within the hour</p>
            </div>
          </div>
          <div className="px-4 py-4 space-y-3 min-h-[120px] bg-gray-50">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand-blue-dark font-black text-xs">SC</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[80%]">
                Hey {booking.firstName}! 👋 Any questions about your booking? We&apos;re here to help.
              </div>
            </div>
            {messages.map((msg, i) => (
              msg.from === "customer" ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-brand-blue text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">{msg.text}</div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-blue-dark font-black text-xs">SC</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[80%]">{msg.text}</div>
                </div>
              )
            ))}
            {msgStatus === "error" && <p className="text-center text-red-500 text-xs">Message failed to send. Please try again.</p>}
          </div>
          <div className="border-t border-gray-100 p-3 flex gap-2 bg-white">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)" rows={1} disabled={msgStatus === "sending"}
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none resize-none disabled:opacity-50" />
            <button onClick={sendMessage} disabled={!message.trim() || msgStatus === "sending"}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all self-end ${message.trim() && msgStatus !== "sending" ? "bg-brand-blue text-white hover:bg-brand-blue-light shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              {msgStatus === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
