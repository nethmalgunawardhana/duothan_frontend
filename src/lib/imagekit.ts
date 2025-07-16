// src/lib/imagekit.ts
export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  size: number;
  filePath: string;
  url: string;
  fileType: string;
  height?: number;
  width?: number;
  thumbnailUrl?: string;
}

export interface ImageKitConfig {
  publicKey: string;
  urlEndpoint: string;
}

export class ImageKitClient {
  private config: ImageKitConfig;

  constructor(config: ImageKitConfig) {
    this.config = config;
  }

  // Simple upload method - works without server authentication
  async uploadFile(file: File, fileName?: string, folder?: string): Promise<ImageKitUploadResponse> {
    if (!this.config.publicKey || !this.config.urlEndpoint) {
      throw new Error('ImageKit not configured. Please set environment variables.');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName || file.name);
      formData.append('publicKey', this.config.publicKey);
      
      if (folder) {
        formData.append('folder', folder);
      }

      // Direct upload to ImageKit
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ImageKit error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  // Generate image URL with transformations
  getImageUrl(path: string, transformations?: string): string {
    if (!this.config.urlEndpoint) {
      console.warn('ImageKit URL endpoint not configured');
      return path;
    }

    const baseUrl = this.config.urlEndpoint.replace(/\/$/, ''); // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    if (transformations) {
      return `${baseUrl}/tr:${transformations}${cleanPath}`;
    }
    return `${baseUrl}${cleanPath}`;
  }

  // Common transformation helpers
  getResizedImageUrl(url: string, width: number, height?: number): string {
    const path = url.includes(this.config.urlEndpoint) 
      ? url.replace(this.config.urlEndpoint, '')
      : url;
    
    const transformation = height ? `w-${width},h-${height},c-maintain_ratio` : `w-${width}`;
    return this.getImageUrl(path, transformation);
  }

  getThumbnailUrl(url: string, size: number = 300): string {
    const path = url.includes(this.config.urlEndpoint) 
      ? url.replace(this.config.urlEndpoint, '')
      : url;
    
    return this.getImageUrl(path, `w-${size},h-${size},c-maintain_ratio`);
  }
}

// Create and export the ImageKit instance
export const imageKit = new ImageKitClient({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

// Validation function
export const isImageKitConfigured = (): boolean => {
  return !!(process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY && process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);
};

export default imageKit;