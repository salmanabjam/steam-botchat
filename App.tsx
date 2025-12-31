import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Database,
  Shield,
  Bell
} from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import Clock from './components/Clock';
import { User, ConnectionStatus } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setSidebarOpen(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const NavItem = ({ icon, label, id }: { icon: React.ReactNode, label: string, id: 'dashboard' | 'settings' }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        if (window.innerWidth < 1024) setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        activeTab === id 
          ? 'bg-primary-50 text-primary-600 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 right-0 z-30 w-72 bg-white border-l border-slate-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-lg text-slate-800 tracking-tight">پنل مدیریت</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile Snippet */}
          <div className="p-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <img 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=0ea5e9&color=fff`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-700 truncate">{user.fullName}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <NavItem id="dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="داشبورد وضعیت" />
            <NavItem id="settings" icon={<Settings className="w-5 h-5" />} label="تنظیمات سیستم" />
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-100">
             <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-2">
                <span>وضعیت شبکه:</span>
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {ConnectionStatus.CONNECTED}
                </span>
             </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Clock />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm">
               <Shield className="w-4 h-4 text-emerald-500" />
               <span>اتصال ایمن (SSL)</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                 <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-10 h-10 text-slate-400" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">تنظیمات سیستم</h2>
                 <p className="text-slate-500 mt-2">این بخش برای پیکربندی پارامترهای پایگاه داده و سرور Python در نظر گرفته شده است.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;