"use client";

import Link from "next/link";
import Image from "next/image";
import { Tv, Wifi, Zap, Volume2, MapPin, Clock, Shield, ChevronRight, Star } from "lucide-react";

const FEATURES = [
  { icon: Tv, title: '75" Flat Screen', desc: "Crystal-clear 4K display so you never miss the big play." },
  { icon: Volume2, title: "Premium Speakers", desc: "Concert-quality sound that fills your entire tailgate area." },
  { icon: Wifi, title: "Starlink Internet", desc: "Blazing-fast satellite internet — stream, game, and browse anywhere." },
  { icon: Zap, title: "Gas Generator", desc: "Reliable portable power so everything runs all day long." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Pick Your Game", desc: "Choose a game day and your drop-off time — we deliver 8+ hours early to beat the traffic." },
  { step: "02", title: "Select Your Zone", desc: "Pick your spot from our interactive map of Tiger Stadium's surrounding areas." },
  { step: "03", title: "Pay & Confirm", desc: "Secure checkout in seconds. We handle setup and pickup." },
];

const TESTIMONIALS = [
  { name: "Jake T.", text: "Best tailgate we've ever had. Walked up, everything was set up perfectly. We're booking every home game.", rating: 5 },
  { name: "Ashley M.", text: "The Starlink was a game changer. We were watching pre-game coverage and streaming highlights all day.", rating: 5 },
  { name: "Brandon L.", text: "Super easy to book. Drop-off was right on time. Everyone wanted to hang at our spot.", rating: 5 },
];

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-blue/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="SlapCart Logo" width={40} height={40} className="rounded-full" />
            <span className="text-white font-display font-bold text-xl tracking-tight">
              Slap<span className="text-brand-gold">Cart</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-white/80">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">What&apos;s Included</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <Link href="/book" className="bg-brand-gold hover:bg-brand-gold-light text-brand-blue-dark font-bold px-5 py-2 rounded-lg text-sm transition-all duration-200 hover:shadow-lg">
            Book Now
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative bg-hero-gradient pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/30 text-brand-gold px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
            Now Booking — LSU 2026 Season
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            The Ultimate{" "}
            <span className="text-brand-gold">Game Day</span>{" "}
            Tailgate,{" "}
            <span className="text-brand-gold">Delivered.</span>
          </h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            We bring a fully loaded SlapCart — flat screen, premium speakers, Starlink, and power — straight to your spot near Tiger Stadium. You show up. We handle everything else.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
              Book Your SlapCart
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="btn-secondary w-full sm:w-auto justify-center text-center">
              See How It Works
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/60 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-brand-gold" /><span>Secure Checkout</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-gold" /><span>On-Time Delivery Guarantee</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-gold" /><span>4 Zones Near Tiger Stadium</span></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="font-display font-bold text-4xl text-brand-blue">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="text-5xl font-display font-black text-brand-gold/20 mb-4">{item.step}</div>
                <h3 className="font-bold text-xl text-brand-blue mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-brand-gold/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Book Now — It Takes 2 Minutes <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-2">Premium Setup</p>
            <h2 className="font-display font-bold text-4xl text-brand-blue">What&apos;s Included</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Every SlapCart comes fully loaded. No equipment to rent, haul, or set up yourself.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:border-brand-gold/30 hover:shadow-md transition-all text-center">
                <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-blue-light transition-colors">
                  <f.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <h3 className="font-bold text-brand-blue mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-4 bg-brand-blue">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-2">Transparent Pricing</p>
          <h2 className="font-display font-bold text-4xl text-white mb-4">Simple. Flat Rate.</h2>
          <p className="text-white/70 mb-12">No hidden fees. No equipment hassles. Just show up and enjoy the game.</p>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-10">
            <div className="text-brand-gold font-display font-black text-6xl mb-2">$1000</div>
            <p className="text-white/70 text-lg mb-8">per game day booking</p>
            <ul className="text-white/80 text-left space-y-3 max-w-xs mx-auto mb-10">
              {["Full-day cart rental (8+ hours)", "Delivery & setup included", "Pickup after the game", '75" 4K flat screen', "Premium speaker system", "Starlink satellite internet", "Gas generator & power"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-brand-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Reserve Your SlapCart <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="font-display font-bold text-4xl text-brand-blue">Tiger Fans Love It</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-brand-blue">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl text-brand-blue mb-4">
            Ready to Elevate Your <span className="text-brand-gold">Game Day?</span>
          </h2>
          <p className="text-gray-500 mb-8 text-lg">Spots fill up fast on game days. Book your SlapCart before your zone sells out.</p>
          <Link href="/book" className="btn-primary inline-flex items-center gap-2">
            Book My SlapCart <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-blue-dark py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="SlapCart Logo" width={32} height={32} className="rounded-full" />
            <span className="text-white font-bold">Slap<span className="text-brand-gold">Cart</span></span>
          </div>
          <p className="text-white/40 text-sm">© 2026 SlapCart. Baton Rouge, LA. All rights reserved.</p>
          <div className="flex gap-4 text-white/50 text-sm">
            <Link href="/book" className="hover:text-white">Book Now</Link>
            <a href="mailto:hello@slapcart.com" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
