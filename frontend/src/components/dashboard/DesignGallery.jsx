import { Loader } from 'lucide-react';

const DesignGallery = ({ designs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Generating Variations...</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse h-64 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!designs || designs.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 className="text-2xl font-bold">Design Gallery</h3>
        <span className="text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 px-3 py-1 rounded-full">
          {designs.length} Options Generated
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {designs.map((design, idx) => (
          <div key={design.id} className="group cursor-pointer relative overflow-hidden rounded-2xl glass transition-all hover:shadow-xl hover:-translate-y-1">
            <img 
              src={design.url} 
              alt={design.style} 
              loading="lazy"
              className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-white font-bold capitalize mb-1">{design.style}</span>
              <div className="flex flex-wrap gap-1">
                {design.materials?.map(m => (
                  <span key={m} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {Math.round(design.model_confidence * 100)}% Match
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignGallery;
