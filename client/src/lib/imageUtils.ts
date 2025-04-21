/**
 * Utility functions for image processing and base64 encoding/decoding
 */

/**
 * Resize an image to a maximum dimension while maintaining aspect ratio
 */
export const resizeImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.9
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not create blob from canvas'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Could not load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert a base64 string to a Blob
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * Get image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('Could not load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Apply a watermark to an image
 */
export const applyWatermark = (
  imageSource: string,
  watermarkText: string,
  options: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    opacity?: number;
    position?: 'center' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  } = {}
): Promise<string> => {
  const {
    fontSize = 24,
    fontFamily = 'Arial',
    color = 'rgba(255, 255, 255, 0.7)',
    opacity = 0.7,
    position = 'bottomRight'
  } = options;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSource;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Apply watermark
      ctx.globalAlpha = opacity;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      
      const metrics = ctx.measureText(watermarkText);
      const textWidth = metrics.width;
      const textHeight = fontSize;
      
      let x = 0;
      let y = 0;
      
      // Position the watermark
      switch (position) {
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = (canvas.height + textHeight) / 2;
          break;
        case 'bottomRight':
          x = canvas.width - textWidth - 20;
          y = canvas.height - 20;
          break;
        case 'bottomLeft':
          x = 20;
          y = canvas.height - 20;
          break;
        case 'topRight':
          x = canvas.width - textWidth - 20;
          y = textHeight + 20;
          break;
        case 'topLeft':
          x = 20;
          y = textHeight + 20;
          break;
      }
      
      ctx.fillText(watermarkText, x, y);
      
      // Reset global alpha
      ctx.globalAlpha = 1.0;
      
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => {
      reject(new Error('Could not load image'));
    };
  });
};
