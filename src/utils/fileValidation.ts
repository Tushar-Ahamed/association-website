export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export interface FileValidationConfig {
  maxSizeMB: number;
  allowedTypes?: string[];
  pdfMaxSizeMB?: number;
}

export function validateSelectedFile(
  file: File,
  config: FileValidationConfig
): { valid: boolean; errorMessage?: string } {
  const fileType = file.type.toLowerCase();
  const fileNameLower = file.name.toLowerCase();
  const isPdf = fileType === 'application/pdf' || fileNameLower.endsWith('.pdf');

  // Type Validation
  if (config.allowedTypes && config.allowedTypes.length > 0) {
    const isAllowed = config.allowedTypes.some((t) => {
      const target = t.toLowerCase();
      if (target === 'image/*' && fileType.startsWith('image/')) return true;
      if ((target === '.pdf' || target === 'application/pdf') && isPdf) return true;
      if (target.startsWith('.')) return fileNameLower.endsWith(target);
      return fileType === target;
    });

    if (!isAllowed) {
      const allowedText = config.allowedTypes.includes('application/pdf') || config.allowedTypes.includes('.pdf')
        ? 'JPG, JPEG, PNG, WEBP বা PDF'
        : 'JPG, JPEG, PNG, WEBP';
      return {
        valid: false,
        errorMessage: `অনুপযুক্ত ফাইল টাইপ! শুধুমাত্র ${allowedText} ফরম্যাটের ফাইল সমর্থিত।`
      };
    }
  }

  // Size Validation
  const effectiveMaxMB = isPdf && config.pdfMaxSizeMB ? config.pdfMaxSizeMB : config.maxSizeMB;
  const maxBytes = effectiveMaxMB * 1024 * 1024;

  if (file.size > maxBytes) {
    const sizeFormatted = effectiveMaxMB >= 1 ? `${effectiveMaxMB} MB` : `${Math.round(effectiveMaxMB * 1024)} KB`;
    return {
      valid: false,
      errorMessage: `ফাইল সাইজ খুব বড়! এই ফাইলের সর্বোচ্চ আকার ${sizeFormatted} হতে পারে।`
    };
  }

  return { valid: true };
}
