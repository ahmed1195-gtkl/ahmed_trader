import React, { useState, useEffect } from 'react';
import Header from './Header';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  BookOpen, Lock, Gift, CheckCircle, 
  ArrowRight, Star, Users, Clock 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useSEO } from '../hooks/useSEO';

const ADMIN_EMAILS = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];

const Courses = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': isAr ? 'دورة التداول الشاملة' : 'Comprehensive Trading Course',
    'description': isAr 
      ? 'تعلم التداول والأسواق المالية مع استراتيجيات SMC و ICT و SK مجاناً.'
      : 'Learn SMC, ICT, and SK trading strategies for free with our comprehensive course.',
    'provider': {
      '@type': 'Organization',
      'name': 'Shukritrade',
      'sameAs': 'https://shukritrade.com'
    }
  };

  useSEO({
    title: isAr ? 'الدورات التدريبية' : 'Trading Courses',
    description: isAr 
      ? 'قائمة الدورات التعليمية لتداول العملات والعملات الرقمية من الصفر إلى الاحتراف مجاناً.'
      : 'Access our catalog of free and premium Forex and Crypto trading courses on Shukritrade.',
    canonicalPath: '/courses',
    schemaData: courseSchema
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email?.toLowerCase()));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const coursesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseTypeIcon = (type) => {
    switch (type) {
      case 'free':
        return <Gift className="w-5 h-5" />;
      case 'paid':
        return <Lock className="w-5 h-5" />;
      case 'conditional':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getCourseTypeBadge = (type) => {
    const badges = {
      free: {
        ar: 'مجاني',
        en: 'Free',
        color: 'bg-green-500/20 text-green-500 border-green-500/30'
      },
      paid: {
        ar: 'مدفوع',
        en: 'Paid',
        color: 'bg-amber-500/20 text-amber-500 border-amber-500/30'
      },
      conditional: {
        ar: 'بشروط',
        en: 'Conditional',
        color: 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      }
    };

    const badge = badges[type] || badges.free;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${badge.color}`}>
        {i18n.language === 'ar' ? badge.ar : badge.en}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-bold">
            {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase mb-4 tracking-tighter">
            {i18n.language === 'ar' ? 'الكورسات' : 'Courses'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {i18n.language === 'ar' 
              ? 'اختر الكورس المناسب لك وابدأ رحلتك في عالم التداول' 
              : 'Choose the right course for you and start your trading journey'}
          </p>
          
          {isAdmin && (
            <Button
              onClick={() => navigate('/admin/courses')}
              className="mt-6 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-md px-8 py-3 hover:brightness-110 cursor-pointer"
            >
              {i18n.language === 'ar' ? 'إدارة الكورسات' : 'Manage Courses'}
            </Button>
          )}
        </motion.div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-24 h-24 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-foreground uppercase mb-4">
              {i18n.language === 'ar' ? 'لا توجد كورسات حالياً' : 'No Courses Available'}
            </h3>
            <p className="text-muted-foreground/50">
              {i18n.language === 'ar' 
                ? 'سيتم إضافة كورسات قريباً' 
                 : 'Courses will be added soon'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border backdrop-blur-xl rounded-xl overflow-hidden hover:border-primary/50 transition-all group h-full flex flex-col">
                  {/* Course Image */}
                  <div className="relative h-56 overflow-hidden">
                    {course.imageUrl ? (
                      <img src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                      decoding="async" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      {getCourseTypeBadge(course.type)}
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight mb-2">
                          {i18n.language === 'ar' ? course.nameAr : course.nameEn}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{course.enrolledCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration || (i18n.language === 'ar' ? 'غير محدد' : 'Flexible')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getCourseTypeIcon(course.type)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                      {i18n.language === 'ar' ? course.descriptionAr : course.descriptionEn}
                    </p>

                    {/* Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {course.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-primary" />
                            <span>{i18n.language === 'ar' ? feature.ar : feature.en}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-full bg-primary hover:brightness-110 text-primary-foreground font-black uppercase tracking-widest rounded-md py-6 mt-auto group cursor-pointer"
                    >
                      {i18n.language === 'ar' ? 'التسجيل الآن' : 'Enroll Now'}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default Courses;
