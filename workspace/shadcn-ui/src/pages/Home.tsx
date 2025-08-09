import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { mockSalons } from '@/data/mockData';
import { 
  Camera, 
  Search, 
  Star, 
  MapPin, 
  Clock,
  Sparkles,
  Users,
  Award,
  ArrowRight,
  Settings,
  Building2
} from 'lucide-react';

const Home: React.FC = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const featuredSalons = mockSalons.slice(0, 3);

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      title: language === 'ar' ? 'ذكاء اصطناعي متطور' : 'Advanced AI Technology',
      description: language === 'ar' 
        ? 'تقنية ذكاء اصطناعي متطورة لتوليد قصات شعر مخصصة تناسب شكل وجهك'
        : 'Advanced AI technology to generate personalized hairstyles that suit your face shape'
    },
    {
      icon: <Users className="h-8 w-8 text-teal-500" />,
      title: language === 'ar' ? 'حلاقين محترفين' : 'Professional Barbers',
      description: language === 'ar'
        ? 'شبكة واسعة من أفضل الحلاقين والمصففين المحترفين في منطقتك'
        : 'Wide network of the best professional barbers and stylists in your area'
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: language === 'ar' ? 'تجربة مميزة' : 'Premium Experience',
      description: language === 'ar'
        ? 'حجز سهل وسريع مع ضمان جودة الخدمة وإدارة مواعيدك بكل سهولة'
        : 'Easy and fast booking with service quality guarantee and effortless appointment management'
    }
  ];

  const steps = [
    {
      number: '1',
      title: language === 'ar' ? 'ارفع صورتك' : 'Upload Your Photo',
      description: language === 'ar' 
        ? 'التقط صورة جديدة أو ارفع صورة من معرض الصور'
        : 'Take a new photo or upload from your gallery'
    },
    {
      number: '2',
      title: language === 'ar' ? 'اختر قصتك' : 'Choose Your Style',
      description: language === 'ar'
        ? 'شاهد 6 خيارات مختلفة واختر الأنسب لك'
        : 'View 6 different options and choose the best for you'
    },
    {
      number: '3',
      title: language === 'ar' ? 'احجز موعدك' : 'Book Your Appointment',
      description: language === 'ar'
        ? 'اختر الصالون والحلاق والموعد المناسب لك'
        : 'Choose the salon, barber, and time that suits you'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-teal-50 to-purple-50 rounded-3xl p-8 md:p-16">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('welcomeSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate(isAuthenticated ? '/try-style' : '/register')}
            >
              <Camera className="mr-2 h-5 w-5" />
              {t('getStarted')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/salons')}
            >
              <Search className="mr-2 h-5 w-5" />
              {t('findSalon')}
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>
      </section>

      {/* Admin and Salon Management Links */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة النظام' : 'System Management'}
          </h2>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'روابط سريعة للوصول إلى لوحات التحكم المختلفة'
              : 'Quick links to access different control panels'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200" onClick={() => navigate('/admin-dashboard')}>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' 
                  ? 'إدارة المستخدمين والصالونات والنظام العام'
                  : 'Manage users, salons, and general system'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-200" onClick={() => navigate('/salon-dashboard')}>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 p-3 bg-teal-100 rounded-full w-fit">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'ar' ? 'لوحة تحكم الصالون' : 'Salon Dashboard'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' 
                  ? 'إدارة الحجوزات والحلاقين وبيانات الصالون'
                  : 'Manage bookings, barbers, and salon data'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'لماذا StyleMe؟' : 'Why StyleMe?'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'نجمع بين أحدث تقنيات الذكاء الاصطناعي وشبكة واسعة من أفضل الصالونات لنقدم لك تجربة فريدة'
              : 'We combine the latest AI technology with a wide network of the best salons to provide you with a unique experience'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 rounded-3xl p-8 md:p-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('howItWorks')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'في ثلاث خطوات بسيطة تستطيع الحصول على قصة الشعر المثالية'
              : 'In three simple steps, you can get the perfect hairstyle'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Salons */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'صالونات مميزة' : 'Featured Salons'}
          </h2>
          <Button variant="ghost" onClick={() => navigate('/salons')}>
            {language === 'ar' ? 'عرض الكل' : 'View All'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredSalons.map((salon) => (
            <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/salons/${salon.id}`)}>
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={salon.images[0]} 
                  alt={salon.name[language]}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-green-500">
                  {language === 'ar' ? 'مفتوح' : 'Open'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{salon.name[language]}</h3>
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{salon.rating}</span>
                  <span className="text-sm text-gray-500 mr-2">({salon.reviewCount})</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{salon.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{salon.workingHours.sunday.open} - {salon.workingHours.sunday.close}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-3xl p-8 md:p-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {language === 'ar' ? 'جرب StyleMe الآن' : 'Try StyleMe Now'}
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          {language === 'ar'
            ? 'انضم إلى آلاف المستخدمين الذين وجدوا أسلوبهم المثالي معنا'
            : 'Join thousands of users who found their perfect style with us'
          }
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-lg px-8 py-6"
          onClick={() => navigate(isAuthenticated ? '/try-style' : '/register')}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {language === 'ar' ? 'ابدأ التجربة' : 'Start Experience'}
        </Button>
      </section>
    </div>
  );
};

export default Home;