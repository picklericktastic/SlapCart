"use client";

import { useState } from "react";
import { MapPin, Compass } from "lucide-react";

const zones = [
  {
    id: "A",
    name: "Zone A — North Lots",
    color: "#002D6D",
    hoverColor: "#1A4B9E",
    description:
      "Prime spots north of Tiger Stadium. Close to the main gates with easy access to North Stadium Drive. Popular with alumni groups and large tailgate setups.",
    spots: [
      { id: "A1", name: "North Stadium Dr (Lot A1)", desc: "50 yards from Gate 1" },
      { id: "A2", name: "Nicholson & Chimes (Lot A2)", desc: "Near The Chimes restaurant" },
      { id: "A3", name: "Tiger Park (Lot A3)", desc: "Adjacent to softball stadium" },
    ],
    path: "M 200 60 L 350 60 L 380 120 L 370 180 L 280 180 L 200 180 L 170 120 Z",
  },
  {
    id: "B",
    name: "Zone B — East Lots",
    color: "#D4A017",
    hoverColor: "#F0C040",
    description:
      "High-energy spots east of the stadium near the practice fields and Cox Plaza. Great visibility and easy in-and-out access from Nicholson Drive.",
    spots: [
      { id: "B1", name: "East Stadium Dr (Lot B1)", desc: "Steps from Tiger Walk" },
      { id: "B2", name: "Practice Facility (Lot B2)", desc: "Near football ops building" },
      { id: "B3", name: "Cox Plaza (Lot B3)", desc: "Central east campus spot" },
    ],
    path: "M 390 120 L 450 80 L 520 100 L 540 170 L 520 240 L 450 260 L 390 240 L 380 180 Z",
  },
  {
    id: "C",
    name: "Zone C — South Lots",
    color: "#2D8B46",
    hoverColor: "#3DAF5C",
    description:
      "Spacious lots south of the stadium with room for larger setups. Close to the Vet School Quad and Nicholson Extension — a local favorite for families.",
    spots: [
      { id: "C1", name: "Nicholson Extension (Lot C1)", desc: "Extra space for big groups" },
      { id: "C2", name: "South Stadium Rd (Lot C2)", desc: "Quick walk to south gates" },
      { id: "C3", name: "Vet Quad (Lot C3)", desc: "Shaded area near vet school" },
    ],
    path: "M 200 280 L 280 280 L 370 280 L 380 320 L 360 380 L 280 400 L 200 380 L 170 320 Z",
  },
  {
    id: "D",
    name: "Zone D — West / Remote Lots",
    color: "#6B21A8",
    hoverColor: "#8B5CF6",
    description:
      "Budget-friendly remote lots west of the stadium near the Ag Center and Huey P. Long Field House. More space and a relaxed atmosphere — shuttle access available.",
    spots: [
      { id: "D1", name: "Huey P Long Field (Lot D1)", desc: "Historic west campus" },
      { id: "D2", name: "Baseball Rd (Lot D2)", desc: "Near Alex Box Stadium" },
      { id: "D3", name: "Ag Center (Lot D3)", desc: "Largest lot, most space" },
    ],
    path: "M 60 120 L 160 120 L 170 180 L 160 240 L 170 280 L 160 320 L 60 320 L 40 240 L 30 180 Z",
  },
];

const streetLabels = [
  { text: "North Stadium Dr", x: 260, y: 50, angle: 0 },
  { text: "Nicholson Dr", x: 500, y: 170, angle: 90 },
  { text: "South Stadium Rd", x: 280, y: 415, angle: 0 },
  { text: "Skip Bertman Dr", x: 20, y: 220, angle: 90 },
  { text: "Dalrymple Dr", x: 280, y: 235, angle: 0 },
];

