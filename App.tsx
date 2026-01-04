import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { Button } from './components/Button';
import { processImage } from './services/geminiService';
import { BackgroundOption, ProcessingConfig } from './types';
import { Layers, Wand2, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMime, setOriginalMime] = useState<string>('image/png');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<BackgroundOption>(BackgroundOption.WHITE);

  const handleImageSelect = (base64: string, mimeType: string) => {
    setOriginalImage(base64);
    setOriginalMime(mimeType);
    setProcessedImage(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    const config: ProcessingConfig = {
      option: selectedOption
    };

    try {
      const resultBase64 = await processImage(originalImage, originalMime, config);
      setProcessedImage(resultBase64);
    } catch (err: any) {
      setError("Failed to process image. Please try again or choose a different image.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
               <Layers size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Fast Background AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-slate-400 text-sm font-medium px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                <Zap size={14} className="text-yellow-400" />
                Gemini Flash
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Intro / Hero */}
        {!originalImage && (
          <div className="text-center max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Remove Backgrounds <span className="text-blue-400">Instantly</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Upload your image and let our AI isolate your subject. 
              Powered by Gemini Flash for quick results.
            </p>
          </div>
        )}

        {/* Workspace */}
        <div className="w-full">
          {!originalImage ? (
            <div className="max-w-2xl mx-auto transition-opacity duration-300 opacity-100">
              <ImageUploader onImageSelected={handleImageSelect} />
            </div>
          ) : !processedImage ? (
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              
              {/* Left Column: Image Preview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 h-[400px] flex items-center justify-center relative overflow-hidden checkerboard">
                  <img 
                    src={`data:${originalMime};base64,${originalImage}`} 
                    alt="Original" 
                    className="max-h-full max-w-full object-contain shadow-2xl" 
                  />
                  <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                    Original
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-400 px-1">
                  <span>Ready to process</span>
                  <button onClick={handleReset} className="text-red-400 hover:text-red-300 transition-colors">
                    Remove Image
                  </button>
                </div>
              </div>

              {/* Right Column: Controls */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-fit space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                       <Wand2 size={18} className="text-blue-400" />
                       Processing Options
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-300">Background Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: BackgroundOption.TRANSPARENT, label: 'Transparent' },
                          { id: BackgroundOption.WHITE, label: 'Pure White' },
                          { id: BackgroundOption.GREEN_SCREEN, label: 'Green Screen' },
                          { id: BackgroundOption.STUDIO, label: 'Studio' },
                          { id: BackgroundOption.CITY, label: 'City Bokeh' },
                          { id: BackgroundOption.NATURE, label: 'Nature' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedOption(opt.id)}
                            className={`p-2 rounded-lg text-sm transition-all border ${
                              selectedOption === opt.id 
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                              : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-700">
                    <Button 
                      onClick={handleProcess} 
                      isLoading={isProcessing} 
                      className="w-full text-lg font-semibold py-3 shadow-blue-900/40"
                    >
                      Process Image
                    </Button>
                    <p className="text-xs text-center text-slate-500 mt-3">
                      Powered by Gemini 2.5 Flash. <br/> Processing usually takes 3-5 seconds.
                    </p>
                 </div>

                 {error && (
                   <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                     {error}
                   </div>
                 )}
              </div>
            </div>
          ) : (
            <ComparisonView 
              originalImage={originalImage}
              processedImage={processedImage}
              originalMimeType={originalMime}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Fast Background AI. Built with Google Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;