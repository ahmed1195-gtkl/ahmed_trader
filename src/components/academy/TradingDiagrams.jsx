import React from 'react';

// SVG Trading Diagrams Component
const DiagramSVG = ({ type, className = '' }) => {
  const baseClass = `w-full h-auto ${className}`;
  
  const diagrams = {
    tradingIntro: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tiBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
          <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="600" height="350" fill="url(#tiBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">WHAT IS TRADING? / ما هو التداول؟</text>
        
        {/* Core Concept: Capital -> Market -> Assets -> Profit */}
        <g transform="translate(50, 70)">
          {/* Capital Node */}
          <rect x="20" y="70" width="110" height="60" fill="rgba(255,255,255,0.03)" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" rx="10" />
          <text x="75" y="95" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Capital / رأس المال</text>
          <text x="75" y="115" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">$ $ $</text>

          {/* Flow Arrow to Right */}
          <path d="M 140 100 L 210 100" fill="none" stroke="url(#goldGlow)" strokeWidth="2.5" markerEnd="url(#arrowGold)" />
          
          {/* Market Node */}
          <rect x="220" y="40" width="120" height="120" fill="rgba(245,158,11,0.05)" stroke="url(#goldGlow)" strokeWidth="2" rx="60" filter="url(#glow)" />
          <text x="280" y="95" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">Market / السوق</text>
          <text x="280" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">Exchange / تبادل</text>

          {/* Flow Arrow to Right */}
          <path d="M 350 100 L 420 100" fill="none" stroke="url(#goldGlow)" strokeWidth="2.5" markerEnd="url(#arrowGold)" />
          
          {/* Assets Node */}
          <rect x="430" y="70" width="110" height="60" fill="rgba(255,255,255,0.03)" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" rx="10" />
          <text x="485" y="95" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Assets / الأصول</text>
          <text x="485" y="115" textAnchor="middle" fill="#3b82f6" fontSize="10">Stocks, Forex, Crypto</text>

          {/* Return flow: Profits */}
          <path d="M 485 140 C 485 220, 75 220, 75 140" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#arrowGreen)" />
          <text x="280" y="215" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">Returns & Profits / الأرباح والعوائد</text>
        </g>
        
        <defs>
          <marker id="arrowGold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
          </marker>
          <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="6 6, 0 3, 6 0" fill="#10b981" />
          </marker>
        </defs>
      </svg>
    ),

    supplyDemand: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sdBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#sdBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">SUPPLY & DEMAND / العرض والطلب</text>
        
        <g transform="translate(100, 60)">
          {/* Axis */}
          <line x1="50" y1="50" x2="50" y2="250" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="250" x2="450" y2="250" stroke="#475569" strokeWidth="2" />
          <text x="30" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">Price / السعر</text>
          <text x="450" y="270" textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="bold">Quantity / الكمية</text>
          
          {/* Demand Curve (Downward sloping) */}
          <path d="M 80 80 L 400 220" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <text x="70" y="75" fill="#10b981" fontSize="11" fontWeight="bold">Demand / الطلب</text>
          
          {/* Supply Curve (Upward sloping) */}
          <path d="M 80 220 L 400 80" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <text x="410" y="75" fill="#ef4444" fontSize="11" fontWeight="bold">Supply / العرض</text>
          
          {/* Equilibrium Point */}
          <circle cx="240" cy="150" r="7" fill="#f59e0b" />
          <circle cx="240" cy="150" r="14" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
          
          {/* Dotted lines to Axis */}
          <line x1="240" y1="150" x2="50" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
          <line x1="240" y1="150" x2="240" y2="250" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
          
          <text x="250" y="140" fill="#f59e0b" fontSize="12" fontWeight="bold">Equilibrium Price / سعر التوازن</text>
        </g>
      </svg>
    ),

    marketParticipants: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mpBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
          <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="goldGlow2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#mpBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">MARKET PARTICIPANTS / صناع السوق</text>
        
        {/* Institutions/Banks card */}
        <g transform="translate(50, 70)">
          <rect x="0" y="0" width="230" height="230" fill="rgba(251,191,36,0.03)" stroke="url(#goldGlow2)" strokeWidth="2" rx="12" />
          <circle cx="115" cy="65" r="35" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="2" />
          <text x="115" y="72" textAnchor="middle" fill="#f59e0b" fontSize="24" fontWeight="bold">🏦</text>
          <text x="115" y="130" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold">Institutions / المؤسسات</text>
          <text x="115" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">Central Banks & Hedge Funds</text>
          <text x="115" y="178" textAnchor="middle" fill="#e2e8f0" fontSize="11">بنوك استثمارية وصناديق تحوط</text>
          <rect x="45" y="195" width="140" height="25" fill="#d97706" rx="6" />
          <text x="115" y="212" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">90% of Volume / السيولة</text>
        </g>
        
        {/* Retail Traders card */}
        <g transform="translate(320, 70)">
          <rect x="0" y="0" width="230" height="230" fill="rgba(59,130,246,0.03)" stroke="url(#blueGlow)" strokeWidth="2" rx="12" />
          <circle cx="115" cy="65" r="35" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="2" />
          <text x="115" y="72" textAnchor="middle" fill="#3b82f6" fontSize="24" fontWeight="bold">💻</text>
          <text x="115" y="130" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">Retail Traders / الأفراد</text>
          <text x="115" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">Individual Retail Accounts</text>
          <text x="115" y="178" textAnchor="middle" fill="#e2e8f0" fontSize="11">المتداولون الأفراد والمبتدئون</text>
          <rect x="45" y="195" width="140" height="25" fill="#2563eb" rx="6" />
          <text x="115" y="212" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">10% of Volume / السيولة</text>
        </g>
      </svg>
    ),

    priceImbalance: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="piBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#piBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">IMBALANCE / خلل التوازن</text>
        
        {/* Demand > Supply -> Rise */}
        <g transform="translate(60, 80)">
          <rect x="0" y="0" width="220" height="210" fill="rgba(16,185,129,0.03)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" rx="12" />
          <text x="110" y="30" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">Demand &gt; Supply</text>
          <text x="110" y="50" textAnchor="middle" fill="#94a3b8" fontSize="10">الطلب أكبر من العرض</text>
          
          {/* Green Candle shooting up */}
          <line x1="110" y1="75" x2="110" y2="185" stroke="#10b981" strokeWidth="2.5" />
          <rect x="95" y="90" width="30" height="75" fill="#10b981" rx="4" />
          <path d="M 110 85 L 110 70" fill="none" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowGreenSmall)" />
          <text x="110" y="195" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">Price Rises / يرتفع السعر</text>
        </g>
        
        {/* Supply > Demand -> Fall */}
        <g transform="translate(320, 80)">
          <rect x="0" y="0" width="220" height="210" fill="rgba(239,68,68,0.03)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" rx="12" />
          <text x="110" y="30" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">Supply &gt; Demand</text>
          <text x="110" y="50" textAnchor="middle" fill="#94a3b8" fontSize="10">العرض أكبر من الطلب</text>
          
          {/* Red Candle collapsing */}
          <line x1="110" y1="75" x2="110" y2="185" stroke="#ef4444" strokeWidth="2.5" />
          <rect x="95" y="95" width="30" height="75" fill="#ef4444" rx="4" />
          <path d="M 110 165 L 110 180" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowRedSmall)" />
          <text x="110" y="195" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Price Falls / ينخفض السعر</text>
        </g>

        <defs>
          <marker id="arrowGreenSmall" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <polygon points="0 4, 2 0, 4 4" fill="#10b981" />
          </marker>
          <marker id="arrowRedSmall" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <polygon points="0 0, 2 4, 4 0" fill="#ef4444" />
          </marker>
        </defs>
      </svg>
    ),

    marketTypes: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mtBoxBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#mtBoxBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">TYPES OF MARKETS / أنواع الأسواق</text>
        
        {/* Grid of 4 markets */}
        <g transform="translate(60, 65)">
          {/* Forex */}
          <rect x="0" y="0" width="220" height="110" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.1)" strokeWidth="1" rx="8" />
          <text x="25" y="35" fill="#f59e0b" fontSize="20">💱</text>
          <text x="60" y="32" fill="#ffffff" fontSize="13" fontWeight="bold">Forex / الفوركس</text>
          <text x="60" y="55" fill="#94a3b8" fontSize="10">Currencies (EUR/USD)</text>
          <text x="60" y="75" fill="#94a3b8" fontSize="10">تداول العملات الأجنبية</text>
          <rect x="60" y="85" width="70" height="15" fill="rgba(16,185,129,0.1)" rx="3" />
          <text x="95" y="96" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">24/5 Open</text>

          {/* Crypto */}
          <rect x="260" y="0" width="220" height="110" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.1)" strokeWidth="1" rx="8" />
          <text x="285" y="35" fill="#f59e0b" fontSize="20">🪙</text>
          <text x="320" y="32" fill="#ffffff" fontSize="13" fontWeight="bold">Crypto / الكريبتو</text>
          <text x="320" y="55" fill="#94a3b8" fontSize="10">Bitcoin, Ethereum</text>
          <text x="320" y="75" fill="#94a3b8" fontSize="10">العملات الرقمية المشفرة</text>
          <rect x="320" y="85" width="70" height="15" fill="rgba(16,185,129,0.1)" rx="3" />
          <text x="355" y="96" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">24/7 Open</text>

          {/* Stocks */}
          <rect x="0" y="130" width="220" height="110" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.1)" strokeWidth="1" rx="8" />
          <text x="25" y="165" fill="#f59e0b" fontSize="20">📈</text>
          <text x="60" y="162" fill="#ffffff" fontSize="13" fontWeight="bold">Stocks / الأسهم</text>
          <text x="60" y="185" fill="#94a3b8" fontSize="10">Apple, Tesla Shares</text>
          <text x="60" y="205" fill="#94a3b8" fontSize="10">أسهم الشركات العالمية</text>
          <rect x="60" y="215" width="70" height="15" fill="rgba(239,68,68,0.1)" rx="3" />
          <text x="95" y="226" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">Sessions</text>

          {/* Commodities */}
          <rect x="260" y="130" width="220" height="110" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.1)" strokeWidth="1" rx="8" />
          <text x="285" y="165" fill="#f59e0b" fontSize="20">✨</text>
          <text x="320" y="162" fill="#ffffff" fontSize="13" fontWeight="bold">Commodities / السلع</text>
          <text x="320" y="185" fill="#94a3b8" fontSize="10">Gold, Silver, Crude Oil</text>
          <text x="320" y="205" fill="#94a3b8" fontSize="10">الذهب، الفضة، النفط</text>
          <rect x="320" y="215" width="70" height="15" fill="rgba(239,68,68,0.1)" rx="3" />
          <text x="355" y="226" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">Sessions</text>
        </g>
      </svg>
    ),

    orderTypes: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="otBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#otBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">ORDER TYPES / أنواع الأوامر</text>
        
        {/* Market Order */}
        <g transform="translate(40, 70)">
          <rect x="0" y="0" width="140" height="220" fill="rgba(16,185,129,0.02)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" rx="10" />
          <text x="70" y="35" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">Market Order</text>
          <text x="70" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">أمر السوق</text>
          <text x="70" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">Executes instantly</text>
          <text x="70" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">at current price</text>
          <rect x="20" y="145" width="100" height="25" fill="#10b981" rx="5" />
          <text x="70" y="162" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Instant / فوري</text>
        </g>
        
        {/* Limit Order */}
        <g transform="translate(230, 70)">
          <rect x="0" y="0" width="140" height="220" fill="rgba(245,158,11,0.02)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" rx="10" />
          <text x="70" y="35" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">Limit Order</text>
          <text x="70" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">الأمر المحدد</text>
          <text x="70" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">Executes only at</text>
          <text x="70" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">specified price</text>
          <rect x="20" y="145" width="100" height="25" fill="#d97706" rx="5" />
          <text x="70" y="162" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Pending / معلق</text>
        </g>
        
        {/* Stop Order */}
        <g transform="translate(420, 70)">
          <rect x="0" y="0" width="140" height="220" fill="rgba(239,68,68,0.02)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" rx="10" />
          <text x="70" y="35" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Stop Loss</text>
          <text x="70" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">إيقاف الخسارة</text>
          <text x="70" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">Triggers automatically</text>
          <text x="70" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">to protect account</text>
          <rect x="20" y="145" width="100" height="25" fill="#ef4444" rx="5" />
          <text x="70" y="162" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Protection / حماية</text>
        </g>
      </svg>
    ),

    platformMockup: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pmBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#pmBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">TRADING PLATFORM / منصة التداول</text>
        
        {/* Stylized Trading Terminal Mockup */}
        <g transform="translate(50, 60)">
          {/* Main frame */}
          <rect x="0" y="0" width="500" height="240" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="8" />
          
          {/* Top toolbar */}
          <rect x="0" y="0" width="500" height="30" fill="rgba(255,255,255,0.05)" rx="8" />
          <circle cx="15" cy="15" r="5" fill="#ef4444" />
          <circle cx="30" cy="15" r="5" fill="#f59e0b" />
          <circle cx="45" cy="15" r="5" fill="#10b981" />
          <text x="250" y="20" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">TradingView Chart - EURUSD H4</text>
          
          {/* Sidebar */}
          <rect x="0" y="30" width="100" height="210" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x="10" y="55" fill="#ffffff" fontSize="10" fontWeight="bold">Watchlist</text>
          <text x="10" y="80" fill="#10b981" fontSize="9">🟢 EURUSD</text>
          <text x="10" y="105" fill="#ef4444" fontSize="9">🔴 GBPUSD</text>
          <text x="10" y="130" fill="#10b981" fontSize="9">🟢 BTCUSD</text>
          <text x="10" y="155" fill="#94a3b8" fontSize="9">⚪ XAUUSD</text>
          
          {/* Chart area */}
          <g transform="translate(100, 30)">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            
            {/* Candles */}
            {/* Candle 1 (Green) */}
            <line x1="50" y1="100" x2="50" y2="180" stroke="#10b981" strokeWidth="2" />
            <rect x="40" y="120" width="20" height="50" fill="#10b981" rx="2" />
            
            {/* Candle 2 (Green) */}
            <line x1="100" y1="70" x2="100" y2="160" stroke="#10b981" strokeWidth="2" />
            <rect x="90" y="90" width="20" height="50" fill="#10b981" rx="2" />
            
            {/* Candle 3 (Red) */}
            <line x1="150" y1="60" x2="150" y2="140" stroke="#ef4444" strokeWidth="2" />
            <rect x="140" y="80" width="20" height="45" fill="#ef4444" rx="2" />
            
            {/* Candle 4 (Green) */}
            <line x1="200" y1="30" x2="200" y2="120" stroke="#10b981" strokeWidth="2" />
            <rect x="190" y="50" width="20" height="55" fill="#10b981" rx="2" />
            
            {/* Candle 5 (Red) */}
            <line x1="250" y1="40" x2="250" y2="150" stroke="#ef4444" strokeWidth="2" />
            <rect x="240" y="65" width="20" height="70" fill="#ef4444" rx="2" />

            {/* Price Line */}
            <line x1="0" y1="65" x2="400" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
            <rect x="340" y="55" width="60" height="18" fill="#ef4444" rx="3" />
            <text x="370" y="68" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">1.08542</text>
          </g>
        </g>
      </svg>
    ),

    candlestickIntro: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ciBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0b14" />
            <stop offset="100%" stopColor="#030307" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#ciBg)" rx="16" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="35" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold" letterSpacing="0.05em">CANDLESTICK ANATOMY / تشريح الشمعة</text>
        
        {/* Bullish Candle (Green) */}
        <g transform="translate(80, 60)">
          <line x1="100" y1="40" x2="100" y2="240" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <rect x="75" y="80" width="50" height="120" fill="#10b981" stroke="#10b981" strokeWidth="1" rx="4" />
          
          <text x="100" y="270" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">Bullish / صاعدة</text>
          
          {/* Anatomical Lines */}
          <line x1="100" y1="40" x2="170" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="44" fill="#94a3b8" fontSize="10">High / أعلى سعر</text>
          
          <line x1="125" y1="80" x2="170" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="84" fill="#10b981" fontSize="10" fontWeight="bold">Close / الإغلاق</text>
          
          <line x1="125" y1="200" x2="170" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="204" fill="#94a3b8" fontSize="10">Open / الافتتاح</text>
          
          <line x1="100" y1="240" x2="170" y2="240" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="244" fill="#94a3b8" fontSize="10">Low / أدنى سعر</text>
        </g>
        
        {/* Bearish Candle (Red) */}
        <g transform="translate(340, 60)">
          <line x1="100" y1="40" x2="100" y2="240" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <rect x="75" y="80" width="50" height="120" fill="#ef4444" stroke="#ef4444" strokeWidth="1" rx="4" />
          
          <text x="100" y="270" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">Bearish / هابطة</text>
          
          {/* Anatomical Lines */}
          <line x1="100" y1="40" x2="170" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="44" fill="#94a3b8" fontSize="10">High / أعلى سعر</text>
          
          <line x1="125" y1="80" x2="170" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="84" fill="#94a3b8" fontSize="10">Open / الافتتاح</text>
          
          <line x1="125" y1="200" x2="170" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="204" fill="#ef4444" fontSize="10" fontWeight="bold">Close / الإغلاق</text>
          
          <line x1="100" y1="240" x2="170" y2="240" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="180" y="244" fill="#94a3b8" fontSize="10">Low / أدنى سعر</text>
        </g>
      </svg>
    ),

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

    cryptoIntro: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crIntroBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldHalving" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#crIntroBg)" rx="12" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" />
        <text x="300" y="30" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">Bitcoin Halving & Supply Scarcity</text>
        
        {/* Halving Timeline */}
        <g transform="translate(40, 70)">
          {/* Horizontal Axis line */}
          <line x1="20" y1="180" x2="500" y2="180" stroke="#475569" strokeWidth="2" />
          
          {/* Halving Steps */}
          {[
            { x: 50, year: '2012', reward: '25 BTC', price: '$12', label: '1st Halving' },
            { x: 170, year: '2016', reward: '12.5 BTC', price: '$650', label: '2nd Halving' },
            { x: 290, year: '2020', reward: '6.25 BTC', price: '$8,800', label: '3rd Halving' },
            { x: 410, year: '2024', reward: '3.125 BTC', price: '$64,000', label: '4th Halving' }
          ].map((item, idx) => (
            <g key={idx} transform={`translate(${item.x}, 0)`}>
              {/* Vertical line connecting tick to axis */}
              <line x1="0" y1="180" x2="0" y2="60" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Event point */}
              <circle cx="0" cy="180" r="6" fill="#f59e0b" />
              <circle cx="0" cy="180" r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
              
              {/* Info bubble */}
              <rect x="-45" y="60" width="90" height="70" fill="rgba(15,23,42,0.85)" stroke="#f59e0b" strokeWidth="1.5" rx="6" />
              <text x="0" y="78" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">{item.year}</text>
              <text x="0" y="98" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">{item.reward}</text>
              <text x="0" y="118" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">{item.price}</text>
              
              <text x="0" y="205" textAnchor="middle" fill="#94a3b8" fontSize="10">{item.label}</text>
            </g>
          ))}

          {/* Supply Curve */}
          <path d="M 10 30 Q 150 100 480 160" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,3" />
          <text x="140" y="125" fill="#ef4444" fontSize="10" transform="rotate(10, 140, 125)">Supply Issuance Rate Drops</text>

          {/* Price Demand Curve */}
          <path d="M 50 170 Q 200 130 430 40" fill="none" stroke="#22c55e" strokeWidth="3" />
          <text x="320" y="75" fill="#22c55e" fontSize="11" fontWeight="bold" transform="rotate(-20, 320, 75)">Stock-to-Flow Price Trend</text>
        </g>
      </svg>
    ),

    onchainMetrics: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ocBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#ocBg)" rx="12" stroke="rgba(59,130,246,0.2)" strokeWidth="1.5" />
        <text x="300" y="30" textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="bold">On-Chain Flow: Exchange Reserves</text>
        
        {/* Left Side: Long-term Accumulation */}
        <g transform="translate(40, 60)">
          <rect x="0" y="0" width="220" height="220" fill="rgba(34,197,94,0.02)" stroke="#22c55e" strokeWidth="1.5" rx="8" />
          <text x="110" y="25" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Bullish Accumulation Flow</text>
          
          <rect x="40" y="55" width="140" height="40" fill="rgba(15,23,42,0.6)" stroke="#475569" rx="6" />
          <text x="110" y="79" textAnchor="middle" fill="#e2e8f0" fontSize="10">Exchange Reserves Drop</text>
          
          {/* Arrow out of exchange */}
          <path d="M 110 115 L 110 160" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreenOnchain)" />
          
          <rect x="30" y="175" width="160" height="35" fill="#22c55e" rx="6" />
          <text x="110" y="196" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Cold Wallet Storage (Hold)</text>
        </g>
        
        {/* Right Side: Distribution / Selling Pressure */}
        <g transform="translate(340, 60)">
          <rect x="0" y="0" width="220" height="220" fill="rgba(239,68,68,0.02)" stroke="#ef4444" strokeWidth="1.5" rx="8" />
          <text x="110" y="25" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">Bearish Selling Flow</text>
          
          <rect x="30" y="55" width="160" height="35" fill="#ef4444" rx="6" />
          <text x="110" y="76" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Whales Transfer to Exchanges</text>
          
          {/* Arrow into exchange */}
          <path d="M 110 105 L 110 150" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRedOnchain)" />
          
          <rect x="40" y="165" width="140" height="40" fill="rgba(15,23,42,0.6)" stroke="#475569" rx="6" />
          <text x="110" y="189" textAnchor="middle" fill="#e2e8f0" fontSize="10">Exchange Reserves Spike</text>
        </g>

        <defs>
          <marker id="arrowGreenOnchain" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#22c55e" />
          </marker>
          <marker id="arrowRedOnchain" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#ef4444" />
          </marker>
        </defs>
      </svg>
    ),

    cryptoLiquidity: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crLqBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08070e" />
            <stop offset="100%" stopColor="#020204" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#crLqBg)" rx="12" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Liquidity Sweep & Liquidation Cascades</text>

        {/* Order Book Bid/Ask visual */}
        <g transform="translate(40, 60)">
          <rect x="0" y="0" width="220" height="230" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" rx="8" />
          <text x="110" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">ORDER BOOK DEPTH</text>
          
          {/* Ask depth (Red) */}
          <rect x="110" y="40" width="90" height="15" fill="rgba(239,68,68,0.3)" />
          <rect x="110" y="60" width="70" height="15" fill="rgba(239,68,68,0.3)" />
          <rect x="110" y="80" width="40" height="15" fill="rgba(239,68,68,0.3)" />
          <text x="30" y="65" fill="#ef4444" fontSize="10">Sells / Offers</text>
          
          {/* Spread */}
          <line x1="10" y1="110" x2="210" y2="110" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
          <text x="110" y="114" textAnchor="middle" fill="#94a3b8" fontSize="10">Spread</text>
          
          {/* Bid depth (Green) */}
          <rect x="110" y="130" width="50" height="15" fill="rgba(34,197,94,0.3)" />
          <rect x="110" y="150" width="80" height="15" fill="rgba(34,197,94,0.3)" />
          <rect x="110" y="170" width="95" height="15" fill="rgba(34,197,94,0.3)" />
          <text x="30" y="165" fill="#22c55e" fontSize="10">Buys / Bids</text>

          <rect x="10" y="195" width="200" height="25" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1" rx="4" />
          <text x="110" y="211" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">High Liquidity Pool (Stop Losses)</text>
        </g>

        {/* Liquidation Sweep chart */}
        <g transform="translate(300, 60)">
          <rect x="0" y="0" width="260" height="230" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" rx="8" />
          <text x="130" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">PRICE SWEEP ACTION</text>
          
          {/* Candlesticks */}
          <line x1="50" y1="40" x2="50" y2="120" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="42" y="60" width="16" height="50" fill="#ef4444" />
          
          {/* Sweep candle (Long wick down) */}
          <line x1="100" y1="70" x2="100" y2="210" stroke="#ef4444" strokeWidth="2" />
          <rect x="92" y="80" width="16" height="60" fill="#ef4444" />
          <circle cx="100" cy="205" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="115" y="208" fill="#f59e0b" fontSize="9" fontWeight="bold">Liquidation Sweep</text>

          {/* Reversal green candle */}
          <line x1="150" y1="90" x2="150" y2="180" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="142" y="100" width="16" height="65" fill="#22c55e" />
          
          {/* Reversal green candle 2 */}
          <line x1="200" y1="50" x2="200" y2="140" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="192" y="60" width="16" height="60" fill="#22c55e" />

          {/* Liquidation level indicator */}
          <line x1="10" y1="200" x2="250" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
          <text x="10" y="195" fill="#ef4444" fontSize="9">Liquidation Price Zone</text>
        </g>
      </svg>
    ),

    leverageRisk: (
      <svg viewBox="0 0 600 350" className={baseClass} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lvBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0a14" />
            <stop offset="100%" stopColor="#020105" />
          </linearGradient>
        </defs>
        <rect width="600" height="350" fill="url(#lvBg)" rx="12" stroke="rgba(239,68,68,0.15)" strokeWidth="1.5" />
        <text x="300" y="30" textAnchor="middle" fill="#d4a94b" fontSize="16" fontWeight="bold">Leverage Risk Alignment</text>
        
        {/* Left Card: 5x Leverage */}
        <g transform="translate(40, 60)">
          <rect x="0" y="0" width="230" height="230" fill="rgba(255,255,255,0.02)" stroke="#22c55e" strokeWidth="1" rx="8" />
          <text x="115" y="25" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">Low Leverage (5x)</text>
          
          <g transform="translate(20, 50)">
            {/* Entry */}
            <rect x="0" y="0" width="150" height="20" fill="rgba(59,130,246,0.15)" rx="4" />
            <text x="10" y="14" fill="#3b82f6" fontSize="10" fontWeight="bold">Entry Price: $40,000</text>
            
            {/* Stop Loss */}
            <rect x="0" y="40" width="150" height="20" fill="rgba(239,68,68,0.15)" rx="4" />
            <text x="10" y="54" fill="#ef4444" fontSize="10" fontWeight="bold">Stop Loss: $38,000 (-5%)</text>
            <line x1="160" y1="10" x2="160" y2="50" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" />
            <text x="170" y="35" fill="#94a3b8" fontSize="9">Risk: 1%</text>

            {/* Liquidation */}
            <rect x="0" y="120" width="150" height="20" fill="rgba(245,158,11,0.1)" rx="4" />
            <text x="10" y="134" fill="#f59e0b" fontSize="10" fontWeight="bold">Liquidation: $32,000 (-20%)</text>
            
            <text x="75" y="105" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">✅ Safe Distance to Liquidation</text>
          </g>
        </g>
        
        {/* Right Card: 50x Leverage */}
        <g transform="translate(330, 60)">
          <rect x="0" y="0" width="230" height="230" fill="rgba(255,255,255,0.02)" stroke="#ef4444" strokeWidth="1" rx="8" />
          <text x="115" y="25" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">High Leverage (50x)</text>
          
          <g transform="translate(20, 50)">
            {/* Entry */}
            <rect x="0" y="0" width="150" height="20" fill="rgba(59,130,246,0.15)" rx="4" />
            <text x="10" y="14" fill="#3b82f6" fontSize="10" fontWeight="bold">Entry Price: $40,000</text>
            
            {/* Liquidation */}
            <rect x="0" y="30" width="150" height="20" fill="rgba(239,68,68,0.2)" rx="4" stroke="#ef4444" strokeWidth="1" />
            <text x="10" y="44" fill="#ef4444" fontSize="10" fontWeight="bold">Liquidation: $39,200 (-2%)</text>
            
            {/* Stop Loss (Behind Liquidation - DANGER!) */}
            <rect x="0" y="120" width="150" height="20" fill="rgba(245,158,11,0.05)" rx="4" />
            <text x="10" y="134" fill="#94a3b8" fontSize="10">Stop Loss: $38,000 (-5%)</text>
            
            <text x="75" y="90" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">⚠️ Liquidation Hit Before SL!</text>
            <text x="75" y="105" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">Account Wiped Out</text>
          </g>
        </g>
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
