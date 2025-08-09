import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Building2, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStats {
  total_users: number;
  total_salons: number;
  approved_salons: number;
  pending_salons: number;
  total_bookings: number;
  recent_users_7_days: number;
  recent_bookings_7_days: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  bookings_count: number;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_approved: boolean;
  owner_name: string;
  barbers_count: number;
  bookings_count: number;
}

interface Booking {
  id: number;
  user_name: string;
  salon_name: string;
  barber_name?: string;
  booking_time: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const dailyBookingsData = [
    { date: '2024-01-10', count: 12 },
    { date: '2024-01-11', count: 15 },
    { date: '2024-01-12', count: 8 },
    { date: '2024-01-13', count: 22 },
    { date: '2024-01-14', count: 18 },
    { date: '2024-01-15', count: 25 },
    { date: '2024-01-16', count: 20 }
  ];

  const topSalonsData = [
    { salon_name: 'صالون الأناقة', booking_count: 45 },
    { salon_name: 'بيت الجمال', booking_count: 38 },
    { salon_name: 'استوديو الحلاقة', booking_count: 32 },
    { salon_name: 'صالون النجوم', booking_count: 28 },
    { salon_name: 'مركز التجميل', booking_count: 22 }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock API calls - replace with actual API endpoints
      const mockStats: DashboardStats = {
        total_users: 1250,
        total_salons: 85,
        approved_salons: 78,
        pending_salons: 7,
        total_bookings: 3420,
        recent_users_7_days: 45,
        recent_bookings_7_days: 156
      };

      const mockUsers: User[] = [
        { id: 1, username: 'أحمد محمد', email: 'ahmed@example.com', bookings_count: 5 },
        { id: 2, username: 'سارة أحمد', email: 'sara@example.com', bookings_count: 3 },
        { id: 3, username: 'خالد عبدالله', email: 'khalid@example.com', bookings_count: 8 }
      ];

      const mockSalons: Salon[] = [
        {
          id: 1,
          name: 'صالون الأناقة',
          address: 'شارع الملك فهد، الرياض',
          phone: '+966501234567',
          email: 'elegance@salon.com',
          is_approved: true,
          owner_name: 'محمد علي',
          barbers_count: 4,
          bookings_count: 45
        },
        {
          id: 2,
          name: 'بيت الجمال',
          address: 'طريق الملك عبدالعزيز، جدة',
          phone: '+966507654321',
          email: 'beauty@salon.com',
          is_approved: false,
          owner_name: 'فاطمة حسن',
          barbers_count: 3,
          bookings_count: 0
        }
      ];

      const mockBookings: Booking[] = [
        {
          id: 1,
          user_name: 'أحمد محمد',
          salon_name: 'صالون الأناقة',
          barber_name: 'محمد علي',
          booking_time: '2024-01-15T10:00:00',
          status: 'confirmed'
        },
        {
          id: 2,
          user_name: 'سارة أحمد',
          salon_name: 'بيت الجمال',
          barber_name: 'فاطمة حسن',
          booking_time: '2024-01-15T14:30:00',
          status: 'pending'
        }
      ];

      setStats(mockStats);
      setUsers(mockUsers);
      setSalons(mockSalons);
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveSalon = async (salonId: number) => {
    try {
      // Mock API call - replace with actual API endpoint
      setSalons(salons.map(salon => 
        salon.id === salonId ? { ...salon, is_approved: true } : salon
      ));
    } catch (error) {
      console.error('Error approving salon:', error);
    }
  };

  const rejectSalon = async (salonId: number) => {
    try {
      // Mock API call - replace with actual API endpoint
      setSalons(salons.map(salon => 
        salon.id === salonId ? { ...salon, is_approved: false } : salon
      ));
    } catch (error) {
      console.error('Error rejecting salon:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  if (!stats) {
    return <div className="flex justify-center items-center h-screen">خطأ في تحميل البيانات</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة إدارة StyleMe</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recent_users_7_days} في آخر 7 أيام
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الصالونات</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_salons}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approved_salons} مُعتمد، {stats.pending_salons} في الانتظار
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_bookings}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recent_bookings_7_days} في آخر 7 أيام
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النمو</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">مقارنة بالشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الحجوزات اليومية</CardTitle>
            <CardDescription>عدد الحجوزات في آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أفضل الصالونات</CardTitle>
            <CardDescription>الصالونات الأكثر حجزاً</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSalonsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="salon_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="booking_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="salons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="salons">الصالونات</TabsTrigger>
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
        </TabsList>

        <TabsContent value="salons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الصالونات</CardTitle>
              <CardDescription>مراجعة واعتماد الصالونات الجديدة</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الصالون</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>المالك</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>عدد الحلاقين</TableHead>
                    <TableHead>عدد الحجوزات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salons.map((salon) => (
                    <TableRow key={salon.id}>
                      <TableCell className="font-medium">{salon.name}</TableCell>
                      <TableCell>{salon.address}</TableCell>
                      <TableCell>{salon.owner_name}</TableCell>
                      <TableCell>
                        <Badge variant={salon.is_approved ? 'default' : 'secondary'}>
                          {salon.is_approved ? 'مُعتمد' : 'في الانتظار'}
                        </Badge>
                      </TableCell>
                      <TableCell>{salon.barbers_count}</TableCell>
                      <TableCell>{salon.bookings_count}</TableCell>
                      <TableCell>
                        {!salon.is_approved && (
                          <div className="space-x-2">
                            <Button size="sm" onClick={() => approveSalon(salon.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              اعتماد
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectSalon(salon.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              رفض
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>عرض وإدارة حسابات المستخدمين</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>عدد الحجوزات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.bookings_count}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          عرض التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الحجوزات</CardTitle>
              <CardDescription>مراقبة جميع الحجوزات في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>الصالون</TableHead>
                    <TableHead>الحلاق</TableHead>
                    <TableHead>التاريخ والوقت</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.user_name}</TableCell>
                      <TableCell>{booking.salon_name}</TableCell>
                      <TableCell>{booking.barber_name || 'غير محدد'}</TableCell>
                      <TableCell>
                        {new Date(booking.booking_time).toLocaleString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

