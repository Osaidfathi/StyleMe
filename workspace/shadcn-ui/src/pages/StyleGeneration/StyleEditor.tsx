import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Palette, 
  Scissors, 
  Sparkles,
  RotateCcw,
  Eye,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface StyleData {
  id: string;
  imageUrl: string;
  styleType: 'haircut' | 'color' | 'beard';
  description: Record<'ar' | 'en', string>;
  confidence: number;
}

const StyleEditor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const { originalImage, selectedStyle, allStyles, notes: initialNotes, gender } = location.state || {};
  
  const [currentStyle, setCurrentStyle] = useState<StyleData>(selectedStyle);
  const [notes, setNotes] = useState(initialNotes || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modifications, setModifications] = useState({
    brightness: [0],
    contrast: [0],
    saturation: [0],
    length: [0], // For hair length
    style_intensity: [50] // How strong the style should be
  });

  if (!selectedStyle || !originalImage) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'لم يتم العثور على بيانات القصة' : 'No style data found'}
        </h2>
        <Button onClick={() => navigate('/try-style')}>
          {language === 'ar' ? 'العودة لتجربة القصات' : 'Back to Try Styles'}
        </Button>
      </div>
    );
  }

  const handleApplyModifications = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing with modifications
    setTimeout(() => {
      // In a real app, this would apply the modifications to the image
      // For demo, we'll just simulate a small change
      setCurrentStyle(prev => ({
        ...prev,
        confidence: Math.min(0.95, prev.confidence + 0.05),
        description: {
          ar: prev.description.ar + ' (محدّث)',
          en: prev.description.en + ' (Updated)'
        }
      }));
      setIsGenerating(false);
    }, 2000);
  };

  const handleSelectDifferentStyle = (style: StyleData) => {
    setCurrentStyle(style);
    // Reset modifications when changing style
    setModifications({
      brightness: [0],
      contrast: [0],
      saturation: [0],
      length: [0],
      style_intensity: [50]
    });
  };

  const handleBookAppointment = () => {
    // Store the final selected style and navigate to salon selection
    localStorage.setItem('selectedStyle', JSON.stringify({
      id: currentStyle.id,
      originalImage,
      selectedStyleImage: currentStyle.imageUrl,
      notes,
      gender,
      modifications
    }));
    
    navigate('/salons');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/try-style')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'العودة للمقترحات' : 'Back to Suggestions'}
        </Button>
        
        <h1 className="text-2xl font-bold">
          {language === 'ar' ? 'محرر القصات' : 'Style Editor'}
        </h1>
        
        <div className="w-32"></div> {/* Spacer for centering */}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Original Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'ar' ? 'الصورة الأصلية' : 'Original Image'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={originalImage} 
              alt="Original"
              className="w-full h-64 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Middle Column - Current Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              {language === 'ar' ? 'القصة الحالية' : 'Current Style'}
              <Badge className="bg-primary">
                {Math.round(currentStyle.confidence * 100)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img 
                src={currentStyle.imageUrl} 
                alt="Current Style"
                className="w-full h-64 object-cover rounded-lg"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">
                      {language === 'ar' ? 'جاري التطبيق...' : 'Applying...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium">{currentStyle.description[language]}</h4>
              <p className="text-sm text-gray-600 capitalize">
                {currentStyle.styleType === 'haircut' 
                  ? (language === 'ar' ? 'قصة شعر' : 'Haircut')
                  : currentStyle.styleType === 'color' 
                    ? (language === 'ar' ? 'لون' : 'Color')
                    : (language === 'ar' ? 'لحية' : 'Beard')
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Controls */}
        <div className="space-y-4">
          {/* Modification Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                {language === 'ar' ? 'التعديلات' : 'Modifications'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="appearance">
                    {language === 'ar' ? 'المظهر' : 'Appearance'}
                  </TabsTrigger>
                  <TabsTrigger value="style">
                    {language === 'ar' ? 'الستايل' : 'Style'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="appearance" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'السطوع' : 'Brightness'}
                    </Label>
                    <Slider
                      value={modifications.brightness}
                      onValueChange={(value) => setModifications(prev => ({ ...prev, brightness: value }))}
                      max={100}
                      min={-100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'التباين' : 'Contrast'}
                    </Label>
                    <Slider
                      value={modifications.contrast}
                      onValueChange={(value) => setModifications(prev => ({ ...prev, contrast: value }))}
                      max={100}
                      min={-100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'التشبع' : 'Saturation'}
                    </Label>
                    <Slider
                      value={modifications.saturation}
                      onValueChange={(value) => setModifications(prev => ({ ...prev, saturation: value }))}
                      max={100}
                      min={-100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="style" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'طول الشعر' : 'Hair Length'}
                    </Label>
                    <Slider
                      value={modifications.length}
                      onValueChange={(value) => setModifications(prev => ({ ...prev, length: value }))}
                      max={50}
                      min={-50}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'قوة الستايل' : 'Style Intensity'}
                    </Label>
                    <Slider
                      value={modifications.style_intensity}
                      onValueChange={(value) => setModifications(prev => ({ ...prev, style_intensity: value }))}
                      max={100}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleApplyModifications}
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'تطبيق التعديلات' : 'Apply Modifications'}
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={language === 'ar' 
                  ? 'أضف أي ملاحظات أو تعديلات تريدها...'
                  : 'Add any notes or modifications you want...'
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleBookAppointment}
              className="w-full"
              size="lg"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t('bookAppointment')}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/try-style')}
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'تجربة قصة أخرى' : 'Try Different Style'}
            </Button>
          </div>
        </div>
      </div>

      {/* Alternative Styles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'ar' ? 'مقترحات أخرى' : 'Other Suggestions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allStyles?.map((style: StyleData) => (
              <div
                key={style.id}
                className={`cursor-pointer transition-all hover:shadow-md rounded-lg overflow-hidden ${
                  currentStyle.id === style.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelectDifferentStyle(style)}
              >
                <img 
                  src={style.imageUrl} 
                  alt={style.description[language]}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <p className="text-xs font-medium truncate">
                    {style.description[language]}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {Math.round(style.confidence * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleEditor;