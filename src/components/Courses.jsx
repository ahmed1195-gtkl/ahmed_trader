import React, { useState, useEffect } from 'react';
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

const ADMIN_EMAILS = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];

const Courses = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
        color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">
            {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-4 tracking-tighter">
            {i18n.language === 'ar' ? 'الكورسات' : 'Courses'}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {i18n.language === 'ar' 
              ? 'اختر الكورس المناسب لك وابدأ رحلتك في عالم التداول' 
              : 'Choose the right course for you and start your trading journey'}
          </p>
          
          {isAdmin && (
            <Button
              onClick={() => navigate('/admin/courses')}
              className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl px-8 py-3"
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
            <BookOpen className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white uppercase mb-4">
              {i18n.language === 'ar' ? 'لا توجد كورسات حالياً' : 'No Courses Available'}
            </h3>
            <p className="text-zinc-500">
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
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden hover:border-yellow-500/50 transition-all group h-full flex flex-col">
                  {/* Course Image */}
                  <div className="relative h-56 overflow-hidden">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-yellow-500/50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      {getCourseTypeBadge(course.type)}
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                          {i18n.language === 'ar' ? course.nameAr : course.nameEn}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
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
                    <p className="text-zinc-400 text-sm mb-6 line-clamp-3">
                      {i18n.language === 'ar' ? course.descriptionAr : course.descriptionEn}
                    </p>

                    {/* Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {course.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{i18n.language === 'ar' ? feature.ar : feature.en}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl py-6 mt-auto group"
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
  );
};

export default Courses;