export default function ZoneMap({ selectedZone, onZoneSelect, selectedSpot, onSpotSelect }) {
  const [hoveredZone, setHoveredZone] = useState(null);
  const activeZone = zones.find((z) => z.id === selectedZone);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-brand-blue">
            Tiger Stadium Area Map
          </h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Compass size={14} />
            <span>N</span>
          </div>
        </div>

        <div className="relative w-full" style={{ maxWidth: 580 }}>
          <svg
            viewBox="0 0 580 450"
            className="w-full h-auto"
            role="img"
            aria-label="Interactive map of tailgate zones around Tiger Stadium"
          >
            {/* Background */}
            <rect width="580" height="450" fill="#f8fafc" rx="12" />

            {/* Grid lines */}
            {[100, 200, 300, 400, 500].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="450" stroke="#e2e8f0" strokeWidth="0.5" />
            ))}
            {[100, 200, 300, 400].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="580" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
            ))}

            {/* Streets */}
            <line x1="170" y1="40" x2="380" y2="40" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="540" y1="60" x2="540" y2="400" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="170" y1="420" x2="380" y2="420" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="20" y1="100" x2="20" y2="360" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="150" y1="230" x2="400" y2="230" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 3" />

            {/* Street labels */}
            {streetLabels.map((s) => (
              <text
                key={s.text}
                x={s.x}
                y={s.y}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="sans-serif"
                textAnchor="middle"
                transform={s.angle ? `rotate(${s.angle}, ${s.x}, ${s.y})` : undefined}
              >
                {s.text}
              </text>
            ))}

            {/* Zones */}
            {zones.map((zone) => {
              const isActive = selectedZone === zone.id;
              const isHovered = hoveredZone === zone.id;
              return (
                <g key={zone.id}>
                  <path
                    d={zone.path}
                    fill={isActive || isHovered ? zone.hoverColor : zone.color}
                    opacity={isActive ? 0.95 : isHovered ? 0.85 : 0.7}
                    stroke={isActive ? "#fff" : "transparent"}
                    strokeWidth={isActive ? 3 : 0}
                    className="zone-path"
                    onClick={() => onZoneSelect(zone.id)}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    role="button"
                    aria-label={`Select ${zone.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onZoneSelect(zone.id);
                    }}
                  />
                  <text
                    x={
                      zone.id === "A" ? 275 :
                      zone.id === "B" ? 460 :
                      zone.id === "C" ? 275 :
                      100
                    }
                    y={
                      zone.id === "A" ? 130 :
                      zone.id === "B" ? 175 :
                      zone.id === "C" ? 340 :
                      225
                    }
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    Zone {zone.id}
                  </text>
                </g>
              );
            })}

            {/* Tiger Stadium (center) */}
            <rect
              x="210"
              y="190"
              width="140"
              height="70"
              rx="8"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            <text
              x="280"
              y="220"
              fill="white"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              TIGER STADIUM
            </text>
            <text
              x="280"
              y="235"
              fill="#94a3b8"
              fontSize="8"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              &quot;Death Valley&quot;
            </text>

            {/* Compass */}
            <g transform="translate(540, 30)">
              <circle r="16" fill="white" stroke="#cbd5e1" strokeWidth="1" />
              <polygon points="0,-12 3,-4 -3,-4" fill="#002D6D" />
              <polygon points="0,12 3,4 -3,4" fill="#cbd5e1" />
              <text y="-4" fill="#002D6D" fontSize="6" fontWeight="bold" textAnchor="middle">
                N
              </text>
            </g>
          </svg>
        </div>

        {/* Zone legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => onZoneSelect(z.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                selectedZone === z.id
                  ? "bg-gray-100 ring-2 ring-brand-blue"
                  : "hover:bg-gray-50"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: z.color }}
              />
              Zone {z.id}
            </button>
          ))}
        </div>
      </div>

      {/* Zone detail panel */}
      {activeZone && (
        <div
          className="bg-white rounded-2xl border-2 p-6 animate-in fade-in slide-in-from-bottom-2"
          style={{ borderColor: activeZone.color }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: activeZone.color }}
            />
            <h4 className="font-display font-bold text-lg">{activeZone.name}</h4>
          </div>
          <p className="text-gray-600 text-sm mb-5">{activeZone.description}</p>

          <p className="text-sm font-semibold text-gray-800 mb-3">
            Choose a drop-off spot:
          </p>
          <div className="grid gap-3">
            {activeZone.spots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => onSpotSelect(spot.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                  selectedSpot === spot.id
                    ? "border-brand-gold bg-brand-gold/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <MapPin
                  size={18}
                  className={
                    selectedSpot === spot.id
                      ? "text-brand-gold"
                      : "text-gray-400"
                  }
                />
                <div>
                  <p className="font-semibold text-sm">{spot.name}</p>
                  <p className="text-gray-500 text-xs">{spot.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
