
import React, { useState } from 'react';
import { AppView } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CustomTestView from './components/CustomTest';
import FormulaCardsView from './components/FormulaCards';
import AITimeTableView from './components/AITimeTable';
import PYQBrowserView from './components/PYQBrowser';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedPYQConfig, setSelectedPYQConfig] = useState<{exam: string, year: string} | null>(null);

  const handleStartPYQ = (exam: string, year: string) => {
    setSelectedPYQConfig({ exam, year });
    setCurrentView(AppView.PYQ_BROWSER);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} onStartPYQ={handleStartPYQ} />;
      case AppView.CUSTOM_TEST:
        return <CustomTestView onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.FORMULA_CARDS:
        return <FormulaCardsView onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.AI_TIME_TABLE:
        return <AITimeTableView onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.PYQ_BROWSER:
        return (
          <PYQBrowserView 
            initialExam={selectedPYQConfig?.exam || 'JEE Main'} 
            initialYear={selectedPYQConfig?.year || '2024'}
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
          />
        );
      default:
        return <Dashboard onViewChange={setCurrentView} onStartPYQ={handleStartPYQ} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AcePrep <span className="text-indigo-600">AI</span></h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.DASHBOARD ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView(AppView.CUSTOM_TEST)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.CUSTOM_TEST ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Custom Test
            </button>
            <button 
              onClick={() => setCurrentView(AppView.FORMULA_CARDS)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.FORMULA_CARDS ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Formula Cards
            </button>
            <button 
              onClick={() => setCurrentView(AppView.AI_TIME_TABLE)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.AI_TIME_TABLE ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              AI Time Table
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Free Pro</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {renderView()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 AcePrep AI. Empowering JEE/NEET Success.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
