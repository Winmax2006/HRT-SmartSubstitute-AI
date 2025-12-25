
import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Calendar, UserMinus, Settings as SettingsIcon, FileCheck, BarChart3, Image, MessageSquare, Database, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { View } from './data';
import { chatWithAI } from './data';

// ==========================================
// UI COMPONENTS
// ==========================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#7aa2ff] text-[#0b0e1a] hover:bg-[#4c74cc]",
    secondary: "bg-transparent border border-[#7aa2ff] text-[#7aa2ff] hover:bg-[#7aa2ff]/10",
    success: "bg-emerald-400 text-black hover:bg-emerald-500",
    warning: "bg-amber-400 text-black hover:bg-amber-500",
    danger: "bg-red-400 text-black hover:bg-red-500",
    ghost: "bg-transparent text-[#a7b0c9] hover:text-white hover:bg-[#242c47]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  icon, 
  action,
  active = false,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-[#171a2e] rounded-xl p-6 transition-all duration-300
        ${active 
          ? 'border border-[#7aa2ff] shadow-[0_0_15px_rgba(122,162,255,0.15)] -translate-y-1' 
          : 'border border-[#242c47] shadow-lg hover:shadow-xl hover:-translate-y-1'
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || icon || action) && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {icon && <div className="text-[#7aa2ff] text-xl">{icon}</div>}
            {title && <h3 className={`text-xl font-semibold ${active ? 'text-white' : 'text-[#e9edff]'}`}>{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

// ==========================================
// CHATBOT
// ==========================================

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'สวัสดีครับ ผมคือผู้ช่วย AI สำหรับการจัดตารางสอน มีอะไรให้ช่วยไหมครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Convert to ChatHistoryItem[] expected by data.ts
    // The previous messages (excluding the new one) are history
    const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' as const : 'user' as const,
        text: m.text
    }));

    const response = await chatWithAI(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  // Styles for markdown content using Tailwind arbitrary variants
  const markdownBaseStyles = `
    [&_p]:mb-2 [&_p:last-child]:mb-0 
    [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 
    [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 
    [&_li]:mb-0.5 
    [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-medium
    [&_strong]:font-bold 
    [&_pre]:my-2 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto 
    [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs 
    [&_pre_code]:bg-transparent [&_pre_code]:p-0
  `;

  const aiMarkdownStyles = `${markdownBaseStyles} [&_code]:bg-black/30 [&_pre]:bg-black/30`;
  const userMarkdownStyles = `${markdownBaseStyles} [&_code]:bg-white/20 [&_pre]:bg-white/20`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-[#171a2e] border border-[#242c47] rounded-xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-slideIn">
          <div className="p-4 bg-[#242c47] flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Bot size={20} className="text-[#7aa2ff]" />
               <span className="font-semibold text-white">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#a7b0c9] hover:text-white">
               <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0e1a]">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] rounded-lg p-3 text-sm overflow-hidden ${
                   msg.role === 'user' 
                     ? `bg-[#7aa2ff] text-[#0b0e1a] ${userMarkdownStyles}`
                     : `bg-[#242c47] text-[#e9edff] ${aiMarkdownStyles}`
                 }`}>
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-[#242c47] rounded-lg p-3 flex gap-1">
                     <span className="w-2 h-2 bg-[#7aa2ff] rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-[#7aa2ff] rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-[#7aa2ff] rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-[#171a2e] border-t border-[#242c47]">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff]"
                  placeholder="พิมพ์ข้อความ..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="sm" onClick={handleSend} disabled={isLoading || !input.trim()}>
                   <Send size={16} />
                </Button>
             </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#7aa2ff] hover:bg-[#4c74cc] text-[#0b0e1a] shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

// ==========================================
// LAYOUT
// ==========================================

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
    { id: 'rules', label: 'เงื่อนไข', icon: <SettingsIcon size={20} /> },
    { id: 'approvals', label: 'อนุมัติ', icon: <FileCheck size={20} /> },
    { id: 'workload', label: 'ภาระงาน', icon: <BarChart3 size={20} /> },
    { id: 'image-editor', label: 'แต่งรูปด้วย AI', icon: <Image size={20} /> },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: <Database size={20} /> },
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
