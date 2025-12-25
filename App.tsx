
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Chatbot } from './components/Chatbot';
import { Dashboard, Schedule, Substitute, Rules, Approvals, Workload, ImageEditor, Settings } from './screens';

export type View = 'dashboard' | 'schedule' | 'substitute' | 'rules' | 'approvals' | 'workload' | 'image-editor' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark class to root div for Tailwind darkMode: 'class'
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'schedule': return <Schedule />;
      case 'substitute': return <Substitute />;
      case 'rules': return <Rules />;
      case 'approvals': return <Approvals />;
      case 'workload': return <Workload />;
      case 'image-editor': return <ImageEditor />;
      case 'settings': return <Settings />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0e1a] text-slate-900 dark:text-slate-200 selection:bg-indigo-500/30 transition-colors duration-300">
      <Layout 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      >
        {renderView()}
      </Layout>
      <Chatbot />
    </div>
  );
}
