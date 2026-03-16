import React from 'react';

// SVG Trading Diagrams Component
const DiagramSVG = ({ type, className = '' }) => {
  const baseClass = `w-full h-auto ${className}`;
  
  const diagrams = {
    supportResistance: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="srBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
          <linearGradient id="resistGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="supportGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#srBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Support & Resistance</text>
        {/* Resistance zone */}
        <rect x="50" y="60" width="500" height="25" fill="url(#resistGrad)" rx="4" />
        <text x="555" y="78" textAnchor="end" fill="#ef4444" fontSize="12" fontWeight="bold">Resistance</text>
        {/* Support zone */}
        <rect x="50" y="265" width="500" height="25" fill="url(#supportGrad)" rx="4" />
        <text x="555" y="283" textAnchor="end" fill="#22c55e" fontSize="12" fontWeight="bold">Support</text>
        {/* Price action - bouncing between S&R */}
        <polyline points="70,250 100,200 130,230 160,150 190,100 220,80 250,90 270,80 290,100 320,150 350,200 370,260 400,240 430,180 460,120 490,85 520,90" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bounce arrows */}
        <polygon points="370,270 365,255 375,255" fill="#22c55e" />
        <polygon points="270,70 265,85 275,85" fill="#ef4444" />
        <polygon points="490,75 485,90 495,90" fill="#ef4444" />
        {/* Labels */}
        <text x="380" y="310" fill="#22c55e" fontSize="11">Price bounces off support</text>
        <text x="250" y="50" fill="#ef4444" fontSize="11">Price rejected at resistance</text>
      </svg>
    ),

    trendlines: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tlBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#tlBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Trend Lines</text>
        {/* Uptrend line */}
        <line x1="60" y1="300" x2="280" y2="100" stroke="#22c55e" strokeWidth="2" strokeDasharray="8,4" />
        {/* Uptrend price */}
        <polyline points="60,290 80,270 100,280 120,250 140,260 160,230 180,240 200,200 220,210 240,170 260,180 280,140" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="170" y="320" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">Uptrend (Higher Lows)</text>
        {/* Downtrend line */}
        <line x1="320" y1="100" x2="560" y2="300" stroke="#ef4444" strokeWidth="2" strokeDasharray="8,4" />
        {/* Downtrend price */}
        <polyline points="320,120 340,140 360,130 380,160 400,150 420,180 440,170 460,210 480,200 500,240 520,230 540,270" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="440" y="320" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">Downtrend (Lower Highs)</text>
        {/* Touch points */}
        <circle cx="100" cy="280" r="5" fill="#22c55e" opacity="0.7" />
        <circle cx="160" cy="240" r="5" fill="#22c55e" opacity="0.7" />
        <circle cx="220" cy="210" r="5" fill="#22c55e" opacity="0.7" />
        <circle cx="360" cy="130" r="5" fill="#ef4444" opacity="0.7" />
        <circle cx="420" cy="170" r="5" fill="#ef4444" opacity="0.7" />
        <circle cx="500" cy="230" r="5" fill="#ef4444" opacity="0.7" />
      </svg>
    ),

    headShoulders: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hsBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#hsBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Head & Shoulders Pattern</text>
        {/* Pattern */}
        <polyline points="50,280 100,280 140,180 170,240 220,240 260,80 300,240 340,240 380,170 420,280 500,280" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Neckline */}
        <line x1="170" y1="240" x2="420" y2="240" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
        <text x="450" y="238" fill="#ef4444" fontSize="12" fontWeight="bold">Neckline</text>
        {/* Labels */}
        <text x="140" y="165" textAnchor="middle" fill="#94a3b8" fontSize="12">Left Shoulder</text>
        <text x="260" y="65" textAnchor="middle" fill="#94a3b8" fontSize="12">Head</text>
        <text x="380" y="155" textAnchor="middle" fill="#94a3b8" fontSize="12">Right Shoulder</text>
        {/* Breakdown arrow */}
        <line x1="420" y1="250" x2="480" y2="310" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed)" />
        <defs><marker id="arrowRed" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" /></marker></defs>
        <text x="490" y="320" fill="#ef4444" fontSize="11">Bearish Breakdown</text>
      </svg>
    ),

    doubleTopBottom: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dtBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#dtBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Double Top & Double Bottom</text>
        {/* Double Top */}
        <polyline points="50,200 80,200 110,80 140,150 180,80 210,200 250,200" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="80" y1="80" x2="210" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="150" y="60" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Double Top</text>
        <text x="110" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">1st Top</text>
        <text x="180" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">2nd Top</text>
        {/* Double Bottom */}
        <polyline points="330,150 360,150 390,280 420,210 460,280 490,150 530,150" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="360" y1="280" x2="490" y2="280" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="430" y="310" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Double Bottom</text>
        <text x="390" y="298" textAnchor="middle" fill="#94a3b8" fontSize="10">1st Bottom</text>
        <text x="460" y="298" textAnchor="middle" fill="#94a3b8" fontSize="10">2nd Bottom</text>
      </svg>
    ),

    candlestick: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="csBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#csBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Candlestick Patterns</text>
        {/* Bullish Engulfing */}
        <g transform="translate(80,50)">
          <line x1="15" y1="30" x2="15" y2="200" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="5" y="70" width="20" height="90" fill="#ef4444" rx="2" />
          <line x1="50" y1="20" x2="50" y2="220" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="35" y="50" width="30" height="130" fill="#22c55e" rx="2" />
          <text x="30" y="250" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Bullish Engulfing</text>
        </g>
        {/* Hammer */}
        <g transform="translate(220,50)">
          <line x1="20" y1="40" x2="20" y2="220" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="10" y="40" width="20" height="30" fill="#22c55e" rx="2" />
          <text x="20" y="250" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Hammer</text>
        </g>
        {/* Doji */}
        <g transform="translate(340,50)">
          <line x1="20" y1="40" x2="20" y2="200" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="10" y="115" width="20" height="4" fill="#94a3b8" rx="1" />
          <text x="20" y="250" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Doji</text>
        </g>
        {/* Shooting Star */}
        <g transform="translate(460,50)">
          <line x1="20" y1="20" x2="20" y2="200" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="10" y="170" width="20" height="30" fill="#ef4444" rx="2" />
          <text x="20" y="250" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Shooting Star</text>
        </g>
      </svg>
    ),

    marketStructure: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="msBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#msBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Market Structure (BOS & CHoCH)</text>
        {/* Bullish structure */}
        <polyline points="40,280 80,220 110,250 150,180 180,210 220,130 260,160 300,90" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* HH HL labels */}
        <text x="80" y="212" fill="#22c55e" fontSize="10">HL</text>
        <text x="150" y="172" fill="#22c55e" fontSize="10">HH</text>
        <text x="180" y="222" fill="#22c55e" fontSize="10">HL</text>
        <text x="220" y="122" fill="#22c55e" fontSize="10">HH</text>
        <text x="260" y="172" fill="#22c55e" fontSize="10">HL</text>
        <text x="300" y="82" fill="#22c55e" fontSize="10">HH</text>
        {/* BOS line */}
        <line x1="150" y1="180" x2="220" y2="180" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="185" y="195" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">BOS</text>
        {/* CHoCH - bearish shift */}
        <polyline points="300,90 330,120 350,100 380,160 410,140 440,200 470,180 500,260" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="350" y="92" fill="#ef4444" fontSize="10">LH</text>
        <text x="380" y="172" fill="#ef4444" fontSize="10">LL</text>
        {/* CHoCH label */}
        <line x1="300" y1="160" x2="380" y2="160" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="340" y="155" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">CHoCH</text>
        {/* Legend */}
        <rect x="380" y="280" width="200" height="55" fill="rgba(255,255,255,0.05)" rx="6" />
        <circle cx="395" cy="295" r="4" fill="#22c55e" />
        <text x="405" y="299" fill="#94a3b8" fontSize="10">BOS = Trend Continuation</text>
        <circle cx="395" cy="315" r="4" fill="#f59e0b" />
        <text x="405" y="319" fill="#94a3b8" fontSize="10">CHoCH = Trend Reversal</text>
      </svg>
    ),

    liquidity: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lqBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#lqBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Liquidity Zones</text>
        {/* Equal highs - BSL */}
        <rect x="100" y="70" width="400" height="20" fill="rgba(239,68,68,0.15)" rx="4" />
        <line x1="100" y1="80" x2="500" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="520" y="84" fill="#ef4444" fontSize="11" fontWeight="bold">BSL</text>
        {/* Equal lows - SSL */}
        <rect x="100" y="260" width="400" height="20" fill="rgba(34,197,94,0.15)" rx="4" />
        <line x1="100" y1="270" x2="500" y2="270" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="520" y="274" fill="#22c55e" fontSize="11" fontWeight="bold">SSL</text>
        {/* Price action touching equal highs */}
        <polyline points="80,200 120,120 140,85 160,100 200,150 240,120 260,85 280,100 320,160 360,120 380,75 400,60 420,100 460,200 500,270 520,280 540,250" fill="none" stroke="#d4a94b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sweep arrow */}
        <text x="400" y="52" fill="#ef4444" fontSize="10">Liquidity Sweep!</text>
        <text x="500" y="300" fill="#22c55e" fontSize="10">SSL Sweep</text>
        {/* Stop loss clusters */}
        <text x="120" y="65" fill="#94a3b8" fontSize="9">Stop Losses</text>
        <text x="120" y="295" fill="#94a3b8" fontSize="9">Stop Losses</text>
        {/* Legend */}
        <rect x="20" y="310" width="250" height="30" fill="rgba(255,255,255,0.05)" rx="6" />
        <text x="30" y="330" fill="#ef4444" fontSize="10">BSL = Buy-Side Liquidity (above highs)</text>
      </svg>
    ),

    orderBlocks: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="obBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#obBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Order Blocks</text>
        {/* Bullish OB */}
        <g transform="translate(30,40)">
          <text x="120" y="10" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">Bullish Order Block</text>
          {/* Candles going down then up */}
          <rect x="40" y="80" width="15" height="60" fill="#ef4444" rx="2" />
          <line x1="47" y1="70" x2="47" y2="150" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="65" y="100" width="15" height="50" fill="#ef4444" rx="2" />
          <line x1="72" y1="90" x2="72" y2="160" stroke="#ef4444" strokeWidth="1.5" />
          {/* OB candle - last red before move up */}
          <rect x="90" y="120" width="18" height="40" fill="#ef4444" rx="2" stroke="#d4a94b" strokeWidth="2" />
          <line x1="99" y1="110" x2="99" y2="170" stroke="#ef4444" strokeWidth="1.5" />
          {/* OB zone */}
          <rect x="88" y="110" width="160" height="60" fill="rgba(34,197,94,0.12)" rx="4" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,3" />
          <text x="200" y="145" fill="#22c55e" fontSize="10">OB Zone</text>
          {/* Strong move up */}
          <rect x="120" y="60" width="15" height="80" fill="#22c55e" rx="2" />
          <rect x="145" y="30" width="15" height="90" fill="#22c55e" rx="2" />
          <rect x="170" y="20" width="15" height="70" fill="#22c55e" rx="2" />
          {/* Return to OB */}
          <polyline points="195,30 210,50 220,40 235,80 245,110 250,130 255,120" fill="none" stroke="#d4a94b" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="230" y="100" fill="#d4a94b" fontSize="9">Price returns to OB</text>
        </g>
        {/* Bearish OB */}
        <g transform="translate(310,40)">
          <text x="120" y="10" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">Bearish Order Block</text>
          {/* Candles going up then down */}
          <rect x="40" y="120" width="15" height="60" fill="#22c55e" rx="2" />
          <line x1="47" y1="110" x2="47" y2="190" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="65" y="100" width="15" height="50" fill="#22c55e" rx="2" />
          <line x1="72" y1="90" x2="72" y2="160" stroke="#22c55e" strokeWidth="1.5" />
          {/* OB candle - last green before move down */}
          <rect x="90" y="80" width="18" height="40" fill="#22c55e" rx="2" stroke="#d4a94b" strokeWidth="2" />
          <line x1="99" y1="70" x2="99" y2="130" stroke="#22c55e" strokeWidth="1.5" />
          {/* OB zone */}
          <rect x="88" y="70" width="160" height="50" fill="rgba(239,68,68,0.12)" rx="4" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />
          <text x="200" y="100" fill="#ef4444" fontSize="10">OB Zone</text>
          {/* Strong move down */}
          <rect x="120" y="110" width="15" height="80" fill="#ef4444" rx="2" />
          <rect x="145" y="130" width="15" height="90" fill="#ef4444" rx="2" />
          <rect x="170" y="160" width="15" height="70" fill="#ef4444" rx="2" />
        </g>
      </svg>
    ),

    fairValueGap: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fvgBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#fvgBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Fair Value Gap (FVG)</text>
        {/* Bullish FVG */}
        <g transform="translate(50,50)">
          <text x="100" y="10" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">Bullish FVG</text>
          {/* Candle 1 */}
          <rect x="40" y="150" width="20" height="60" fill="#22c55e" rx="2" />
          <line x1="50" y1="140" x2="50" y2="220" stroke="#22c55e" strokeWidth="1.5" />
          <text x="50" y="235" textAnchor="middle" fill="#94a3b8" fontSize="9">C1</text>
          {/* Candle 2 - big impulse */}
          <rect x="80" y="60" width="20" height="100" fill="#22c55e" rx="2" />
          <line x1="90" y1="50" x2="90" y2="170" stroke="#22c55e" strokeWidth="1.5" />
          <text x="90" y="185" textAnchor="middle" fill="#94a3b8" fontSize="9">C2</text>
          {/* Candle 3 */}
          <rect x="120" y="30" width="20" height="50" fill="#22c55e" rx="2" />
          <line x1="130" y1="20" x2="130" y2="90" stroke="#22c55e" strokeWidth="1.5" />
          <text x="130" y="105" textAnchor="middle" fill="#94a3b8" fontSize="9">C3</text>
          {/* FVG zone - between C1 high and C3 low */}
          <rect x="55" y="90" width="80" height="50" fill="rgba(59,130,246,0.2)" rx="4" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="160" y="120" fill="#3b82f6" fontSize="11" fontWeight="bold">FVG</text>
        </g>
        {/* Bearish FVG */}
        <g transform="translate(320,50)">
          <text x="100" y="10" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">Bearish FVG</text>
          {/* Candle 1 */}
          <rect x="40" y="50" width="20" height="60" fill="#ef4444" rx="2" />
          <line x1="50" y1="40" x2="50" y2="120" stroke="#ef4444" strokeWidth="1.5" />
          <text x="50" y="135" textAnchor="middle" fill="#94a3b8" fontSize="9">C1</text>
          {/* Candle 2 - big impulse down */}
          <rect x="80" y="100" width="20" height="100" fill="#ef4444" rx="2" />
          <line x1="90" y1="90" x2="90" y2="210" stroke="#ef4444" strokeWidth="1.5" />
          <text x="90" y="225" textAnchor="middle" fill="#94a3b8" fontSize="9">C2</text>
          {/* Candle 3 */}
          <rect x="120" y="180" width="20" height="50" fill="#ef4444" rx="2" />
          <line x1="130" y1="170" x2="130" y2="240" stroke="#ef4444" strokeWidth="1.5" />
          <text x="130" y="255" textAnchor="middle" fill="#94a3b8" fontSize="9">C3</text>
          {/* FVG zone */}
          <rect x="55" y="120" width="80" height="50" fill="rgba(59,130,246,0.2)" rx="4" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="160" y="150" fill="#3b82f6" fontSize="11" fontWeight="bold">FVG</text>
        </g>
      </svg>
    ),

    breakOfStructure: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bosBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#bosBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Break of Structure (BOS)</text>
        {/* Bullish BOS */}
        <polyline points="40,250 70,200 90,230 120,160 140,190 170,120 200,150 230,80" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Previous high line */}
        <line x1="120" y1="160" x2="200" y2="160" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="160" y="155" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">BOS ✓</text>
        <text x="120" y="152" fill="#94a3b8" fontSize="9">Previous HH</text>
        {/* Bearish BOS */}
        <polyline points="320,100 350,150 370,120 400,190 420,160 450,230 480,200 510,280" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="400" y1="190" x2="480" y2="190" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="440" y="185" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">BOS ✓</text>
        <text x="400" y="202" fill="#94a3b8" fontSize="9">Previous LL</text>
        {/* Labels */}
        <text x="140" y="310" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Bullish BOS</text>
        <text x="420" y="310" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Bearish BOS</text>
      </svg>
    ),

    killZones: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kzBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#kzBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">ICT Kill Zones (Trading Sessions)</text>
        {/* Timeline */}
        <line x1="50" y1="180" x2="560" y2="180" stroke="#374151" strokeWidth="2" />
        {/* Asian Session */}
        <rect x="60" y="100" width="100" height="70" fill="rgba(168,85,247,0.15)" rx="6" stroke="#a855f7" strokeWidth="1.5" />
        <text x="110" y="90" textAnchor="middle" fill="#a855f7" fontSize="12" fontWeight="bold">Asian</text>
        <text x="110" y="125" textAnchor="middle" fill="#94a3b8" fontSize="10">00:00 - 08:00</text>
        <text x="110" y="140" textAnchor="middle" fill="#94a3b8" fontSize="9">Low Volatility</text>
        <text x="110" y="155" textAnchor="middle" fill="#94a3b8" fontSize="9">Range Formation</text>
        {/* London Kill Zone */}
        <rect x="190" y="60" width="120" height="110" fill="rgba(59,130,246,0.15)" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="250" y="50" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">London KZ</text>
        <text x="250" y="85" textAnchor="middle" fill="#94a3b8" fontSize="10">07:00 - 10:00</text>
        <text x="250" y="100" textAnchor="middle" fill="#d4a94b" fontSize="10" fontWeight="bold">HIGH VOLUME</text>
        <text x="250" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">Trend Initiation</text>
        <text x="250" y="130" textAnchor="middle" fill="#94a3b8" fontSize="9">Liquidity Sweeps</text>
        <text x="250" y="155" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">★ Best Setups</text>
        {/* NY Kill Zone */}
        <rect x="340" y="60" width="120" height="110" fill="rgba(239,68,68,0.15)" rx="6" stroke="#ef4444" strokeWidth="1.5" />
        <text x="400" y="50" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">New York KZ</text>
        <text x="400" y="85" textAnchor="middle" fill="#94a3b8" fontSize="10">12:00 - 15:00</text>
        <text x="400" y="100" textAnchor="middle" fill="#d4a94b" fontSize="10" fontWeight="bold">HIGH VOLUME</text>
        <text x="400" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">Continuation/Reversal</text>
        <text x="400" y="130" textAnchor="middle" fill="#94a3b8" fontSize="9">News Impact</text>
        <text x="400" y="155" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">★ Best Setups</text>
        {/* Late Session */}
        <rect x="490" y="120" width="60" height="50" fill="rgba(107,114,128,0.15)" rx="6" stroke="#6b7280" strokeWidth="1.5" />
        <text x="520" y="110" textAnchor="middle" fill="#6b7280" fontSize="11">Close</text>
        <text x="520" y="145" textAnchor="middle" fill="#94a3b8" fontSize="9">15:00+</text>
        <text x="520" y="160" textAnchor="middle" fill="#94a3b8" fontSize="9">Avoid</text>
        {/* Volume visualization */}
        <rect x="60" y="200" width="100" height="20" fill="rgba(168,85,247,0.3)" rx="3" />
        <rect x="190" y="200" width="120" height="60" fill="rgba(59,130,246,0.3)" rx="3" />
        <rect x="340" y="200" width="120" height="55" fill="rgba(239,68,68,0.3)" rx="3" />
        <rect x="490" y="200" width="60" height="15" fill="rgba(107,114,128,0.3)" rx="3" />
        <text x="300" y="290" textAnchor="middle" fill="#94a3b8" fontSize="11">Volume Distribution (GMT)</text>
      </svg>
    ),

    riskManagement: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rmBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#rmBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Risk Management</text>
        {/* Risk:Reward visualization */}
        <g transform="translate(50,50)">
          <text x="100" y="10" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="bold">Risk : Reward Ratio</text>
          {/* Entry line */}
          <line x1="20" y1="120" x2="200" y2="120" stroke="#d4a94b" strokeWidth="2" />
          <text x="210" y="124" fill="#d4a94b" fontSize="11" fontWeight="bold">Entry</text>
          {/* Stop loss */}
          <rect x="20" y="120" width="180" height="50" fill="rgba(239,68,68,0.1)" rx="4" />
          <line x1="20" y1="170" x2="200" y2="170" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
          <text x="210" y="174" fill="#ef4444" fontSize="11" fontWeight="bold">Stop Loss</text>
          <text x="100" y="150" textAnchor="middle" fill="#ef4444" fontSize="12">-1R (Risk)</text>
          {/* Take profit */}
          <rect x="20" y="20" width="180" height="100" fill="rgba(34,197,94,0.1)" rx="4" />
          <line x1="20" y1="20" x2="200" y2="20" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,3" />
          <text x="210" y="24" fill="#22c55e" fontSize="11" fontWeight="bold">Take Profit</text>
          <text x="100" y="70" textAnchor="middle" fill="#22c55e" fontSize="12">+2R (Reward)</text>
          <text x="100" y="200" textAnchor="middle" fill="#d4a94b" fontSize="12" fontWeight="bold">1:2 RR = Win 50% → Profitable</text>
        </g>
        {/* Position sizing */}
        <g transform="translate(320,50)">
          <text x="120" y="10" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="bold">Position Sizing</text>
          <rect x="10" y="25" width="230" height="220" fill="rgba(255,255,255,0.03)" rx="8" />
          <text x="120" y="55" textAnchor="middle" fill="#d4a94b" fontSize="12">Account: $10,000</text>
          <text x="120" y="80" textAnchor="middle" fill="#ef4444" fontSize="12">Risk: 1% = $100</text>
          <text x="120" y="105" textAnchor="middle" fill="#94a3b8" fontSize="12">Stop Loss: 50 pips</text>
          <line x1="30" y1="115" x2="220" y2="115" stroke="#374151" strokeWidth="1" />
          <text x="120" y="140" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">Lot Size = 0.20</text>
          <text x="120" y="165" textAnchor="middle" fill="#94a3b8" fontSize="10">$100 ÷ (50 × $10) = 0.20</text>
          <line x1="30" y1="180" x2="220" y2="180" stroke="#374151" strokeWidth="1" />
          <text x="120" y="205" textAnchor="middle" fill="#94a3b8" fontSize="11">Max 2 trades/day</text>
          <text x="120" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">Max daily loss: $200</text>
        </g>
      </svg>
    ),

    trend: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="trBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#trBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Market Trends</text>
        {/* Uptrend */}
        <polyline points="30,280 60,250 80,260 110,220 130,230 160,190 180,200 210,160" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="120" y="310" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Uptrend ↑</text>
        {/* Sideways */}
        <polyline points="220,180 240,160 260,180 280,160 300,180 320,160 340,180 360,160" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="290" y="310" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">Sideways ↔</text>
        {/* Downtrend */}
        <polyline points="370,100 400,130 420,120 450,160 470,150 500,190 520,180 550,220" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="460" y="310" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Downtrend ↓</text>
      </svg>
    ),

    fibonacci: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fibBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#fibBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Fibonacci Retracement</text>
        {/* Swing move */}
        <polyline points="80,280 150,250 200,200 250,150 300,100 350,70" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Fib levels */}
        <line x1="350" y1="70" x2="550" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
        <text x="555" y="74" fill="#94a3b8" fontSize="10">0% (Top)</text>
        <line x1="350" y1="112" x2="550" y2="112" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" />
        <text x="555" y="116" fill="#3b82f6" fontSize="10">23.6%</text>
        <line x1="350" y1="150" x2="550" y2="150" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,3" />
        <text x="555" y="154" fill="#8b5cf6" fontSize="10">38.2%</text>
        <line x1="350" y1="175" x2="550" y2="175" stroke="#d4a94b" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="555" y="179" fill="#d4a94b" fontSize="10" fontWeight="bold">50%</text>
        <line x1="350" y1="200" x2="550" y2="200" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="555" y="204" fill="#22c55e" fontSize="10" fontWeight="bold">61.8% ★</text>
        <line x1="350" y1="240" x2="550" y2="240" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
        <text x="555" y="244" fill="#f59e0b" fontSize="10">78.6%</text>
        <line x1="80" y1="280" x2="550" y2="280" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
        <text x="555" y="284" fill="#94a3b8" fontSize="10">100% (Bottom)</text>
        {/* Retracement */}
        <polyline points="350,70 380,100 400,112 420,150 440,200 450,175" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="460" y="170" fill="#22c55e" fontSize="11" fontWeight="bold">Buy Zone</text>
      </svg>
    ),

    entryModel: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#emBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Trade Entry Model</text>
        {/* Steps */}
        <g transform="translate(30,50)">
          {[
            { y: 0, num: '1', text: 'Identify Trend (H4)', color: '#3b82f6' },
            { y: 50, num: '2', text: 'Mark Key Levels (H1)', color: '#8b5cf6' },
            { y: 100, num: '3', text: 'Wait for Price at Level', color: '#f59e0b' },
            { y: 150, num: '4', text: 'Get Confirmation (M15)', color: '#22c55e' },
            { y: 200, num: '5', text: 'Execute with Risk Mgmt', color: '#d4a94b' },
          ].map(({ y, num, text, color }) => (
            <g key={num}>
              <circle cx="20" cy={y + 15} r="15" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
              <text x="20" y={y + 20} textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">{num}</text>
              <text x="45" y={y + 20} fill="#e2e8f0" fontSize="13">{text}</text>
              {num !== '5' && <line x1="20" y1={y + 32} x2="20" y2={y + 48} stroke={color} strokeWidth="1" strokeDasharray="3,3" />}
            </g>
          ))}
        </g>
        {/* Trade visualization */}
        <g transform="translate(300,50)">
          <rect x="0" y="0" width="260" height="250" fill="rgba(255,255,255,0.03)" rx="8" />
          <text x="130" y="25" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">Example Trade</text>
          {/* Price action */}
          <polyline points="20,200 40,180 60,190 80,160 100,170 120,130 140,100 160,80" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Entry */}
          <circle cx="120" cy="130" r="5" fill="#d4a94b" />
          <text x="135" y="128" fill="#d4a94b" fontSize="10" fontWeight="bold">Entry</text>
          {/* SL */}
          <line x1="100" y1="170" x2="180" y2="170" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="185" y="174" fill="#ef4444" fontSize="10">SL</text>
          {/* TP */}
          <line x1="100" y1="70" x2="180" y2="70" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="185" y="74" fill="#22c55e" fontSize="10">TP (1:2)</text>
          {/* RR */}
          <text x="130" y="230" textAnchor="middle" fill="#d4a94b" fontSize="12" fontWeight="bold">Risk:Reward = 1:2</text>
        </g>
      </svg>
    ),

    chartPatterns: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cpBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#cpBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Chart Patterns</text>
        {/* Triangle */}
        <g transform="translate(30,50)">
          <polyline points="10,120 40,60 60,100 90,50 110,80 140,40 160,70" fill="none" stroke="#d4a94b" strokeWidth="2" />
          <line x1="10" y1="40" x2="160" y2="60" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
          <line x1="10" y1="120" x2="160" y2="80" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="85" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11">Triangle</text>
        </g>
        {/* Wedge */}
        <g transform="translate(220,50)">
          <polyline points="10,120 30,80 50,110 70,70 90,100 110,60 130,90" fill="none" stroke="#d4a94b" strokeWidth="2" />
          <line x1="10" y1="60" x2="130" y2="50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
          <line x1="10" y1="130" x2="130" y2="100" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="70" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11">Rising Wedge</text>
        </g>
        {/* Flag */}
        <g transform="translate(400,50)">
          <polyline points="10,130 30,60 50,40 60,80 70,70 80,90 90,80 100,100 110,90" fill="none" stroke="#d4a94b" strokeWidth="2" />
          <line x1="50" y1="40" x2="110" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
          <line x1="50" y1="80" x2="110" y2="100" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
          <polyline points="110,90 130,50 150,30" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="80" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11">Bull Flag</text>
        </g>
      </svg>
    ),

    rsi: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rsiBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
          <linearGradient id="rsiOverbought" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="rsiOversold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#rsiBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">RSI (Relative Strength Index)</text>
        
        <line x1="50" y1="80" x2="550" y2="80" stroke="#404050" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="50" y1="180" x2="550" y2="180" stroke="#404050" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="50" y1="280" x2="550" y2="280" stroke="#404050" strokeWidth="1" strokeDasharray="3,3" />
        
        <rect x="50" y="50" width="500" height="30" fill="url(#rsiOverbought)" />
        <text x="560" y="70" fill="#ef4444" fontSize="11" fontWeight="bold">70 (Overbought)</text>
        
        <line x1="50" y1="180" x2="550" y2="180" stroke="#d4a94b" strokeWidth="2" />
        <text x="560" y="185" fill="#d4a94b" fontSize="11" fontWeight="bold">50 (Neutral)</text>
        
        <rect x="50" y="280" width="500" height="30" fill="url(#rsiOversold)" />
        <text x="560" y="300" fill="#22c55e" fontSize="11" fontWeight="bold">30 (Oversold)</text>
        
        <polyline points="70,200 100,150 130,140 160,120 190,110 220,130 250,160 280,170 310,150 340,120 370,100 400,110 430,140 460,160 490,180 520,200" fill="none" stroke="#d4a94b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        <circle cx="370" cy="100" r="5" fill="#ef4444" />
        <text x="370" y="85" textAnchor="middle" fill="#ef4444" fontSize="10">Sell</text>
        
        <circle cx="220" cy="130" r="5" fill="#22c55e" />
        <text x="220" y="320" textAnchor="middle" fill="#22c55e" fontSize="10">Buy</text>
      </svg>
    ),

    macd: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="macdBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#macdBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">MACD (Moving Average Convergence Divergence)</text>
        
        <line x1="50" y1="180" x2="550" y2="180" stroke="#d4a94b" strokeWidth="2" />
        <text x="560" y="185" fill="#d4a94b" fontSize="11">0</text>
        
        <polyline points="70,170 100,160 130,150 160,140 190,130 220,120 250,110 280,100 310,95 340,100 370,110 400,120 430,130 460,140 490,150 520,160" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="530" y="160" fill="#3b82f6" fontSize="11" fontWeight="bold">MACD</text>
        
        <polyline points="70,175 100,165 130,155 160,145 190,135 220,125 250,115 280,105 310,100 340,105 370,115 400,125 430,135 460,145 490,155 520,165" fill="none" stroke="#f97316" strokeWidth="2.5" />
        <text x="530" y="175" fill="#f97316" fontSize="11" fontWeight="bold">Signal</text>
        
        <rect x="65" y="180" width="8" height="8" fill="#22c55e" />
        <rect x="95" y="180" width="8" height="5" fill="#22c55e" />
        <rect x="125" y="180" width="8" height="3" fill="#22c55e" />
        <rect x="155" y="180" width="8" height="2" fill="#ef4444" />
        <rect x="185" y="180" width="8" height="4" fill="#ef4444" />
        <rect x="215" y="180" width="8" height="6" fill="#ef4444" />
        <rect x="245" y="180" width="8" height="8" fill="#ef4444" />
        <rect x="275" y="180" width="8" height="7" fill="#ef4444" />
        <rect x="305" y="180" width="8" height="5" fill="#ef4444" />
        <rect x="335" y="180" width="8" height="3" fill="#22c55e" />
        <rect x="365" y="180" width="8" height="5" fill="#22c55e" />
        <rect x="395" y="180" width="8" height="7" fill="#22c55e" />
        <rect x="425" y="180" width="8" height="9" fill="#22c55e" />
        <rect x="455" y="180" width="8" height="8" fill="#22c55e" />
        <rect x="485" y="180" width="8" height="6" fill="#22c55e" />
        <rect x="515" y="180" width="8" height="4" fill="#22c55e" />
        
        <text x="300" y="320" textAnchor="middle" fill="#94a3b8" fontSize="11">Bullish (Green) = Uptrend | Bearish (Red) = Downtrend</text>
      </svg>
    ),

    fibonacci: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fibBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#fibBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Fibonacci Retracement Levels</text>
        
        <line x1="100" y1="280" x2="100" y2="80" stroke="#d4a94b" strokeWidth="3" />
        <circle cx="100" cy="280" r="4" fill="#22c55e" />
        <text x="85" y="295" fill="#22c55e" fontSize="11" fontWeight="bold">Low</text>
        <circle cx="100" cy="80" r="4" fill="#ef4444" />
        <text x="85" y="70" fill="#ef4444" fontSize="11" fontWeight="bold">High</text>
        
        <line x1="100" y1="80" x2="500" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="510" y="85" fill="#ef4444" fontSize="11" fontWeight="bold">0%</text>
        
        <line x1="100" y1="125" x2="500" y2="125" stroke="#d4a94b" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="510" y="130" fill="#d4a94b" fontSize="11" fontWeight="bold">23.6%</text>
        
        <line x1="100" y1="155" x2="500" y2="155" stroke="#d4a94b" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="510" y="160" fill="#d4a94b" fontSize="11" fontWeight="bold">38.2%</text>
        
        <line x1="100" y1="180" x2="500" y2="180" stroke="#d4a94b" strokeWidth="2" />
        <text x="510" y="185" fill="#d4a94b" fontSize="11" fontWeight="bold">50%</text>
        
        <line x1="100" y1="205" x2="500" y2="205" stroke="#d4a94b" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="510" y="210" fill="#d4a94b" fontSize="11" fontWeight="bold">61.8%</text>
        
        <line x1="100" y1="235" x2="500" y2="235" stroke="#d4a94b" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="510" y="240" fill="#d4a94b" fontSize="11" fontWeight="bold">76.4%</text>
        
        <line x1="100" y1="280" x2="500" y2="280" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="510" y="285" fill="#22c55e" fontSize="11" fontWeight="bold">100%</text>
        
        <text x="300" y="320" textAnchor="middle" fill="#94a3b8" fontSize="11">Support at 38.2%, 50%, 61.8% | Key reversal at 50%</text>
      </svg>
    ),

    riskManagement: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rmBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#rmBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Risk Management Framework</text>
        
        <rect x="50" y="60" width="140" height="60" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="8" />
        <text x="120" y="80" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">Account Size</text>
        <text x="120" y="105" textAnchor="middle" fill="#93c5fd" fontSize="10">$10,000</text>
        
        <rect x="210" y="60" width="140" height="60" fill="#7c2d12" stroke="#ea580c" strokeWidth="2" rx="8" />
        <text x="280" y="80" textAnchor="middle" fill="#ea580c" fontSize="11" fontWeight="bold">Risk per Trade</text>
        <text x="280" y="105" textAnchor="middle" fill="#fed7aa" fontSize="10">1-2% Max</text>
        
        <rect x="370" y="60" width="140" height="60" fill="#166534" stroke="#22c55e" strokeWidth="2" rx="8" />
        <text x="440" y="80" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Position Size</text>
        <text x="440" y="105" textAnchor="middle" fill="#86efac" fontSize="10">Calculated</text>
        
        <rect x="50" y="150" width="130" height="110" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" rx="8" />
        <text x="115" y="175" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Stop Loss</text>
        <text x="115" y="195" textAnchor="middle" fill="#fca5a5" fontSize="9">Exit Point</text>
        <text x="115" y="210" textAnchor="middle" fill="#fca5a5" fontSize="9">Limit Losses</text>
        <text x="115" y="225" textAnchor="middle" fill="#fca5a5" fontSize="9">Protect Capital</text>
        
        <rect x="210" y="150" width="130" height="110" fill="#1b3a1b" stroke="#22c55e" strokeWidth="2" rx="8" />
        <text x="275" y="175" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Take Profit</text>
        <text x="275" y="195" textAnchor="middle" fill="#86efac" fontSize="9">Target Price</text>
        <text x="275" y="210" textAnchor="middle" fill="#86efac" fontSize="9">Lock Profits</text>
        <text x="275" y="225" textAnchor="middle" fill="#86efac" fontSize="9">Secure Gains</text>
        
        <rect x="370" y="150" width="140" height="110" fill="#1a1a2e" stroke="#d4a94b" strokeWidth="2" rx="8" />
        <text x="440" y="175" textAnchor="middle" fill="#d4a94b" fontSize="11" fontWeight="bold">R:R Ratio</text>
        <text x="440" y="195" textAnchor="middle" fill="#fef3c7" fontSize="9">Ideal: 1:2</text>
        <text x="440" y="210" textAnchor="middle" fill="#fef3c7" fontSize="9">Risk $100</text>
        <text x="440" y="225" textAnchor="middle" fill="#fef3c7" fontSize="9">Gain $200</text>
      </svg>
    ),
  };

  const DiagramComponent = diagrams[type];
  
  if (!DiagramComponent) {
    return (
      <div className="w-full h-48 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-700">
        <p className="text-gray-400 text-sm">Diagram: {type}</p>
      </div>
    );
  }

  return DiagramComponent;
};

export default DiagramSVG;
