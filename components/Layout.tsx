
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
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'substitute', label: 'Substitution', icon: <UserMinus size={20} /> },
    { id: 'rules', label: 'Rules', icon: <SettingsIcon size={20} /> },
    { id: 'approvals', label: 'Approvals', icon: <FileCheck size={20} /> },
    { id: 'workload', label: 'Workload', icon: <BarChart3 size={20} /> },
    { id: 'image-editor', label: 'AI Editor', icon: <Image size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Database size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex-shrink-0 fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              SmartSub
            </h1>
          </div>
        </div>
        
        <div className="px-6 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Menu</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-blue-50 text-blue-600 px-6' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-100 space-y-6">
           <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-800">
               AD
             </div>
             <div className="overflow-hidden">
               <div className="text-[13px] font-black text-slate-800 truncate">Admin User</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Academic Dept</div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <div className="max-w-7xl mx-auto min-h-full">
           {children}
        </div>
      </main>
      
      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-around z-30">
         {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`p-3 rounded-2xl transition-all ${currentView === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
            >
              {item.icon}
            </button>
         ))}
      </div>
    </div>
  );
};
