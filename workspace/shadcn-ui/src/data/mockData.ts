import { Salon, Barber, Service, WorkingHours, Review, AIStyleGeneration, GeneratedStyle } from '@/types';

export const mockWorkingHours: WorkingHours = {
  sunday: { open: '09:00', close: '22:00', isOpen: true },
  monday: { open: '09:00', close: '22:00', isOpen: true },
  tuesday: { open: '09:00', close: '22:00', isOpen: true },
  wednesday: { open: '09:00', close: '22:00', isOpen: true },
  thursday: { open: '09:00', close: '22:00', isOpen: true },
  friday: { open: '14:00', close: '24:00', isOpen: true },
  saturday: { open: '09:00', close: '22:00', isOpen: true },
};

export const mockServices: Service[] = [
  {
    id: '1',
    name: { ar: 'قص شعر رجالي', en: 'Men\'s Haircut' },
    description: { ar: 'قص شعر كلاسيكي وعصري', en: 'Classic and modern haircuts' },
    price: 25,
    duration: 30,
    category: 'haircut',
    gender: 'male',
  },
  {
    id: '2',
    name: { ar: 'قص شعر نسائي', en: 'Women\'s Haircut' },
    description: { ar: 'قص وتصفيف شعر نسائي', en: 'Women\'s cut and styling' },
    price: 35,
    duration: 45,
    category: 'haircut',
    gender: 'female',
  },
  {
    id: '3',
    name: { ar: 'صبغة شعر', en: 'Hair Coloring' },
    description: { ar: 'صبغة وتلوين شعر احترافي', en: 'Professional hair coloring' },
    price: 50,
    duration: 90,
    category: 'coloring',
    gender: 'both',
  },
  {
    id: '4',
    name: { ar: 'تهذيب اللحية', en: 'Beard Trimming' },
    description: { ar: 'تهذيب وتصفيف اللحية', en: 'Beard trimming and styling' },
    price: 15,
    duration: 20,
    category: 'beard',
    gender: 'male',
  },
];

export const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'أحمد الحلاق',
    specialties: ['قص كلاسيكي', 'تهذيب لحية'],
    bio: { 
      ar: 'حلاق محترف مع 10 سنوات خبرة', 
      en: 'Professional barber with 10 years experience' 
    },
    avatar: '/api/placeholder/100/100',
    salonId: '1',
    rating: 4.8,
    status: 'available',
    workingHours: mockWorkingHours,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'فاطمة المصففة',
    specialties: ['قص نسائي', 'صبغة'],
    bio: { 
      ar: 'مصففة شعر متخصصة في الصبغات الحديثة', 
      en: 'Hair stylist specialized in modern coloring' 
    },
    avatar: '/api/placeholder/100/100',
    salonId: '1',
    rating: 4.9,
    status: 'available',
    workingHours: mockWorkingHours,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'محمد الأسطى',
    specialties: ['قص عصري', 'تصفيف'],
    bio: { 
      ar: 'خبير في القصات العصرية والكلاسيكية', 
      en: 'Expert in modern and classic cuts' 
    },
    avatar: '/api/placeholder/100/100',
    salonId: '2',
    rating: 4.7,
    status: 'available',
    workingHours: mockWorkingHours,
    createdAt: new Date(),
  },
];

