import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';
import { Activity, Server, Users, Wifi } from 'lucide-react';
import StatCard from './StatCard';
import { fetchChartData, fetchRecentLogs, fetchSystemMetrics } from '../services/api';
import { ChartDataPoint, LogEntry, SystemMetrics } from '../types';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const m = await fetchSystemMetrics();
      const c = await fetchChartData();
      const l = await fetchRecentLogs();
      setMetrics(m);
      setChartData(c);
      setLogs(l);
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Refresh data every 5 seconds (simulating mock backend updates)

    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div className="p-10 text-center text-slate-500">در حال دریافت اطلاعات...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="مصرف پردازنده" 
          value={`${metrics.cpuUsage}%`} 
          icon={<Activity className="w-6 h-6" />} 
          color="red"
          trend="up"
          trendValue="2%"
        />
        <StatCard 
          title="مصرف حافظه" 
          value={`${metrics.memoryUsage}%`} 
          icon={<Server className="w-6 h-6" />} 
          color="blue"
          trend="neutral"
          trendValue="0%"
        />
        <StatCard 
          title="کاربران آنلاین" 
          value={metrics.activeSessions} 
          icon={<Users className="w-6 h-6" />} 
          color="purple"
          trend="up"
          trendValue="5 کاربر"
        />
        <StatCard 
          title="درخواست‌ها" 
          value={metrics.requestsPerMinute} 
          icon={<Wifi className="w-6 h-6" />} 
          color="green"
          trend="down"
          trendValue="12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">ترافیک شبکه (زنده)</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">بروزرسانی خودکار</span>
          </div>
          <div className="h-[300px] w-full dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ fontFamily: 'Vazirmatn', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ textAlign: 'right', color: '#64748b' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" name="ورودی" />
                <Area type="monotone" dataKey="value2" stroke="#6366f1" strokeWidth={3} fillOpacity={0} name="خروجی" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Logs / Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-6">گزارشات سیستم</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  log.level === 'success' ? 'bg-emerald-500' :
                  log.level === 'error' ? 'bg-red-500' :
                  log.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm text-slate-700 font-medium">{log.message}</p>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(log.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
       {/* Secondary Stats/Bars */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">آمار منابع سرور (هفتگی)</h3>
          <div className="h-[250px] w-full dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ fontFamily: 'Vazirmatn', textAlign: 'right' }} />
                <Legend wrapperStyle={{ fontFamily: 'Vazirmatn' }} />
                <Bar dataKey="value" name="پردازنده" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value2" name="حافظه" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
};

export default Dashboard;