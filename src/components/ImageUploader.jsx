import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';

function ImageUploader({ onImageUploaded, currentImageUrl = null, label = 'رفع صورة' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ahmed_trader_preset');
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dmrrj3rpl/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error('فشل رفع الصورة');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من حجم الصورة
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }

    // معاينة الصورة محلياً
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // رفع الصورة إلى Cloudinary
    setUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadToCloudinary(file);
      onImageUploaded(imageUrl);
      setPreview(imageUrl);
    } catch (err) {
      setError(err.message);
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-white mb-2">
        {label}
      </label>

      {/* منطقة الرفع */}
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 transition-all bg-zinc-900/50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-12 h-12 text-amber-500 animate-spin" />
              <p className="text-gray-400">جاري رفع الصورة...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-500" />
              <div>
                <p className="text-white font-bold mb-1">اضغط لاختيار صورة</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF (أقل من 10MB)</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative group">
          <img src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl border border-white/10"
          decoding="async" loading="lazy" />
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-amber-500 transition-all"
              disabled={uploading}
            >
              <ImageIcon className="w-5 h-5 inline mr-2" />
              تغيير
            </button>
            
            <button
              onClick={handleRemove}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-all"
              disabled={uploading}
            >
              <X className="w-5 h-5 inline mr-2" />
              حذف
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* رسالة خطأ */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
