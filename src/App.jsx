import React, { useState, useEffect } from 'react';
import Profile from './components/Profile';
import ReportForm from './components/ReportForm';
import HistoryView from './components/History';
import { useProfile } from './hooks/useProfile';
import { useReports } from './hooks/useReports';
import { Settings, FileText, History, AlertCircle } from 'lucide-react';

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function App() {
  const { isProfileComplete, loading: profileLoading } = useProfile();
  const { checkLastMonthReportExists } = useReports();
  const [view, setView] = useState('home'); // 'home', 'profile', 'history'
  
  const [editingReport, setEditingReport] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMonth, setReminderMonth] = useState('');

  useEffect(() => {
    const checkReminder = async () => {
      const today = new Date();
      if (today.getDate() <= 5) {
        const lastMonthIndex = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
        const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
        
        const lastMonthString = `${MESES[lastMonthIndex]}-${lastMonthYear}`;
        
        const exists = await checkLastMonthReportExists(lastMonthString);
        if (!exists) {
          setReminderMonth(MESES[lastMonthIndex]);
          setShowReminder(true);
        } else {
          setShowReminder(false);
        }
      } else {
        setShowReminder(false);
      }
    };
    
    if (isProfileComplete) {
      checkReminder();
    }
  }, [view, isProfileComplete, checkLastMonthReportExists]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Flujo 1: Onboarding si no hay perfil
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Profile onComplete={() => setView('home')} showCancel={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm flex flex-col relative">
        
        {/* Header App */}
        <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-extrabold text-blue-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Mi Informe
          </h1>
          <button 
            onClick={() => setView('profile')}
            className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 bg-gray-50 pb-24">
          {view === 'profile' ? (
            <Profile 
              onComplete={() => setView('home')} 
              onCancel={() => setView('home')}
              showCancel={true}
            />
          ) : view === 'history' ? (
            <div className="animate-in fade-in duration-300">
              <HistoryView onEditReport={(report) => {
                setEditingReport(report);
                setView('home');
              }} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {showReminder && (
                <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start shadow-sm">
                  <AlertCircle className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-800 text-sm">¡Recordatorio importante!</h3>
                    <p className="text-xs text-amber-700 mt-1">
                      No olvides enviar tu informe del mes de <strong>{reminderMonth}</strong>.
                    </p>
                  </div>
                </div>
              )}
              
              <ReportForm 
                editingReport={editingReport} 
                onClearEdit={() => setEditingReport(null)} 
              />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 flex justify-around sticky bottom-0 z-10 pb-safe">
          <button 
            onClick={() => setView('home')}
            className={`flex-1 py-4 flex flex-col items-center ${view === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Informe</span>
          </button>
          <button 
            onClick={() => setView('history')}
            className={`flex-1 py-4 flex flex-col items-center ${view === 'history' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <History className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Historial</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;

