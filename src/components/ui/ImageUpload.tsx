'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';
import { formatFileSize } from '@/utils/formatters';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  folder?: string;
  maxSize?: number; // in bytes
  accept?: string;
}

export default function ImageUpload({
  onUploadComplete,
  folder = 'uploads',
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { uploading, progress, error, url, uploadImage, reset } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      alert(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const result = await uploadImage(file, folder);
      if (result.url && onUploadComplete) {
        onUploadComplete(result.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleReset = () => {
    if (preview) {
      URL.revokeObjectURL(preview); // Clean up memory
    }
    setPreview(null);
    reset();
  };

  const displayUrl = url || preview;

  return (
    <div className="w-full">
      {!preview && !url && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500">
              Max size: {formatFileSize(maxSize)}
            </span>
          </label>
        </div>
      )}

      {displayUrl && (
        <div className="space-y-4">
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={displayUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              type="button"
            >
              ✕
            </button>
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {url && !uploading && (
            <div className="text-green-600 text-sm">Upload completed!</div>
          )}
        </div>
      )}
    </div>
  );
}