import React from 'react';
import { LayoutDashboard, Calendar, UserMinus, Settings, FileCheck, BarChart3, Image, MessageSquare } from 'lucide-react';
import { View } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: <LayoutDashboard size={20} /> },
    { id: 'schedule', label: 'ตารางสอน', icon: <Calendar size={20} /> },
    { id: 'substitute', label: 'จัดสอนแทน', icon: <UserMinus size={20} /> },
    { id: 'rules', label: 'เงื่อนไข', icon: <Settings size={20} /> },
    { id: 'approvals', label: 'อนุมัติ', icon: <FileCheck size={20} /> },
    { id: 'workload', label: 'ภาระงาน', icon: <BarChart3 size={20} /> },
    { id: 'image-editor', label: 'แต่งรูปด้วย AI', icon: <Image size={20} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#171a2e] border-r border-[#242c47] flex-shrink-0 fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-6 border-b border-[#242c47]">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7aa2ff] to-[#a78bfa] bg-clip-text text-transparent">
            SmartSub AI
          </h1>
          <p className="text-xs text-[#a7b0c9] mt-1">ระบบจัดสอนแทนอัจฉริยะ</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id 
                  ? 'bg-[#7aa2ff]/10 text-[#7aa2ff] border border-[#7aa2ff]/20' 
                  : 'text-[#a7b0c9] hover:bg-[#242c47] hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[#242c47]">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
               AD
             </div>
             <div>
               <div className="text-sm font-medium">Admin User</div>
               <div className="text-xs text-[#a7b0c9]">Academic Affairs</div>
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#171a2e] border-t border-[#242c47] p-2 flex justify-around z-30">
         {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`p-2 rounded-lg ${currentView === item.id ? 'text-[#7aa2ff]' : 'text-[#a7b0c9]'}`}
            >
              {item.icon}
            </button>
         ))}
      </div>
    </div>
  );
};