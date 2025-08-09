import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { mockSalons } from '@/data/mockData';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard,
  User,
  CheckCircle
} from 'lucide-react';

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const salon = mockSalons.find(s => s.id === id);
  const selectedStyle = JSON.parse(localStorage.getItem('selectedStyle') || 'null');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [notes, setNotes] = useState(selectedStyle?.notes || '');
  const [step, setStep] = useState(1); // 1: DateTime, 2: Barber/Service, 3: Confirmation, 4: Payment
  
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

  // Generate available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30'
  ];

  const selectedServiceObj = salon.services.find(s => s.id === selectedService);
  const selectedBarberObj = salon.barbers.find(b => b.id === selectedBarber);
  const totalPrice = selectedServiceObj?.price || 0;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(`/salons/${id}`);
    }
  };

  const handleConfirmBooking = () => {
    // In a real app, this would create the booking via API
    const bookingData = {
      id: Date.now().toString(),
      userId: user?.id,
      salonId: id,
      barberId: selectedBarber,
      serviceId: selectedService,
      appointmentTime: new Date(selectedDate!.setHours(
        parseInt(selectedTime.split(':')[0]),
        parseInt(selectedTime.split(':')[1])
      )),
      status: 'confirmed',
      originalImageUrl: selectedStyle?.originalImage,
      selectedStyleImageUrl: selectedStyle?.selectedStyleImage,
      customerNotes: { ar: notes, en: notes },
      price: totalPrice,
      paymentStatus: 'paid'
    };
    
    // Store booking data
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));
    
    // Clear selected style
    localStorage.removeItem('selectedStyle');
    
    // Navigate to success page
    navigate('/booking-success', { 
      state: { booking: bookingData, salon } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'السابق' : 'Back'}
        </Button>
        
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                s <= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s < step ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Step 1: Date & Time */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {language === 'ar' ? 'اختر التاريخ والوقت' : 'Select Date & Time'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    className="rounded-md border"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      {language === 'ar' ? 'الوقت المتاح' : 'Available Time'}
                    </Label>
                    <RadioGroup value={selectedTime} onValueChange={setSelectedTime}>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <div key={time} className="flex items-center space-x-2">
                            <RadioGroupItem value={time} id={time} />
                            <Label htmlFor={time} className="text-sm cursor-pointer">
                              {time}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                <Button 
                  onClick={handleNext} 
                  disabled={!selectedDate || !selectedTime}
                  className="w-full"
                >
                  {t('next')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Barber & Service */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {language === 'ar' ? 'اختر الحلاق والخدمة' : 'Select Barber & Service'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {language === 'ar' ? 'الحلاق' : 'Barber'}
                  </Label>
                  <RadioGroup value={selectedBarber} onValueChange={setSelectedBarber}>
                    <div className="space-y-3">
                      {salon.barbers.map((barber) => (
                        <div key={barber.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={barber.id} id={barber.id} />
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={barber.avatar} />
                            <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Label htmlFor={barber.id} className="cursor-pointer font-medium">
                              {barber.name}
                            </Label>
                            <p className="text-sm text-gray-600">{barber.bio[language]}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              ⭐ {barber.rating}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {language === 'ar' ? 'الخدمة' : 'Service'}
                  </Label>
                  <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                    <div className="space-y-2">
                      {salon.services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={service.id} id={service.id} />
                            <div>
                              <Label htmlFor={service.id} className="cursor-pointer font-medium">
                                {service.name[language]}
                              </Label>
                              <p className="text-sm text-gray-600">{service.description[language]}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">${service.price}</span>
                            <p className="text-xs text-gray-500">{service.duration} min</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </Label>
                  <Textarea
                    placeholder={language === 'ar' 
                      ? 'أضف أي ملاحظات خاصة...'
                      : 'Add any special notes...'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!selectedBarber || !selectedService}
                  className="w-full"
                >
                  {t('next')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                    <span>{selectedDate?.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{language === 'ar' ? 'الوقت:' : 'Time:'}</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{language === 'ar' ? 'الحلاق:' : 'Barber:'}</span>
                    <span>{selectedBarberObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{language === 'ar' ? 'الخدمة:' : 'Service:'}</span>
                    <span>{selectedServiceObj?.name[language]}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full">
                  {language === 'ar' ? 'المتابعة للدفع' : 'Proceed to Payment'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  {language === 'ar' ? 'الدفع' : 'Payment'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'ar' ? 'محاكاة الدفع' : 'Payment Simulation'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'ar' 
                      ? 'في التطبيق الحقيقي، ستتم معالجة الدفع هنا'
                      : 'In the real app, payment processing would happen here'
                    }
                  </p>
                  <Badge className="mb-4">
                    {language === 'ar' ? 'نسخة تجريبية' : 'Demo Version'}
                  </Badge>
                </div>

                <Button onClick={handleConfirmBooking} className="w-full" size="lg">
                  {language === 'ar' ? 'تأكيد الحجز والدفع' : 'Confirm Booking & Pay'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Booking Summary */}
        <div className="space-y-6">
          {/* Salon Info */}
          <Card>
            <CardHeader>
              <CardTitle>{salon.name[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={salon.images[0]} 
                alt={salon.name[language]}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <p className="text-sm text-gray-600 mb-2">{salon.address}</p>
              <div className="flex items-center">
                <Badge variant="outline">⭐ {salon.rating}</Badge>
                <span className="text-sm text-gray-500 ml-2">
                  ({salon.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Selected Style */}
          {selectedStyle && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'القصة المختارة' : 'Selected Style'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <img 
                    src={selectedStyle.originalImage} 
                    alt="Original"
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="text-center">
                    <div className="text-2xl">→</div>
                  </div>
                  <img 
                    src={selectedStyle.selectedStyleImage} 
                    alt="Selected Style"
                    className="w-16 h-20 object-cover rounded"
                  />
                </div>
                {selectedStyle.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <strong>{language === 'ar' ? 'ملاحظات:' : 'Notes:'}</strong>
                    <p>{selectedStyle.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Booking Summary */}
          {step >= 2 && selectedServiceObj && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'ملخص الحجز' : 'Booking Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {step >= 1 && selectedDate && selectedTime && (
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'الموعد:' : 'Appointment:'}</span>
                    <span>{selectedDate.toLocaleDateString()} {selectedTime}</span>
                  </div>
                )}
                {selectedBarberObj && (
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'الحلاق:' : 'Barber:'}</span>
                    <span>{selectedBarberObj.name}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>{language === 'ar' ? 'الخدمة:' : 'Service:'}</span>
                  <span>{selectedServiceObj.name[language]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{language === 'ar' ? 'المدة:' : 'Duration:'}</span>
                  <span>{selectedServiceObj.duration} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                  <span>${totalPrice}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;