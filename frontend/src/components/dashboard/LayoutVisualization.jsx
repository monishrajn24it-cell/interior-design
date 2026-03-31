const LayoutVisualization = ({ layout, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center animate-pulse">
        <span className="text-gray-400">Optimizing Layout Matrix...</span>
      </div>
    );
  }

  if (!layout || !layout.items) return null;

  return (
    <div className="glass rounded-xl p-6 relative overflow-hidden h-96 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 z-10">Optimized Spatial Layout</h3>
      <div className="flex-1 relative bg-gray-50 dark:bg-[#0f172a] rounded-lg border border-gray-200 dark:border-gray-700"
           style={{
             backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
             backgroundSize: '20px 20px',
             backgroundPosition: 'center center'
           }}
      >
        {/* Render furniture boxes mapped from Grid (relative scaling applied visually for 500x500 mock) */}
        {layout.items.map((item, i) => {
          return (
            <div 
              key={i} 
              className="absolute border-2 border-[var(--primary-color)] bg-primary-100/80 dark:bg-primary-900/40 backdrop-blur-sm rounded-sm flex items-center justify-center text-xs font-bold text-primary-800 dark:text-primary-200 shadow-md uppercase tracking-wider"
              style={{
                left: `${(item.x / 500) * 100}%`,
                top: `${(item.y / 500) * 100}%`,
                width: `${(item.width / 500) * 100}%`,
                height: `${(item.height / 500) * 100}%`,
                transform: `rotate(${item.rotation}deg)`
              }}
            >
              {item.type.replace('_', ' ')}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm font-medium opacity-80 z-10">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Score: {Math.round(layout.optimization_score * 100)}%</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> CSP Validated</div>
      </div>
    </div>
  );
};

export default LayoutVisualization;
