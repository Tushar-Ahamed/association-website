import React, { useState, useRef } from 'react';
import { Send, Image, X, Sparkles, MessageSquare, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateSelectedFile, ALLOWED_IMAGE_TYPES } from '../../utils/fileValidation';

export const PostCreateCard: React.FC = () => {
  const { user, createPost } = useAuth();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-6 text-white text-center shadow-2xl border border-slate-800 font-bengali">
        <h3 className="text-base font-bold mb-1 flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" /> সামাজিক ফিডে আলোচনা ও পোস্ট করুন
        </h3>
        <p className="text-xs text-slate-400">ঝিনাইদহ জেলা সমিতির ফিডে মতামত প্রকাশ ও মন্তব্য করতে লগইন করুন।</p>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > 4) {
      showToast('warning', 'ছবি আপলোড সীমা', 'একটি পোস্টে সর্বোচ্চ ৪টি ছবি যুক্ত করা যাবে।');
    }

    const filesArray = Array.from(files).slice(0, 4 - imageUrls.length);

    filesArray.forEach((file) => {
      const validation = validateSelectedFile(file, {
        maxSizeMB: 2,
        allowedTypes: ALLOWED_IMAGE_TYPES
      });
      if (!validation.valid) {
        showToast('error', 'পোস্ট ছবি অগ্রহণযোগ্য', `${file.name}: ${validation.errorMessage || 'সর্বোচ্চ ২ MB ও JPG, PNG, WEBP ফাইল সমর্থিত।'}`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrls((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost(content, imageUrls);
    setContent('');
    setImageUrls([]);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-xl font-bengali">
      <div className="flex items-start gap-4">
        <img
          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
          alt={user.full_name_bn}
          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/50 shrink-0"
        />
        
        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`প্রিয় ${user.full_name_bn}, আজ ঝিনাইদহ সমিতি সদস্যদের সাথে কী শেয়ার করতে চান?`}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Image Previews */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative h-20 rounded-xl overflow-hidden group border border-slate-800">
                  <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-slate-950/90 text-white rounded-full hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700/60"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>ডিভাইস থেকে ছবি তুলুন / যুক্ত করুন ({imageUrls.length}/4)</span>
            </button>

            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>প্রকাশ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
