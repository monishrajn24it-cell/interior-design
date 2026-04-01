import { useState } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

const ControlPanel = ({ onGenerate, isProcessing }) => {
  const [style, setStyle] = useState('modern');
  const [intensity, setIntensity] = useState(50);
  const [prompt, setPrompt] = useState('');

  const styles = [
    { id: 'modern', label: 'Modern' },
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'scandinavian', label: 'Scandinavian' },
    { id: 'industrial', label: 'Industrial' },
  ];

  return (
    <div className="glass rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
        <SlidersHorizontal size={20} className="text-primary-500" />
        <h3 className="text-lg font-semibold">Design Settings</h3>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Design Style</label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map(s => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`text-sm py-2 px-3 rounded-lg border transition-all ${
                style === s.id 
                  ? 'bg-primary-500 text-white border-primary-500 font-medium' 
                  : 'bg-transparent border-gray-200 dark:border-gray-700 hover:border-primary-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Style Prompt (Optional)</label>
        <textarea
          placeholder="e.g., Modern minimalist living room with warm lighting and wooden accents"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[var(--input-bg)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Creativity</label>
          <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{intensity}%</span>
        </div>
        <input 
          type="range" min="0" max="100" 
          value={intensity} onChange={(e) => setIntensity(e.target.value)}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtle</span>
          <span>Wild</span>
        </div>
      </div>

      <button
        onClick={() => onGenerate({ style, intensity, prompt })}
        disabled={isProcessing}
        className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-shadow flex items-center justify-center gap-2 transform transition-all 
          ${isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-primary-600 to-accent-500 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5'
          }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Generating Magic...
          </>
        ) : (
          <>
            <Sparkles size={20} /> Generate Designs
          </>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
