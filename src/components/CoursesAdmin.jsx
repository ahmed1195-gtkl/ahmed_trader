import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../lib/firebase';
import { 
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, 
  query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Plus, Edit, Trash2, Save, X, BookOpen, 
  Image as ImageIcon, DollarSign, Gift, Lock,
  ArrowLeft, Loader2, CheckCircle, AlertCircle, FileSpreadsheet
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader';
import Header from './Header';

const ADMIN_EMAILS = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];

const CoursesAdmin = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    type: 'free', // free, paid, conditional
    price: '', // السعر (عند اختيار paid)
    conditions: '', // الشروط (عند اختيار conditional)
    imageUrl: '',
    duration: '',
    sheetUrl: '',
    whatsappUrl: '',
    instagramUrl: '',
    telegramUrl: '',
    emailUrl: '',
    features: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminCheck = ADMIN_EMAILS.includes(currentUser.email?.toLowerCase());
        setIsAdmin(adminCheck);
        if (!adminCheck) {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin]);

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
      toast.error('فشل تحميل الكورسات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    if (!formData.nameAr || !formData.nameEn || !formData.descriptionAr || !formData.descriptionEn) {
      toast.error(i18n.language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    // التحقق من رابط Google Sheet (ضروري)
    if (!formData.sheetUrl || formData.sheetUrl.trim() === '') {
      toast.error(i18n.language === 'ar' ? 'رابط Google Sheet ضروري' : 'Google Sheet URL is required');
      return;
    }

    // التحقق من وجود رابط تواصل واحد على الأقل
    const hasContactLink = formData.whatsappUrl || formData.instagramUrl || formData.telegramUrl || formData.emailUrl;
    if (!hasContactLink) {
      toast.error(i18n.language === 'ar' ? 'يجب إضافة رابط تواصل واحد على الأقل' : 'At least one contact link is required');
      return;
    }

    setSaving(true);
    try {
      const courseData = {
        ...formData,
        updatedAt: serverTimestamp(),
        enrolledCount: editingCourse?.enrolledCount || 0
      };

      if (editingCourse) {
        // تحديث كورس موجود
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
        toast.success(i18n.language === 'ar' ? 'تم تحديث الكورس بنجاح' : 'Course updated successfully');
      } else {
        // إضافة كورس جديد
        courseData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'courses'), courseData);
        toast.success(i18n.language === 'ar' ? 'تم إضافة الكورس بنجاح' : 'Course added successfully');
      }

      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(i18n.language === 'ar' ? 'فشل حفظ الكورس' : 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      nameAr: course.nameAr || '',
      nameEn: course.nameEn || '',
      descriptionAr: course.descriptionAr || '',
      descriptionEn: course.descriptionEn || '',
      type: course.type || 'free',
      price: course.price || '',
      conditions: course.conditions || '',
      imageUrl: course.imageUrl || '',
      duration: course.duration || '',
      sheetUrl: course.sheetUrl || '',
      whatsappUrl: course.whatsappUrl || '',
      instagramUrl: course.instagramUrl || '',
      telegramUrl: course.telegramUrl || '',
      emailUrl: course.emailUrl || '',
      features: course.features || []
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm(i18n.language === 'ar' ? 'هل أنت متأكد من حذف هذا الكورس؟' : 'Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'courses', courseId));
      toast.success(i18n.language === 'ar' ? 'تم حذف الكورس بنجاح' : 'Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(i18n.language === 'ar' ? 'فشل حذف الكورس' : 'Failed to delete course');
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      type: 'free',
      price: '',
      conditions: '',
      imageUrl: '',
      duration: '',
      sheetUrl: '',
      whatsappUrl: '',
      instagramUrl: '',
      telegramUrl: '',
      emailUrl: '',
      features: []
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const getCourseTypeBadge = (type) => {
    const badges = {
      free: { ar: 'مجاني', en: 'Free', color: 'bg-green-500' },
      paid: { ar: 'مدفوع', en: 'Paid', color: 'bg-amber-500' },
      conditional: { ar: 'بشروط', en: 'Conditional', color: 'bg-blue-500' }
    };
    const badge = badges[type] || badges.free;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white ${badge.color}`}>
        {i18n.language === 'ar' ? badge.ar : badge.en}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/admin')}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl p-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tight">
                {i18n.language === 'ar' ? 'إدارة الكورسات' : 'Manage Courses'}
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                {i18n.language === 'ar' ? 'إضافة وتعديل الكورسات' : 'Add and edit courses'}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            {i18n.language === 'ar' ? 'إضافة كورس' : 'Add Course'}
          </Button>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => !saving && resetForm()}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card border border-border rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white uppercase">
                    {editingCourse 
                      ? (i18n.language === 'ar' ? 'تعديل الكورس' : 'Edit Course')
                      : (i18n.language === 'ar' ? 'إضافة كورس جديد' : 'Add New Course')
                    }
                  </h2>
                  <Button
                    onClick={resetForm}
                    disabled={saving}
                    className="bg-white/5 hover:bg-white/10 text-white rounded-xl p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Course Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'اسم الكورس (عربي) *' : 'Course Name (Arabic) *'}
                      </label>
                      <Input
                        value={formData.nameAr}
                        onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="الدورة الكلاسيك"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'اسم الكورس (إنجليزي) *' : 'Course Name (English) *'}
                      </label>
                      <Input
                        value={formData.nameEn}
                        onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="Classic Course"
                        required
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'الوصف (عربي) *' : 'Description (Arabic) *'}
                      </label>
                      <textarea
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 min-h-[100px] focus:border-amber-500/50 focus:outline-none"
                        placeholder="وصف الكورس بالعربي..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'الوصف (إنجليزي) *' : 'Description (English) *'}
                      </label>
                      <textarea
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 min-h-[100px] focus:border-amber-500/50 focus:outline-none"
                        placeholder="Course description in English..."
                        required
                      />
                    </div>
                  </div>

                  {/* Type and Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'نوع الكورس *' : 'Course Type *'}
                      </label>
                      <div className="flex gap-2">
                        {['free', 'paid', 'conditional'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, type})}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                              formData.type === type
                                ? 'bg-amber-500 border-amber-500 text-black'
                                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            {type === 'free' && <Gift className="w-4 h-4 inline mr-1" />}
                            {type === 'paid' && <DollarSign className="w-4 h-4 inline mr-1" />}
                            {type === 'conditional' && <Lock className="w-4 h-4 inline mr-1" />}
                            {type === 'free' && (i18n.language === 'ar' ? 'مجاني' : 'Free')}
                            {type === 'paid' && (i18n.language === 'ar' ? 'مدفوع' : 'Paid')}
                            {type === 'conditional' && (i18n.language === 'ar' ? 'بشروط' : 'Conditional')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <ImageUploader
                        label={i18n.language === 'ar' ? 'صورة الكورس' : 'Course Image'}
                        currentImageUrl={formData.imageUrl}
                        onImageUploaded={(url) => setFormData({...formData, imageUrl: url})}
                      />
                    </div>
                  </div>

                  {/* حقل السعر (عند اختيار مدفوع) */}
                  {formData.type === 'paid' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'السعر *' : 'Price *'}
                      </label>
                      <Input
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder={i18n.language === 'ar' ? 'مثال: 299$' : 'e.g., $299'}
                        required
                      />
                    </div>
                  )}

                  {/* حقل الشروط (عند اختيار بشروط) */}
                  {formData.type === 'conditional' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'الشروط *' : 'Conditions *'}
                      </label>
                      <textarea
                        value={formData.conditions}
                        onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 min-h-[100px] focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder={i18n.language === 'ar' ? 'اكتب الشروط هنا... يمكنك وضع روابط' : 'Write conditions here... You can include links'}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'يمكنك إضافة روابط مثل: https://example.com' : 'You can add links like: https://example.com'}
                      </p>
                    </div>
                  )}

                  {/* Duration and Sheet URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase">
                        {i18n.language === 'ar' ? 'المدة' : 'Duration'}
                      </label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder={i18n.language === 'ar' ? '4 أسابيع' : '4 weeks'}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-400 uppercase">
                          {i18n.language === 'ar' ? 'رابط الشيت *' : 'Sheet URL *'}
                        </label>
                        <Button
                          type="button"
                          onClick={() => window.open('/#/sheets-guide', '_blank')}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl px-3 py-1 text-xs"
                        >
                          <FileSpreadsheet className="w-3 h-3 mr-1" />
                          {i18n.language === 'ar' ? 'دليل الإعداد' : 'Setup Guide'}
                        </Button>
                      </div>
                      <Input
                        value={formData.sheetUrl}
                        onChange={(e) => setFormData({...formData, sheetUrl: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'رابط Web App من Google Apps Script' : 'Web App URL from Google Apps Script'}
                      </p>
                    </div>
                  </div>

                  {/* Contact URLs */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase">
                      {i18n.language === 'ar' ? 'روابط التواصل (اختياري)' : 'Contact Links (Optional)'}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={formData.whatsappUrl}
                        onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="WhatsApp URL"
                      />
                      <Input
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="Instagram URL"
                      />
                      <Input
                        value={formData.telegramUrl}
                        onChange={(e) => setFormData({...formData, telegramUrl: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="Telegram URL"
                      />
                      <Input
                        value={formData.emailUrl}
                        onChange={(e) => setFormData({...formData, emailUrl: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={resetForm}
                      disabled={saving}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl py-3"
                    >
                      {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-xl py-3"
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {i18n.language === 'ar' ? 'حفظ' : 'Save'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="glass-card border border-border rounded-2xl overflow-hidden">
              <div className="relative h-48">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.nameAr} className="w-full h-full object-cover" decoding="async" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-amber-500/50" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {getCourseTypeBadge(course.type)}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-black text-white">
                  {i18n.language === 'ar' ? course.nameAr : course.nameEn}
                </CardTitle>
                <p className="text-zinc-400 text-sm line-clamp-2">
                  {i18n.language === 'ar' ? course.descriptionAr : course.descriptionEn}
                </p>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => handleEdit(course)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl py-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {i18n.language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
                <Button
                  onClick={() => handleDelete(course.id)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 rounded-xl py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {i18n.language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white uppercase mb-4">
              {i18n.language === 'ar' ? 'لا توجد كورسات' : 'No Courses'}
            </h3>
            <p className="text-zinc-500 mb-6">
              {i18n.language === 'ar' ? 'ابدأ بإضافة أول كورس' : 'Start by adding your first course'}
            </p>
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default CoursesAdmin;
