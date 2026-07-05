import { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, LogOut } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Brokers from './components/Brokers';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import MarketData from './components/MarketData';
import Feed from './components/Feed';
import ChatWidget from './components/ChatWidget';
import CookieConsent from './components/CookieConsent';
import { FeedSkeleton, DashboardSkeleton, ChatSkeleton, BooksSkeleton, ProfileSkeleton } from './components/ui/PageSkeletons';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import ComingSoonPage from './components/ui/ComingSoonPage';
import './App.css';

// ─── Lazy loading high-performance wrapper ───────────────────────────────────
const withSuspense = (Component, Fallback) => {
  const WrappedComponent = (props) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
  WrappedComponent.displayName = `withSuspense(${Component.name || 'Component'})`;
  return WrappedComponent;
};

const LazyAuth = withSuspense(lazy(() => import('./components/Auth')), FeedSkeleton);
const LazyOnboarding = withSuspense(lazy(() => import('./components/Onboarding')), FeedSkeleton);
const LazyOnboardingFlow = withSuspense(lazy(() => import('./components/OnboardingFlow')), FeedSkeleton);
const LazySettings = withSuspense(lazy(() => import('./components/Settings')), ProfileSkeleton);
const LazyNewsPage = withSuspense(lazy(() => import('./components/NewsPage')), FeedSkeleton);
const LazyGlobalNews = withSuspense(lazy(() => import('./components/GlobalNews')), FeedSkeleton);
const LazyCourses = withSuspense(lazy(() => import('./components/Courses')), BooksSkeleton);
const LazyCourseEnrollment = withSuspense(lazy(() => import('./components/CourseEnrollment')), BooksSkeleton);
const LazyCoursesAdmin = withSuspense(lazy(() => import('./components/CoursesAdmin')), DashboardSkeleton);
const LazyCourseRegistration = withSuspense(lazy(() => import('./components/CourseRegistration')), BooksSkeleton);
const LazyBrokersPage = withSuspense(lazy(() => import('./components/BrokersPage')), DashboardSkeleton);
const LazyAdminDashboard = withSuspense(lazy(() => import('./components/AdminDashboard')), DashboardSkeleton);
const LazyResetPassword = withSuspense(lazy(() => import('./components/ResetPassword')), FeedSkeleton);
const LazyPrivacyPolicy = withSuspense(lazy(() => import('./components/PrivacyPolicy')), FeedSkeleton);
const LazyAITradingBot = withSuspense(lazy(() => import('./components/AITradingBot')), DashboardSkeleton);
const LazyPipCalculator = withSuspense(lazy(() => import('./components/PipCalculator')), DashboardSkeleton);
const LazyMessages = withSuspense(lazy(() => import('./components/Messages')), ChatSkeleton);
const LazyUserProfile = withSuspense(lazy(() => import('./components/UserProfile')), ProfileSkeleton);
const LazyFriends = withSuspense(lazy(() => import('./components/Friends')), ProfileSkeleton);
const LazyTradingChallengeTest = withSuspense(lazy(() => import('./components/TradingChallengeTest')), DashboardSkeleton);
const LazyChallengeDashboard = withSuspense(lazy(() => import('./components/ChallengeDashboard')), DashboardSkeleton);
const LazyChallengeAdmin = withSuspense(lazy(() => import('./components/ChallengeAdmin')), DashboardSkeleton);
const LazyGlobalLeaderboard = withSuspense(lazy(() => import('./components/GlobalLeaderboard')), DashboardSkeleton);
const LazyJoinTeam = withSuspense(lazy(() => import('./components/JoinTeam')), DashboardSkeleton);
const LazySheetsGuide = withSuspense(lazy(() => import('./components/SheetsGuide')), BooksSkeleton);
const LazyMarketIntelligence = withSuspense(lazy(() => import('./components/MarketIntelligence')), DashboardSkeleton);
const LazyAcademy = withSuspense(lazy(() => import('./components/academy/Academy')), BooksSkeleton);
const LazySchoolPage = withSuspense(lazy(() => import('./components/academy/SchoolPage')), BooksSkeleton);
const LazyLessonPage = withSuspense(lazy(() => import('./components/academy/LessonPage')), BooksSkeleton);
const LazyBooksPage = withSuspense(lazy(() => import('./components/BooksPage')), BooksSkeleton);
const LazyBookDetail = withSuspense(lazy(() => import('./components/BookDetail')), BooksSkeleton);
const LazyImmersiveBookReader = withSuspense(lazy(() => import('./components/ImmersiveBookReader')), BooksSkeleton);

