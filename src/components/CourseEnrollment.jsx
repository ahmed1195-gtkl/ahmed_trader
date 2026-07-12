import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import CourseRegistration from './CourseRegistration';

const CourseEnrollment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        setCourse({
          id: courseDoc.id,
          ...courseDoc.data()
        });
      } else {
        setError(i18n.language === 'ar' ? 'الكورس غير موجود' : 'Course not found');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(i18n.language === 'ar' ? 'حدث خطأ في تحميل الكورس' : 'Error loading course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-foreground font-bold">
              {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase mb-4">
              {error || (i18n.language === 'ar' ? 'الكورس غير موجود' : 'Course Not Found')}
            </h2>
            <Button
              onClick={() => navigate('/courses')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-xl px-8 py-3"
            >
              {i18n.language === 'ar' ? 'العودة للكورسات' : 'Back to Courses'}
            </Button>
          </div>
        </div>
      </>
    );
  }

  // تمرير بيانات الكورس إلى CourseRegistration
  return (
    <>
      <Header />
      <CourseRegistration course={course} />
    </>
  );
};

export default CourseEnrollment;
