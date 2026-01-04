import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data and mime type
      const match = result.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        onImageSelected(match[2], match[1]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative group cursor-pointer w-full h-64 sm:h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300
        ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && processFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-4 text-center p-6">
        <div className={`
          p-4 rounded-full transition-transform duration-300 group-hover:scale-110
          ${isDragging ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}
        `}>
          <Upload size={32} />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-200">
            Click or drag image to upload
          </p>
          <p className="text-sm text-slate-400">
            Supports JPG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
};