export const mockSalons: Salon[] = [
  {
    id: '1',
    name: { ar: 'صالون الأناقة', en: 'Elegance Salon' },
    description: { 
      ar: 'صالون حديث يقدم أفضل خدمات الحلاقة والتجميل', 
      en: 'Modern salon offering the best hair and beauty services' 
    },
    address: 'شارع الملك فهد، الرياض',
    latitude: 24.7136,
    longitude: 46.6753,
    phone: '+966501234567',
    email: 'contact@elegance-salon.com',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    rating: 4.8,
    reviewCount: 156,
    status: 'active',
    ownerId: '2',
    services: mockServices,
    barbers: mockBarbers.filter(b => b.salonId === '1'),
    workingHours: mockWorkingHours,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: { ar: 'بيت الجمال', en: 'Beauty House' },
    description: { 
      ar: 'مركز تجميل شامل للرجال والنساء', 
      en: 'Complete beauty center for men and women' 
    },
    address: 'طريق الملك عبدالعزيز، جدة',
    latitude: 21.4858,
    longitude: 39.1925,
    phone: '+966502345678',
    email: 'info@beauty-house.com',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    rating: 4.6,
    reviewCount: 89,
    status: 'active',
    ownerId: '2',
    services: mockServices,
    barbers: mockBarbers.filter(b => b.salonId === '2'),
    workingHours: mockWorkingHours,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: { ar: 'استوديو الحلاقة', en: 'Barber Studio' },
    description: { 
      ar: 'استوديو متخصص في قصات الشعر الرجالي العصرية', 
      en: 'Studio specialized in modern men\'s haircuts' 
    },
    address: 'شارع التحلية، الخبر',
    latitude: 26.2172,
    longitude: 50.1971,
    phone: '+966503456789',
    email: 'studio@barber-studio.com',
    images: ['/api/placeholder/400/300'],
    rating: 4.9,
    reviewCount: 234,
    status: 'active',
    ownerId: '2',
    services: mockServices.filter(s => s.gender === 'male' || s.gender === 'both'),
    barbers: [],
    workingHours: mockWorkingHours,
    createdAt: new Date(),
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    salonId: '1',
    barberId: '1',
    bookingId: '1',
    rating: 5,
    comment: { 
      ar: 'خدمة ممتازة والحلاق محترف جداً', 
      en: 'Excellent service and very professional barber' 
    },
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    userId: '1',
    salonId: '1',
    barberId: '2',
    bookingId: '2',
    rating: 4,
    comment: { 
      ar: 'نتيجة جيدة لكن الانتظار كان طويل', 
      en: 'Good result but the wait was long' 
    },
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

export const mockGeneratedStyles: GeneratedStyle[] = [
  {
    id: '1',
    imageUrl: '/api/placeholder/300/400',
    styleType: 'haircut',
    description: { 
      ar: 'قصة كلاسيكية أنيقة', 
      en: 'Classic elegant cut' 
    },
    confidence: 0.95,
  },
  {
    id: '2',
    imageUrl: '/api/placeholder/300/400',
    styleType: 'haircut',
    description: { 
      ar: 'قصة عصرية جانبية', 
      en: 'Modern side cut' 
    },
    confidence: 0.88,
  },
  {
    id: '3',
    imageUrl: '/api/placeholder/300/400',
    styleType: 'haircut',
    description: { 
      ar: 'قصة قصيرة رياضية', 
      en: 'Short athletic cut' 
    },
    confidence: 0.92,
  },
  {
    id: '4',
    imageUrl: '/api/placeholder/300/400',
    styleType: 'haircut',
    description: { 
      ar: 'قصة طويلة مموجة', 
      en: 'Long wavy style' 
    },
    confidence: 0.85,
  },
  {
    id: '5',
    imageUrl: '/api/placeholder/300/400',
    styleType: 'color',
    description: { 
      ar: 'لون بني فاتح', 
      en: 'Light brown color' 
    },
    confidence: 0.90,
  },
  {
    id: '6',
    imageUrl: '/api/placeholder/300/400',
    styleType: 'beard',
    description: { 
      ar: 'لحية مهذبة قصيرة', 
      en: 'Trimmed short beard' 
    },
    confidence: 0.87,
  },
];

export const mockAIGeneration: AIStyleGeneration = {
  id: '1',
  userId: '1',
  originalImageUrl: '/api/placeholder/300/400',
  generatedStyles: mockGeneratedStyles,
  targetGender: 'male',
  preferences: 'modern, professional',
  createdAt: new Date(),
};