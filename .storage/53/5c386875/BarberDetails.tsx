import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Star, 
  Calendar, 
  Users, 
  Clock,
  Award,
  MapPin
} from 'lucide-react';

interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  bio: Record<'ar' | 'en', string>;
  specialties: string[];
  experience: number;
  status: 'available' | 'busy' | 'offline';
  totalBookings?: number;
  workingHours?: {
    start: string;
    end: string;
  };
  location?: string;
}

interface BarberDetailsProps {
  barber: Barber | null;
  isOpen: boolean;
  onClose: () => void;
}

const BarberDetails: React.FC<BarberDetailsProps> = ({ barber, isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!barber) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return language === 'ar' ? 'متاح' : 'Available';
      case 'busy': return language === 'ar' ? 'مشغول' : 'Busy';
      case 'offline': return language === 'ar' ? 'غير متاح' : 'Offline';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {language === 'ar' ? 'تفاصيل الحلاق' : 'Barber Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={barber.avatar} alt={barber.name} />
              <AvatarFallback className="text-2xl">
                {barber.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="text-xl font-bold mb-2">{barber.name}</h3>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{barber.rating}</span>
              <span className="text-gray-500 text-sm">
                ({language === 'ar' ? 'تقييم' : 'rating'})
              </span>
            </div>
            
            <Badge className={getStatusColor(barber.status)}>
              {getStatusText(barber.status)}
            </Badge>
          </div>

          {/* Bio Section */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {barber.bio[language]}
              </p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-lg font-bold">{barber.totalBookings || 147}</div>
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'مجموع الحجوزات' : 'Total Bookings'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="text-lg font-bold">{barber.experience || 5}</div>
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'سنوات الخبرة' : 'Years Experience'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Working Hours */}
          {barber.workingHours && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium text-sm">
                    {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {barber.workingHours.start} - {barber.workingHours.end}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Specialties */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'التخصصات' : 'Specialties'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {barber.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* This Month Stats */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-800 mb-2">
                {language === 'ar' ? 'إحصائيات هذا الشهر' : 'This Month Stats'}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-700 font-medium">
                    {Math.floor(Math.random() * 20) + 15}
                  </div>
                  <div className="text-green-600 text-xs">
                    {language === 'ar' ? 'حجوزات مكتملة' : 'Completed Bookings'}
                  </div>
                </div>
                <div>
                  <div className="text-green-700 font-medium">
                    {(4.5 + Math.random() * 0.4).toFixed(1)}
                  </div>
                  <div className="text-green-600 text-xs">
                    {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarberDetails;