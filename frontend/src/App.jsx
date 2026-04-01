import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ControlPanel from './components/ControlPanel';
import ResultsDashboard from './components/dashboard/ResultsDashboard';
import { analyzeRoom, generateDesigns, optimizeLayout, predictBudget } from './services/api';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import logoSrc from './assets/logo.png';

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
        generateDesigns(sessionId, config.style, config.intensity, config.prompt),
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
    <div className={`min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300 font-sans hero-gradient relative overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] halo bg-primary-500 animate-float" />
      <div className="absolute bottom-[-10%] left-[-5%] halo bg-accent-500 animate-float" style={{ animationDelay: '-3s' }} />
      
      <nav className="fixed w-full z-50 glass px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={logoSrc}
            alt="DecoraVision Logo"
            className="h-10 w-10 object-contain rounded-lg"
            style={{ mixBlendMode: 'lighten' }}
          />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            DecoraVision AI
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
        {!sessionData.sessionId ? (
          <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-10 relative">
            <div className="text-center max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-4 mb-8"
              >
                <h2 className="flex flex-col items-center">
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-6xl md:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500"
                  >
                    Smart Design
                  </motion.span>
                  
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-2xl md:text-3xl font-medium text-gray-400 italic font-serif my-2"
                  >
                    for
                  </motion.span>
                  
                  <motion.span 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-6xl md:text-8xl font-black tracking-tight"
                  >
                    Smart Living
                  </motion.span>
                </h2>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="text-gray-500 dark:text-gray-400 text-xl max-w-xl mx-auto leading-relaxed"
              >
                Transform your space with AI-driven aesthetics. 
                Upload a photo to begin your interior design journey.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="w-full max-w-xl"
            >
              <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10">
                <ImageUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            </motion.div>
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
