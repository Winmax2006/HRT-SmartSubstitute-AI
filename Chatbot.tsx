import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/Button';

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
                 <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                   msg.role === 'user' 
                     ? 'bg-[#7aa2ff] text-[#0b0e1a]' 
                     : 'bg-[#242c47] text-[#e9edff]'
                 }`}>
                   {msg.text}
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