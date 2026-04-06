"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, parse, subHours } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import ZoneMap from "../../components/ZoneMap";

const GAMES = [
  { id: 1, opponent: "Clemson",           date: "2026-09-05", time: "19:00", display: "Sat, Sep 5 — 7:00 PM" },
  { id: 2, opponent: "Louisiana Tech",    date: "2026-09-12", time: "15:00", display: "Sat, Sep 12 — 3:00 PM" },
  { id: 3, opponent: "Texas A&M",         date: "2026-09-26", time: "19:30", display: "Sat, Sep 26 — 7:30 PM" },
  { id: 4, opponent: "McNeese",           date: "2026-10-03", time: "15:00", display: "Sat, Oct 3 — 3:00 PM" },
  { id: 5, opponent: "Mississippi State", date: "2026-10-17", time: "15:00", display: "Sat, Oct 17 — 3:00 PM" },
  { id: 6, opponent: "Alabama",           date: "2026-11-07", time: "19:30", display: "Sat, Nov 7 — 7:30 PM" },
  { id: 7, opponent: "Texas",             date: "2026-11-14", time: "19:30", display: "Sat, Nov 14 — 7:30 PM" },
];

const STEP_LABELS = ["Game & Time", "Zone & Spot", "Your Info", "Pay"];

function generateTimeSlots(game) {
  if (!game) return [];
  const kickoffHour = parseInt(game.time.split(":")[0], 10);
  const kickoffMin = parseInt(game.time.split(":")[1], 10);
  const kickoffTotalMinutes = kickoffHour * 60 + kickoffMin;
  const cutoffTotalMinutes = kickoffTotalMinutes - 8 * 60; // 8 hours before
  const hardCapMinutes = 8 * 60 + 30; // hard cap at 8:30 AM
  const effectiveCutoff = Math.min(cutoffTotalMinutes, hardCapMinutes);

  const slots = [];
  for (let m = 6 * 60; m <= effectiveCutoff; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const display12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const minStr = min === 0 ? "00" : String(min);
    slots.push({ value: `${String(h).padStart(2, "0")}:${minStr}`, label: `${display12}:${minStr} ${ampm}` });
  }
  return slots;
}

function StepIndicator({ currentStep }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            const isDone = stepNum < currentStep;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`step-indicator ${
                    isDone
                      ? "bg-brand-gold text-brand-blue-dark"
                      : isActive
                      ? "bg-brand-blue text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isDone ? <CheckCircle size={18} /> : stepNum}
                </div>
                <span
                  className={`hidden sm:inline text-sm font-medium ${
                    isActive ? "text-brand-blue" : isDone ? "text-brand-gold" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      isDone ? "bg-brand-gold" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    createAccount: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const game = GAMES.find((g) => g.id === selectedGame);
  const timeSlots = useMemo(() => generateTimeSlots(game), [game]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedGame && selectedTime;
      case 2:
        return selectedZone && selectedSpot;
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const next = () => {
    if (canProceed() && step < 4) setStep(step + 1);
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="font-display font-black text-3xl text-brand-blue mb-3">
            You&apos;re Booked!
          </h1>
          <p className="text-gray-600 mb-6">
            Your SlapCart will be delivered for LSU vs {game?.opponent} on{" "}
            {game?.display}. Check your email at{" "}
            <span className="font-semibold">{formData.email}</span> for
            confirmation details.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Game</span>
              <span className="font-medium">LSU vs {game?.opponent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Drop-off</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Zone</span>
              <span className="font-medium">Zone {selectedZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Spot</span>
              <span className="font-medium">{selectedSpot}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-500 font-semibold">Total</span>
              <span className="font-bold text-brand-blue">$1,000.00</span>
            </div>
          </div>
          <Link href="/" className="btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-blue py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white transition">
            <ChevronLeft size={20} />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-gold rounded-lg flex items-center justify-center">
              <span className="text-brand-blue-dark font-display font-black text-xs">SC</span>
            </div>
            <span className="text-white font-display font-bold text-lg">SlapCart</span>
          </Link>
        </div>
      </div>

      <StepIndicator currentStep={step} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Pick Game & Time */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue mb-2 flex items-center gap-2">
                <Calendar size={24} /> Pick Your Game
              </h2>
              <p className="text-gray-500 text-sm">LSU 2026 Home Schedule</p>
            </div>

            <div className="grid gap-3">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGame(g.id);
                    setSelectedTime(null);
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition ${
                    selectedGame === g.id
                      ? "border-brand-gold bg-brand-gold/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-brand-blue">LSU vs {g.opponent}</p>
                    <p className="text-gray-500 text-sm">{g.display}</p>
                  </div>
                  {selectedGame === g.id && (
                    <CheckCircle className="text-brand-gold" size={22} />
                  )}
                </button>
              ))}
            </div>

            {selectedGame && timeSlots.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl text-brand-blue mb-2 flex items-center gap-2">
                  <Clock size={20} /> Drop-Off Time
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Available times are at least 8 hours before kickoff.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      onClick={() => setSelectedTime(slot.label)}
                      className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
                        selectedTime === slot.label
                          ? "border-brand-gold bg-brand-gold/10 text-brand-blue"
                          : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Zone Map */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue mb-2 flex items-center gap-2">
                <MapPin size={24} /> Select Your Zone & Spot
              </h2>
              <p className="text-gray-500 text-sm">
                Click a zone on the map, then choose your drop-off spot.
              </p>
            </div>

            <ZoneMap
              selectedZone={selectedZone}
              onSelectZone={(z) => {
                setSelectedZone(z);
                setSelectedSpot(null);
              }}
              selectedSpot={selectedSpot}
              onSelectSpot={setSelectedSpot}
            />
          </div>
        )}

        {/* Step 3: Guest Info */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue mb-2 flex items-center gap-2">
                <User size={24} /> Your Information
              </h2>
              <p className="text-gray-500 text-sm">
                Guest checkout or create an account for faster booking next time.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="border-t pt-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.createAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, createAccount: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm text-gray-700">
                    Create an account for faster booking next time
                  </span>
                </label>

                {formData.createAccount && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition"
                      placeholder="Create a password"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Pay */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-blue mb-2 flex items-center gap-2">
                <CreditCard size={24} /> Review & Pay
              </h2>
              <p className="text-gray-500 text-sm">
                Confirm your details and complete payment.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-brand-blue mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Game</span>
                  <span className="font-medium">LSU vs {game?.opponent}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{game?.display}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Drop-off Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Zone</span>
                  <span className="font-medium">Zone {selectedZone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Spot</span>
                  <span className="font-medium">{selectedSpot}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between pt-3 text-base">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-display font-black text-xl text-brand-blue">
                    $1,000.00
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-brand-blue mb-4">Payment</h3>
              <div
                id="square-card-container"
                className="w-full min-h-[120px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm"
              >
                Square Payment Form will load here
              </div>

              <button
                onClick={handleSubmit}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Pay $1,000.00
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Secured by Square. Your payment info is encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        {!submitted && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 text-gray-600 hover:text-brand-blue font-medium transition"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-brand-blue font-medium transition"
              >
                <ArrowLeft size={18} />
                Home
              </Link>
            )}

            {step < 4 && (
              <button
                onClick={next}
                disabled={!canProceed()}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition ${
                  canProceed()
                    ? "bg-brand-blue text-white hover:bg-brand-blue-light"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
