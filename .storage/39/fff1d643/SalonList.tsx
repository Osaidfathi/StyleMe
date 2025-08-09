import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { t, getLocalizedText } from '@/lib/i18n';
import { mockSalons } from '@/data/mockData';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone,
  Filter,
  SlidersHorizontal
} from 'lucide-react';

const SalonList: React.FC = () => {
  const [salons, setSalons] = useState(mockSalons);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterOpen, setFilterOpen] = useState('all');
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Check if user has selected a style (for booking flow)
  const selectedStyle = JSON.parse(localStorage.getItem('selectedStyle') || 'null');

  useEffect(() => {
    let filtered = mockSalons;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(salon => 
        salon.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterOpen !== 'all') {
      const isOpen = filterOpen === 'open';
      filtered = filtered.filter(salon => salon.status === 'active');
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'name':
          return a.name[language].localeCompare(b.name[language]);
        default:
          return 0;
      }
    });

    setSalons(filtered);
  }, [searchTerm, sortBy, filterOpen, language]);

  const handleSalonClick = (salonId: string) => {
    if (selectedStyle) {
      navigate(`/salons/${salonId}/book`);
    } else {
      navigate(`/salons/${salonId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {t('searchSalons')}
          </h1>
          {selectedStyle && (
            <p className="text-gray-600 mt-2">
              {language === 'ar' 
                ? 'اختر الصالون المناسب لتطبيق قصتك المختارة'
                : 'Choose the right salon to apply your selected style'
              }
            </p>
          )}
        </div>
        
        {selectedStyle && (
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <img 
                src={selectedStyle.selectedStyleImage} 
                alt="Selected Style" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-sm">
                  {language === 'ar' ? 'القصة المختارة' : 'Selected Style'}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {language === 'ar' ? 'جاهز للحجز' : 'Ready to Book'}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === 'ar' ? 'ابحث عن صالون...' : 'Search salons...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">
              {language === 'ar' ? 'أعلى تقييم' : 'Highest Rated'}
            </SelectItem>
            <SelectItem value="reviews">
              {language === 'ar' ? 'أكثر المراجعات' : 'Most Reviews'}
            </SelectItem>
            <SelectItem value="name">
              {language === 'ar' ? 'الاسم' : 'Name'}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterOpen} onValueChange={setFilterOpen}>
          <SelectTrigger className="w-full md:w-32">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'الكل' : 'All'}
            </SelectItem>
            <SelectItem value="open">
              {language === 'ar' ? 'مفتوح' : 'Open'}
            </SelectItem>
            <SelectItem value="closed">
              {language === 'ar' ? 'مغلق' : 'Closed'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <Card 
            key={salon.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSalonClick(salon.id)}
          >
            <div className="aspect-video relative">
              <img 
                src={salon.images[0]} 
                alt={salon.name[language]}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <Badge 
                className="absolute top-2 right-2"
                variant={salon.status === 'active' ? 'default' : 'secondary'}
              >
                {salon.status === 'active' 
                  ? (language === 'ar' ? 'مفتوح' : 'Open')
                  : (language === 'ar' ? 'مغلق' : 'Closed')
                }
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">
                {salon.name[language]}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{salon.rating}</span>
                  <span className="text-gray-500 text-sm mr-2">
                    ({salon.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{salon.address}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {salon.workingHours.sunday.open} - {salon.workingHours.sunday.close}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{salon.phone}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-1">
                  {salon.services.slice(0, 3).map((service) => (
                    <Badge key={service.id} variant="outline" className="text-xs">
                      {service.name[language]}
                    </Badge>
                  ))}
                  {salon.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{salon.services.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {salons.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No Results Found'}
          </h3>
          <p className="text-gray-500">
            {language === 'ar' 
              ? 'جرب تغيير كلمات البحث أو الفلاتر'
              : 'Try changing your search terms or filters'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SalonList;