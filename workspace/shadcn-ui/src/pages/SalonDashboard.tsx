import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Users, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Booking {
  id: number;
  user_name: string;
  barber_name?: string;
  booking_time: string;
  status: string;
}

interface Barber {
  id: number;
  name: string;
  specialty: string;
}

interface DashboardData {
  salon_name: string;
  today_bookings_count: number;
  week_bookings_count: number;
  pending_bookings_count: number;
  today_bookings: Booking[];
  pending_bookings: Booking[];
}

const SalonDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBarber, setNewBarber] = useState({ name: '', specialty: '' });
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  // Mock salon ID - in real app, this would come from authentication
  const salonId = 1;

  useEffect(() => {
    fetchDashboardData();
    fetchBarbers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock API call - replace with actual API endpoint
      const mockData: DashboardData = {
        salon_name: 'صالون الأناقة',
        today_bookings_count: 8,
        week_bookings_count: 45,
        pending_bookings_count: 3,
        today_bookings: [
          { id: 1, user_name: 'أحمد محمد', barber_name: 'محمد علي', booking_time: '2024-01-15T10:00:00', status: 'confirmed' },
          { id: 2, user_name: 'سارة أحمد', barber_name: 'فاطمة حسن', booking_time: '2024-01-15T14:30:00', status: 'pending' }
        ],
        pending_bookings: [
          { id: 3, user_name: 'خالد عبدالله', barber_name: 'محمد علي', booking_time: '2024-01-16T11:00:00', status: 'pending' }
        ]
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      // Mock API call - replace with actual API endpoint
      const mockBarbers: Barber[] = [
        { id: 1, name: 'محمد علي', specialty: 'قصات رجالية' },
        { id: 2, name: 'فاطمة حسن', specialty: 'قصات نسائية' },
        { id: 3, name: 'أحمد سالم', specialty: 'تصفيف الشعر' }
      ];
      setBarbers(mockBarbers);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  };

  const addBarber = async () => {
    if (!newBarber.name.trim()) return;
    
    try {
      // Mock API call - replace with actual API endpoint
      const newId = Math.max(...barbers.map(b => b.id)) + 1;
      const barber: Barber = { id: newId, ...newBarber };
      setBarbers([...barbers, barber]);
      setNewBarber({ name: '', specialty: '' });
    } catch (error) {
      console.error('Error adding barber:', error);
    }
  };

  const updateBarber = async () => {
    if (!editingBarber) return;
    
    try {
      // Mock API call - replace with actual API endpoint
      setBarbers(barbers.map(b => b.id === editingBarber.id ? editingBarber : b));
      setEditingBarber(null);
    } catch (error) {
      console.error('Error updating barber:', error);
    }
  };

  const deleteBarber = async (barberId: number) => {
    try {
      // Mock API call - replace with actual API endpoint
      setBarbers(barbers.filter(b => b.id !== barberId));
    } catch (error) {
      console.error('Error deleting barber:', error);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      console.log(`Updating booking ${bookingId} to status ${status}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  if (!dashboardData) {
    return <div className="flex justify-center items-center h-screen">خطأ في تحميل البيانات</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{dashboardData.salon_name} - لوحة التحكم</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجوزات اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.today_bookings_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجوزات الأسبوع</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.week_bookings_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجوزات معلقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pending_bookings_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الحلاقين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{barbers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>حجوزات اليوم</CardTitle>
          <CardDescription>جميع الحجوزات المقررة لليوم</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم العميل</TableHead>
                <TableHead>الحلاق</TableHead>
                <TableHead>الوقت</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.today_bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user_name}</TableCell>
                  <TableCell>{booking.barber_name || 'غير محدد'}</TableCell>
                  <TableCell>{new Date(booking.booking_time).toLocaleTimeString('ar-SA')}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                          تأكيد
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                          إلغاء
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

      {/* Barbers Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>إدارة الحلاقين</CardTitle>
              <CardDescription>إضافة وتعديل وحذف الحلاقين في الصالون</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة حلاق
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة حلاق جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات الحلاق الجديد</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="barber-name">الاسم</Label>
                    <Input
                      id="barber-name"
                      value={newBarber.name}
                      onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                      placeholder="اسم الحلاق"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barber-specialty">التخصص</Label>
                    <Input
                      id="barber-specialty"
                      value={newBarber.specialty}
                      onChange={(e) => setNewBarber({ ...newBarber, specialty: e.target.value })}
                      placeholder="التخصص"
                    />
                  </div>
                  <Button onClick={addBarber} className="w-full">
                    إضافة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>التخصص</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barbers.map((barber) => (
                <TableRow key={barber.id}>
                  <TableCell>{barber.name}</TableCell>
                  <TableCell>{barber.specialty}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setEditingBarber(barber)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تعديل بيانات الحلاق</DialogTitle>
                          </DialogHeader>
                          {editingBarber && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-barber-name">الاسم</Label>
                                <Input
                                  id="edit-barber-name"
                                  value={editingBarber.name}
                                  onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-barber-specialty">التخصص</Label>
                                <Input
                                  id="edit-barber-specialty"
                                  value={editingBarber.specialty}
                                  onChange={(e) => setEditingBarber({ ...editingBarber, specialty: e.target.value })}
                                />
                              </div>
                              <Button onClick={updateBarber} className="w-full">
                                حفظ التغييرات
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => deleteBarber(barber.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalonDashboard;

