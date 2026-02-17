"use client";

import { useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  50 Astrolytics logo variations                                     */
/*  Inspiration:                                                       */
/*  - Astro framework: implied rocket via negative space in A,         */
/*    with flame curve underneath                                      */
/*  - Specno: rocket integrated into a node (circle), the body IS      */
/*    the node with nose cone + fins/exhaust, connection lines          */
/*  Key principle: never draw a literal rocket — let it EMERGE          */
/*  from the shapes that also form the "A" or enclosing mark.          */
/* ------------------------------------------------------------------ */

const P = "#0ea5e9";  // primary-500
const C = "#06b6d4";  // cyan-500
const P4 = "#38bdf8"; // primary-400
const C4 = "#22d3ee"; // cyan-400
const P6 = "#0284c7"; // primary-600
const C6 = "#0891b2"; // cyan-600
const DARK = "#0f172a"; // slate-900

interface LogoVariant {
  name: string;
  description: string;
  category: string;
  svg: React.ReactNode;
  wide?: boolean;
}

const logos: LogoVariant[] = [
  /* ================================================================ */
  /*  CATEGORY A: ASTRO-STYLE — Implied rocket via negative space     */
  /*  The A is formed by two solid shapes with a gap between them     */
  /*  that reads as a rocket. Flame/curve element underneath.         */
  /* ================================================================ */

  {
    name: "Astro Classic",
    category: "Negative Space",
    description: "Dark A-body on top, flame curve below. Rocket implied by the gap between them.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="a1a" x1="60" y1="8" x2="60" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor={P} />
            <stop offset="1" stopColor={P6} />
          </linearGradient>
        </defs>
        {/* Upper A body — two legs converging to a point */}
        <path d="M60 8 L38 70 H48 L60 42 L72 70 H82 Z" fill="url(#a1a)" />
        {/* Flame curve underneath — the gap between this and the A implies the rocket */}
        <path d="M44 78 Q52 68 60 74 Q68 80 76 72" stroke={C4} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M48 86 Q54 78 60 82 Q66 86 72 80" stroke={P4} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
        {/* A crossbar hint */}
        <path d="M48 56 L72 56" stroke={P4} strokeWidth="2" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Flame Tongue",
    category: "Negative Space",
    description: "Solid A-frame with a single organic flame lick rising from beneath into the A's center.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="a2a" x1="60" y1="10" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor={P} />
            <stop offset="1" stopColor={P6} />
          </linearGradient>
        </defs>
        {/* Solid A (no crossbar — the flame IS the crossbar region) */}
        <path d="M60 10 L85 95 H73 L60 55 L47 95 H35 Z" fill="url(#a2a)" />
        {/* Flame tongue rising from below into the A void */}
        <path d="M52 95 Q55 80 60 70 Q65 60 60 50 Q55 60 58 70 Q50 85 48 95 Z" fill={C4} opacity="0.7" />
        <path d="M56 95 Q58 82 60 73 Q62 65 60 55 Q58 65 59 73 Q55 85 53 95 Z" fill="white" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Split Void",
    category: "Negative Space",
    description: "A split into left and right halves with a tapered rocket-shaped void between them.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left half of A */}
        <path d="M56 10 L34 95 H46 L56 62 Z" fill={P} />
        {/* Right half of A */}
        <path d="M64 10 L86 95 H74 L64 62 Z" fill={P} />
        {/* The void between = rocket shape. Flame below. */}
        <path d="M50 95 Q55 85 60 82 Q65 85 70 95" fill={C4} opacity="0.6" />
        <path d="M54 95 Q57 88 60 86 Q63 88 66 95" fill="white" opacity="0.25" />
        {/* Crossbar connecting the halves */}
        <rect x="42" y="68" width="36" height="3" rx="1.5" fill={P4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Wedge Gap",
    category: "Negative Space",
    description: "Thick wedge A with a clean vertical channel cut through center — implied rocket fuselage.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="a4a" x1="60" y1="8" x2="60" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Thick A with vertical channel cut */}
        <path d="M60 8 L88 90 H70 L64 70 V30 L60 8 L56 30 V70 L50 90 H32 Z" fill="url(#a4a)" fillRule="evenodd" />
        {/* Flame licks at base of channel */}
        <path d="M56 90 Q58 82 60 78 Q62 82 64 90" fill={C4} opacity="0.6" />
        <path d="M58 90 Q59 85 60 82 Q61 85 62 90" fill="white" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Nose Cone Gap",
    category: "Negative Space",
    description: "A has a pointed nose cone notch cut from the apex — the missing piece implies a launched rocket.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A with nose cone shaped notch cut from top */}
        <path d="M60 28 L40 95 H52 L58 75 H62 L68 95 H80 Z" fill={P} />
        {/* Detached nose cone floating above = rocket that launched */}
        <path d="M60 6 L55 22 H65 Z" fill={C4} />
        {/* Exhaust trail connecting them */}
        <line x1="60" y1="22" x2="60" y2="28" stroke={C4} strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
        {/* Crossbar */}
        <rect x="49" y="65" width="22" height="3" rx="1.5" fill={DARK} />
        {/* Flame at base */}
        <path d="M52 95 Q56 88 60 85 Q64 88 68 95" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Curved Shell",
    category: "Negative Space",
    description: "Two curved shell halves forming an A with an aerodynamic rocket silhouette between them.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left curved shell */}
        <path d="M60 10 Q45 30 38 60 Q34 80 36 95 H46 Q44 80 48 60 Q52 40 60 28 Z" fill={P} />
        {/* Right curved shell */}
        <path d="M60 10 Q75 30 82 60 Q86 80 84 95 H74 Q76 80 72 60 Q68 40 60 28 Z" fill={P} />
        {/* Crossbar */}
        <rect x="46" y="62" width="28" height="3" rx="1.5" fill={P4} opacity="0.5" />
        {/* Flame below the rocket void */}
        <path d="M50 95 Q55 85 60 80 Q65 85 70 95" fill={C4} opacity="0.6" />
        <path d="M54 95 Q57 88 60 85 Q63 88 66 95" fill={P4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Double Stroke",
    category: "Negative Space",
    description: "Two parallel A outlines with the space between them forming the rocket body.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer A */}
        <path d="M60 8 L88 95 H74 L66 72 H54 L46 95 H32 Z" stroke={P} strokeWidth="3" fill="none" />
        {/* Inner A (smaller) */}
        <path d="M60 24 L78 88 H70 L64 72 H56 L50 88 H42 Z" stroke={P4} strokeWidth="2" fill="none" />
        {/* Flame */}
        <path d="M50 95 Q55 87 60 84 Q65 87 70 95" stroke={C4} strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },

  {
    name: "Inverse Flame",
    category: "Negative Space",
    description: "The A is formed by the FLAME shape — a curving upward form that reads as both fire and letterform.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="a8a" x1="60" y1="8" x2="60" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="0.6" stopColor={P} />
            <stop offset="1" stopColor={C} />
          </linearGradient>
        </defs>
        {/* Flame-A: organic fire shape that also reads as an A */}
        <path d="M60 8 Q50 25 42 50 Q38 65 40 80 Q42 92 48 98 Q52 90 56 78 L60 62 L64 78 Q68 90 72 98 Q78 92 80 80 Q82 65 78 50 Q70 25 60 8 Z" fill="url(#a8a)" />
        {/* Crossbar */}
        <path d="M48 68 Q54 64 60 66 Q66 64 72 68" stroke={DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },

  {
    name: "Tapered Channel",
    category: "Negative Space",
    description: "Bold A with a tapered channel narrowing toward the apex — suggests a rocket ascending.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="a9a" x1="60" y1="10" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor={P} />
            <stop offset="1" stopColor={C6} />
          </linearGradient>
        </defs>
        {/* A with tapered internal channel */}
        <path d="M60 10 L86 95 H72 L66 78 L63 35 L60 10 L57 35 L54 78 L48 95 H34 Z" fill="url(#a9a)" />
        {/* Crossbar bridges */}
        <rect x="50" y="62" width="20" height="3" rx="1.5" fill={DARK} />
        {/* Flame base */}
        <path d="M54 95 L60 85 L66 95" fill={C4} opacity="0.5" />
        <path d="M57 95 L60 88 L63 95" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Exhaust Plume",
    category: "Negative Space",
    description: "Clean A silhouette with a wide expanding exhaust plume beneath — the A IS the rocket.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A silhouette */}
        <path d="M60 8 L82 72 H68 L60 48 L52 72 H38 Z" fill={P} />
        {/* Crossbar */}
        <rect x="48" y="58" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Wide expanding exhaust plume */}
        <path d="M38 72 Q42 82 30 100 Q45 92 60 95 Q75 92 90 100 Q78 82 82 72 Q70 80 60 78 Q50 80 38 72 Z" fill={C4} opacity="0.25" />
        <path d="M45 72 Q48 82 40 95 Q50 88 60 90 Q70 88 80 95 Q72 82 75 72 Q67 78 60 76 Q53 78 45 72 Z" fill={C4} opacity="0.35" />
        <path d="M50 72 Q53 80 50 90 Q55 86 60 87 Q65 86 70 90 Q67 80 70 72 Q65 76 60 75 Q55 76 50 72 Z" fill={P4} opacity="0.4" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY B: SPECNO-STYLE — Rocket integrated into a node/circle */
  /*  The circle IS the rocket body. Nose cone emerges from top,      */
  /*  fins/exhaust from bottom. Node connection lines optional.        */
  /* ================================================================ */

  {
    name: "Node Rocket",
    category: "Node + Rocket",
    description: "Circle node IS the rocket body. Nose cone on top, fins + exhaust below, connection dots.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="b1a" x1="60" y1="15" x2="60" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Nose cone */}
        <path d="M60 12 L52 32 H68 Z" fill={P4} />
        {/* Circle = rocket body = node */}
        <circle cx="60" cy="55" r="25" fill="url(#b1a)" />
        {/* Window */}
        <circle cx="60" cy="48" r="5" fill={DARK} />
        <circle cx="60" cy="48" r="3" fill={P4} opacity="0.3" />
        {/* A crossbar on the body */}
        <rect x="42" y="60" width="36" height="4" rx="2" fill={DARK} />
        {/* Fins */}
        <path d="M35 75 L28 92 L42 78 Z" fill={C} />
        <path d="M85 75 L92 92 L78 78 Z" fill={C} />
        {/* Exhaust */}
        <path d="M52 80 L60 98 L68 80" fill={C4} opacity="0.5" />
        <path d="M56 80 L60 92 L64 80" fill="white" opacity="0.2" />
        {/* Connection dots (node network hint) */}
        <circle cx="20" cy="30" r="3" fill={P4} opacity="0.3" />
        <line x1="20" y1="30" x2="42" y2="42" stroke={P4} strokeWidth="1" opacity="0.2" />
        <circle cx="100" cy="35" r="3" fill={P4} opacity="0.3" />
        <line x1="100" y1="35" x2="78" y2="45" stroke={P4} strokeWidth="1" opacity="0.2" />
        <circle cx="25" cy="95" r="3" fill={C4} opacity="0.3" />
        <line x1="25" y1="95" x2="38" y2="80" stroke={C4} strokeWidth="1" opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Node A-Frame",
    category: "Node + Rocket",
    description: "A-shaped frame with a node circle at the center — the node doubles as the rocket porthole.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A frame */}
        <path d="M60 10 L85 95 H75 L67 72 H53 L45 95 H35 Z" fill={P} />
        {/* Crossbar removed — replaced by node */}
        {/* Central node circle */}
        <circle cx="60" cy="58" r="12" fill={DARK} stroke={C4} strokeWidth="2" />
        <circle cx="60" cy="58" r="6" fill={C4} opacity="0.2" />
        {/* Connection lines from node */}
        <line x1="48" y1="58" x2="20" y2="50" stroke={C4} strokeWidth="1.5" opacity="0.3" />
        <line x1="72" y1="58" x2="100" y2="50" stroke={C4} strokeWidth="1.5" opacity="0.3" />
        <circle cx="20" cy="50" r="3" fill={C4} opacity="0.4" />
        <circle cx="100" cy="50" r="3" fill={C4} opacity="0.4" />
        {/* Flame base */}
        <path d="M45 95 Q52 88 60 85 Q68 88 75 95" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Orbit Node",
    category: "Node + Rocket",
    description: "Rocket-A with a circular node orbit ring — the A sits inside the orbital path.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Orbit ring */}
        <circle cx="60" cy="55" r="42" stroke={P4} strokeWidth="1.5" opacity="0.2" />
        {/* Orbit nodes */}
        <circle cx="18" cy="55" r="4" fill={C4} opacity="0.5" />
        <circle cx="102" cy="55" r="4" fill={C4} opacity="0.5" />
        <circle cx="60" cy="13" r="4" fill={P4} opacity="0.5" />
        {/* A inside */}
        <path d="M60 22 L78 88 H68 L63 72 H57 L52 88 H42 Z" fill={P} />
        {/* Window */}
        <circle cx="60" cy="48" r="4" fill={DARK} />
        {/* Crossbar */}
        <rect x="52" y="60" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M52 88 L60 100 L68 88" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Capsule Node",
    category: "Node + Rocket",
    description: "Capsule/pill shape (elongated node) with the A letterform inside and a nose cone tip.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="b4a" x1="60" y1="5" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Capsule body */}
        <rect x="38" y="20" width="44" height="70" rx="22" fill="url(#b4a)" />
        {/* Nose cone extending from capsule */}
        <path d="M60 5 L50 22 H70 Z" fill={P4} />
        {/* A cutout inside capsule */}
        <path d="M60 30 L72 78 H66 L63 68 H57 L54 78 H48 Z" fill={DARK} />
        <rect x="54" y="58" width="12" height="3" rx="1.5" fill={P} opacity="0.5" />
        {/* Fins */}
        <path d="M38 78 L30 95 L42 85 Z" fill={C} />
        <path d="M82 78 L90 95 L78 85 Z" fill={C} />
        {/* Exhaust */}
        <path d="M48 90 L60 108 L72 90" fill={C4} opacity="0.3" />
        <path d="M52 90 L60 102 L68 90" fill={P4} opacity="0.3" />
        {/* Node connections */}
        <line x1="30" y1="95" x2="15" y2="105" stroke={C4} strokeWidth="1" opacity="0.3" />
        <circle cx="15" cy="105" r="3" fill={C4} opacity="0.3" />
        <line x1="90" y1="95" x2="105" y2="105" stroke={C4} strokeWidth="1" opacity="0.3" />
        <circle cx="105" cy="105" r="3" fill={C4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Network Launch",
    category: "Node + Rocket",
    description: "Three connected nodes form a triangle/A shape — the top node is launching upward like a rocket.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection lines */}
        <line x1="60" y1="25" x2="30" y2="90" stroke={P4} strokeWidth="2" opacity="0.3" />
        <line x1="60" y1="25" x2="90" y2="90" stroke={P4} strokeWidth="2" opacity="0.3" />
        <line x1="30" y1="90" x2="90" y2="90" stroke={P4} strokeWidth="2" opacity="0.3" />
        {/* Bottom nodes */}
        <circle cx="30" cy="90" r="8" fill={P} opacity="0.6" />
        <circle cx="90" cy="90" r="8" fill={P} opacity="0.6" />
        {/* Top node = rocket (larger, with nose cone + exhaust) */}
        <circle cx="60" cy="35" r="12" fill={P} />
        <path d="M60 10 L54 24 H66 Z" fill={C4} />
        {/* Exhaust below top node */}
        <path d="M55 47 L60 58 L65 47" fill={C4} opacity="0.5" />
        <path d="M57 47 L60 54 L63 47" fill="white" opacity="0.2" />
        {/* "A" is implied by the triangle of nodes */}
        {/* Window in top node */}
        <circle cx="60" cy="35" r="4" fill={DARK} />
        <circle cx="60" cy="35" r="2.5" fill={P4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Hex Node",
    category: "Node + Rocket",
    description: "Hexagonal node (tech/molecular feel) with rocket A emerging from the top vertex.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagon */}
        <path d="M60 20 L90 40 L90 75 L60 95 L30 75 L30 40 Z" fill={P} opacity="0.15" stroke={P} strokeWidth="2" />
        {/* Rocket-A inside hex */}
        <path d="M60 15 L78 82 H68 L63 68 H57 L52 82 H42 Z" fill={P} />
        {/* Window */}
        <circle cx="60" cy="42" r="4" fill={DARK} />
        <circle cx="60" cy="42" r="2.5" fill={C4} opacity="0.3" />
        {/* Crossbar */}
        <rect x="52" y="55" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Exhaust */}
        <path d="M52 82 L60 95 L68 82" fill={C4} opacity="0.5" />
        {/* Node connection stubs */}
        <line x1="30" y1="40" x2="15" y2="32" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <circle cx="15" cy="32" r="3" fill={P4} opacity="0.3" />
        <line x1="90" y1="40" x2="105" y2="32" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <circle cx="105" cy="32" r="3" fill={P4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Data Node",
    category: "Node + Rocket",
    description: "Central rocket-A node with radiating data connection lines in all directions.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Radiating connections */}
        {[[15, 25], [105, 20], [10, 70], [110, 75], [25, 105], [95, 108]].map(([x, y], i) => (
          <g key={i}>
            <line x1="60" y1="55" x2={x} y2={y} stroke={P4} strokeWidth="1" opacity="0.15" />
            <circle cx={x} cy={y} r="3" fill={i % 2 === 0 ? P4 : C4} opacity="0.35" />
          </g>
        ))}
        {/* Central glow */}
        <circle cx="60" cy="55" r="28" fill={P} opacity="0.08" />
        {/* A mark */}
        <path d="M60 18 L76 85 H68 L64 72 H56 L52 85 H44 Z" fill={P} />
        <circle cx="60" cy="42" r="4" fill={DARK} />
        <rect x="52" y="58" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M52 85 L60 98 L68 85" fill={C4} opacity="0.5" />
      </svg>
    ),
  },

  {
    name: "Ring Launch",
    category: "Node + Rocket",
    description: "A-rocket launching OUT of a circular ring — breaking through the node boundary.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ring */}
        <circle cx="60" cy="65" r="35" stroke={P} strokeWidth="2.5" opacity="0.4" />
        {/* A breaking out of the ring at top */}
        <path d="M60 8 L78 85 H68 L63 68 H57 L52 85 H42 Z" fill={P} />
        {/* Mask effect — cover ring behind A */}
        <path d="M55 28 L45 65 H75 L65 28 Z" fill={DARK} opacity="0" />
        {/* Window */}
        <circle cx="60" cy="42" r="4" fill={DARK} />
        <circle cx="60" cy="42" r="2.5" fill={C4} opacity="0.3" />
        {/* Crossbar */}
        <rect x="52" y="58" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Exhaust inside ring */}
        <path d="M52 85 L60 100 L68 85" fill={C4} opacity="0.4" />
        {/* Speed lines at top */}
        <line x1="48" y1="18" x2="45" y2="8" stroke={C4} strokeWidth="1" opacity="0.3" />
        <line x1="72" y1="18" x2="75" y2="8" stroke={C4} strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Double Node",
    category: "Node + Rocket",
    description: "Two overlapping circles (Venn/node intersection) with the A-rocket in the overlap zone.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left circle */}
        <circle cx="45" cy="58" r="30" stroke={P} strokeWidth="1.5" fill={P} opacity="0.08" />
        {/* Right circle */}
        <circle cx="75" cy="58" r="30" stroke={C} strokeWidth="1.5" fill={C} opacity="0.08" />
        {/* A in intersection */}
        <path d="M60 18 L74 88 H66 L63 75 H57 L54 88 H46 Z" fill={P} />
        <circle cx="60" cy="42" r="3.5" fill={DARK} />
        <rect x="53" y="58" width="14" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M54 88 L60 100 L66 88" fill={C4} opacity="0.5" />
      </svg>
    ),
  },

  {
    name: "Atom Node",
    category: "Node + Rocket",
    description: "Atom-like: A-rocket as nucleus with electron orbit paths around it.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Electron orbits */}
        <ellipse cx="60" cy="55" rx="50" ry="18" stroke={P4} strokeWidth="1" opacity="0.2" transform="rotate(-30 60 55)" />
        <ellipse cx="60" cy="55" rx="50" ry="18" stroke={C4} strokeWidth="1" opacity="0.2" transform="rotate(30 60 55)" />
        <ellipse cx="60" cy="55" rx="50" ry="18" stroke={P4} strokeWidth="1" opacity="0.15" />
        {/* Electron dots */}
        <circle cx="18" cy="38" r="3" fill={C4} opacity="0.6" />
        <circle cx="102" cy="72" r="3" fill={P4} opacity="0.6" />
        <circle cx="110" cy="55" r="3" fill={C4} opacity="0.5" />
        {/* A nucleus */}
        <path d="M60 18 L76 86 H68 L64 72 H56 L52 86 H44 Z" fill={P} />
        <circle cx="60" cy="42" r="3.5" fill={DARK} />
        <rect x="52" y="58" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M52 86 L60 98 L68 86" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY C: FLAME-INTEGRATED — Exhaust/fire is the key element  */
  /* ================================================================ */

  {
    name: "Three Tongues",
    category: "Flame Integrated",
    description: "Clean A sitting atop three stylized flame tongues that form the base.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A */}
        <path d="M60 8 L82 72 H68 L60 48 L52 72 H38 Z" fill={P} />
        <rect x="47" y="58" width="26" height="3" rx="1.5" fill={DARK} />
        {/* Three flame tongues */}
        <path d="M42 72 Q38 85 42 100 Q46 85 50 72 Z" fill={C4} opacity="0.6" />
        <path d="M54 72 Q52 90 60 105 Q68 90 66 72 Z" fill={P4} opacity="0.7" />
        <path d="M70 72 Q74 85 78 100 Q82 85 78 72 Z" fill={C4} opacity="0.6" />
        {/* Inner bright flames */}
        <path d="M56 72 Q55 88 60 98 Q65 88 64 72 Z" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Gradient Burn",
    category: "Flame Integrated",
    description: "A fades from solid at top to flame-like dissolving gradient at the bottom.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c2a" x1="60" y1="8" x2="60" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor={P} />
            <stop offset="0.6" stopColor={P} />
            <stop offset="0.8" stopColor={C4} />
            <stop offset="1" stopColor={C4} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* A that dissolves into flame at base */}
        <path d="M60 8 L88 105 H72 L64 80 H56 L48 105 H32 Z" fill="url(#c2a)" />
        <rect x="47" y="60" width="26" height="3" rx="1.5" fill={DARK} />
        {/* Window */}
        <circle cx="60" cy="40" r="4" fill={DARK} />
      </svg>
    ),
  },

  {
    name: "Liftoff Base",
    category: "Flame Integrated",
    description: "A hovers above a horizontal platform with flames billowing out sideways.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A hovering */}
        <path d="M60 8 L80 68 H68 L60 45 L52 68 H40 Z" fill={P} />
        <rect x="48" y="55" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Platform */}
        <rect x="30" y="78" width="60" height="3" rx="1.5" fill={P4} opacity="0.3" />
        {/* Sideways flames from platform */}
        <path d="M30 80 Q20 85 15 92 Q22 88 30 86 Z" fill={C4} opacity="0.4" />
        <path d="M90 80 Q100 85 105 92 Q98 88 90 86 Z" fill={C4} opacity="0.4" />
        {/* Center exhaust between A and platform */}
        <path d="M52 68 Q55 72 60 75 Q65 72 68 68" fill={C4} opacity="0.3" />
        <path d="M55 68 Q57 71 60 73 Q63 71 65 68" fill={P4} opacity="0.4" />
        {/* Downward exhaust */}
        <path d="M50 82 Q55 90 60 95 Q65 90 70 82" fill={C4} opacity="0.25" />
        <path d="M54 82 Q57 88 60 92 Q63 88 66 82" fill="white" opacity="0.15" />
      </svg>
    ),
  },

  {
    name: "Ember Particles",
    category: "Flame Integrated",
    description: "A with small ember/spark particles rising around it — suggests liftoff energy.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A */}
        <path d="M60 15 L82 92 H70 L64 75 H56 L50 92 H38 Z" fill={P} />
        <rect x="50" y="62" width="20" height="3" rx="1.5" fill={DARK} />
        {/* Flame base */}
        <path d="M50 92 L60 108 L70 92" fill={C4} opacity="0.5" />
        {/* Ember particles */}
        {[[25, 80, 2], [30, 60, 1.5], [22, 40, 1], [28, 25, 1.5], [92, 75, 2], [95, 50, 1.5], [98, 30, 1], [88, 20, 1.5], [40, 105, 1.5], [80, 108, 1.5], [35, 15, 1], [85, 12, 1]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? C4 : P4} opacity={0.2 + (i % 3) * 0.15} />
        ))}
      </svg>
    ),
  },

  {
    name: "Heat Wave",
    category: "Flame Integrated",
    description: "A with wavy heat distortion lines rising from the base exhaust.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A */}
        <path d="M60 8 L82 75 H68 L60 50 L52 75 H38 Z" fill={P} />
        <rect x="47" y="60" width="26" height="3" rx="1.5" fill={DARK} />
        {/* Exhaust flame */}
        <path d="M48 75 Q54 85 60 82 Q66 85 72 75" fill={C4} opacity="0.3" />
        {/* Heat waves */}
        <path d="M35 88 Q42 84 50 88 Q58 92 65 88 Q72 84 80 88" stroke={P4} strokeWidth="1.5" opacity="0.2" fill="none" />
        <path d="M32 96 Q40 92 48 96 Q56 100 64 96 Q72 92 82 96" stroke={C4} strokeWidth="1.5" opacity="0.15" fill="none" />
        <path d="M28 104 Q38 100 48 104 Q58 108 68 104 Q78 100 88 104" stroke={P4} strokeWidth="1" opacity="0.1" fill="none" />
      </svg>
    ),
  },

  {
    name: "Flame Crossbar",
    category: "Flame Integrated",
    description: "The A's crossbar is replaced by a horizontal flame streak.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A without crossbar */}
        <path d="M60 10 L85 95 H73 L60 52 L47 95 H35 Z" fill={P} />
        {/* Flame crossbar */}
        <path d="M42 65 Q48 58 55 62 Q60 65 65 62 Q72 58 78 65" stroke={C4} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M45 65 Q50 60 57 63 Q60 64 63 63 Q70 60 75 65" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
        {/* Bottom flame */}
        <path d="M47 95 Q52 88 60 84 Q68 88 73 95" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Candle Flame",
    category: "Flame Integrated",
    description: "The top of the A tapers into a single teardrop flame shape — like a candle/rocket tip.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c7a" x1="60" y1="5" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor={C4} />
            <stop offset="0.3" stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* A with flame tip */}
        <path d="M60 5 Q55 15 52 25 L40 95 H52 L58 72 H62 L68 95 H80 L68 25 Q65 15 60 5 Z" fill="url(#c7a)" />
        {/* Inner flame at tip */}
        <path d="M60 5 Q57 12 56 20 L60 15 L64 20 Q63 12 60 5 Z" fill="white" opacity="0.4" />
        {/* Crossbar */}
        <rect x="48" y="60" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Window */}
        <circle cx="60" cy="42" r="4" fill={DARK} />
      </svg>
    ),
  },

  {
    name: "Booster Flame",
    category: "Flame Integrated",
    description: "A with two side booster flames flanking the legs — SpaceX booster aesthetic.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A */}
        <path d="M60 10 L80 85 H68 L60 58 L52 85 H40 Z" fill={P} />
        <rect x="48" y="62" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Left booster flame */}
        <path d="M40 85 Q35 95 38 110 Q42 100 40 85 Z" fill={C4} opacity="0.5" />
        <path d="M40 85 Q37 92 39 102 Q41 95 40 85 Z" fill="white" opacity="0.2" />
        {/* Right booster flame */}
        <path d="M80 85 Q85 95 82 110 Q78 100 80 85 Z" fill={C4} opacity="0.5" />
        <path d="M80 85 Q83 92 81 102 Q79 95 80 85 Z" fill="white" opacity="0.2" />
        {/* Center flame */}
        <path d="M52 85 Q56 95 60 105 Q64 95 68 85 Z" fill={P4} opacity="0.5" />
        <path d="M55 85 Q58 93 60 100 Q62 93 65 85 Z" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY D: ABSTRACT / GEOMETRIC — Minimal, modern marks         */
  /* ================================================================ */

  {
    name: "Triangle Stack",
    category: "Abstract Geometric",
    description: "Stacked triangles: small on top (nose cone) and large below forming the A body.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Small triangle (nose cone) */}
        <path d="M60 8 L52 28 H68 Z" fill={C4} />
        {/* Large triangle (A body) */}
        <path d="M60 32 L35 95 H85 Z" fill={P} />
        {/* Counter space (A hole) */}
        <path d="M60 55 L50 85 H70 Z" fill={DARK} />
        {/* Flame */}
        <path d="M50 95 L60 112 L70 95" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Chevron Lift",
    category: "Abstract Geometric",
    description: "Upward chevron/arrow that reads as both an A and a rocket launching.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Chevron = A = rocket direction */}
        <path d="M60 12 L30 70 H45 L60 42 L75 70 H90 Z" fill={P} />
        {/* Second smaller chevron below = exhaust */}
        <path d="M60 72 L40 100 H50 L60 82 L70 100 H80 Z" fill={C4} opacity="0.4" />
        {/* Third tiny chevron = trailing exhaust */}
        <path d="M60 95 L50 112 H55 L60 102 L65 112 H70 Z" fill={C4} opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Diamond Core",
    category: "Abstract Geometric",
    description: "Diamond/rhombus with an A-shaped negative space — the diamond suggests a rocket cross-section.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="d3a" x1="60" y1="10" x2="60" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Diamond */}
        <path d="M60 10 L100 60 L60 110 L20 60 Z" fill="url(#d3a)" />
        {/* A negative space */}
        <path d="M60 28 L72 75 H66 L63 65 H57 L54 75 H48 Z" fill={DARK} />
        <rect x="54" y="55" width="12" height="3" rx="1.5" fill={P4} opacity="0.3" />
        {/* Flame at bottom point */}
        <path d="M55 95 L60 110 L65 95" fill="white" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Isometric A",
    category: "Abstract Geometric",
    description: "3D isometric A-block with a rocket shadow cast from it.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Front face */}
        <path d="M60 10 L80 90 H70 L65 72 H55 L50 90 H40 Z" fill={P} />
        {/* Right face (lighter) */}
        <path d="M80 90 L90 85 L70 5 L60 10 Z" fill={P4} opacity="0.6" />
        {/* Top face */}
        <path d="M60 10 L70 5 L65 8 L60 10 Z" fill="white" opacity="0.3" />
        {/* Shadow */}
        <ellipse cx="65" cy="95" rx="25" ry="5" fill={P} opacity="0.1" />
        {/* Window on front */}
        <circle cx="60" cy="42" r="4" fill={DARK} />
        {/* Crossbar on front */}
        <rect x="50" y="58" width="20" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M50 90 L60 105 L70 90" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Minimal Arrow",
    category: "Abstract Geometric",
    description: "Ultra-minimal: just an upward arrow/pointer that reads as A + rocket direction.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Arrow / A shape */}
        <path d="M60 12 L40 72 H52 V95 H68 V72 H80 Z" fill={P} />
        {/* Crossbar */}
        <rect x="52" y="60" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame at base */}
        <path d="M52 95 Q56 102 60 108 Q64 102 68 95" fill={C4} opacity="0.5" />
        <path d="M55 95 Q58 100 60 104 Q62 100 65 95" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Pentagon Shield",
    category: "Abstract Geometric",
    description: "Home-plate/pentagon shape with pointed top (like a rocket nose) containing the A.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="d6a" x1="60" y1="5" x2="60" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Pentagon pointed at top */}
        <path d="M60 5 L95 40 L85 100 H35 L25 40 Z" fill="url(#d6a)" opacity="0.2" stroke={P} strokeWidth="2" />
        {/* A inside */}
        <path d="M60 20 L78 88 H68 L64 72 H56 L52 88 H42 Z" fill={P} />
        <circle cx="60" cy="45" r="4" fill={DARK} />
        <rect x="52" y="58" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Exhaust */}
        <path d="M52 88 L60 100 L68 88" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Parallel Lines",
    category: "Abstract Geometric",
    description: "Two angled parallel lines converging upward with a point cap — minimalist A/rocket.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left line */}
        <line x1="60" y1="12" x2="35" y2="95" stroke={P} strokeWidth="6" strokeLinecap="round" />
        {/* Right line */}
        <line x1="60" y1="12" x2="85" y2="95" stroke={P} strokeWidth="6" strokeLinecap="round" />
        {/* Crossbar */}
        <line x1="42" y1="68" x2="78" y2="68" stroke={P4} strokeWidth="3" strokeLinecap="round" />
        {/* Point/tip highlight */}
        <circle cx="60" cy="12" r="4" fill={C4} />
        {/* Flame dots */}
        <circle cx="60" cy="102" r="3" fill={C4} opacity="0.5" />
        <circle cx="54" cy="100" r="2" fill={P4} opacity="0.3" />
        <circle cx="66" cy="100" r="2" fill={P4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Origami Fold",
    category: "Abstract Geometric",
    description: "Folded paper/origami style A with light and shadow faces implying dimensionality.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left face - darker */}
        <path d="M60 10 L38 90 H60 Z" fill={P} />
        {/* Right face - lighter */}
        <path d="M60 10 L82 90 H60 Z" fill={P4} />
        {/* Fold line down center */}
        <line x1="60" y1="10" x2="60" y2="90" stroke="white" strokeWidth="1" opacity="0.3" />
        {/* Counter (A hole) */}
        <path d="M60 42 L52 72 H60 Z" fill={DARK} opacity="0.8" />
        <path d="M60 42 L68 72 H60 Z" fill={DARK} opacity="0.6" />
        {/* Flame */}
        <path d="M48 90 L60 108 L72 90" fill={C4} opacity="0.4" />
        <path d="M52 90 L60 102 L68 90" fill="white" opacity="0.15" />
      </svg>
    ),
  },

  {
    name: "Concentric Triangles",
    category: "Abstract Geometric",
    description: "Nested triangles getting smaller toward center — creates depth illusion of a tunnel/thruster.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outermost */}
        <path d="M60 8 L92 100 H28 Z" stroke={P} strokeWidth="2" opacity="0.2" fill="none" />
        {/* Middle */}
        <path d="M60 22 L82 92 H38 Z" stroke={P4} strokeWidth="2" opacity="0.35" fill="none" />
        {/* Inner */}
        <path d="M60 36 L72 84 H48 Z" fill={P} opacity="0.15" stroke={P} strokeWidth="2" />
        {/* Core */}
        <path d="M60 50 L66 76 H54 Z" fill={P} />
        {/* Flame */}
        <path d="M50 100 L60 115 L70 100" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY E: MOTION / DYNAMIC — Speed, liftoff, movement         */
  /* ================================================================ */

  {
    name: "Speed Lines",
    category: "Motion / Dynamic",
    description: "A with horizontal speed lines on both sides suggesting rapid upward movement.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A */}
        <path d="M60 10 L82 90 H70 L64 72 H56 L50 90 H38 Z" fill={P} />
        <circle cx="60" cy="40" r="3.5" fill={DARK} />
        <rect x="51" y="58" width="18" height="3" rx="1.5" fill={DARK} />
        {/* Speed lines - left */}
        <line x1="8" y1="45" x2="30" y2="45" stroke={C4} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1="12" y1="55" x2="28" y2="55" stroke={P4} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
        <line x1="15" y1="65" x2="32" y2="65" stroke={C4} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        {/* Speed lines - right */}
        <line x1="90" y1="45" x2="112" y2="45" stroke={C4} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1="92" y1="55" x2="108" y2="55" stroke={P4} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
        <line x1="88" y1="65" x2="105" y2="65" stroke={C4} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        {/* Flame */}
        <path d="M50 90 L60 108 L70 90" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Tilt Launch",
    category: "Motion / Dynamic",
    description: "A tilted at an angle as if mid-launch — dynamic diagonal composition.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-15 60 60)">
          {/* A */}
          <path d="M60 12 L80 88 H70 L65 72 H55 L50 88 H40 Z" fill={P} />
          <circle cx="60" cy="40" r="3.5" fill={DARK} />
          <rect x="52" y="58" width="16" height="3" rx="1.5" fill={DARK} />
          {/* Flame */}
          <path d="M50 88 L60 105 L70 88" fill={C4} opacity="0.5" />
        </g>
        {/* Curved exhaust trail */}
        <path d="M70 100 Q80 102 88 108 Q92 112 95 115" stroke={C4} strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none" />
        <path d="M72 95 Q82 98 90 105" stroke={P4} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none" />
      </svg>
    ),
  },

  {
    name: "Atmosphere Break",
    category: "Motion / Dynamic",
    description: "A-rocket breaking through an arc (atmosphere) — half above, half below the line.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Atmosphere arc */}
        <path d="M15 62 Q60 42 105 62" stroke={P4} strokeWidth="2" opacity="0.25" fill="none" />
        <path d="M10 68 Q60 48 110 68" stroke={C4} strokeWidth="1.5" opacity="0.15" fill="none" />
        {/* A breaking through */}
        <path d="M60 8 L80 88 H70 L65 72 H55 L50 88 H40 Z" fill={P} />
        <circle cx="60" cy="38" r="3.5" fill={DARK} />
        <rect x="52" y="55" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame below arc */}
        <path d="M50 88 L60 105 L70 88" fill={C4} opacity="0.4" />
        {/* Sparkle at breakthrough point */}
        <circle cx="45" cy="52" r="2" fill="white" opacity="0.4" />
        <circle cx="75" cy="52" r="2" fill="white" opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Swoosh Trail",
    category: "Motion / Dynamic",
    description: "A with a long curved swoosh trail extending behind it — motion path.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Swoosh trail */}
        <path d="M10 100 Q25 95 40 85 Q55 70 60 50" stroke={C4} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.3" />
        <path d="M15 105 Q30 98 45 88 Q58 75 62 55" stroke={P4} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.2" />
        {/* A at the end of the trail */}
        <path d="M60 10 L78 82 H70 L65 68 H55 L50 82 H42 Z" fill={P} />
        <circle cx="60" cy="38" r="3" fill={DARK} />
        <rect x="52" y="55" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Small flame */}
        <path d="M50 82 L60 92 L70 82" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Starburst",
    category: "Motion / Dynamic",
    description: "A with a starburst/ignition flash at the tip — the moment of launch.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Starburst at tip */}
        <line x1="60" y1="5" x2="60" y2="0" stroke={C4} strokeWidth="1.5" opacity="0.4" />
        <line x1="60" y1="5" x2="52" y2="0" stroke={P4} strokeWidth="1" opacity="0.3" />
        <line x1="60" y1="5" x2="68" y2="0" stroke={P4} strokeWidth="1" opacity="0.3" />
        <line x1="60" y1="5" x2="50" y2="6" stroke={C4} strokeWidth="1" opacity="0.2" />
        <line x1="60" y1="5" x2="70" y2="6" stroke={C4} strokeWidth="1" opacity="0.2" />
        <circle cx="60" cy="8" r="4" fill={C4} opacity="0.3" />
        <circle cx="60" cy="8" r="2" fill="white" opacity="0.4" />
        {/* A */}
        <path d="M60 12 L82 92 H70 L64 75 H56 L50 92 H38 Z" fill={P} />
        <circle cx="60" cy="42" r="3.5" fill={DARK} />
        <rect x="51" y="58" width="18" height="3" rx="1.5" fill={DARK} />
        {/* Exhaust */}
        <path d="M50 92 L60 108 L70 92" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Ghost Trail",
    category: "Motion / Dynamic",
    description: "Multiple fading copies of the A stacked behind it suggesting upward motion blur.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ghost copies (progressively more faded, shifted down) */}
        <path d="M60 36 L76 92 H68 L64 78 H56 L52 92 H44 Z" fill={P} opacity="0.07" />
        <path d="M60 28 L76 88 H68 L64 75 H56 L52 88 H44 Z" fill={P} opacity="0.12" />
        <path d="M60 20 L76 84 H68 L64 72 H56 L52 84 H44 Z" fill={P} opacity="0.2" />
        {/* Main A */}
        <path d="M60 10 L78 82 H68 L64 68 H56 L52 82 H42 Z" fill={P} />
        <circle cx="60" cy="38" r="3" fill={DARK} />
        <rect x="52" y="55" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M52 82 L60 95 L68 82" fill={C4} opacity="0.5" />
      </svg>
    ),
  },

  {
    name: "Orbit Sling",
    category: "Motion / Dynamic",
    description: "A-rocket slingshotting around a gravitational body (small circle) with a curved trajectory.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gravitational body */}
        <circle cx="85" cy="85" r="8" fill={C} opacity="0.2" stroke={C4} strokeWidth="1" />
        {/* Slingshot trajectory */}
        <path d="M100 105 Q90 85 85 75 Q75 55 60 30" stroke={C4} strokeWidth="1.5" opacity="0.25" fill="none" strokeDasharray="4 3" />
        {/* A */}
        <path d="M60 10 L76 78 H68 L64 65 H56 L52 78 H44 Z" fill={P} />
        <circle cx="60" cy="36" r="3" fill={DARK} />
        <rect x="52" y="52" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M52 78 L60 90 L68 78" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY F: WORDMARK / COMBINED — Full brand treatments          */
  /* ================================================================ */

  {
    name: "Wordmark Negative",
    category: "Wordmark",
    description: "Full 'Astrolytics' wordmark where the A uses the Astro-style negative space rocket.",
    wide: true,
    svg: (
      <svg viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A with implied rocket (Astro-style) */}
        <path d="M28 8 L12 58 H20 L28 35 L36 58 H44 Z" fill={P} />
        <path d="M20 62 Q24 56 28 60 Q32 64 36 58" stroke={C4} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* "strolytics" */}
        <text x="52" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="38" fontWeight="700" fill="white">strolytics</text>
      </svg>
    ),
  },

  {
    name: "Wordmark Node",
    category: "Wordmark",
    description: "Full wordmark with the A as a Specno-style node rocket — circle body with nose cone.",
    wide: true,
    svg: (
      <svg viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Node A */}
        <circle cx="28" cy="42" r="16" fill={P} />
        <path d="M28 12 L22 28 H34 Z" fill={C4} />
        <path d="M22 58 L28 68 L34 58" fill={C4} opacity="0.5" />
        {/* A inside node */}
        <path d="M28 28 L34 55 H31 L29 50 H27 L25 55 H22 Z" fill={DARK} />
        {/* Connection lines */}
        <line x1="12" y1="42" x2="4" y2="42" stroke={P4} strokeWidth="1" opacity="0.3" />
        <circle cx="4" cy="42" r="2" fill={P4} opacity="0.3" />
        {/* "strolytics" */}
        <text x="52" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="38" fontWeight="700" fill="white">strolytics</text>
      </svg>
    ),
  },

  {
    name: "Wordmark Flame Split",
    category: "Wordmark",
    description: "Split A with flame between the halves, flowing into the text.",
    wide: true,
    svg: (
      <svg viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left half A */}
        <path d="M26 8 L12 58 H20 L26 38 Z" fill={P} />
        {/* Right half A */}
        <path d="M30 8 L44 58 H36 L30 38 Z" fill={P} />
        {/* Flame in gap */}
        <path d="M22 58 Q25 50 28 48 Q31 50 34 58" fill={C4} opacity="0.6" />
        <path d="M24 58 Q27 52 28 50 Q29 52 32 58" fill="white" opacity="0.2" />
        {/* Crossbar */}
        <rect x="18" y="42" width="20" height="2" rx="1" fill={P4} opacity="0.3" />
        {/* "strolytics" */}
        <text x="52" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="38" fontWeight="700" fill="white">strolytics</text>
      </svg>
    ),
  },

  {
    name: "Stacked Badge",
    category: "Wordmark",
    description: "Icon on top, 'ASTROLYTICS' text below in a stacked badge arrangement.",
    svg: (
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Icon — negative space A */}
        <path d="M60 8 L38 65 H48 L60 38 L72 65 H82 Z" fill={P} />
        <path d="M44 70 Q52 62 60 66 Q68 70 76 64" stroke={C4} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Divider */}
        <line x1="25" y1="82" x2="95" y2="82" stroke={P4} strokeWidth="1" opacity="0.2" />
        {/* Text */}
        <text x="60" y="100" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fontWeight="700" fill="white" letterSpacing="3">ASTROLYTICS</text>
        {/* Subtitle */}
        <text x="60" y="116" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="400" fill={P4} opacity="0.5" letterSpacing="2">PRODUCT ANALYTICS</text>
      </svg>
    ),
  },

  {
    name: "Rounded Badge",
    category: "Wordmark",
    description: "Rocket-A mark inside a rounded rectangle/pill badge shape.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pill badge */}
        <rect x="15" y="15" width="90" height="90" rx="20" fill={P} opacity="0.1" stroke={P} strokeWidth="2" />
        {/* A inside */}
        <path d="M60 25 L78 88 H68 L64 74 H56 L52 88 H42 Z" fill={P} />
        <circle cx="60" cy="48" r="4" fill={DARK} />
        <rect x="52" y="60" width="16" height="3" rx="1.5" fill={DARK} />
        {/* Flame */}
        <path d="M52 88 Q56 82 60 78 Q64 82 68 88" fill={C4} opacity="0.5" />
        {/* Flame below badge */}
        <path d="M48 105 L60 115 L72 105" fill={C4} opacity="0.2" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY G: HYBRID / EXPERIMENTAL — Unique conceptual mixes      */
  /* ================================================================ */

  {
    name: "DNA Helix A",
    category: "Hybrid",
    description: "The two A strokes twist around each other like DNA — suggests data + rocket trajectory.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left strand */}
        <path d="M60 10 Q48 30 55 50 Q62 70 50 90" stroke={P} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Right strand */}
        <path d="M60 10 Q72 30 65 50 Q58 70 70 90" stroke={C} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Cross rungs */}
        <line x1="52" y1="30" x2="68" y2="30" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <line x1="56" y1="50" x2="64" y2="50" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <line x1="52" y1="70" x2="68" y2="70" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        {/* Flame */}
        <path d="M50 90 L60 108 L70 90" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Constellation A",
    category: "Hybrid",
    description: "A formed by connected star points like a constellation — the top star is brightest (rocket tip).",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Constellation lines */}
        <line x1="60" y1="12" x2="38" y2="90" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <line x1="60" y1="12" x2="82" y2="90" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <line x1="45" y1="62" x2="75" y2="62" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <line x1="38" y1="90" x2="82" y2="90" stroke={P4} strokeWidth="1" opacity="0.15" />
        {/* Star points */}
        <circle cx="60" cy="12" r="5" fill={C4} />
        <circle cx="60" cy="12" r="8" fill={C4} opacity="0.15" />
        <circle cx="38" cy="90" r="3.5" fill={P} />
        <circle cx="82" cy="90" r="3.5" fill={P} />
        <circle cx="45" cy="62" r="3" fill={P4} opacity="0.7" />
        <circle cx="75" cy="62" r="3" fill={P4} opacity="0.7" />
        {/* Flame dot below */}
        <circle cx="60" cy="100" r="3" fill={C4} opacity="0.4" />
        <circle cx="60" cy="100" r="6" fill={C4} opacity="0.1" />
      </svg>
    ),
  },

  {
    name: "Warp Tunnel",
    category: "Hybrid",
    description: "Concentric circles converging to the tip of the A — warp speed tunnel effect.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Concentric circles converging to tip */}
        <ellipse cx="60" cy="60" rx="50" ry="50" stroke={P4} strokeWidth="1" opacity="0.08" />
        <ellipse cx="60" cy="55" rx="38" ry="38" stroke={P4} strokeWidth="1" opacity="0.12" />
        <ellipse cx="60" cy="48" rx="26" ry="26" stroke={P4} strokeWidth="1" opacity="0.18" />
        <ellipse cx="60" cy="40" rx="14" ry="14" stroke={P4} strokeWidth="1" opacity="0.25" />
        {/* A */}
        <path d="M60 10 L80 90 H68 L60 62 L52 90 H40 Z" fill={P} />
        <rect x="48" y="68" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Tip glow */}
        <circle cx="60" cy="10" r="4" fill={C4} opacity="0.4" />
        {/* Flame */}
        <path d="M48 90 L60 105 L72 90" fill={C4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Circuit A",
    category: "Hybrid",
    description: "A shape formed by circuit board traces with solder point nodes at the joints.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circuit traces forming A */}
        <path d="M60 12 L40 90" stroke={P} strokeWidth="3" strokeLinecap="round" />
        <path d="M60 12 L80 90" stroke={P} strokeWidth="3" strokeLinecap="round" />
        <path d="M47 62 H73" stroke={P} strokeWidth="3" strokeLinecap="round" />
        {/* Solder joints */}
        <circle cx="60" cy="12" r="4" fill={C4} />
        <circle cx="40" cy="90" r="3.5" fill={P4} />
        <circle cx="80" cy="90" r="3.5" fill={P4} />
        <circle cx="47" cy="62" r="3" fill={P} />
        <circle cx="73" cy="62" r="3" fill={P} />
        {/* Branch traces */}
        <path d="M40 90 H25" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <path d="M80 90 H95" stroke={P4} strokeWidth="1.5" opacity="0.3" />
        <path d="M47 62 L35 50" stroke={P4} strokeWidth="1.5" opacity="0.2" />
        <circle cx="25" cy="90" r="2" fill={C4} opacity="0.3" />
        <circle cx="95" cy="90" r="2" fill={C4} opacity="0.3" />
        {/* Flame */}
        <path d="M50 95 L60 108 L70 95" fill={C4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Wave Launch",
    category: "Hybrid",
    description: "A solid A with data/signal wave patterns flowing upward through it.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="hw1">
            <path d="M60 10 L85 95 H35 Z" />
          </clipPath>
        </defs>
        {/* A */}
        <path d="M60 10 L82 90 H70 L65 75 H55 L50 90 H38 Z" fill={P} />
        {/* Wave patterns clipped to A shape */}
        <g clipPath="url(#hw1)" opacity="0.3">
          <path d="M30 30 Q45 25 60 30 Q75 35 90 30" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M30 42 Q45 37 60 42 Q75 47 90 42" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M30 54 Q45 49 60 54 Q75 59 90 54" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M30 66 Q45 61 60 66 Q75 71 90 66" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M30 78 Q45 73 60 78 Q75 83 90 78" stroke="white" strokeWidth="1.5" fill="none" />
        </g>
        {/* Counter */}
        <path d="M60 42 L53 75 H67 Z" fill={DARK} />
        {/* Flame */}
        <path d="M50 90 L60 105 L70 90" fill={C4} opacity="0.4" />
      </svg>
    ),
  },

  {
    name: "Launchpad",
    category: "Hybrid",
    description: "A sitting on a detailed launchpad base — horizontal line with support structures.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* A */}
        <path d="M60 8 L78 72 H68 L60 48 L52 72 H42 Z" fill={P} />
        <rect x="48" y="58" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Support structure / gantry */}
        <line x1="38" y1="72" x2="38" y2="85" stroke={P4} strokeWidth="2" opacity="0.3" />
        <line x1="82" y1="72" x2="82" y2="85" stroke={P4} strokeWidth="2" opacity="0.3" />
        {/* Launchpad */}
        <rect x="25" y="85" width="70" height="4" rx="2" fill={P} opacity="0.3" />
        {/* Exhaust below pad */}
        <path d="M45 89 Q50 95 48 105 Q55 98 60 102 Q65 98 72 105 Q70 95 75 89" fill={C4} opacity="0.25" />
        <path d="M50 89 Q54 95 52 102 Q56 97 60 100 Q64 97 68 102 Q66 95 70 89" fill={P4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Neon Glow",
    category: "Hybrid",
    description: "The A has a neon-tube glow effect — bright stroke with soft outer glow.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer glow */}
        <path d="M60 15 L82 90 H70 L64 75 H56 L50 90 H38 Z" stroke={P} strokeWidth="8" opacity="0.1" strokeLinejoin="round" />
        <path d="M60 15 L82 90 H70 L64 75 H56 L50 90 H38 Z" stroke={P4} strokeWidth="5" opacity="0.2" strokeLinejoin="round" />
        {/* Bright tube */}
        <path d="M60 15 L82 90 H70 L64 75 H56 L50 90 H38 Z" stroke={C4} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Crossbar glow */}
        <line x1="50" y1="65" x2="70" y2="65" stroke={P} strokeWidth="5" opacity="0.1" strokeLinecap="round" />
        <line x1="50" y1="65" x2="70" y2="65" stroke={C4} strokeWidth="2" strokeLinecap="round" />
        {/* Flame glow */}
        <path d="M50 90 L60 105 L70 90" stroke={C4} strokeWidth="2" opacity="0.5" fill={C4} fillOpacity="0.1" strokeLinejoin="round" />
      </svg>
    ),
  },

  {
    name: "Gradient Morph",
    category: "Hybrid",
    description: "The A shape morphs between sharp rocket at top and soft/rounded at the base.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="h8a" x1="60" y1="8" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor={C4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Morphing A: sharp point at top, rounded bottom */}
        <path d="M60 8 L42 70 Q38 85 42 92 Q48 98 56 95 L60 78 L64 95 Q72 98 78 92 Q82 85 78 70 Z" fill="url(#h8a)" />
        {/* Crossbar */}
        <rect x="48" y="62" width="24" height="3" rx="1.5" fill={DARK} />
        {/* Window */}
        <circle cx="60" cy="38" r="4" fill={DARK} />
        <circle cx="60" cy="38" r="2.5" fill={C4} opacity="0.3" />
        {/* Exhaust */}
        <path d="M52 95 L60 110 L68 95" fill={C4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Split Gradient",
    category: "Hybrid",
    description: "A split down the center — left primary, right cyan — creating a two-tone rocket.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left half */}
        <path d="M60 10 L38 92 H50 L58 68 V42 L60 10 Z" fill={P} />
        {/* Right half */}
        <path d="M60 10 L82 92 H70 L62 68 V42 L60 10 Z" fill={C} />
        {/* Center line subtle */}
        <line x1="60" y1="25" x2="60" y2="68" stroke="white" strokeWidth="0.5" opacity="0.3" />
        {/* Counter hole */}
        <path d="M58 68 L52 88 H60 Z" fill={DARK} />
        <path d="M62 68 L68 88 H60 Z" fill={DARK} />
        {/* Flame */}
        <path d="M50 92 Q55 85 60 82 Q65 85 70 92" fill={C4} opacity="0.5" />
        <path d="M54 92 Q57 87 60 85 Q63 87 66 92" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  /* ================================================================ */
  /*  CATEGORY H: CURVED / ORGANIC — Soft bezier curves, rounded      */
  /*  rocket-A shells. Inspired by #29 (stacked layers) and #56       */
  /*  (neon glow). All paths use Q/C curves instead of straight lines */
  /* ================================================================ */

  {
    name: "Curved Shell Stack",
    category: "Curved / Organic",
    description: "Two stacked curved shells — rounded nose cone on top, bulging body below with organic counter.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rounded nose cone */}
        <path d="M60 6 Q52 16 50 26 Q55 28 60 28 Q65 28 70 26 Q68 16 60 6 Z" fill={C4} />
        {/* Curved body */}
        <path d="M48 32 Q38 55 36 80 Q35 92 42 98 H78 Q85 92 84 80 Q82 55 72 32 Q66 30 60 30 Q54 30 48 32 Z" fill={P} />
        {/* Organic counter hole */}
        <path d="M60 52 Q53 65 52 80 Q56 86 60 86 Q64 86 68 80 Q67 65 60 52 Z" fill={DARK} />
        {/* Flame */}
        <path d="M48 98 Q52 92 56 90 Q60 95 60 105 Q60 95 64 90 Q68 92 72 98" fill={C4} opacity="0.4" />
        <path d="M53 98 Q57 94 60 100 Q63 94 67 98" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Neon Curves",
    category: "Curved / Organic",
    description: "Neon glow A but with fully curved/rounded strokes — no straight edges anywhere.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer glow */}
        <path d="M60 12 Q42 50 38 80 Q36 95 45 98 Q52 100 58 88 Q60 82 62 88 Q68 100 75 98 Q84 95 82 80 Q78 50 60 12 Z" stroke={P} strokeWidth="8" opacity="0.08" fill="none" />
        <path d="M60 12 Q42 50 38 80 Q36 95 45 98 Q52 100 58 88 Q60 82 62 88 Q68 100 75 98 Q84 95 82 80 Q78 50 60 12 Z" stroke={P4} strokeWidth="5" opacity="0.15" fill="none" />
        {/* Bright tube */}
        <path d="M60 12 Q42 50 38 80 Q36 95 45 98 Q52 100 58 88 Q60 82 62 88 Q68 100 75 98 Q84 95 82 80 Q78 50 60 12 Z" stroke={C4} strokeWidth="2.5" fill="none" />
        {/* Curved crossbar glow */}
        <path d="M44 68 Q52 62 60 65 Q68 62 76 68" stroke={P} strokeWidth="5" opacity="0.08" fill="none" strokeLinecap="round" />
        <path d="M44 68 Q52 62 60 65 Q68 62 76 68" stroke={C4} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Flame glow */}
        <path d="M48 100 Q54 95 60 108 Q66 95 72 100" stroke={C4} strokeWidth="2" opacity="0.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    name: "Bulb Rocket",
    category: "Curved / Organic",
    description: "Teardrop/lightbulb shape — rounded bulb at bottom, tapered point at top. A implied by counter.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cr3" x1="60" y1="8" x2="60" y2="98" gradientUnits="userSpaceOnUse">
            <stop stopColor={C4} />
            <stop offset="0.4" stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Teardrop body */}
        <path d="M60 8 Q48 28 42 52 Q36 76 40 88 Q44 98 60 98 Q76 98 80 88 Q84 76 78 52 Q72 28 60 8 Z" fill="url(#cr3)" />
        {/* Organic A counter */}
        <path d="M60 42 Q54 58 52 74 Q56 82 60 82 Q64 82 68 74 Q66 58 60 42 Z" fill={DARK} />
        {/* Curved crossbar */}
        <path d="M46 66 Q53 62 60 64 Q67 62 74 66" stroke={DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Flame tendrils */}
        <path d="M50 98 Q54 92 58 90 Q60 98 60 108" stroke={C4} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M70 98 Q66 92 62 90 Q60 98 60 108" stroke={C4} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M60 98 Q60 102 60 108" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Soft Layers",
    category: "Curved / Organic",
    description: "Three stacked rounded layers — top cap, middle body, bottom base — with soft gaps between.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top layer — rounded nose */}
        <path d="M60 8 Q50 18 48 28 Q54 32 60 32 Q66 32 72 28 Q70 18 60 8 Z" fill={C4} />
        {/* Middle layer — wide body */}
        <path d="M46 36 Q40 52 38 68 Q48 72 60 72 Q72 72 82 68 Q80 52 74 36 Q67 34 60 34 Q53 34 46 36 Z" fill={P} />
        {/* Bottom layer — base */}
        <path d="M42 76 Q38 86 40 94 Q50 98 60 98 Q70 98 80 94 Q82 86 78 76 Q69 74 60 74 Q51 74 42 76 Z" fill={P6} />
        {/* A counter in middle */}
        <path d="M60 46 Q55 54 54 64 Q57 68 60 68 Q63 68 66 64 Q65 54 60 46 Z" fill={DARK} />
        {/* Flame */}
        <path d="M52 98 Q56 94 60 92 Q64 94 68 98 Q64 102 60 110 Q56 102 52 98 Z" fill={C4} opacity="0.5" />
      </svg>
    ),
  },

  {
    name: "Balloon A",
    category: "Curved / Organic",
    description: "Hot air balloon silhouette — curved envelope top, basket/fins at bottom. A crossbar is the basket line.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cr5" x1="60" y1="5" x2="60" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Balloon envelope */}
        <path d="M60 5 Q35 15 30 45 Q28 65 40 78 Q50 82 60 80 Q70 82 80 78 Q92 65 90 45 Q85 15 60 5 Z" fill="url(#cr5)" />
        {/* A counter */}
        <path d="M60 28 Q52 42 50 58 Q55 65 60 65 Q65 65 70 58 Q68 42 60 28 Z" fill={DARK} />
        {/* Basket lines */}
        <line x1="44" y1="80" x2="48" y2="92" stroke={P4} strokeWidth="1.5" opacity="0.4" />
        <line x1="76" y1="80" x2="72" y2="92" stroke={P4} strokeWidth="1.5" opacity="0.4" />
        {/* Basket */}
        <path d="M46 92 Q53 95 60 94 Q67 95 74 92" stroke={P} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Flame inside (burner) */}
        <path d="M56 78 Q58 72 60 70 Q62 72 64 78" fill={C4} opacity="0.5" />
        <path d="M58 78 Q59 74 60 72 Q61 74 62 78" fill="white" opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Aero Shell",
    category: "Curved / Organic",
    description: "Aerodynamic rocket shell — perfectly smooth curves, wind-tunnel tested silhouette with A counter.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cr6" x1="60" y1="5" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.8" />
            <stop offset="0.15" stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Smooth aero body */}
        <path d="M60 5 Q52 18 46 38 Q40 58 38 75 Q37 85 42 90 L48 92 Q54 94 60 94 Q66 94 72 92 L78 90 Q83 85 82 75 Q80 58 74 38 Q68 18 60 5 Z" fill="url(#cr6)" />
        {/* Smooth A counter */}
        <path d="M60 35 Q54 50 52 68 Q56 76 60 76 Q64 76 68 68 Q66 50 60 35 Z" fill={DARK} />
        {/* Subtle panel line */}
        <path d="M46 58 Q53 54 60 56 Q67 54 74 58" stroke="white" strokeWidth="1" opacity="0.15" fill="none" />
        {/* Curved fins */}
        <path d="M38 82 Q32 90 30 100 Q35 96 40 90" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M82 82 Q88 90 90 100 Q85 96 80 90" stroke={C} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Flame */}
        <path d="M52 94 Q56 90 60 88 Q64 90 68 94 Q64 100 60 110 Q56 100 52 94 Z" fill={C4} opacity="0.5" />
        <path d="M56 94 Q58 92 60 90 Q62 92 64 94 Q62 98 60 104 Q58 98 56 94 Z" fill="white" opacity="0.2" />
      </svg>
    ),
  },

  {
    name: "Glow Pod",
    category: "Curved / Organic",
    description: "Rounded pod with neon glow outline — soft capsule shape, A revealed by glowing crossbar and counter.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pod shape - glow layers */}
        <path d="M60 10 Q44 25 40 50 Q38 72 42 88 Q48 96 60 96 Q72 96 78 88 Q82 72 80 50 Q76 25 60 10 Z" stroke={P} strokeWidth="7" opacity="0.06" fill="none" />
        <path d="M60 10 Q44 25 40 50 Q38 72 42 88 Q48 96 60 96 Q72 96 78 88 Q82 72 80 50 Q76 25 60 10 Z" stroke={P4} strokeWidth="4" opacity="0.12" fill="none" />
        <path d="M60 10 Q44 25 40 50 Q38 72 42 88 Q48 96 60 96 Q72 96 78 88 Q82 72 80 50 Q76 25 60 10 Z" stroke={C4} strokeWidth="2" fill="none" />
        {/* Glowing crossbar */}
        <path d="M45 62 Q52 57 60 59 Q68 57 75 62" stroke={P} strokeWidth="4" opacity="0.08" fill="none" strokeLinecap="round" />
        <path d="M45 62 Q52 57 60 59 Q68 57 75 62" stroke={C4} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Counter glow */}
        <path d="M60 35 Q54 48 52 62" stroke={C4} strokeWidth="1" opacity="0.3" fill="none" />
        <path d="M60 35 Q66 48 68 62" stroke={C4} strokeWidth="1" opacity="0.3" fill="none" />
        {/* Tip glow */}
        <circle cx="60" cy="10" r="3" fill={C4} opacity="0.4" />
        <circle cx="60" cy="10" r="6" fill={C4} opacity="0.1" />
        {/* Flame */}
        <path d="M52 96 Q56 92 60 90 Q64 92 68 96 Q64 102 60 112 Q56 102 52 96" stroke={C4} strokeWidth="1.5" opacity="0.4" fill={C4} fillOpacity="0.08" />
      </svg>
    ),
  },

  {
    name: "Wave Form",
    category: "Curved / Organic",
    description: "Two sinuous wave-shaped strokes converging to a point — the A legs are flowing curves.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cr8" x1="60" y1="8" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor={C4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Left wave leg */}
        <path d="M60 8 Q50 25 48 42 Q46 58 42 72 Q38 86 36 95" stroke="url(#cr8)" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Right wave leg */}
        <path d="M60 8 Q70 25 72 42 Q74 58 78 72 Q82 86 84 95" stroke="url(#cr8)" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Curved crossbar */}
        <path d="M44 65 Q52 60 60 62 Q68 60 76 65" stroke={P4} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Tip glow */}
        <circle cx="60" cy="8" r="3" fill={C4} opacity="0.5" />
        <circle cx="60" cy="8" r="6" fill={C4} opacity="0.15" />
        {/* Flame */}
        <path d="M48 95 Q54 90 60 88 Q66 90 72 95 Q66 100 60 110 Q54 100 48 95 Z" fill={C4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Pebble Stack",
    category: "Curved / Organic",
    description: "Three stacked pebble/pill shapes — rounded nose, body, and exhaust — with soft neon outlines.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top pebble (nose) — with glow */}
        <ellipse cx="60" cy="18" rx="10" ry="12" stroke={P} strokeWidth="5" opacity="0.06" fill="none" />
        <ellipse cx="60" cy="18" rx="10" ry="12" stroke={C4} strokeWidth="2" fill="none" />
        <ellipse cx="60" cy="18" rx="10" ry="12" fill={C4} opacity="0.08" />
        {/* Middle pebble (body) — larger, with glow */}
        <ellipse cx="60" cy="52" rx="22" ry="20" stroke={P} strokeWidth="6" opacity="0.06" fill="none" />
        <ellipse cx="60" cy="52" rx="22" ry="20" stroke={P4} strokeWidth="3" opacity="0.12" fill="none" />
        <ellipse cx="60" cy="52" rx="22" ry="20" stroke={C4} strokeWidth="1.5" fill="none" />
        <ellipse cx="60" cy="52" rx="22" ry="20" fill={P} opacity="0.08" />
        {/* A counter inside body */}
        <ellipse cx="60" cy="54" rx="8" ry="7" fill={DARK} />
        {/* Crossbar through body */}
        <path d="M42 52 Q51 48 60 50 Q69 48 78 52" stroke={C4} strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* Bottom pebble (exhaust) */}
        <ellipse cx="60" cy="84" rx="14" ry="10" stroke={C4} strokeWidth="1.5" opacity="0.5" fill={C4} fillOpacity="0.05" />
        {/* Flame */}
        <path d="M52 90 Q56 88 60 86 Q64 88 68 90 Q64 96 60 106 Q56 96 52 90 Z" fill={C4} opacity="0.3" />
      </svg>
    ),
  },

  {
    name: "Organic Bloom",
    category: "Curved / Organic",
    description: "Flower/bloom shape — rounded petals forming an A with a soft glowing center and trailing stem.",
    svg: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cr10" x1="60" y1="5" x2="60" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor={C4} />
            <stop offset="0.5" stopColor={P4} />
            <stop offset="1" stopColor={P} />
          </linearGradient>
        </defs>
        {/* Main organic A body — bulging curves */}
        <path d="M60 5 Q48 20 44 40 Q40 55 38 68 Q36 82 44 90 Q50 95 56 88 L60 72 L64 88 Q70 95 76 90 Q84 82 82 68 Q80 55 76 40 Q72 20 60 5 Z" fill="url(#cr10)" />
        {/* Soft counter hole */}
        <path d="M60 35 Q55 48 53 60 Q56 68 60 68 Q64 68 67 60 Q65 48 60 35 Z" fill={DARK} />
        {/* Glowing center dot */}
        <circle cx="60" cy="50" r="4" fill={C4} opacity="0.2" />
        <circle cx="60" cy="50" r="2" fill="white" opacity="0.3" />
        {/* Curved crossbar */}
        <path d="M43 62 Q52 58 60 60 Q68 58 77 62" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Trailing stem / exhaust */}
        <path d="M56 92 Q58 96 60 100 Q60 104 58 110" stroke={C4} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M64 92 Q62 96 60 100 Q60 104 62 110" stroke={C4} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M60 92 Q60 98 60 110" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.2" />
      </svg>
    ),
  },
];

