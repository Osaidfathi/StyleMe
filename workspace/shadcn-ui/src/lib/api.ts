const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API configuration
export const api = {
  baseURL: API_BASE_URL,
  
  // Helper function to make API calls
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // AI endpoints
  ai: {
    analyzeface: (imageData: string) => 
      api.request('/api/ai/analyze_face', {
        method: 'POST',
        body: JSON.stringify({ image: imageData }),
      }),
    
    generateHairstyle: (imageData: string, styleType: string = 'modern', gender: string = 'unisex', faceShape: string = 'oval') =>
      api.request('/api/ai/generate_hairstyle', {
        method: 'POST',
        body: JSON.stringify({ 
          image: imageData, 
          style_type: styleType,
          gender,
          face_shape: faceShape
        }),
      }),
    
    modifyHairstyle: (imageData: string, styleType: string = 'modern', modificationType: string = 'enhance') =>
      api.request('/api/ai/modify_hairstyle', {
        method: 'POST',
        body: JSON.stringify({ 
          image: imageData, 
          style_type: styleType,
          modification_type: modificationType
        }),
      }),
    
    getSuggestions: (gender: string = 'unisex', faceShape: string = 'oval') =>
      api.request('/api/ai/get_suggestions', {
        method: 'POST',
        body: JSON.stringify({ gender, face_shape }),
      }),
    
    health: () => api.request('/api/ai/health'),
  },

  // Salon endpoints
  salons: {
    getAll: () => api.request('/api/salons/all'),
    
    getNearby: (latitude: number, longitude: number, radius: number = 50) =>
      api.request('/api/salons/nearby', {
        method: 'POST',
        body: JSON.stringify({ latitude, longitude, radius }),
      }),
    
    getByCity: (city?: string, country?: string) => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (country) params.append('country', country);
      return api.request(`/api/salons/by_city?${params.toString()}`);
    },
    
    getDetails: (salonId: number) => api.request(`/api/salons/${salonId}`),
  },

  // Booking endpoints
  booking: {
    create: (bookingData: any) =>
      api.request('/api/booking/create', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    
    getMyBookings: (userId: number) => api.request(`/api/booking/user/${userId}`),
    
    cancel: (bookingId: number) =>
      api.request(`/api/booking/${bookingId}/cancel`, {
        method: 'PUT',
      }),
  },

  // User endpoints
  users: {
    register: (userData: any) =>
      api.request('/api/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    login: (credentials: any) =>
      api.request('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
  },
};

// Location services
export const locationService = {
  // Get user's current location
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  // Get city name from coordinates (using a reverse geocoding service)
  async getCityFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      // Using a free geocoding service (you might want to use a more reliable one in production)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      return data.city || data.locality || 'Unknown';
    } catch (error) {
      console.error('Error getting city from coordinates:', error);
      return 'Unknown';
    }
  },
};

export default api;

