"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tv,
  Speaker,
  Wifi,
  Zap,
  CheckCircle,
  Star,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollhY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-blue/95 backdrop-blur-md shadow-lg"
          : "bg-brand-blue"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
              <span className="text-brand-blue-dark font-display font-black text-sm">
                SC
              </span>
            </div>
            <span className="text-white font-display font-bold text-xl tracking-tight">
              SlapCart
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-white/80 hover:text-white transition text-sm font-medium"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-white/80 hover:text-white transition text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-white/80 hover:text-white transition text-sm font-medium"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-white/80 hover:text-white transition text-sm font-medium"
            >
              Reviews
            </a>
            <Link
              href="/book"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-blue-dark font-bold px-5 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              Book Now
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a
              href="#how-it-works"
              className="block text-white/80 hover:text-white py-2 text-sm"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="block text-white/80 hover:text-white py-2 text-sm"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-white/80 hover:text-white py-2 text-sm"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block text-white/80 hover:text-white py-2 text-sm"
            >
              Reviews
            </a>
            <Link
              href="/book"
              className="block bg-brand-gold text-brand-blue-dark font-bold px-5 py-2 rounded-lg text-sm text-center"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const features = [
  {
    icon: Tv,
    title: '65" Flat Screen TV',
    desc: "Watch every play on a crystal-clear big screen with HDMI hookup for your streaming apps.",
  },
  {
    icon: Speaker,
    title: "Premium Speakers",
    desc: "Bluetooth speakers with deep bass that set the mood for your entire tailgate.",
  },
  {
    icon: Wifi,
    title: "Starlink Internet",
    desc: "High-speed satellite WiFi so your whole crew can stream, post, and stay connected.",
  },
  {
    icon: Zap,
    title: "Gas Generator",
    desc: "Quiet-running generator powers everything all day — no extension cords needed.",
  },
];

const steps = [
  {
    num: "1",
    title: "Pick Your Game",
    desc: "Choose from any LSU 2025 home game and select your drop-off time.",
  },
  {
    num: "2",
    title: "Select Your Zone",
    desc: "Pick your tailgate zone and exact drop-off spot on our interactive map.",
  },
  {
    num: "3",
    title: "Pay & Confirm",
    desc: "Secure checkout. We deliver, set up, and pick up — you just show up.",
  },
];

const inclusions = [
  '65" TV with streaming capability',
  "Premium Bluetooth speakers",
  "Starlink WiFi hotspot",
  "Quiet gas generator",
  "Delivery, setup & breakdown",
  "All cables and connections",
  "Weather-resistant equipment",
  "On-call game-day support",
];

const testimonials = [
  {
    name: "Tyler Boudreaux",
    text: "We rented SlapCart for the Bama game and it was absolutely worth every penny. Our tailgate was the envy of the entire lot. Setup was already done when we arrived at 9am.",
    rating: 5,
  },
  {
    name: "Ashley Thibodaux",
    text: "I surprised my husband for his birthday tailgate and he lost his mind. The TV and speakers were top-notch and the Starlink WiFi was clutch for streaming the other SEC games.",
    rating: 5,
  },
  {
    name: "Marcus Landry",
    text: "Third time booking SlapCart this season. The crew is always professional, everything works perfectly, and breakdown is seamless. Best money I spend all fall. Geaux Tigers!",
    rating: 5,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-hero-gradient min-h-screen flex items-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue-light rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 rounded-full px-5 py-2 mb-8 animate-pulse">
            <span className="w-2 h-2 bg-brand-gold rounded-full" />
            <span className="text-brand-gold font-semibold text-sm tracking-wide">
              Now Booking — LSU 2025 Season
            </span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            The Ultimate Game Day
            <br />
            <span className="text-brand-gold">Tailgate, Delivered.</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A premium mobile entertainment cart — 65&quot; TV, speakers, Starlink
            WiFi &amp; generator — delivered to your tailgate spot near Tiger
            Stadium. Just show up and enjoy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book" className="btn-primary text-center">
              Book Your Cart — $1,000
            </Link>
            <a href="#how-it-works" className="btn-secondary text-center">
              See How It Works
            </a>
          </div>

          <div className="mt-16 animate-bounce">
            <ChevronDown className="mx-auto text-white/40" size={32} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl text-brand-blue mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Three simple steps to the best tailgate of your life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition text-center"
              >
                <div className="w-14 h-14 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-brand-blue-dark font-display font-black text-xl">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-brand-blue mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl text-brand-blue mb-4">
              What&apos;s on the Cart
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Everything you need for a legendary game day experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-brand-gold/50 hover:shadow-lg transition group"
              >
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-gold/20 transition">
                  <f.icon className="text-brand-blue" size={24} />
                </div>
                <h3 className="font-display font-bold text-lg text-brand-blue mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl text-brand-blue mb-4">
              Simple, Flat-Rate Pricing
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              No hidden fees. No surge pricing. One price for the full game day
              experience.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-brand-blue p-8 text-center">
              <p className="text-brand-gold font-semibold text-sm tracking-wide uppercase mb-2">
                Game Day Package
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-white font-display font-black text-6xl">
                  $1,000
                </span>
                <span className="text-white/60 text-lg">/game</span>
              </div>
            </div>
            <div className="p-8">
              <ul className="space-y-3">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle
                      className="text-brand-gold mt-0.5 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/book"
                className="btn-primary w-full block text-center mt-8"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl text-brand-blue mb-4">
              What Fans Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="text-brand-gold fill-brand-gold"
                      size={18}
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="font-bold text-brand-blue">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-brand-gold rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            Ready to Slap Different?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Lock in your game day cart before spots fill up. Limited
            availability per game.
          </p>
          <Link href="/book" className="btn-primary text-center">
            Book Your SlapCart — $1,000
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-blue-dark font-display font-black text-sm">
                  SC
                </span>
              </div>
              <span className="text-white font-display font-bold text-lg">
                SlapCart
              </span>
            </div>
            <div className="flex gap-8 text-white/60 text-sm">
              <a href="#how-it-works" className="hover:text-white transition">
                How It Works
              </a>
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition">
                Pricing
              </a>
            </div>
            <p className="text-white/40 text-sm">
              &copy; 2025 SlapCart. All rights reserved. Not affiliated with
              LSU.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
