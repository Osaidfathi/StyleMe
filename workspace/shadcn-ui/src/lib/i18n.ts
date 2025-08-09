import { Language } from '@/types';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    tryStyle: 'Try New Style',
    findSalon: 'Find Salon',
    myBookings: 'My Bookings',
    profile: 'Profile',
    admin: 'Admin',
    salonDashboard: 'Salon Dashboard',
    support: 'Support',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    phone: 'Phone Number',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    
    // Home Page
    welcomeTitle: 'Discover Your Perfect Style with AI',
    welcomeSubtitle: 'Upload your photo and get personalized hairstyle recommendations powered by artificial intelligence',
    getStarted: 'Get Started',
    howItWorks: 'How It Works',
    
    // Style Generation
    uploadPhoto: 'Upload Photo',
    takePhoto: 'Take Photo',
    selectGender: 'Select Gender',
    generating: 'Generating styles...',
    selectStyle: 'Select Your Favorite Style',
    addNotes: 'Add Notes',
    bookAppointment: 'Book Appointment',
    saveStyle: 'Save Style',
    shareStyle: 'Share Style',
    
    // Salon Search
    searchSalons: 'Search Salons',
    nearbyServices: 'Nearby Services',
    rating: 'Rating',
    distance: 'Distance',
    price: 'Price',
    openNow: 'Open Now',
    viewDetails: 'View Details',
    selectBarber: 'Select Barber',
    availableSlots: 'Available Time Slots',
    
    // Booking
    bookingDetails: 'Booking Details',
    selectedStyle: 'Selected Style',
    customerNotes: 'Customer Notes',
    appointmentTime: 'Appointment Time',
    totalPrice: 'Total Price',
    confirmBooking: 'Confirm Booking',
    payNow: 'Pay Now',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    today: 'Today',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    
    // Status
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    tryStyle: 'جرب قصة جديدة',
    findSalon: 'ابحث عن صالون',
    myBookings: 'حجوزاتي',
    profile: 'الملف الشخصي',
    admin: 'الإدارة',
    salonDashboard: 'لوحة الصالون',
    support: 'الدعم الفني',
    
    // Auth
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    
    // Home Page
    welcomeTitle: 'اكتشف أسلوبك المثالي مع الذكاء الاصطناعي',
    welcomeSubtitle: 'ارفع صورتك واحصل على توصيات قصات شعر مخصصة مدعومة بالذكاء الاصطناعي',
    getStarted: 'ابدأ الآن',
    howItWorks: 'كيف يعمل',
    
    // Style Generation
    uploadPhoto: 'رفع صورة',
    takePhoto: 'التقاط صورة',
    selectGender: 'اختر الجنس',
    generating: 'جاري إنشاء القصات...',
    selectStyle: 'اختر قصتك المفضلة',
    addNotes: 'إضافة ملاحظات',
    bookAppointment: 'حجز موعد',
    saveStyle: 'حفظ القصة',
    shareStyle: 'مشاركة القصة',
    
    // Salon Search
    searchSalons: 'البحث عن الصالونات',
    nearbyServices: 'الخدمات القريبة',
    rating: 'التقييم',
    distance: 'المسافة',
    price: 'السعر',
    openNow: 'مفتوح الآن',
    viewDetails: 'عرض التفاصيل',
    selectBarber: 'اختر الحلاق',
    availableSlots: 'المواعيد المتاحة',
    
    // Booking
    bookingDetails: 'تفاصيل الحجز',
    selectedStyle: 'القصة المختارة',
    customerNotes: 'ملاحظات العميل',
    appointmentTime: 'موعد الحجز',
    totalPrice: 'السعر الإجمالي',
    confirmBooking: 'تأكيد الحجز',
    payNow: 'ادفع الآن',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    search: 'بحث',
    filter: 'فلتر',
    sort: 'ترتيب',
    today: 'اليوم',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    
    // Status
    pending: 'معلق',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
  }
};

export type TranslationKey = keyof typeof translations.en;

let currentLanguage: Language = 'ar';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export const getCurrentLanguage = (): Language => currentLanguage;

export const t = (key: TranslationKey): string => {
  return translations[currentLanguage][key] || key;
};

export const getLocalizedText = (text: Record<Language, string>): string => {
  return text[currentLanguage] || text.en || text.ar || '';
};