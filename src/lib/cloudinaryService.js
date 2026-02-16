/**
 * خدمة رفع الصور إلى Cloudinary
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmrrj3rpl';
// استخدام unsigned upload بدون preset
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

/**
 * رفع صورة إلى Cloudinary
 * @param {File} file - ملف الصورة
 * @param {string} folder - المجلد في Cloudinary (اختياري)
 * @returns {Promise<string>} - رابط الصورة المرفوعة
 */
export const uploadImage = async (file, folder = 'ahmed_trader') => {
  try {
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      throw new Error('الملف المحدد ليس صورة');
    }

    // التحقق من حجم الملف (أقل من 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('حجم الصورة يجب أن يكون أقل من 10MB');
    }

    // إنشاء FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    // استخدام unsigned upload
    formData.append('upload_preset', 'ml_default');

    // رفع الصورة
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'فشل رفع الصورة');
    }

    const data = await response.json();
    
    // إرجاع رابط الصورة الآمن
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * رفع صورة من رابط URL
 * @param {string} imageUrl - رابط الصورة
 * @param {string} folder - المجلد في Cloudinary (اختياري)
 * @returns {Promise<string>} - رابط الصورة المرفوعة
 */
export const uploadImageFromUrl = async (imageUrl, folder = 'ahmed_trader') => {
  try {
    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'فشل رفع الصورة');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    throw error;
  }
};

/**
 * حذف صورة من Cloudinary
 * @param {string} publicId - معرف الصورة العام
 * @returns {Promise<boolean>} - نجاح الحذف
 */
export const deleteImage = async (publicId) => {
  try {
    // ملاحظة: حذف الصور يتطلب توقيع من الخادم
    // يجب تنفيذ هذا من خلال Cloud Function أو API خلفي
    console.warn('Delete operation requires server-side implementation');
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * الحصول على رابط صورة محسّن
 * @param {string} imageUrl - رابط الصورة الأصلي
 * @param {object} options - خيارات التحسين
 * @returns {string} - رابط الصورة المحسّن
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto'
  } = options;

  // إذا لم يكن رابط Cloudinary، أرجع الرابط الأصلي
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // استخراج public_id من الرابط
  const parts = imageUrl.split('/upload/');
  if (parts.length !== 2) return imageUrl;

  // إضافة معاملات التحسين
  const transformations = `w_${width},h_${height},c_fill,q_${quality},f_${format}`;
  
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export default {
  uploadImage,
  uploadImageFromUrl,
  deleteImage,
  getOptimizedImageUrl
};