// ─── Helper: render page or ComingSoon ─────────────────────────────────────
function PageGuard({ enabled, children }) {
  if (enabled === false) return <ComingSoonPage />;
  return children;
}

// ─── Homepage layout (Coach section removed) ────────────────────────────────
function MainLayout() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <MarketData />
      </div>
      <main>
        <Hero />
        <div className="bg-background">
          <Feed />
        </div>
        <Benefits />
      </main>
      <Footer />
    </>
  );
}

// ─── Loading screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="relative"
      >
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-primary font-black tracking-[0.2em] uppercase text-xs"
      >
        Shukritrade
      </motion.p>
    </div>
  );
}

// ─── Banned screen ──────────────────────────────────────────────────────────
function BannedScreen({ banData }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-card border border-destructive/20 backdrop-blur-xl p-10 rounded-xl shadow-2xl"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-destructive/20">
          <Lock className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-4">Account Suspended</h1>
        <div className="space-y-4 text-left bg-secondary p-6 rounded-md border border-border mb-8">
          <div>
            <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Reason</p>
            <p className="text-sm text-muted-foreground">{banData.banReason || 'Violation of community guidelines'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Duration</p>
            <p className="text-sm text-muted-foreground">{banData.banDuration === 'permanent' ? 'Permanent Ban' : `${banData.banDuration} Days`}</p>
          </div>
          {banData.banUntil && (
            <div>
              <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Expires On</p>
              <p className="text-sm text-muted-foreground">{new Date(banData.banUntil).toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive font-black text-sm uppercase tracking-widest hover:bg-destructive hover:text-white transition-all mb-6 cursor-pointer"
        >
          <LogOut className="w-5 h-5" /> Logout &amp; Switch Account
        </button>

        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          If you believe this is a mistake, please contact our support team via Telegram.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Authenticated routes with platform context ──────────────────────────────
function AuthenticatedRoutes({ user, userData, onboardingCompleted, isAdmin, hasDemoAccount }) {
  const { pages, features, maintenance } = usePlatform();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/auth" element={<Navigate to={onboardingCompleted ? "/" : "/onboarding"} />} />
      <Route path="/onboarding" element={onboardingCompleted ? <Navigate to="/" /> : <LazyOnboarding />} />
      <Route path="/setup-account" element={<LazyOnboardingFlow />} />
      <Route path="/settings" element={<LazySettings />} />
      <Route path="/reset-password" element={<LazyResetPassword />} />
      <Route path="/privacy" element={<LazyPrivacyPolicy />} />

      {/* News */}
      <Route path="/news" element={
        <PageGuard enabled={pages.news}>
          <LazyNewsPage />
        </PageGuard>
      } />
      <Route path="/global-news" element={
        <PageGuard enabled={pages.news}>
          <LazyGlobalNews />
        </PageGuard>
      } />

      {/* Academy */}
      <Route path="/academy" element={
        <PageGuard enabled={pages.academy}>
          <LazyAcademy />
        </PageGuard>
      } />
      <Route path="/academy/:schoolId" element={
        <PageGuard enabled={pages.academy}>
          <LazySchoolPage />
        </PageGuard>
      } />
      <Route path="/academy/:schoolId/lesson/:lessonId" element={
        <PageGuard enabled={pages.academy}>
          <LazyLessonPage />
        </PageGuard>
      } />

      {/* Books */}
      <Route path="/books" element={
        <PageGuard enabled={pages.books}>
          <LazyBooksPage />
        </PageGuard>
      } />
      <Route path="/books/:bookId" element={
        <PageGuard enabled={pages.books}>
          <LazyBookDetail />
        </PageGuard>
      } />
      <Route path="/books/:bookId/read" element={
        <PageGuard enabled={pages.books}>
          <LazyImmersiveBookReader />
        </PageGuard>
      } />

      {/* Courses */}
      <Route path="/courses" element={
        <PageGuard enabled={pages.courses}>
          <LazyCourses />
        </PageGuard>
      } />
      <Route path="/course/:courseId" element={
        <PageGuard enabled={pages.courses}>
          <LazyCourseEnrollment />
        </PageGuard>
      } />
      <Route path="/course-registration" element={<LazyCourseRegistration />} />

      {/* Challenges */}
      <Route path="/challenges" element={
        <PageGuard enabled={pages.challenges}>
          <ProtectedRoute hasDemoAccount={hasDemoAccount} isAdmin={isAdmin}>
            <LazyTradingChallengeTest />
          </ProtectedRoute>
        </PageGuard>
      } />
      <Route path="/challenge/:participantId" element={
        <PageGuard enabled={pages.challenges}>
          <ProtectedRoute hasDemoAccount={hasDemoAccount} isAdmin={isAdmin}>
            <LazyChallengeDashboard />
          </ProtectedRoute>
        </PageGuard>
      } />

      {/* Messages */}
      <Route path="/messages" element={
        <PageGuard enabled={pages.messages}>
          <LazyMessages />
        </PageGuard>
      } />

      {/* Community / Friends */}
      <Route path="/friends" element={
        <PageGuard enabled={pages.friends}>
          <LazyFriends />
        </PageGuard>
      } />

      {/* AI Bot */}
      <Route path="/ai-bot" element={
        <PageGuard enabled={pages.aiBot}>
          <ProtectedRoute hasDemoAccount={hasDemoAccount} isAdmin={isAdmin}>
            <LazyAITradingBot />
          </ProtectedRoute>
        </PageGuard>
      } />

      {/* Pip Calculator */}
      <Route path="/pip-calculator" element={
        <PageGuard enabled={pages.pipCalculator}>
          <LazyPipCalculator />
        </PageGuard>
      } />

      {/* Market Intelligence */}
      <Route path="/market-intelligence" element={
        <PageGuard enabled={pages.marketIntelligence}>
          <LazyMarketIntelligence />
        </PageGuard>
      } />

      {/* Global Leaderboard */}
      <Route path="/global-leaderboard" element={
        <PageGuard enabled={pages.globalLeaderboard}>
          <LazyGlobalLeaderboard />
        </PageGuard>
      } />

      {/* Brokers */}
      <Route path="/brokers" element={
        <PageGuard enabled={pages.brokers}>
          <LazyBrokersPage />
        </PageGuard>
      } />

      {/* Sheets Guide */}
      <Route path="/sheets-guide" element={
        <PageGuard enabled={pages.sheetsGuide}>
          <LazySheetsGuide />
        </PageGuard>
      } />

      {/* User profile + join team (always available) */}
      <Route path="/profile/:userId" element={<LazyUserProfile />} />
      <Route path="/join-team/:inviteCode" element={<LazyJoinTeam />} />

      {/* Admin routes */}
      <Route path="/admin" element={isAdmin ? <LazyAdminDashboard /> : <Navigate to="/" />} />
      <Route path="/admin/courses" element={isAdmin ? <LazyCoursesAdmin /> : <Navigate to="/" />} />
      <Route path="/admin/challenges" element={isAdmin ? <LazyChallengeAdmin /> : <Navigate to="/" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasDemoAccount, setHasDemoAccount] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setOnboardingCompleted(data.onboardingCompleted);
            setIsAdmin(data.isAdmin || ['mchokri100@gmail.com', 'ahmed1195@gmail.com'].includes(currentUser.email?.toLowerCase()));
            setHasDemoAccount(!!data.demoAccountId);
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  if (loading) return <LoadingScreen />;

  if (userData?.isBanned) {
    return <BannedScreen banData={userData} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PlatformProvider>
          <Router>
            <div className="min-h-screen relative bg-background">
              <div className="relative z-10">
                {!user ? (
                  <Routes>
                    <Route path="/auth" element={<LazyAuth />} />
                    <Route path="/reset-password" element={<LazyResetPassword />} />
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                  </Routes>
                ) : (
                  <AuthenticatedRoutes
                    user={user}
                    userData={userData}
                    onboardingCompleted={onboardingCompleted}
                    isAdmin={isAdmin}
                    hasDemoAccount={hasDemoAccount}
                  />
                )}
              </div>
              {user && <ChatWidget />}
              <CookieConsent />
            </div>
          </Router>
        </PlatformProvider>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
