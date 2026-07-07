
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { View } from './data';
import { Layout, Chatbot } from './components';
import { Dashboard, Schedule, Substitute, Rules, Approvals, Workload, ImageEditor, Settings } from './screens';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard key="dashboard" onViewChange={setCurrentView} />;
      case 'schedule': return <Schedule key="schedule" />;
      case 'substitute': return <Substitute key="substitute" />;
      case 'rules': return <Rules key="rules" />;
      case 'approvals': return <Approvals key="approvals" />;
      case 'workload': return <Workload key="workload" />;
      case 'image-editor': return <ImageEditor key="image-editor" />;
      case 'settings': return <Settings key="settings" />;
      default: return <Dashboard key="dashboard" onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-blue-500/30">
      <Layout currentView={currentView} onViewChange={setCurrentView} isDarkMode={false} onToggleTheme={() => {}}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </Layout>
      <Chatbot />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
