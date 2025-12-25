
import React from 'react';
import { LayoutDashboard, Calendar, UserMinus, Settings as SettingsIcon, FileCheck, BarChart3, Image, MessageSquare, Database, Moon, Sun } from 'lucide-react';
import { View } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, isDarkMode, onToggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: <LayoutDashboard size={20} /> },
    { id: 'schedule', label: 'ตารางสอน', icon: <Calendar size={20} /> },
    { id: 'substitute', label: 'จัดสอนแทน', icon: <UserMinus size={20} /> },
    { id: 'rules', label: 'เงื่อนไข', icon: <SettingsIcon size={20} /> },
    { id: 'approvals', label: 'อนุมัติ', icon: <FileCheck size={20} /> },
    { id: 'workload', label: 'ภาระงาน', icon: <BarChart3 size={20} /> },
    { id: 'image-editor', label: 'แต่งรูปด้วย AI', icon: <Image size={20} /> },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: <Database size={20} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0b0e1a] border-r border-slate-200 dark:border-slate-800 flex-shrink-0 fixed h-full z-20 hidden md:flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            SmartSub AI
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">ระบบจัดสอนแทนอัจฉริยะ</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm border-l-4 border-indigo-600 dark:border-indigo-400' 
                  : 'text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
           {/* Dark Mode Toggle */}
           <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-[#9CA3AF]">Dark Mode</span>
              <button 
                onClick={onToggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                <span className="absolute flex items-center justify-center w-full h-full pointer-events-none">
                   {isDarkMode ? <Moon size={10} className="text-indigo-600 absolute left-1.5" /> : <Sun size={10} className="text-slate-500 absolute right-1.5" />}
                </span>
              </button>
           </div>

           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
               AD
             </div>
             <div>
               <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Admin User</div>
               <div className="text-xs text-[#9CA3AF]">Academic Affairs</div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </main>
      
      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0b0e1a] border-t border-slate-200 dark:border-slate-800 p-2 flex justify-around z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`p-2 rounded-lg ${currentView === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-[#9CA3AF]'}`}
            >
              {item.icon}
            </button>
         ))}
         <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-[#9CA3AF]"
         >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
         </button>
      </div>
    </div>
  );
};
