export interface ImageCompressionConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  convertToWebP?: boolean;
}

export async function compressImage(
  file: File,
  config: ImageCompressionConfig = {}
): Promise<{ dataUrl: string; blob: Blob; format: string; originalSizeMB: number; compressedSizeMB: number }> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    convertToWebP = true
  } = config;

  const originalSizeMB = file.size / (1024 * 1024);

  // If non-image or PDF, read directly
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          blob: file,
          format: file.type,
          originalSizeMB,
          compressedSizeMB: originalSizeMB
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      // Scale down proportionally if larger than maximum dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context creation failed'));
        return;
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = convertToWebP ? 'image/webp' : (file.type || 'image/jpeg');

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob compression failed'));
            return;
          }

          const compressedSizeMB = blob.size / (1024 * 1024);
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve({
              dataUrl: reader.result as string,
              blob,
              format: mimeType,
              originalSizeMB,
              compressedSizeMB
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        mimeType,
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
