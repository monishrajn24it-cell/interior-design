import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../services/api';

const ImageUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return alert('Please upload an image file.');
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onUploadSuccess(res.session_id, file);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`w-full max-w-xl p-8 border-2 border-dashed rounded-3xl transition-all duration-300 transform flex flex-col items-center justify-center min-h-[300px] cursor-pointer
        ${isDragging ? 'border-primary-500 bg-primary-500/10 scale-105' : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 glass'}
      `}
      onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" ref={fileInputRef} className="hidden" accept="image/*"
        onChange={(e) => e.target.files && processFile(e.target.files[0])}
      />
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-lg font-medium animate-pulse">Uploading and Parsing Image...</p>
        </div>
      ) : (
        <>
          <div className="bg-primary-50 dark:bg-gray-800 p-4 rounded-full mb-4 group-hover:bg-primary-100 transition">
            <UploadCloud size={48} className="text-primary-500" />
          </div>
          <p className="text-xl font-semibold mb-2 text-center text-[var(--text-color)]">
            Drag & Drop Room Image
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Supports JPG, PNG (Max 5MB)
          </p>
          <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-full shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2">
            <ImageIcon size={18} /> Browse Files
          </button>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
