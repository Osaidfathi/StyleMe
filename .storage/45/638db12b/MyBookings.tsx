import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { mockSalons } from '@/data/mockData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  Star,
  Eye,
  X,
  Edit,
  CalendarX
} from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  salonId: string;
  barberId: string;
  serviceId: string;
  appointmentTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  originalImageUrl?: string;
  selectedStyleImageUrl?: string;
  customerNotes: Record<'ar' | 'en', string>;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load user bookings from localStorage (in real app, this would be an API call)
      const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const userSpecificBookings = userBookings
        .filter((booking: Booking) => booking.userId === user.id)
        .map((booking: Booking) => ({
          ...booking,
          appointmentTime: new Date(booking.appointmentTime)
        }))
        .sort((a: Booking, b: Booking) => 
          new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()
        );
      
      setBookings(userSpecificBookings);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please Login First'}
        </h2>
        <Button onClick={() => navigate('/login')}>
          {t('login')}
        </Button>
      </div>
    );
  }

  const getBookingsByStatus = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const getSalonById = (salonId: string) => {
    return mockSalons.find(salon => salon.id === salonId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return language === 'ar' ? 'مؤكد' : 'Confirmed';
      case 'pending': return language === 'ar' ? 'معلق' : 'Pending';
      case 'completed': return language === 'ar' ? 'مكتمل' : 'Completed';
      case 'cancelled': return language === 'ar' ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    );
    setBookings(updatedBookings);
    
    // Update localStorage
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedAllBookings = allBookings.map((booking: Booking) => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' }
        : booking
    );
    localStorage.setItem('userBookings', JSON.stringify(updatedAllBookings));
  };

  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const salon = getSalonById(booking.salonId);
    const isUpcoming = new Date(booking.appointmentTime) > new Date();
    const canCancel = booking.status === 'confirmed' && isUpcoming;

    if (!salon) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{salon.name[language]}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{salon.address}</span>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusText(booking.status)}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{booking.appointmentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{booking.appointmentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{salon.phone}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold mb-2">${booking.price}</div>
              <Badge variant="outline" className="text-xs">
                {booking.paymentStatus === 'paid' 
                  ? (language === 'ar' ? 'مدفوع' : 'Paid')
                  : (language === 'ar' ? 'غير مدفوع' : 'Unpaid')
                }
              </Badge>
            </div>
          </div>

          {booking.selectedStyleImageUrl && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">
                {language === 'ar' ? 'القصة المختارة:' : 'Selected Style:'}
              </h4>
              <div className="flex items-center space-x-3">
                <img 
                  src={booking.originalImageUrl} 
                  alt="Original"
                  className="w-12 h-14 object-cover rounded"
                />
                <span className="text-lg">→</span>
                <img 
                  src={booking.selectedStyleImageUrl} 
                  alt="Selected Style"
                  className="w-12 h-14 object-cover rounded"
                />
              </div>
            </div>
          )}

          {booking.customerNotes[language] && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">
                {language === 'ar' ? 'ملاحظاتك:' : 'Your Notes:'}
              </h4>
              <p className="text-sm text-gray-700">{booking.customerNotes[language]}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/salons/${booking.salonId}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'عرض الصالون' : 'View Salon'}
            </Button>
            
            {canCancel && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
              >
                <CalendarX className="h-4 w-4 mr-1" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t('myBookings')}
        </h1>
        <Button onClick={() => navigate('/try-style')}>
          {language === 'ar' ? 'حجز جديد' : 'New Booking'}
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {language === 'ar' ? 'لا توجد حجوزات' : 'No Bookings Yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'ar' 
              ? 'ابدأ بتجربة قصة شعر جديدة وحجز موعدك'
              : 'Start by trying a new hairstyle and booking your appointment'
            }
          </p>
          <Button onClick={() => navigate('/try-style')}>
            {t('tryStyle')}
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              {language === 'ar' ? 'الكل' : 'All'} ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              {language === 'ar' ? 'مؤكد' : 'Confirmed'} ({getBookingsByStatus('confirmed').length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              {language === 'ar' ? 'معلق' : 'Pending'} ({getBookingsByStatus('pending').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {language === 'ar' ? 'مكتمل' : 'Completed'} ({getBookingsByStatus('completed').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {getBookingsByStatus('all').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {getBookingsByStatus('confirmed').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {getBookingsByStatus('pending').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {getBookingsByStatus('completed').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MyBookings;