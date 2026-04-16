import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Filter,
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  ChevronDown,
  X,
  RefreshCw,
  Bell
} from 'lucide-react';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, IMPACT_LEVELS, EVENT_CATEGORIES } from '../lib/economicCalendarSchema';

const EconomicCalendar = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter states
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'EUR', 'GBP']);
  const [selectedImpact, setSelectedImpact] = useState(['HIGH', 'MEDIUM']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('week'); // week, month, all

  // Available filter options
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];
  const impactLevels = ['HIGH', 'MEDIUM', 'LOW'];
  const categories = Object.values(EVENT_CATEGORIES);

  /**
   * Fetch events from Firestore with filters
   */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const now = new Date();
      let endDate = new Date();

      // Calculate end date based on range
      if (dateRange === 'week') {
        endDate.setDate(endDate.getDate() + 7);
      } else if (dateRange === 'month') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 3);
      }

      // Build query with filters
      let constraints = [
        where('eventTime', '>=', Timestamp.fromDate(now)),
        where('eventTime', '<=', Timestamp.fromDate(endDate)),
        where('currency', 'in', selectedCurrencies.length > 0 ? selectedCurrencies : currencies),
        where('impact', 'in', selectedImpact.length > 0 ? selectedImpact : impactLevels),
        orderBy('eventTime', 'asc')
      ];

      // Add category filter if selected
      if (selectedCategories.length > 0) {
        constraints.push(where('category', 'in', selectedCategories));
      }

      const q = query(collection(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS), ...constraints);

      // Real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(fetchedEvents);
        setLoading(false);
      });

      return unsubscribe;

    } catch (err) {
      console.error('Error fetching events:', err);
      setError(true);
      setLoading(false);
    }
  }, [selectedCurrencies, selectedImpact, selectedCategories, dateRange]);

  useEffect(() => {
    const unsubscribe = fetchEvents();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchEvents]);

  /**
   * Get impact badge color
   */
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  /**
   * Get event status badge
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', color: 'bg-blue-500/20 text-blue-400' };
      case 'alert_sent':
        return { text: 'Alert Sent', color: 'bg-amber-500/20 text-amber-400' };
      case 'released':
        return { text: 'Released', color: 'bg-green-500/20 text-green-400' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500/20 text-gray-400' };
    }
  };

  /**
   * Format date time
   */
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  };

  /**
   * Get title in current language
   */
  const getLocalizedTitle = (event) => {
    const langKey = `title${i18n.language === 'ar' ? 'Ar' : i18n.language === 'en' ? 'En' : i18n.language === 'fr' ? 'Fr' : 'Es'}`;
    return event[langKey] || event.title;
  };

  return (
    <div className="w-full bg-black/50 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Economic Calendar</h2>
            <p className="text-sm text-gray-500">Real-time forex economic events</p>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:text-black transition-all"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">Filters</span>
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl space-y-6"
          >
            {/* Date Range */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Date Range</label>
              <div className="flex gap-2">
                {['week', 'month', 'all'].map(range => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      dateRange === range
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Levels */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Impact Level</label>
              <div className="flex flex-wrap gap-2">
                {impactLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedImpact(prev =>
                        prev.includes(level)
                          ? prev.filter(l => l !== level)
                          : [...prev, level]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      selectedImpact.includes(level)
                        ? getImpactColor(level)
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Currencies */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Currencies</label>
              <div className="flex flex-wrap gap-2">
                {currencies.map(curr => (
                  <button
                    key={curr}
                    onClick={() => {
                      setSelectedCurrencies(prev =>
                        prev.includes(curr)
                          ? prev.filter(c => c !== curr)
                          : [...prev, curr]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      selectedCurrencies.includes(curr)
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategories(prev =>
                        prev.includes(cat)
                          ? prev.filter(c => c !== cat)
                          : [...prev, cat]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategories.includes(cat)
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      {error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Error loading events</p>
          <button
            onClick={() => fetchEvents()}
            className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No events found for selected filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-amber-500/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Event Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold group-hover:text-amber-500 transition-colors">
                      {getLocalizedTitle(event)}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{event.currency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(event.eventTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{event.category}</span>
                    </div>
                  </div>
                </div>

                {/* Economic Data */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Forecast</p>
                    <p className="text-white font-semibold">{event.forecast || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Previous</p>
                    <p className="text-white font-semibold">{event.previous || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Actual</p>
                    <p className={`font-semibold ${event.actual ? 'text-green-400' : 'text-gray-500'}`}>
                      {event.actual || 'Pending'}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusBadge(event.status).color}`}>
                      {getStatusBadge(event.status).text}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Bell className="w-3 h-3" />
          <span>Alerts sent 5 minutes before HIGH impact events</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          <span>Updated every 15 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default EconomicCalendar;
