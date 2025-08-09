import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Calendar, MapPin, Clock, Home, Eye } from 'lucide-react';

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const { booking, salon } = location.state || {};

  if (!booking || !salon) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'لم يتم العثور على بيانات الحجز' : 'Booking data not found'}
        </h2>
        <Button onClick={() => navigate('/')}>
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="text-center border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            {language === 'ar' ? 'تم تأكيد حجزك بنجاح!' : 'Booking Confirmed Successfully!'}
          </h1>
          <p className="text-green-700">
            {language === 'ar' 
              ? 'سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني'
              : 'Booking details will be sent to your email'
            }
          </p>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {language === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">{language === 'ar' ? 'معلومات الصالون' : 'Salon Information'}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <strong className="w-20">{language === 'ar' ? 'الاسم:' : 'Name:'}</strong>
                  <span>{salon.name[language]}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>{salon.address}</span>
                </div>
                <div className="flex items-center">
                  <strong className="w-20">{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong>
                  <span>{salon.phone}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">{language === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{new Date(booking.appointmentTime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{new Date(booking.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex items-center">
                  <strong className="w-20">{language === 'ar' ? 'السعر:' : 'Price:'}</strong>
                  <span>${booking.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{language === 'ar' ? 'حالة الحجز:' : 'Booking Status:'}</span>
              <Badge className="bg-green-500">
                {language === 'ar' ? 'مؤكد' : 'Confirmed'}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{language === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}</span>
              <Badge className="bg-blue-500">
                {language === 'ar' ? 'مدفوع' : 'Paid'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Style */}
      {booking.selectedStyleImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'القصة المختارة' : 'Selected Style'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <img 
                  src={booking.originalImageUrl} 
                  alt="Original"
                  className="w-20 h-24 object-cover rounded"
                />
                <div className="flex items-center">
                  <span className="text-2xl">→</span>
                </div>
                <img 
                  src={booking.selectedStyleImageUrl} 
                  alt="Selected Style"
                  className="w-20 h-24 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {language === 'ar' 
                    ? 'سيقوم الحلاق بتطبيق هذه القصة وفقاً للصورة المرفقة'
                    : 'The barber will apply this style according to the attached image'
                  }
                </p>
                {booking.customerNotes[language] && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>{language === 'ar' ? 'ملاحظاتك:' : 'Your Notes:'}</strong>
                    <p>{booking.customerNotes[language]}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-amber-800 mb-2">
            {language === 'ar' ? 'ملاحظات مهمة:' : 'Important Notes:'}
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• {language === 'ar' ? 'يرجى الحضور قبل 15 دقيقة من موعدك' : 'Please arrive 15 minutes before your appointment'}</li>
            <li>• {language === 'ar' ? 'أحضر هويتك الشخصية' : 'Bring your personal ID'}</li>
            <li>• {language === 'ar' ? 'في حالة التأخير أكثر من 15 دقيقة قد يتم إلغاء الحجز' : 'Bookings may be cancelled if you\'re more than 15 minutes late'}</li>
            <li>• {language === 'ar' ? 'يمكنك إلغاء أو تعديل الحجز حتى 24 ساعة قبل الموعد' : 'You can cancel or modify your booking up to 24 hours before'}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/bookings')}
          className="flex-1"
        >
          <Eye className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'عرض حجوزاتي' : 'View My Bookings'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate('/')}
          className="flex-1"
        >
          <Home className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>
      </div>
    </div>
  );
};

export default BookingSuccess;