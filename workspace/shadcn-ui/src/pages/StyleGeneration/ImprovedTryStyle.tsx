import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { 
  Camera, 
  Upload, 
  Loader2, 
  RefreshCw,
  Heart,
  Share2,
  BookOpen,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Scissors,
  Palette,
  Zap,
  Eye,
  RotateCcw
} from 'lucide-react';

interface GeneratedStyle {
  id: string;
  imageUrl: string;
  styleType: 'haircut' | 'color' | 'beard';
  description: Record<'ar' | 'en', string>;
  confidence: number;
}

interface ModificationRequest {
  type: 'length' | 'volume' | 'color' | 'style';
  value: number;
  description: string;
}

const ImprovedTryStyle: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Select Gender, 3: Generating, 4: Results, 5: Modify
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [generatedStyles, setGeneratedStyles] = useState<GeneratedStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedStyleImage, setSelectedStyleImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [notes, setNotes] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  
  // Modification controls
  const [lengthAdjustment, setLengthAdjustment] = useState([0]);
  const [volumeAdjustment, setVolumeAdjustment] = useState([0]);
  const [colorIntensity, setColorIntensity] = useState([0]);
  
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        setOriginalImage(imageData);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.style.cssText = `
        max-width: 90vw;
        max-height: 70vh;
        border-radius: 12px;
        margin-bottom: 20px;
      `;
      
      const captureBtn = document.createElement('button');
      captureBtn.textContent = language === 'ar' ? 'التقاط الصورة' : 'Capture Photo';
      captureBtn.style.cssText = `
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px;
      `;
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = language === 'ar' ? 'إلغاء' : 'Cancel';
      cancelBtn.style.cssText = `
        background: #ef4444;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px;
      `;
      
      modal.appendChild(video);
      
      const buttonContainer = document.createElement('div');
      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      modal.appendChild(buttonContainer);
      
      document.body.appendChild(modal);
      
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(imageDataUrl);
        setOriginalImage(imageDataUrl);
        setStep(2);
        
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
      
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
      
    } catch (error) {
      console.error('Camera access error:', error);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'user';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            setSelectedImage(imageData);
            setOriginalImage(imageData);
            setStep(2);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const generateStyles = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedImage) {
      alert(language === 'ar' ? 'يرجى رفع صورة أولاً' : 'Please upload an image first');
      return;
    }

    setStep(3);
    setIsGenerating(true);
    setProgress(0);

    const progressSteps = [15, 30, 45, 60, 75, 85, 95, 100];
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep]);
        currentStep++;
      } else {
        clearInterval(progressInterval);
      }
    }, 400);

    try {
      // Simulate AI processing with enhanced mock generation
      const generatedStyles = await createEnhancedMockStyles(selectedImage, selectedGender);
      
      clearInterval(progressInterval);
      setProgress(100);
      setGeneratedStyles(generatedStyles);
      setIsGenerating(false);
      setStep(4);
      
    } catch (error) {
      console.error('AI Generation failed:', error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setStep(1);
    }
  };

  const createEnhancedMockStyles = async (originalImage: string, gender: 'male' | 'female') => {
    const styleConfigs = gender === 'female' ? [
      { type: 'haircut', nameAr: 'قصة طبقات عصرية', nameEn: 'Modern Layered Cut', filter: 'brightness(1.1) contrast(1.05)' },
      { type: 'color', nameAr: 'لون شعر طبيعي', nameEn: 'Natural Hair Color', filter: 'sepia(0.3) hue-rotate(20deg)' },
      { type: 'haircut', nameAr: 'قصة قصيرة أنيقة', nameEn: 'Elegant Short Cut', filter: 'contrast(1.2) brightness(1.05)' },
      { type: 'haircut', nameAr: 'تموجات ناعمة', nameEn: 'Soft Waves', filter: 'blur(0.3px) brightness(1.08)' },
      { type: 'color', nameAr: 'شعر مفرود كلاسيكي', nameEn: 'Classic Straight Hair', filter: 'saturate(0.8) brightness(1.02)' },
      { type: 'color', nameAr: 'خصل ملونة', nameEn: 'Colored Highlights', filter: 'hue-rotate(45deg) saturate(1.3)' }
    ] : [
      { type: 'haircut', nameAr: 'قصة شعر عصرية', nameEn: 'Modern Haircut', filter: 'brightness(1.1) contrast(1.1)' },
      { type: 'beard', nameAr: 'لحية مهذبة', nameEn: 'Well-groomed Beard', filter: 'sepia(0.2) contrast(1.15)' },
      { type: 'color', nameAr: 'لون شعر جديد', nameEn: 'New Hair Color', filter: 'hue-rotate(30deg) saturate(1.1)' },
      { type: 'haircut', nameAr: 'قصة فيد متدرجة', nameEn: 'Gradient Fade Cut', filter: 'contrast(1.3) brightness(1.05)' },
      { type: 'haircut', nameAr: 'ستايل حديث', nameEn: 'Modern Style', filter: 'brightness(0.95) saturate(1.1)' },
      { type: 'haircut', nameAr: 'قصة كلاسيكية', nameEn: 'Classic Cut', filter: 'saturate(0.9) brightness(1.05)' }
    ];

    const styles = await Promise.all(
      styleConfigs.map(async (config, index) => ({
        id: `enhanced-style-${index + 1}`,
        imageUrl: await applyImageFilter(originalImage, config.filter),
        styleType: config.type as 'haircut' | 'color' | 'beard',
        description: {
          ar: config.nameAr,
          en: config.nameEn
        },
        confidence: 0.8 + Math.random() * 0.15
      }))
    );

    return styles;
  };

  const applyImageFilter = async (imageUrl: string, filter: string): Promise<string> => {
    return new Promise<string>((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.filter = filter;
          ctx.drawImage(img, 0, 0);
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageUrl;
    });
  };

  const selectStyle = (styleId: string) => {
    setSelectedStyle(styleId);
    const style = generatedStyles.find(s => s.id === styleId);
    if (style) {
      setSelectedStyleImage(style.imageUrl);
    }
  };

  const modifyStyle = async () => {
    if (!selectedStyleImage) return;
    
    setIsModifying(true);
    
    // Simulate modification based on slider values
    const modifications = [];
    if (lengthAdjustment[0] !== 0) {
      modifications.push(`brightness(${1 + lengthAdjustment[0] * 0.1})`);
    }
    if (volumeAdjustment[0] !== 0) {
      modifications.push(`contrast(${1 + volumeAdjustment[0] * 0.1})`);
    }
    if (colorIntensity[0] !== 0) {
      modifications.push(`saturate(${1 + colorIntensity[0] * 0.2})`);
    }
    
    const combinedFilter = modifications.join(' ') || 'none';
    const modifiedImage = await applyImageFilter(selectedStyleImage, combinedFilter);
    
    setSelectedStyleImage(modifiedImage);
    setIsModifying(false);
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
    
    localStorage.setItem('selectedStyle', JSON.stringify({
      id: selectedStyle,
      originalImage: originalImage,
      selectedStyleImage: selectedStyleImage,
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

  const navigateStyles = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStyleIndex > 0) {
      setCurrentStyleIndex(currentStyleIndex - 1);
    } else if (direction === 'next' && currentStyleIndex < generatedStyles.length - 1) {
      setCurrentStyleIndex(currentStyleIndex + 1);
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
    <div className="max-w-6xl mx-auto space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-500" />
          {t('tryStyle')}
        </h1>
        <p className="text-gray-600">
          {language === 'ar' 
            ? 'اكتشف قصة الشعر المثالية باستخدام الذكاء الاصطناعي المتطور'
            : 'Discover your perfect hairstyle with advanced AI technology'
          }
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-12 h-1 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Image Upload */}
      {step === 1 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Upload className="h-6 w-6" />
              {t('uploadPhoto')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-32 flex-col space-y-2 hover:bg-blue-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-blue-500" />
                <span>{language === 'ar' ? 'رفع من المعرض' : 'Upload from Gallery'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-32 flex-col space-y-2 hover:bg-green-50"
                onClick={handleCameraCapture}
              >
                <Camera className="h-8 w-8 text-green-500" />
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
            
            <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              <Eye className="h-5 w-5 mx-auto mb-2 text-gray-400" />
              {language === 'ar' 
                ? 'اختر صورة واضحة لوجهك للحصول على أفضل النتائج. تأكد من الإضاءة الجيدة وأن الوجه واضح.'
                : 'Choose a clear photo of your face for best results. Ensure good lighting and that your face is clearly visible.'
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Gender Selection */}
      {step === 2 && selectedImage && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {language === 'ar' ? 'صورتك' : 'Your Photo'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={selectedImage} 
                alt="Uploaded" 
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setStep(1)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'تغيير الصورة' : 'Change Photo'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                {t('selectGender')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={selectedGender} 
                onValueChange={(value: 'male' | 'female') => setSelectedGender(value)}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="flex-1 cursor-pointer">
                    {t('male')} - {language === 'ar' ? 'قصات شعر ولحية' : 'Haircuts & Beard styles'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="flex-1 cursor-pointer">
                    {t('female')} - {language === 'ar' ? 'قصات شعر وألوان' : 'Haircuts & Hair colors'}
                  </Label>
                </div>
              </RadioGroup>
              
              <Button 
                onClick={generateStyles} 
                className="w-full"
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'توليد القصات بالذكاء الاصطناعي' : 'Generate AI Hairstyles'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 3 && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-16 text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">
              {language === 'ar' ? 'جاري توليد القصات...' : 'Generating Hairstyles...'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'الذكاء الاصطناعي يحلل صورتك ويولد قصات مخصصة لك'
                : 'AI is analyzing your photo and generating personalized hairstyles'
              }
            </p>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">{progress}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === 4 && generatedStyles.length > 0 && (
        <div className="space-y-6">
          {/* Style Selection Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {language === 'ar' ? 'اختر قصتك المفضلة' : 'Choose Your Favorite Style'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generatedStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedStyle === style.id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => selectStyle(style.id)}
                  >
                    <img 
                      src={style.imageUrl} 
                      alt={style.description[language]}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant={favorites.includes(style.id) ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(style.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(style.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">{style.description[language]}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(style.confidence * 100)}% {language === 'ar' ? 'دقة' : 'match'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {style.styleType === 'haircut' && (language === 'ar' ? 'قصة' : 'Cut')}
                          {style.styleType === 'color' && (language === 'ar' ? 'لون' : 'Color')}
                          {style.styleType === 'beard' && (language === 'ar' ? 'لحية' : 'Beard')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Style Details */}
          {selectedStyle && selectedStyleImage && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Before/After Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {language === 'ar' ? 'مقارنة قبل وبعد' : 'Before & After'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowComparison(!showComparison)}
                    >
                      {showComparison 
                        ? (language === 'ar' ? 'إخفاء المقارنة' : 'Hide Comparison')
                        : (language === 'ar' ? 'عرض المقارنة' : 'Show Comparison')
                      }
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showComparison ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">{language === 'ar' ? 'قبل' : 'Before'}</p>
                        <img 
                          src={originalImage || ''} 
                          alt="Before" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">{language === 'ar' ? 'بعد' : 'After'}</p>
                        <img 
                          src={selectedStyleImage} 
                          alt="After" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={selectedStyleImage} 
                      alt="Selected Style" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Modification Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {language === 'ar' ? 'تعديل القصة' : 'Modify Style'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'طول الشعر' : 'Hair Length'}
                    </Label>
                    <Slider
                      value={lengthAdjustment}
                      onValueChange={setLengthAdjustment}
                      max={5}
                      min={-5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{language === 'ar' ? 'أقصر' : 'Shorter'}</span>
                      <span>{language === 'ar' ? 'أطول' : 'Longer'}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'كثافة الشعر' : 'Hair Volume'}
                    </Label>
                    <Slider
                      value={volumeAdjustment}
                      onValueChange={setVolumeAdjustment}
                      max={5}
                      min={-5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{language === 'ar' ? 'أقل كثافة' : 'Less Volume'}</span>
                      <span>{language === 'ar' ? 'أكثر كثافة' : 'More Volume'}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'شدة اللون' : 'Color Intensity'}
                    </Label>
                    <Slider
                      value={colorIntensity}
                      onValueChange={setColorIntensity}
                      max={5}
                      min={-5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{language === 'ar' ? 'أفتح' : 'Lighter'}</span>
                      <span>{language === 'ar' ? 'أغمق' : 'Darker'}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={modifyStyle} 
                    disabled={isModifying}
                    className="w-full"
                  >
                    {isModifying ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    {language === 'ar' ? 'تطبيق التعديلات' : 'Apply Modifications'}
                  </Button>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">
                      {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={language === 'ar' 
                        ? 'أضف أي ملاحظات أو طلبات خاصة للحلاق...'
                        : 'Add any special notes or requests for the barber...'
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          {selectedStyle && (
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleBookAppointment} size="lg" className="flex-1 max-w-xs">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {language === 'ar' ? 'احجز موعد' : 'Book Appointment'}
                  </Button>
                  
                  <Button onClick={shareStyle} variant="outline" size="lg" className="flex-1 max-w-xs">
                    <Share2 className="h-5 w-5 mr-2" />
                    {language === 'ar' ? 'مشاركة' : 'Share'}
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setStep(1);
                      setSelectedImage(null);
                      setGeneratedStyles([]);
                      setSelectedStyle(null);
                    }} 
                    variant="outline" 
                    size="lg"
                    className="flex-1 max-w-xs"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    {language === 'ar' ? 'جرب مرة أخرى' : 'Try Again'}
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

export default ImprovedTryStyle;

