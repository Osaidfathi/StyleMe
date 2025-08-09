import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { api, locationService } from '@/lib/api';
import { t } from '@/lib/i18n';
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail,
  Navigation,
  Filter,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  is_approved: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  distance?: number;
  barbers: Array<{
    id: number;
    name: string;
    specialty: string;
  }>;
}

const SalonList: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'rating'>('distance');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadSalons();
    requestUserLocation();
  }, []);

  useEffect(() => {
    filterAndSortSalons();
  }, [salons, searchTerm, sortBy, userLocation]);

  const requestUserLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      
      // Get nearby salons if location is available
      if (location) {
        await loadNearbySalons(location.latitude, location.longitude);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      // Continue without location - show all salons
    } finally {
      setLocationLoading(false);
    }
  };

  const loadSalons = async () => {
    try {
      setLoading(true);
      const response = await api.salons.getAll();
      setSalons(response.salons || []);
      setError('');
    } catch (error) {
      console.error('Error loading salons:', error);
      setError(language === 'ar' ? 'خطأ في تحميل الصالونات' : 'Error loading salons');
      // Fallback to mock data
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbySalons = async (latitude: number, longitude: number, radius: number = 50) => {
    try {
      const response = await api.salons.getNearby(latitude, longitude, radius);
      setSalons(response.salons || []);
    } catch (error) {
      console.error('Error loading nearby salons:', error);
      // Fallback to all salons
      await loadSalons();
    }
  };

  const loadSalonsByCity = async (city: string) => {
    try {
      setLoading(true);
      const response = await api.salons.getByCity(city);
      setSalons(response.salons || []);
      setSelectedCity(city);
    } catch (error) {
      console.error('Error loading salons by city:', error);
      setError(language === 'ar' ? 'خطأ في تحميل صالونات المدينة' : 'Error loading salons for city');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSalons = () => {
    let filtered = salons.filter(salon => {
      const matchesSearch = salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           salon.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           salon.city?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort salons
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance;
          }
          return 0;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          // Mock rating for now - in real app this would come from reviews
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    setFilteredSalons(filtered);
  };

  const handleSalonSelect = (salon: Salon) => {
    // Check if user came from style selection
    const selectedStyle = localStorage.getItem('selectedStyle');
    
    if (selectedStyle) {
      // Navigate to booking with salon and style info
      navigate(`/booking?salon=${salon.id}&style=${JSON.parse(selectedStyle).id}`);
    } else {
      // Navigate to salon details
      navigate(`/salons/${salon.id}`);
    }
  };

  const getDistanceText = (distance?: number) => {
    if (distance === undefined) return '';
    if (distance < 1) {
      return `${Math.round(distance * 1000)}${language === 'ar' ? ' متر' : 'm'}`;
    }
    return `${distance.toFixed(1)}${language === 'ar' ? ' كم' : 'km'}`;
  };

  const cities = [...new Set(salons.map(salon => salon.city).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {language === 'ar' ? 'جاري تحميل الصالونات...' : 'Loading salons...'}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'ar' ? 'اختر صالونك المفضل' : 'Choose Your Preferred Salon'}
        </h1>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'اعثر على أفضل الصالونات في منطقتك واحجز موعدك'
            : 'Find the best salons in your area and book your appointment'
          }
        </p>
      </div>

      {/* Location Status */}
      {locationLoading && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>{language === 'ar' ? 'جاري تحديد موقعك...' : 'Getting your location...'}</span>
          </CardContent>
        </Card>
      )}

      {userLocation && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center">
            <Navigation className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">
              {language === 'ar' ? 'تم تحديد موقعك - عرض الصالونات القريبة' : 'Location found - Showing nearby salons'}
            </span>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'ar' ? 'ابحث عن صالون...' : 'Search salons...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCity} onValueChange={loadSalonsByCity}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر المدينة' : 'Select City'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {language === 'ar' ? 'جميع المدن' : 'All Cities'}
                </SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city!}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'distance' | 'name' | 'rating') => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">
                  {language === 'ar' ? 'الأقرب' : 'Nearest'}
                </SelectItem>
                <SelectItem value="name">
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </SelectItem>
                <SelectItem value="rating">
                  {language === 'ar' ? 'التقييم' : 'Rating'}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={requestUserLocation}
              disabled={locationLoading}
            >
              <Navigation className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تحديد الموقع' : 'Find Location'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salon Grid */}
      {filteredSalons.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {language === 'ar' ? 'لا توجد صالونات' : 'No Salons Found'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'لم نجد صالونات تطابق معايير البحث الخاصة بك'
                : 'We couldn\'t find any salons matching your search criteria'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalons.map((salon) => (
            <Card 
              key={salon.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSalonSelect(salon)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{salon.name}</CardTitle>
                  {salon.distance !== undefined && (
                    <Badge variant="secondary">
                      {getDistanceText(salon.distance)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{salon.address}</span>
                </div>

                {salon.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{salon.phone}</span>
                  </div>
                )}

                {salon.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{salon.email}</span>
                  </div>
                )}

                {salon.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {salon.description}
                  </p>
                )}

                {salon.barbers && salon.barbers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">
                      {language === 'ar' ? 'الحلاقين:' : 'Barbers:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {salon.barbers.slice(0, 3).map((barber) => (
                        <Badge key={barber.id} variant="outline" className="text-xs">
                          {barber.name}
                        </Badge>
                      ))}
                      {salon.barbers.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{salon.barbers.length - 3} {language === 'ar' ? 'أكثر' : 'more'}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">4.{Math.floor(Math.random() * 5) + 5}</span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.floor(Math.random() * 100) + 20})
                    </span>
                  </div>
                  
                  <Badge className="bg-green-100 text-green-800">
                    {language === 'ar' ? 'مفتوح' : 'Open'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Style Info */}
      {localStorage.getItem('selectedStyle') && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg mr-4 flex items-center justify-center">
                <img 
                  src={JSON.parse(localStorage.getItem('selectedStyle')!).selectedStyleImage} 
                  alt="Selected Style"
                  className="w-12 h-12 rounded object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  {language === 'ar' ? 'القصة المختارة' : 'Selected Style'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar' 
                    ? 'اختر صالوناً لحجز موعد لهذه القصة'
                    : 'Choose a salon to book an appointment for this style'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalonList;

