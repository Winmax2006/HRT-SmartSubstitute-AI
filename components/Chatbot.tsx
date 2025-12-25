
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/Button';
import ReactMarkdown from 'react-markdown';

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

    const history = messages.map(m => m.text);
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

  const aiMarkdownStyles = `${markdownBaseStyles} [&_code]:bg-black/10 dark:[&_code]:bg-black/30 [&_pre]:bg-black/10 dark:[&_pre]:bg-black/30`;
  const userMarkdownStyles = `${markdownBaseStyles} [&_code]:bg-white/20 [&_pre]:bg-white/20`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-slideIn">
          <div className="p-4 bg-slate-100 dark:bg-slate-950 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
               <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
               <span className="font-semibold text-slate-800 dark:text-white">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
               <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] rounded-lg p-3 text-sm overflow-hidden ${
                   msg.role === 'user' 
                     ? `bg-indigo-600 dark:bg-indigo-500 text-white ${userMarkdownStyles}`
                     : `bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm ${aiMarkdownStyles}`
                 }`}>
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex gap-1 shadow-sm">
                     <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-800 dark:text-slate-200"
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
        className="w-14 h-14 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};
