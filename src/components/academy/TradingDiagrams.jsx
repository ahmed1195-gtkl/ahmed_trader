import React from 'react';

const TradingDiagrams = ({ type = 'supportResistance', className = '' }) => {
  const baseClass = `w-full h-auto max-w-2xl mx-auto rounded-xl shadow-lg ${className}`;

  const diagrams = {
    supportResistance: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="srBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#srBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Support & Resistance</text>
        
        {/* Resistance line */}
        <line x1="50" y1="100" x2="550" y2="100" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,5" />
        <text x="560" y="105" fill="#ef4444" fontSize="12" fontWeight="bold">Resistance</text>
        
        {/* Support line */}
        <line x1="50" y1="250" x2="550" y2="250" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="5,5" />
        <text x="560" y="255" fill="#22c55e" fontSize="12" fontWeight="bold">Support</text>
        
        {/* Price action */}
        <polyline points="80,200 120,150 160,180 200,120 240,160 280,130 320,170 360,140 400,180 440,150 480,190 520,160" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Bounce indicators */}
        <circle cx="120" cy="150" r="3" fill="#3b82f6" />
        <circle cx="160" cy="180" r="3" fill="#3b82f6" />
        <circle cx="200" cy="120" r="3" fill="#3b82f6" />
        <circle cx="280" cy="130" r="3" fill="#3b82f6" />
        <circle cx="360" cy="140" r="3" fill="#3b82f6" />
        
        <text x="300" y="320" textAnchor="middle" fill="#94a3b8" fontSize="11">Price bounces off Support & Resistance levels</text>
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
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Trendlines</text>
        
        {/* Uptrend */}
        <polyline points="80,280 120,250 160,220 200,190 240,160 280,130 320,100" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="80" y1="280" x2="320" y2="100" stroke="#22c55e" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
        <text x="200" y="310" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Uptrend ↑</text>
        
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
          <rect x="0" y="0" width="140" height="50" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="6" />
          <text x="70" y="20" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">1. Identify</text>
          <text x="70" y="35" textAnchor="middle" fill="#93c5fd" fontSize="10">Trend (H4)</text>
          
          <line x1="140" y1="25" x2="170" y2="25" stroke="#d4a94b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          <rect x="170" y="0" width="140" height="50" fill="#6b21a8" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="240" y="20" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">2. Mark</text>
          <text x="240" y="35" textAnchor="middle" fill="#c4b5fd" fontSize="10">Levels (H1)</text>
          
          <line x1="310" y1="25" x2="340" y2="25" stroke="#d4a94b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          <rect x="340" y="0" width="140" height="50" fill="#92400e" stroke="#f59e0b" strokeWidth="2" rx="6" />
          <text x="410" y="20" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">3. Wait</text>
          <text x="410" y="35" textAnchor="middle" fill="#fed7aa" fontSize="10">Price at Level</text>
          
          {/* Second row */}
          <rect x="0" y="70" width="140" height="50" fill="#166534" stroke="#22c55e" strokeWidth="2" rx="6" />
          <text x="70" y="90" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">4. Get</text>
          <text x="70" y="105" textAnchor="middle" fill="#86efac" fontSize="10">Confirmation</text>
          
          <line x1="140" y1="95" x2="170" y2="95" stroke="#d4a94b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          <rect x="170" y="70" width="140" height="50" fill="#7c2d12" stroke="#ea580c" strokeWidth="2" rx="6" />
          <text x="240" y="90" textAnchor="middle" fill="#ea580c" fontSize="12" fontWeight="bold">5. Enter</text>
          <text x="240" y="105" textAnchor="middle" fill="#fed7aa" fontSize="10">Trade (M15)</text>
          
          <line x1="310" y1="95" x2="340" y2="95" stroke="#d4a94b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          <rect x="340" y="70" width="140" height="50" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" rx="6" />
          <text x="410" y="90" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">6. Manage</text>
          <text x="410" y="105" textAnchor="middle" fill="#fca5a5" fontSize="10">SL & TP</text>
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
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Market Structure (HH/HL vs LH/LL)</text>
        
        {/* Uptrend - Higher Highs and Higher Lows */}
        <text x="150" y="60" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">UPTREND</text>
        <polyline points="80,200 120,150 160,180 200,120 240,160 280,100" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="120" cy="150" r="4" fill="#22c55e" />
        <text x="120" y="140" textAnchor="middle" fill="#22c55e" fontSize="9">HH</text>
        <circle cx="200" cy="120" r="4" fill="#22c55e" />
        <text x="200" y="110" textAnchor="middle" fill="#22c55e" fontSize="9">HH</text>
        <circle cx="160" cy="180" r="4" fill="#86efac" />
        <text x="160" y="195" textAnchor="middle" fill="#86efac" fontSize="9">HL</text>
        <circle cx="240" cy="160" r="4" fill="#86efac" />
        <text x="240" y="175" textAnchor="middle" fill="#86efac" fontSize="9">HL</text>
        
        {/* Downtrend - Lower Highs and Lower Lows */}
        <text x="450" y="60" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">DOWNTREND</text>
        <polyline points="370,100 410,150 450,120 490,180 530,150 570,200" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="410" cy="150" r="4" fill="#ef4444" />
        <text x="410" y="165" textAnchor="middle" fill="#ef4444" fontSize="9">LH</text>
        <circle cx="490" cy="180" r="4" fill="#ef4444" />
        <text x="490" y="195" textAnchor="middle" fill="#ef4444" fontSize="9">LH</text>
        <circle cx="450" cy="120" r="4" fill="#fca5a5" />
        <text x="450" y="110" textAnchor="middle" fill="#fca5a5" fontSize="9">LL</text>
        <circle cx="530" cy="150" r="4" fill="#fca5a5" />
        <text x="530" y="140" textAnchor="middle" fill="#fca5a5" fontSize="9">LL</text>
      </svg>
    ),

    liquidity: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="liqBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#liqBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Liquidity Zones & Sweeps</text>
        
        {/* Previous high */}
        <line x1="100" y1="120" x2="500" y2="120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <text x="510" y="125" fill="#3b82f6" fontSize="11" fontWeight="bold">Previous High</text>
        
        {/* Price action */}
        <polyline points="100,200 150,180 200,150 250,140 300,145 350,140 400,160 450,150 500,170" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Liquidity sweep */}
        <circle cx="250" cy="140" r="6" fill="none" stroke="#ef4444" strokeWidth="2" />
        <text x="250" y="110" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Sweep!</text>
        <line x1="250" y1="115" x2="250" y2="135" stroke="#ef4444" strokeWidth="1.5" />
        
        {/* Buy zone after sweep */}
        <rect x="280" y="150" width="80" height="40" fill="#22c55e" opacity="0.2" rx="4" />
        <text x="320" y="175" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Buy Zone</text>
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
        
        {/* Bullish order block */}
        <rect x="80" y="120" width="120" height="80" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2" rx="4" />
        <text x="140" y="145" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Bullish</text>
        <text x="140" y="160" textAnchor="middle" fill="#86efac" fontSize="9">Order Block</text>
        <text x="140" y="190" textAnchor="middle" fill="#86efac" fontSize="9">Buy Pressure</text>
        
        {/* Price action through bullish block */}
        <polyline points="80,100 120,90 160,110 200,80 240,120" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Bearish order block */}
        <rect x="320" y="80" width="120" height="80" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="380" y="105" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Bearish</text>
        <text x="380" y="120" textAnchor="middle" fill="#fca5a5" fontSize="9">Order Block</text>
        <text x="380" y="150" textAnchor="middle" fill="#fca5a5" fontSize="9">Sell Pressure</text>
        
        {/* Price action through bearish block */}
        <polyline points="320,150 360,160 400,140 440,170 480,140" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
        
        {/* Gap area */}
        <rect x="200" y="140" width="100" height="60" fill="#8b5cf6" opacity="0.3" stroke="#8b5cf6" strokeWidth="2" rx="4" />
        <text x="250" y="165" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">FVG</text>
        <text x="250" y="190" textAnchor="middle" fill="#c4b5fd" fontSize="9">Gap Zone</text>
        
        {/* Price action - gap creation */}
        <line x1="150" y1="100" x2="200" y2="100" stroke="#22c55e" strokeWidth="2.5" />
        <line x1="200" y1="200" x2="250" y2="200" stroke="#22c55e" strokeWidth="2.5" />
        <text x="170" y="90" fill="#22c55e" fontSize="10">Gap Created</text>
        
        {/* Price returns to fill gap */}
        <polyline points="250,200 280,170 300,160 320,170 350,140" fill="none" stroke="#d4a94b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="320" y="130" fill="#d4a94b" fontSize="10">Returns to Fill</text>
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
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Kill Zones (ICT)</text>
        
        {/* London Open */}
        <rect x="80" y="100" width="100" height="150" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="2" rx="4" />
        <text x="130" y="130" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">London</text>
        <text x="130" y="145" textAnchor="middle" fill="#fca5a5" fontSize="9">Kill Zone</text>
        <text x="130" y="160" textAnchor="middle" fill="#fca5a5" fontSize="8">8:00-12:00</text>
        <text x="130" y="230" textAnchor="middle" fill="#fca5a5" fontSize="9">High Volatility</text>
        
        {/* New York Open */}
        <rect x="250" y="100" width="100" height="150" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="2" rx="4" />
        <text x="300" y="130" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">New York</text>
        <text x="300" y="145" textAnchor="middle" fill="#93c5fd" fontSize="9">Kill Zone</text>
        <text x="300" y="160" textAnchor="middle" fill="#93c5fd" fontSize="8">13:00-17:00</text>
        <text x="300" y="230" textAnchor="middle" fill="#93c5fd" fontSize="9">High Volatility</text>
        
        {/* Asian Session */}
        <rect x="420" y="100" width="100" height="150" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2" rx="4" />
        <text x="470" y="130" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Asian</text>
        <text x="470" y="145" textAnchor="middle" fill="#86efac" fontSize="9">Session</text>
        <text x="470" y="160" textAnchor="middle" fill="#86efac" fontSize="8">21:00-08:00</text>
        <text x="470" y="230" textAnchor="middle" fill="#86efac" fontSize="9">Low Volatility</text>
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
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Risk Management Formula</text>
        
        <text x="300" y="70" textAnchor="middle" fill="#d4a94b" fontSize="13" fontWeight="bold">Position Size = (Account × Risk %) / Pips Risk</text>
        
        <rect x="50" y="100" width="500" height="150" fill="#1a1a2e" stroke="#d4a94b" strokeWidth="2" rx="8" />
        
        <text x="70" y="130" fill="#d4a94b" fontSize="12" fontWeight="bold">Example:</text>
        <text x="70" y="155" fill="#93c5fd" fontSize="11">Account: $10,000</text>
        <text x="70" y="175" fill="#93c5fd" fontSize="11">Risk per Trade: 2% = $200</text>
        <text x="70" y="195" fill="#93c5fd" fontSize="11">Stop Loss: 50 pips away</text>
        <text x="70" y="215" fill="#22c55e" fontSize="12" fontWeight="bold">Position Size = $200 / 50 = 0.04 lots (4,000 units)</text>
        
        <text x="300" y="290" textAnchor="middle" fill="#fca5a5" fontSize="11">Never risk more than 2% per trade!</text>
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
        
        {/* Head and Shoulders */}
        <text x="150" y="70" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">Head & Shoulders</text>
        <polyline points="100,150 120,120 140,150 160,100 180,150 200,140" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="100" y1="150" x2="200" y2="150" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Double Top */}
        <text x="450" y="70" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Double Top</text>
        <polyline points="400,150 420,100 440,150 460,100 480,150" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="400" y1="150" x2="480" y2="150" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Triangle */}
        <text x="150" y="260" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Triangle</text>
        <polyline points="100,280 150,200 200,280" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="100" y1="280" x2="200" y2="280" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Flag */}
        <text x="450" y="260" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">Flag</text>
        <polyline points="400,280 430,250 460,270 480,240" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="400" y="240" width="80" height="40" fill="#8b5cf6" opacity="0.1" />
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
        
        {/* Bullish Candle */}
        <text x="120" y="70" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Bullish</text>
        <line x1="120" y1="100" x2="120" y2="180" stroke="#22c55e" strokeWidth="1" />
        <rect x="105" y="130" width="30" height="40" fill="#22c55e" stroke="#22c55e" strokeWidth="2" />
        <text x="120" y="210" textAnchor="middle" fill="#86efac" fontSize="9">Open &lt; Close</text>
        
        {/* Bearish Candle */}
        <text x="300" y="70" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Bearish</text>
        <line x1="300" y1="100" x2="300" y2="180" stroke="#ef4444" strokeWidth="1" />
        <rect x="285" y="110" width="30" height="40" fill="#ef4444" stroke="#ef4444" strokeWidth="2" />
        <text x="300" y="210" textAnchor="middle" fill="#fca5a5" fontSize="9">Open &gt; Close</text>
        
        {/* Doji */}
        <text x="480" y="70" textAnchor="middle" fill="#d4a94b" fontSize="11" fontWeight="bold">Doji</text>
        <line x1="480" y1="100" x2="480" y2="180" stroke="#d4a94b" strokeWidth="1" />
        <line x1="470" y1="140" x2="490" y2="140" stroke="#d4a94b" strokeWidth="3" />
        <text x="480" y="210" textAnchor="middle" fill="#fef3c7" fontSize="9">Indecision</text>
      </svg>
    ),

    trend: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#tBg)" rx="12" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Bullish (Green) = Uptrend | Bearish (Red) = Downtrend</text>
        
        <polyline points="80,200 120,180 160,160 200,140 240,120 280,100 320,90 360,80 400,100 440,120 480,140 520,160 560,180" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="300" y="280" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Uptrend: Each peak and valley is higher than the previous</text>
        
        <polyline points="80,100 120,120 160,140 200,160 240,180 280,200 320,210 360,220 400,200 440,180 480,160 520,140 560,120" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="300" y="320" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Downtrend: Each peak and valley is lower than the previous</text>
      </svg>
    ),

    riskManagementFramework: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rmf2Bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#rmf2Bg)" rx="12" />
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
        <p className="text-gray-400 text-sm">Diagram type "{type}" not found</p>
      </div>
    );
  }

  return DiagramComponent;
};

export default TradingDiagrams;
