import firebase_admin
from firebase_admin import credentials, firestore
import datetime

# تهيئة Firebase
# ملاحظة: في بيئة Manus، يتم استخدام بيانات الاعتماد الافتراضية أو المسار المحدد
try:
    # محاولة الحصول على بيانات الاعتماد من الملف الموجود في المشروع إذا كان متاحاً
    # أو استخدام الإعدادات الافتراضية للبيئة
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase initialization error: {e}")
    print("Please ensure Firebase is configured correctly in the environment.")

db = firestore.client()

def add_classic_course():
    course_data = {
        "nameAr": "الدورة الكلاسيك",
        "nameEn": "Classic Course",
        "descriptionAr": "دورة شاملة في أساسيات التداول الكلاسيكي، تغطي التحليل الفني وإدارة المخاطر.",
        "descriptionEn": "A comprehensive course in classic trading basics, covering technical analysis and risk management.",
        "type": "free",
        "imageUrl": "/assets/coach_mustafa-cn55cHri.jpg", # استخدام صورة الكوتش مصطفى
        "duration": "4 weeks",
        "sheetUrl": "https://script.google.com/macros/s/AKfycbzU7giZJy_k4nWfvkU1k3qrA8TjRoWFmk23q6dHsbDfZ8WabiBvArtl4tIQAwtvdAPPqQ/exec",
        "telegramUrl": "https://t.me/+CADMeIVdMDQ2Nzg0",
        "whatsappUrl": "",
        "instagramUrl": "",
        "emailUrl": "",
        "features": [
            {"ar": "مجاني بالكامل", "en": "Completely Free"},
            {"ar": "دعم فني مستمر", "en": "Continuous Support"},
            {"ar": "تطبيقات عملية", "en": "Practical Applications"}
        ],
        "enrolledCount": 0,
        "createdAt": datetime.datetime.now(),
        "updatedAt": datetime.datetime.now()
    }

    try:
        # إضافة الكورس إلى مجموعة 'courses'
        doc_ref = db.collection('courses').document('classic_course')
        doc_ref.set(course_data)
        print("Classic Course added successfully!")
    except Exception as e:
        print(f"Error adding course: {e}")

if __name__ == "__main__":
    # هذا السكربت يحتاج لبيئة بايثون مهيأة ببيانات اعتماد Firebase
    # سأقوم بدلاً من ذلك بإنشاء مكون React يقوم بهذه المهمة لمرة واحدة عند فتحه من قبل الأدمن
    print("Script prepared. Will be integrated into Admin Dashboard.")