const categories = [...new Set(logos.map((l) => l.category))];

function downloadSvg(index: number, name: string) {
  const el = document.getElementById(`logo-svg-${index}`);
  if (!el) return;
  const svgEl = el.querySelector("svg");
  if (!svgEl) return;

  const clone = svgEl.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const blob = new Blob([clone.outerHTML], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `astrolytics-${String(index + 1).padStart(2, "0")}-${name.toLowerCase().replace(/\s+/g, "-")}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LogoExplorationPage() {
  const [filterCat, setFilterCat] = useState<string>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = filterCat === "all" ? logos : logos.filter((l) => l.category === filterCat);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
            Logo Exploration v2
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Rocket-A Logo Variants</h1>
          <p className="text-gray-400 max-w-2xl">
            {logos.length} variations inspired by Astro&apos;s negative-space approach and Specno&apos;s node-rocket integration. The rocket is never drawn literally &mdash; it emerges from the shapes.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilterCat("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCat === "all"
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
            }`}
          >
            All ({logos.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterCat === cat
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
              }`}
            >
              {cat} ({logos.filter((l) => l.category === cat).length})
            </button>
          ))}
        </div>

        {/* Logo grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
          {filtered.map((logo, _fi) => {
            const globalIdx = logos.indexOf(logo);
            return (
              <button
                key={globalIdx}
                onClick={() => downloadSvg(globalIdx, logo.name)}
                className={`group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-primary-500/50 transition-all duration-300 text-left ${
                  logo.wide ? "sm:col-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                      #{String(globalIdx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-600 bg-gray-800/50 px-1.5 py-0.5 rounded">{logo.category}</span>
                      <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </div>
                  </div>

                  {/* SVG preview — dark bg */}
                  <div
                    id={`logo-svg-${globalIdx}`}
                    className="flex items-center justify-center h-32 mb-3"
                  >
                    <div className={logo.wide ? "w-full max-w-[280px]" : "w-24 h-24"}>
                      {logo.svg}
                    </div>
                  </div>

                  {/* Light bg preview */}
                  <div className="flex items-center justify-center h-16 mb-3 bg-white/5 rounded-lg border border-gray-800/50">
                    <div className="bg-white rounded-lg p-2 flex items-center justify-center" style={{ width: logo.wide ? "180px" : "48px", height: "48px" }}>
                      <div className={logo.wide ? "w-full" : "w-full h-full"}>
                        {logo.svg}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-xs font-semibold text-white mb-0.5">{logo.name}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{logo.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
            <span className="text-primary-400 font-semibold">{logos.length}</span>
            <span className="text-gray-300">logo variants &middot; click to download SVG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
