import React, { useState } from 'react';
import Profile from './components/Profile';
import { useProfile } from './hooks/useProfile';
import { Settings, FileText, History } from 'lucide-react';

function App() {
  const { isProfileComplete, loading } = useProfile();
  const [view, setView] = useState('home'); // 'home', 'profile', 'history'

  if (loading) {
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
        <main className="flex-1 p-4 bg-gray-50">
          {view === 'profile' ? (
            <Profile 
              onComplete={() => setView('home')} 
              onCancel={() => setView('home')}
              showCancel={true}
            />
          ) : view === 'history' ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-700">Historial</h2>
              <p className="text-gray-500 mt-2">Aquí se mostrarán los informes enviados.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Enviar Informe</h2>
              <p className="text-gray-500 mt-2 mb-8">El formulario se construirá en el siguiente paso.</p>
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
