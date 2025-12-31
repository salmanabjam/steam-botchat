import { ChartDataPoint, LogEntry, SystemMetrics, User } from '../types';
import moment from 'jalali-moment';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (username: string, password: string): Promise<User> => {
  await delay(1000); // Simulate network latency
  if (username === 'admin' && password === 'admin') {
    return {
      id: '1',
      username: 'admin',
      fullName: 'مدیر سیستم',
      role: 'admin',
      avatarUrl: 'https://picsum.photos/200/200'
    };
  }
  throw new Error('نام کاربری یا رمز عبور اشتباه است.');
};

export const fetchSystemMetrics = async (): Promise<SystemMetrics> => {
  // Simulating fetching real-time data from Python backend
  // await delay(200); 
  return {
    cpuUsage: Math.floor(Math.random() * 30) + 20, // Random 20-50%
    memoryUsage: Math.floor(Math.random() * 20) + 40, // Random 40-60%
    activeSessions: Math.floor(Math.random() * 10) + 5,
    requestsPerMinute: Math.floor(Math.random() * 100) + 300,
    lastUpdated: new Date()
  };
};

export const fetchChartData = async (): Promise<ChartDataPoint[]> => {
  // Generate 7 data points representing last 7 time intervals
  const data: ChartDataPoint[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60000); // Past minutes
    data.push({
      time: moment(d).locale('fa').format('HH:mm'),
      value: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 80),
    });
  }
  return data;
};

export const fetchRecentLogs = async (): Promise<LogEntry[]> => {
  return [
    { id: 1, message: 'پشتیبان‌گیری خودکار باموفقیت انجام شد.', level: 'success', timestamp: new Date() },
    { id: 2, message: 'تلاش ناموفق برای ورود با IP ناشناس.', level: 'warning', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 3, message: 'سرویس پردازش تصویر راه‌اندازی شد.', level: 'info', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 4, message: 'خطا در اتصال به درگاه پرداخت.', level: 'error', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
  ];
};