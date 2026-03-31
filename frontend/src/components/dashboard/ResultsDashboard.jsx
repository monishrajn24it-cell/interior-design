import DesignGallery from './DesignGallery';
import LayoutVisualization from './LayoutVisualization';
import BudgetInsights from './BudgetInsights';
import { Layers, Box } from 'lucide-react';

const ResultsDashboard = ({ sessionData, loadingState }) => {
  const isAnythingLoading = Object.values(loadingState).some(v => v);
  const hasResults = sessionData.designs || sessionData.layout || sessionData.budget || sessionData.analysis;

  if (!hasResults && !isAnythingLoading) {
    return (
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Layers size={32} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Ready for Transformation</h3>
        <p className="text-gray-500 max-w-md">
          Adjust your settings in the control panel and click generate to let our AI engine create your personalized interior design concepts.
        </p>
      </div>
    );
  }

  // Display the structural breakdown when CNN analysis completes
  const renderAnalysis = () => {
    if (loadingState.analyzing) return <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-800 rounded mx-auto w-1/2 mb-6"></div>;
    if (!sessionData.analysis) return null;
    return (
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full font-medium">
          <Box size={16} /> 
          Detected: {sessionData.analysis.objects_detected?.map(d => d.label).join(', ')}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Estimated Area: <span className="font-bold text-[var(--text-color)]">{sessionData.analysis.room_features?.area_estimate_sqft} sqft</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderAnalysis()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LayoutVisualization layout={sessionData.layout} isLoading={loadingState.optimizing} />
        <BudgetInsights budget={sessionData.budget} isLoading={loadingState.predicting} />
      </div>

      <div className="pt-6 border-t border-[var(--border-color)]">
        <DesignGallery designs={sessionData.designs} isLoading={loadingState.generating} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
