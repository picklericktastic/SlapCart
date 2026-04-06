"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const ZONES = {
  A: {
    id: "A", name: "Zone A — North Lots",
    description: "North Stadium Dr & Nicholson Dr area. High-foot-traffic, popular tailgate corridor.",
    color: "#1A4B9E", hoverColor: "#2563EB", textColor: "#ffffff", capacity: "High demand",
    spots: ["A1 – North Stadium Dr", "A2 – Nicholson & Chimes", "A3 – Tiger Park"],
  },
  B: {
    id: "B", name: "Zone B — East Lots",
    description: "East of the stadium near the Practice Facility. Great for late arrivals.",
    color: "#D4A017", hoverColor: "#F0C040", textColor: "#001A42", capacity: "Moderate demand",
    spots: ["B1 – East Stadium Dr", "B2 – Near Practice Facility", "B3 – Cox Communications Plaza"],
  },
  C: {
    id: "C", name: "Zone C — South Lots",
    description: "South end of the stadium along Nicholson Extension. Spacious, easy access.",
    color: "#059669", hoverColor: "#10B981", textColor: "#ffffff", capacity: "Moderate demand",
    spots: ["C1 – Nicholson Extension", "C2 – South Stadium Rd", "C3 – Vet Quad Area"],
  },
  D: {
    id: "D", name: "Zone D — Remote Lots",
    description: "Remote parking areas near Huey P. Long Field. Best for large groups.",
    color: "#7C3AED", hoverColor: "#8B5CF6", textColor: "#ffffff", capacity: "Lower demand",
    spots: ["D1 – Huey P. Long Field", "D2 – Baseball Rd Lots", "D3 – Ag Center Area"],
  },
};

