
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { View } from './data';
import { Layout, Chatbot } from './components';
import { Dashboard, Schedule, Substitute, Rules, Approvals, Workload, ImageEditor, Settings } from './screens';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

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
    <div className="min-h-screen bg-[#0b0e1a] text-slate-200 selection:bg-indigo-500/30">
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderView()}
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
