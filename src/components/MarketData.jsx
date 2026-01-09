import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MarketData = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      // Using CoinGecko API for live crypto/market data as a free example
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&per_page=5&page=1&sparkline=false');
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/60 backdrop-blur-xl border-y border-yellow-500/20 py-3 md:py-4 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 text-yellow-500 shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('market.live')}</span>
        </div>
        
        <div className="flex gap-8 md:gap-12 animate-marquee whitespace-nowrap">
          {data.map((coin) => (
            <div key={coin.id} className="flex items-center gap-3">
              <span className="text-sm font-black text-white uppercase">{coin.symbol}</span>
              <span className="text-sm font-bold text-gray-300">${coin.current_price.toLocaleString()}</span>
              <div className={`flex items-center text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>

        {lastUpdated && (
          <div className="ml-auto text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:block">
            {t('market.updated')}: {lastUpdated}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MarketData;
