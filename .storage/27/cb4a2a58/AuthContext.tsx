import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'أحمد محمد',
    gender: 'male',
    preferredLanguage: 'ar',
    role: 'customer',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'salon@example.com',
    name: 'صالون الأناقة',
    gender: 'male',
    preferredLanguage: 'ar',
    role: 'salon_owner',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'admin@styleme.com',
    name: 'StyleMe Admin',
    gender: 'male',
    preferredLanguage: 'en',
    role: 'admin',
    createdAt: new Date(),
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const savedUser = localStorage.getItem('styleme-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in real app, this would be an API call
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('styleme-user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Mock registration
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        gender: userData.gender || 'male',
        preferredLanguage: userData.preferredLanguage || 'ar',
        role: 'customer',
        createdAt: new Date(),
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('styleme-user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('styleme-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};