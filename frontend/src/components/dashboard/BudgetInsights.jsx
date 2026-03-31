import { DollarSign, AlertCircle } from 'lucide-react';

const BudgetInsights = ({ budget, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6 h-48 flex items-center justify-center animate-pulse">
        <span className="text-gray-400">Predicting Financials...</span>
      </div>
    );
  }

  if (!budget) return null;

  const getCategoryColor = (cat) => {
    switch(cat.toLowerCase()) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'premium': return 'text-rose-500 bg-rose-500/10';
      default: return 'text-primary-500 bg-primary-500/10';
    }
  };

  return (
    <div className="glass rounded-xl p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-green-500" />
          Budget Projection
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Base Cost</p>
            <h4 className="text-4xl font-extrabold text-[var(--text-color)]">
              ${budget.estimated_cost_usd.toLocaleString()}
            </h4>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-black/20">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Classification</span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded mt-1 inline-block w-max ${getCategoryColor(budget.budget_category)}`}>
                {budget.budget_category} Tier
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Confidence Interval</span>
              <span className="text-sm font-medium mt-1">
                ${budget.confidence_interval[0].toLocaleString()} - ${budget.confidence_interval[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-blue-500/5 p-2 rounded-md">
        <AlertCircle size={14} className="text-blue-500" />
        <p>Prediction generated using Multi-Linear Regression based on 10k+ design historicals.</p>
      </div>
    </div>
  );
};

export default BudgetInsights;
