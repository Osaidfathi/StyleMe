import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { mockGeneratedStyles } from '@/data/mockData';
import { 
  Camera, 
  Upload, 
  Loader2, 
  RefreshCw,
  Heart,
  Share2,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface GeneratedStyle {
  id: string;
  imageUrl: string;
  styleType: 'haircut' | 'color' | 'beard';
  description: Record<'ar' | 'en', string>;
  confidence: number;
}

const TryStyle: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Select Gender, 3: Generating, 4: Results
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [generatedStyles, setGeneratedStyles] = useState<GeneratedStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open camera
    // For demo, we'll use a placeholder
    setSelectedImage('/api/placeholder/300/400');
    setStep(2);
  };

  const generateStyles = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setStep(3);
    setIsGenerating(true);
    setProgress(0);

    // Simulate AI generation process
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Filter styles based on gender
      const genderFilteredStyles = mockGeneratedStyles.filter(style => {
        if (selectedGender === 'female' && style.styleType === 'beard') {
          return false;
        }
        return true;
      });
      
      setGeneratedStyles(genderFilteredStyles);
      setIsGenerating(false);
      setStep(4);
    }, 3000);
  };

  const toggleFavorite = (styleId: string) => {
    setFavorites(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleBookAppointment = () => {
    if (!selectedStyle) return;
    
    // Store the selected style and navigate to salon selection
    localStorage.setItem('selectedStyle', JSON.stringify({
      id: selectedStyle,
      originalImage: selectedImage,
      selectedStyleImage: generatedStyles.find(s => s.id === selectedStyle)?.imageUrl,
      notes,
      gender: selectedGender
    }));
    
    navigate('/salons');
  };

  const shareStyle = () => {
    if (navigator.share) {
      navigator.share({
        title: 'StyleMe - ' + (language === 'ar' ? 'قصة شعر جديدة' : 'New Hairstyle'),
        text: language === 'ar' ? 'شاهد قصة الشعر الجديدة التي جربتها' : 'Check out this new hairstyle I tried',
        url: window.location.href
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please Login First'}
        </h2>
        <p className="text-gray-600 mb-6">
          {language === 'ar' 
            ? 'للاستفادة من خدمة تجربة القصات بالذكاء الاصطناعي'
            : 'To use our AI-powered hairstyle generation service'
          }
        </p>
        <Button onClick={() => navigate('/login')}>
          {t('login')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {t('tryStyle')}
        </h1>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'اكتشف قصة الشعر المثالية باستخدام الذكاء الاصطناعي'
            : 'Discover your perfect hairstyle with AI technology'
          }
        </p>
      </div>

      {/* Step 1: Image Upload */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {t('uploadPhoto')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-32 flex-col space-y-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8" />
                <span>{language === 'ar' ? 'رفع من المعرض' : 'Upload from Gallery'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-32 flex-col space-y-2"
                onClick={handleCameraCapture}
              >
                <Camera className="h-8 w-8" />
                <span>{t('takePhoto')}</span>
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="text-center text-sm text-gray-500">
              {language === 'ar' 
                ? 'اختر صورة واضحة لوجهك للحصول على أفضل النتائج'
                : 'Choose a clear photo of your face for best results'
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Gender Selection */}
      {step === 2 && selectedImage && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'صورتك' : 'Your Photo'}</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={selectedImage} 
                alt="Uploaded" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setStep(1)}
              >
                {language === 'ar' ? 'تغيير الصورة' : 'Change Photo'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('selectGender')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={selectedGender} 
                onValueChange={(value: 'male' | 'female') => setSelectedGender(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{t('male')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{t('female')}</Label>
                </div>
              </RadioGroup>
              
              <div className="space-y-2">
                <Label>
                  {language === 'ar' ? 'خيارات التصميم' : 'Styling Options'}
                </Label>
                <div className="text-sm text-gray-600">
                  {selectedGender === 'male' ? (
                    <ul className="space-y-1">
                      <li>• {language === 'ar' ? 'قصات شعر متنوعة' : 'Various haircuts'}</li>
                      <li>• {language === 'ar' ? 'أشكال اللحية' : 'Beard styles'}</li>
                      <li>• {language === 'ar' ? 'ألوان الشعر' : 'Hair colors'}</li>
                    </ul>
                  ) : (
                    <ul className="space-y-1">
                      <li>• {language === 'ar' ? 'قصات شعر نسائية' : 'Women\'s haircuts'}</li>
                      <li>• {language === 'ar' ? 'ألوان وتدرجات' : 'Colors and gradients'}</li>
                      <li>• {language === 'ar' ? 'تسريحات عصرية' : 'Modern styles'}</li>
                    </ul>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={generateStyles}
                className="w-full"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'إنشاء القصات' : 'Generate Styles'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 3 && (
        <Card>
          <CardContent className="py-16 text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">
              {t('generating')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' 
                ? 'جاري تحليل صورتك وإنشاء قصات مخصصة لك باستخدام الذكاء الاصطناعي'
                : 'Analyzing your photo and creating personalized hairstyles using AI'
              }
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">{progress}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === 4 && generatedStyles.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {t('selectStyle')}
            </h2>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'اختر قصتك المفضلة من بين الخيارات المتاحة'
                : 'Choose your favorite style from the generated options'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {generatedStyles.map((style) => (
              <Card 
                key={style.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <CardContent className="p-4">
                  <div className="relative">
                    <img 
                      src={style.imageUrl} 
                      alt={style.description[language]}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(style.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(style.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                    <Badge className="absolute bottom-2 left-2">
                      {Math.round(style.confidence * 100)}%
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium">{style.description[language]}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {language === 'ar' 
                        ? (style.styleType === 'haircut' ? 'قصة شعر' : 
                           style.styleType === 'color' ? 'لون' : 'لحية')
                        : style.styleType
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedStyle && (
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'إضافة ملاحظات' : 'Add Notes'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={language === 'ar' 
                    ? 'أضف أي ملاحظات أو تعديلات تريدها على القصة المختارة...'
                    : 'Add any notes or modifications you want for the selected style...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleBookAppointment}
                    className="flex-1"
                    size="lg"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t('bookAppointment')}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={shareStyle}
                    size="lg"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      setSelectedImage(null);
                      setSelectedStyle(null);
                      setNotes('');
                      setGeneratedStyles([]);
                    }}
                    size="lg"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TryStyle;