import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ComparisonViewProps {
  originalImage: string;
  processedImage: string;
  originalMimeType: string;
  onReset: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalImage,
  processedImage,
  originalMimeType,
  onReset
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'processed'>('split');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${processedImage}`;
    link.download = `removed-bg-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const imgSrc = `data:${originalMimeType};base64,${originalImage}`;
  const processedSrc = `data:image/png;base64,${processedImage}`;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('split')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'split' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('processed')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'processed' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Result Only
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onReset} className="!py-1.5 text-sm">
            <RefreshCw size={16} /> New Image
          </Button>
          <Button onClick={handleDownload} className="!py-1.5 text-sm">
            <Download size={16} /> Download
          </Button>
        </div>
      </div>

      <div className="w-full h-[500px] md:h-[600px] bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 relative flex justify-center items-center checkerboard">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-2 h-full w-full">
             <div className="h-full w-full relative border-r border-slate-700">
                <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">Original</span>
                <img src={imgSrc} alt="Original" className="w-full h-full object-contain p-4" />
             </div>
             <div className="h-full w-full relative">
                <span className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-lg">AI Result</span>
                <img src={processedSrc} alt="Processed" className="w-full h-full object-contain p-4" />
             </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
             <span className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-lg">AI Result</span>
             <img src={processedSrc} alt="Processed" className="w-full h-full object-contain p-2" />
          </div>
        )}
      </div>
      
      <div className="text-center text-slate-400 text-sm">
        Use right-click or the download button to save.
      </div>
    </div>
  );
};