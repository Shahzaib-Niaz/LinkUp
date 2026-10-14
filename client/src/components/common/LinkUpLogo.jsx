import React from "react";

export function LinkUpIcon({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
    >
      <defs>
        <linearGradient
          id="linkup-bg-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>

        <linearGradient
          id="linkup-node-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        <filter
          id="linkup-shadow"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
        >
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="8"
            floodColor="#6366F1"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      {/* Main squircle container with glow shadow */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="18"
        fill="url(#linkup-bg-gradient)"
        filter="url(#linkup-shadow)"
      />

      {/* Glossy top overlay */}
      <path
        d="M3 21C3 11.0589 11.0589 3 21 3H43C52.9411 3 61 11.0589 61 21V26C61 26 44 32 21 32C8 32 3 26 3 26V21Z"
        fill="white"
        fillOpacity="0.12"
      />

      {/* Left Chat Loop / Link Node */}
      <path
        d="M20 22C20 17.5817 23.5817 14 28 14H34C38.4183 14 42 17.5817 42 22V25C42 29.4183 38.4183 33 34 33H27.5L20.5 38.5V33C19.5 31.8 19 30 19 28V23C19.3333 22.3333 19.6667 21.6667 20 22Z"
        fill="white"
      />

      {/* Right Interlocking Link Arc */}
      <path
        d="M29 27C29 27 31.5 24 36.5 24C41.5 24 45 27.5 45 32.5V36C45 40.5 41.5 44 37 44H32L26 48.5V43.5C24.5 42.2 23.5 40.2 23.5 38V35"
        stroke="url(#linkup-node-gradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Infinity Link Heartbeat Connection */}
      <path
        d="M27 23.5C29 21.5 32 21.5 34 23.5L37 26.5C39 28.5 42 28.5 44 26.5"
        stroke="#6366F1"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Live Status Pulse Dot */}
      <circle cx="47" cy="17" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}

export default function LinkUpLogo({
  size = "md",
  showText = true,
  className = "",
}) {
  const iconSizes = {
    sm: 32,
    md: 42,
    lg: 56,
    xl: 72,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const pixelSize = typeof size === "number" ? size : iconSizes[size] || 42;
  const textSizeClass = typeof size === "string" ? textSizes[size] : "text-2xl";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <LinkUpIcon size={pixelSize} />
      {showText && (
        <span className={`font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent font-sans ${textSizeClass}`}>
          Link<span className="text-indigo-400 font-black">Up</span>
        </span>
      )}
    </div>
  );
}
