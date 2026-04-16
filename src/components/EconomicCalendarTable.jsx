import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { forexFactoryScraperReal } from '../lib/forexFactoryScraperReal';

const EconomicCalendarTable = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'EUR', 'GBP', 'JPY']);
  const [selectedImpacts, setSelectedImpacts] = useState(['HIGH', 'MEDIUM', 'LOW']);

  // Fetch events on mount and set up interval
  useEffect(() => {
    const fetchEconomicEvents = async () => {
      setLoading(true);
      try {
        const allEvents = await forexFactoryScraperReal.fetchEvents();
        const filtered = forexFactoryScraperReal.filterEvents(allEvents, selectedCurrencies, selectedImpacts);
        const sorted = forexFactoryScraperReal.sortEventsByTime(filtered);
        setEvents(sorted);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents(forexFactoryScraperReal.getFallbackEvents());
      } finally {
        setLoading(false);
      }
    };

    fetchEconomicEvents();
    // Refresh every 15 minutes
    const interval = setInterval(fetchEconomicEvents, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedCurrencies, selectedImpacts]);

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'HIGH':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'MEDIUM':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  // Get impact icon
  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'HIGH':
        return <AlertCircle className="w-4 h-4" />;
      case 'MEDIUM':
        return <TrendingUp className="w-4 h-4" />;
      case 'LOW':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === 'released') {
      return <span className="text-xs font-black uppercase px-2 py-1 rounded bg-green-500/20 text-green-500">Released</span>;
    }
    return <span className="text-xs font-black uppercase px-2 py-1 rounded bg-blue-500/20 text-blue-500">Pending</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-amber-500" />
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {t('news.economicCalendar', 'Economic Calendar')}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Forex Factory Real-Time Data</p>
          </div>
        </div>
        <button
          onClick={() => {
            forexFactoryScraperReal.clearCache();
            setLoading(true);
          }}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Currency Filter */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Currencies</p>
          <div className="flex flex-wrap gap-2">
            {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'].map(currency => (
              <button
                key={currency}
                onClick={() => {
                  setSelectedCurrencies(prev =>
                    prev.includes(currency)
                      ? prev.filter(c => c !== currency)
                      : [...prev, currency]
                  );
                }}
                className={`text-xs font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all border ${
                  selectedCurrencies.includes(currency)
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white/5 text-white border-white/10 hover:border-white/20'
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Filter */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Impact Level</p>
          <div className="flex flex-wrap gap-2">
            {['HIGH', 'MEDIUM', 'LOW'].map(impact => (
              <button
                key={impact}
                onClick={() => {
                  setSelectedImpacts(prev =>
                    prev.includes(impact)
                      ? prev.filter(i => i !== impact)
                      : [...prev, impact]
                  );
                }}
                className={`text-xs font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all border ${
                  selectedImpacts.includes(impact)
                    ? getImpactColor(impact) + ' border-current'
                    : 'bg-white/5 text-white border-white/10 hover:border-white/20'
                }`}
              >
                {impact}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin mb-3">
            <RefreshCw className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-sm text-gray-500">Loading economic events from Forex Factory...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Currency</th>
                <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Impact</th>
                <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Event</th>
                <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Forecast</th>
                <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Previous</th>
                <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Actual</th>
                <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {event.time}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-black text-amber-500">{event.currency}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-2 text-sm font-black px-2 py-1 rounded w-fit ${getImpactColor(event.impact)}`}>
                        {getImpactIcon(event.impact)}
                        {event.impact}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-white font-semibold">{event.title}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-300">{event.forecast}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-300">{event.previous}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {event.actual ? (
                        <span className="text-sm font-black text-green-500">{event.actual}</span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(event.status)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No events found for selected filters</p>
        </div>
      )}

      {/* Cache Status */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-xs text-gray-500">
          Last updated: {events.length > 0 ? new Date(events[0].fetchedAt).toLocaleTimeString() : 'Never'} • 
          Data refreshes every 15 minutes
        </p>
      </div>
    </motion.div>
  );
};

export default EconomicCalendarTable;
