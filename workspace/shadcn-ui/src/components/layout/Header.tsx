import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { 
  User, 
  Calendar, 
  Settings, 
  LogOut, 
  Globe, 
  Menu,
  Shield
} from 'lucide-react';

const Header: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'salon_owner') return '/salon-dashboard';
    return '/profile';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.jpg" alt="StyleMe" className="h-8 w-8 rounded-full" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            StyleMe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('home')}
          </Link>
          <Link 
            to="/try-style" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('tryStyle')}
          </Link>
          <Link 
            to="/salons" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('findSalon')}
          </Link>
          {isAuthenticated && (
            <Link 
              to="/bookings" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('myBookings')}
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="hidden sm:flex items-center space-x-1"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'EN' : 'ع'}
            </span>
          </Button>

          {/* User Menu or Auth Buttons */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/bookings')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{t('myBookings')}</span>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>{t('admin')}</span>
                  </DropdownMenuItem>
                )}
                {user?.role === 'salon_owner' && (
                  <DropdownMenuItem onClick={() => navigate('/salon-dashboard')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('salonDashboard')}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                {t('login')}
              </Button>
              <Button onClick={() => navigate('/register')}>
                {t('register')}
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container py-4 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link 
              to="/try-style" 
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('tryStyle')}
            </Link>
            <Link 
              to="/salons" 
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('findSalon')}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/bookings" 
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('myBookings')}
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="w-full justify-start px-3 py-2"
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;