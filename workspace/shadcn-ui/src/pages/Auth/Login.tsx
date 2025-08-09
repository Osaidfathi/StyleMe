import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { 
      email: 'user@example.com', 
      label: language === 'ar' ? 'عميل' : 'Customer',
      role: 'customer'
    },
    { 
      email: 'salon@example.com', 
      label: language === 'ar' ? 'صالون' : 'Salon Owner',
      role: 'salon_owner'
    },
    { 
      email: 'admin@styleme.com', 
      label: language === 'ar' ? 'مدير' : 'Admin',
      role: 'admin'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo.jpg" alt="StyleMe" className="h-12 w-12 rounded-full" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t('login')}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'أدخل بياناتك للدخول إلى حسابك'
                : 'Enter your credentials to access your account'
              }
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('loading') : t('login')}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600">
              {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('register')}
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="w-full border-t pt-4">
              <p className="text-sm text-gray-600 text-center mb-3">
                {language === 'ar' ? 'للتجربة السريعة:' : 'For quick demo:'}
              </p>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword('demo123');
                    }}
                  >
                    <span className="font-medium">{cred.label}:</span>
                    <span className="ml-2 text-xs text-gray-500">{cred.email}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {language === 'ar' ? 'كلمة المرور: demo123' : 'Password: demo123'}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;