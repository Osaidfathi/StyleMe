import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { t, getLocalizedText } from '@/lib/i18n';
import { mockSalons, mockReviews } from '@/data/mockData';
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail,
  Calendar,
  ArrowLeft,
  Users
} from 'lucide-react';
import BarberDetails from '@/components/BarberDetails';

const SalonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [isBarberDetailsOpen, setIsBarberDetailsOpen] = useState(false);
  
  const salon = mockSalons.find(s => s.id === id);
  const salonReviews = mockReviews.filter(r => r.salonId === id);
  
  if (!salon) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'الصالون غير موجود' : 'Salon Not Found'}
        </h2>
        <Button onClick={() => navigate('/salons')}>
          {language === 'ar' ? 'العودة للقائمة' : 'Back to List'}
        </Button>
      </div>
    );
  }

  const selectedStyle = JSON.parse(localStorage.getItem('selectedStyle') || 'null');

  const handleBookNow = () => {
    navigate(`/salons/${id}/book`);
  };

  const handleBarberClick = (barber: any) => {
    // Add total bookings and working hours to barber data
    const enhancedBarber = {
      ...barber,
      totalBookings: Math.floor(Math.random() * 200) + 50,
      workingHours: {
        start: '09:00',
        end: '20:00'
      }
    };
    setSelectedBarber(enhancedBarber);
    setIsBarberDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/salons')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {language === 'ar' ? 'العودة' : 'Back'}
      </Button>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {salon.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${salon.name[language]} ${index + 1}`}
                className="aspect-video object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {salon.name[language]}
            </h1>
            <p className="text-gray-600">
              {salon.description[language]}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold text-lg">{salon.rating}</span>
              <span className="text-gray-500 ml-1">
                ({salon.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})
              </span>
            </div>
            <Badge variant={salon.status === 'active' ? 'default' : 'secondary'}>
              {salon.status === 'active' 
                ? (language === 'ar' ? 'مفتوح' : 'Open')
                : (language === 'ar' ? 'مغلق' : 'Closed')
              }
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-3 text-gray-500" />
              <span>{salon.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-gray-500" />
              <span>{salon.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3 text-gray-500" />
              <span>{salon.email}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-3 text-gray-500" />
              <span>
                {salon.workingHours.sunday.open} - {salon.workingHours.sunday.close}
              </span>
            </div>
          </div>
          
          {selectedStyle && (
            <Card className="border-primary">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedStyle.selectedStyleImage} 
                    alt="Selected Style" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {language === 'ar' ? 'القصة المختارة' : 'Selected Style'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'جاهز للحجز' : 'Ready to book'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleBookNow}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {t('bookAppointment')}
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">
            {language === 'ar' ? 'الخدمات' : 'Services'}
          </TabsTrigger>
          <TabsTrigger value="barbers">
            {language === 'ar' ? 'الحلاقين' : 'Barbers'}
          </TabsTrigger>
          <TabsTrigger value="reviews">
            {language === 'ar' ? 'التقييمات' : 'Reviews'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {salon.services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{service.name[language]}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description[language]}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {service.duration} {language === 'ar' ? 'دقيقة' : 'min'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {service.gender === 'both' 
                            ? (language === 'ar' ? 'رجال ونساء' : 'Men & Women')
                            : service.gender === 'male' 
                              ? (language === 'ar' ? 'رجال' : 'Men')
                              : (language === 'ar' ? 'نساء' : 'Women')
                          }
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">${service.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="barbers" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {salon.barbers.map((barber) => (
              <Card key={barber.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={barber.avatar} alt={barber.name} />
                      <AvatarFallback>
                        {barber.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{barber.name}</h4>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{barber.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {barber.bio[language]}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {barber.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2">
                        <Badge 
                          variant={barber.status === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {barber.status === 'available' 
                            ? (language === 'ar' ? 'متاح' : 'Available')
                            : barber.status === 'busy'
                              ? (language === 'ar' ? 'مشغول' : 'Busy')
                              : (language === 'ar' ? 'غير متاح' : 'Offline')
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          {salonReviews.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {language === 'ar' ? 'لا توجد تقييمات بعد' : 'No Reviews Yet'}
              </h3>
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'كن أول من يقيم هذا الصالون'
                  : 'Be the first to review this salon'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {salonReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.userId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.createdAt.toLocaleDateString(
                              language === 'ar' ? 'ar-SA' : 'en-US'
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {review.comment[language]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonDetails;