import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ControlPanel from './components/ControlPanel';
import ResultsDashboard from './components/dashboard/ResultsDashboard';
import { analyzeRoom, generateDesigns, optimizeLayout, predictBudget } from './services/api';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState({
    sessionId: null,
    imagePreview: null,
    analysis: null,
    designs: null,
    layout: null,
    budget: null,
  });

  const [loadingState, setLoadingState] = useState({
    analyzing: false,
    generating: false,
    optimizing: false,
    predicting: false,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleUploadSuccess = (sessionId, file) => {
    setSessionData(prev => ({ 
      ...prev, 
      sessionId,
      imagePreview: URL.createObjectURL(file) 
    }));
  };

  const handleGenerate = async (config) => {
    const { sessionId } = sessionData;
    if (!sessionId) return;
    
    try {
      // 1. Analyze Room
      setLoadingState(p => ({ ...p, analyzing: true }));
      const analysis = await analyzeRoom(sessionId);
      setSessionData(p => ({ ...p, analysis }));
      setLoadingState(p => ({ ...p, analyzing: false }));

      // Parallelize remaining tasks once analysis is done
      setLoadingState(p => ({ ...p, generating: true, optimizing: true, predicting: true }));
      
      const [designs, layout, budget] = await Promise.all([
        generateDesigns(sessionId, config.style, config.intensity),
        optimizeLayout(sessionId),
        predictBudget(sessionId, config.style)
      ]);

      setSessionData(p => ({ ...p, designs: designs.designs, layout, budget }));
      setLoadingState(p => ({ ...p, generating: false, optimizing: false, predicting: false }));

    } catch (err) {
      console.error(err);
      setLoadingState({ analyzing: false, generating: false, optimizing: false, predicting: false });
      alert("An error occurred during processing.");
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300 font-sans ${darkMode ? 'dark' : ''}`}>
      <nav className="fixed w-full z-50 glass px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
          AInterior.io
        </h1>
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
        {!sessionData.sessionId ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Redesign Your Space <br/><span className="text-primary-500">in Seconds with AI</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Upload a photo of your room to generate over 50 stunning interior design variants, optimized layouts, and budget estimates.
              </p>
            </div>
            <ImageUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <div className="glass rounded-2xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Original Room</h3>
                <img 
                  src={sessionData.imagePreview} 
                  alt="Original" 
                  className="w-full h-48 object-cover rounded-xl border border-[var(--border-color)]"
                />
              </div>
              <ControlPanel 
                onGenerate={handleGenerate} 
                isProcessing={Object.values(loadingState).some(v => v)} 
              />
            </aside>
            <section className="lg:col-span-3">
              <ResultsDashboard sessionData={sessionData} loadingState={loadingState} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
