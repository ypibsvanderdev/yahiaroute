"use client";

import React from "react";

type YahiaRouteLogoProps = {
  size?: number;
  className?: string;
  showText?: boolean;
};

export default function YahiaRouteLogo({
  size = 28,
  className = "",
  showText = false,
}: YahiaRouteLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="yahiaGrad" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="yahiaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield / Route Ring */}
        <circle cx="18" cy="18" r="15" stroke="url(#yahiaGrad)" strokeWidth="1.75" strokeDasharray="3 2" opacity="0.6" />

        {/* Multi-Model Neural Constellation Lines */}
        <line x1="18" y1="18" x2="10" y2="10" stroke="url(#yahiaGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="18" x2="26" y2="10" stroke="url(#yahiaGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="18" x2="18" y2="28" stroke="url(#yahiaGrad)" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="10" y1="10" x2="26" y2="10" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />

        {/* Dynamic Model Nodes (Left, Right, Bottom, Center) */}
        <circle cx="10" cy="10" r="3.2" fill="#00F2FE" filter="url(#yahiaGlow)" />
        <circle cx="26" cy="10" r="3.2" fill="#8B5CF6" filter="url(#yahiaGlow)" />
        <circle cx="18" cy="28" r="3.2" fill="#10B981" filter="url(#yahiaGlow)" />

        {/* Central Yahia Hub */}
        <circle cx="18" cy="18" r="5" fill="url(#yahiaGrad)" filter="url(#yahiaGlow)" />
        <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
      </svg>
      {showText && (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 text-lg tracking-wide font-extrabold">
          Yahia<span className="text-white font-medium">Route</span>
        </span>
      )}
    </div>
  );
}

export { YahiaRouteLogo };
