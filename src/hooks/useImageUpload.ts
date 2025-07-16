import { useState } from 'react';
import { imageKit } from '../lib/imagekit';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

interface UploadError {
  message?: string;
}

export const useImageUpload = () => {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
  });

  const uploadImage = async (file: File, folder?: string) => {
    setState({
      uploading: true,
      progress: 0,
      error: null,
      url: null,
    });

    try {
      // Simulate progress (since ImageKit doesn't provide real progress)
      setState(prev => ({ ...prev, progress: 30 }));
      
      const result = await imageKit.uploadFile(file, undefined, folder);
      
      setState(prev => ({ ...prev, progress: 100 }));
      
      setState({
        uploading: false,
        progress: 100,
        error: null,
        url: result.url,
      });

      return result;
    } catch (error) {
      const uploadError = error as UploadError;
      const errorMessage = uploadError.message || 'Upload failed';
      
      setState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      url: null,
    });
  };

  return {
    ...state,
    uploadImage,
    reset,
  };
};