export default function ZoneMap({ selectedZone, onZoneSelect, selectedSpot, onSpotSelect, takenSpots = [] }) {
  const [hoveredZone, setHoveredZone] = useState(null);

  const fill = (id) => {
    const z = ZONES[id];
    const allTaken = ZONES[id].spots.every((s) => takenSpots.includes(s));
    if (allTaken) return "#9ca3af88";
    if (selectedZone === id) return z.hoverColor;
    if (hoveredZone === id) return z.color + "CC";
    return z.color + "88";
  };

  const stroke = (id) => {
    const allTaken = ZONES[id].spots.every((s) => takenSpots.includes(s));
    if (allTaken) return "#9ca3af";
    return selectedZone === id ? ZONES[id].hoverColor : ZONES[id].color;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <p className="text-sm text-gray-500 text-center mb-3 flex items-center justify-center gap-1">
          <MapPin className="w-4 h-4 text-brand-gold" />
          Click a zone to select your drop-off area near Tiger Stadium
        </p>

        <svg viewBox="0 0 400 360" className="w-full max-w-md mx-auto block" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>
          <rect width="400" height="360" fill="#e8ead0" rx="12" />
          {/* Streets */}
          <rect x="60" y="0" width="18" height="360" fill="#c8c9b0" />
          <rect x="0" y="60" width="400" height="14" fill="#c8c9b0" />
          <rect x="0" y="280" width="400" height="14" fill="#c8c9b0" />
          <rect x="320" y="0" width="14" height="360" fill="#c8c9b0" />
          <text x="69" y="190" fontSize="7" fill="#888" transform="rotate(-90, 69, 190)" textAnchor="middle" fontFamily="system-ui">NICHOLSON DR</text>
          <text x="200" y="72" fontSize="7" fill="#888" textAnchor="middle" fontFamily="system-ui">NORTH STADIUM DR</text>

          {/* Zone A — North */}
          <path d="M78 74 L310 74 L310 170 L78 170 Z" fill={fill("A")} stroke={stroke("A")} strokeWidth={selectedZone === "A" ? 3 : 1.5}
            className="zone-path cursor-pointer" onClick={() => onZoneSelect("A")}
            onMouseEnter={() => setHoveredZone("A")} onMouseLeave={() => setHoveredZone(null)} />
          <text x="194" y="116" fontSize="22" fontWeight="900" fill="rgba(255,255,255,0.9)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">A</text>
          <text x="194" y="134" fontSize="8" fill="rgba(255,255,255,0.85)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">NORTH LOTS</text>

          {/* Tiger Stadium */}
          <rect x="140" y="165" width="115" height="110" rx="8" fill="#002D6D" stroke="#D4A017" strokeWidth="3" />
          <rect x="148" y="173" width="99" height="94" rx="5" fill="#1A4B9E" />
          <rect x="158" y="183" width="79" height="74" rx="3" fill="#2d8a4e" />
          <rect x="165" y="190" width="65" height="60" rx="2" fill="#34a058" />
          {[202, 212, 222, 232, 242].map((y) => (
            <line key={y} x1="165" y1={y} x2="230" y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          ))}
          <rect x="165" y="190" width="65" height="8" rx="1" fill="#2563EB" opacity="0.7" />
          <rect x="165" y="242" width="65" height="8" rx="1" fill="#2563EB" opacity="0.7" />
          <text x="197.5" y="218" fontSize="7.5" fontWeight="bold" fill="#D4A017" textAnchor="middle" fontFamily="system-ui">TIGER</text>
          <text x="197.5" y="228" fontSize="7.5" fontWeight="bold" fill="#D4A017" textAnchor="middle" fontFamily="system-ui">STADIUM</text>

          {/* Zone B — East */}
          <path d="M334 74 L390 74 L390 286 L334 286 Z" fill={fill("B")} stroke={stroke("B")} strokeWidth={selectedZone === "B" ? 3 : 1.5}
            className="zone-path cursor-pointer" onClick={() => onZoneSelect("B")}
            onMouseEnter={() => setHoveredZone("B")} onMouseLeave={() => setHoveredZone(null)} />
          <text x="362" y="178" fontSize="20" fontWeight="900" fill="rgba(0,26,66,0.9)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">B</text>
          <text x="362" y="193" fontSize="7" fill="rgba(0,26,66,0.85)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">EAST LOTS</text>

          {/* Zone C — South */}
          <path d="M78 294 L310 294 L310 350 L78 350 Z" fill={fill("C")} stroke={stroke("C")} strokeWidth={selectedZone === "C" ? 3 : 1.5}
            className="zone-path cursor-pointer" onClick={() => onZoneSelect("C")}
            onMouseEnter={() => setHoveredZone("C")} onMouseLeave={() => setHoveredZone(null)} />
          <text x="194" y="325" fontSize="20" fontWeight="900" fill="rgba(255,255,255,0.95)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">C</text>
          <text x="194" y="340" fontSize="7" fill="rgba(255,255,255,0.85)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">SOUTH LOTS</text>

          {/* Zone D — West/Remote */}
          <path d="M0 74 L58 74 L58 350 L0 350 Z" fill={fill("D")} stroke={stroke("D")} strokeWidth={selectedZone === "D" ? 3 : 1.5}
            className="zone-path cursor-pointer" onClick={() => onZoneSelect("D")}
            onMouseEnter={() => setHoveredZone("D")} onMouseLeave={() => setHoveredZone(null)} />
          <text x="29" y="215" fontSize="18" fontWeight="900" fill="rgba(255,255,255,0.95)" textAnchor="middle" fontFamily="system-ui" pointerEvents="none">D</text>

          {/* Compass */}
          <g transform="translate(370, 330)">
            <circle cx="0" cy="0" r="14" fill="white" opacity="0.9" />
            <text x="0" y="-4" fontSize="8" fontWeight="bold" fill="#002D6D" textAnchor="middle" fontFamily="system-ui">N</text>
            <line x1="0" y1="-11" x2="0" y2="-6" stroke="#002D6D" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Legend buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {Object.values(ZONES).map((zone) => (
            <button key={zone.id} onClick={() => onZoneSelect(zone.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${selectedZone === zone.id ? "shadow-md scale-105" : "opacity-70 hover:opacity-100"}`}
              style={{ backgroundColor: zone.color + (selectedZone === zone.id ? "" : "33"), color: selectedZone === zone.id ? zone.textColor : zone.color, borderColor: selectedZone === zone.id ? zone.color : "transparent" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
              Zone {zone.id}
            </button>
          ))}
        </div>
      </div>

      {/* Zone detail */}
      {selectedZone && (
        <div className="rounded-2xl p-5 border-2 transition-all duration-300"
          style={{ borderColor: ZONES[selectedZone].color, backgroundColor: ZONES[selectedZone].color + "10" }}>
          <h4 className="font-bold text-brand-blue text-lg">{ZONES[selectedZone].name}</h4>
          <p className="text-gray-600 text-sm mt-1">{ZONES[selectedZone].description}</p>
          <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: ZONES[selectedZone].color + "20", color: ZONES[selectedZone].color }}>
            {ZONES[selectedZone].capacity}
          </span>
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Choose your exact drop-off spot:</p>
            <div className="space-y-2">
              {ZONES[selectedZone].spots.map((spot) => {
                const isTaken = takenSpots.includes(spot);
                return (
                  <button key={spot} onClick={() => !isTaken && onSpotSelect(spot)} disabled={isTaken}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      isTaken
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        : selectedSpot === spot
                        ? "border-brand-gold bg-brand-gold/10 text-brand-blue"
                        : "border-gray-200 bg-white text-gray-700 hover:border-brand-gold/50"
                    }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: isTaken ? "#9ca3af" : selectedSpot === spot ? ZONES[selectedZone].color : "#9ca3af" }} />
                        {spot}
                      </div>
                      {isTaken && (
                        <span className="text-xs font-semibold bg-red-100 text-red-500 px-2 py-0.5 rounded-full flex-shrink-0">
                          Booked
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
