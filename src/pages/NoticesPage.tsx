import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateSelectedFile, ALLOWED_IMAGE_TYPES } from '../utils/fileValidation';
import { compressImage } from '../utils/imageCompressor';
import { Bell, Pin, Download, Plus, FileText, Sparkles, X, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { NoticeCategory } from '../types';

export const NoticesPage: React.FC = () => {
  const { user, notices, createNotice, deleteNotice } = useAuth();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // New notice form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('general');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canPublish = user?.role === 'super_admin' || user?.role === 'committee_member' || user?.role === 'upazila_admin';

  const filteredNotices = notices.filter((n) =>
    activeCategory === 'all' ? true : n.category === activeCategory
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateSelectedFile(file, {
        maxSizeMB: 2,
        pdfMaxSizeMB: 10,
        allowedTypes: [...ALLOWED_IMAGE_TYPES, 'application/pdf', '.pdf']
      });
      if (!validation.valid) {
        showToast('error', 'সংযুক্তি আপলোড ব্যর্থ', validation.errorMessage || 'ছবি সর্বোচ্চ ২ MB এবং PDF ফাইল সর্বোচ্চ ১০ MB সমর্থিত।');
        if (e.target) e.target.value = '';
        return;
      }

      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
          convertToWebP: true
        });
        setFileName(file.name);
        setFileUrl(compressed.dataUrl);
        if (file.type.startsWith('image/')) {
          showToast('success', 'ছবি অপটিমাইজড', 'সংযুক্তি ছবিটি অপটিমাইজ ও সংকুচিত করা হয়েছে।');
        }
      } catch (err) {
        showToast('error', 'প্রসেসিং ত্রুটি', 'ফাইল প্রক্রিয়াজাতকরণে ব্যর্থতা।');
      } finally {
        setIsCompressing(false);
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    createNotice(title, content, category, fileUrl || undefined, isPinned);
    setTitle('');
    setContent('');
    setFileUrl('');
    setFileName('');
    setIsPinned(false);
    setModalOpen(false);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'urgent': return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'event': return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'academic': return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'scholarship': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const getCategoryLabelBn = (cat: string) => {
    switch (cat) {
      case 'urgent': return 'জরুরি';
      case 'event': return 'আয়োজন/ইভেন্ট';
      case 'academic': return 'একাডেমিক';
      case 'scholarship': return 'বৃত্তি সংক্রান্ত';
      default: return 'সাধারণ নোটিশ';
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" /> অফিসিয়াল সাধারণ নোটিশ বোর্ড
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              জরুরি নোটিশ ও নির্দেশনাবলী
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              ঝিনাইদহ জেলা সমিতি, রাবি প্রকাশিত সকল আদেশ, সংবাদ ও তথ্য।
            </p>
          </div>

          {canPublish && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন নোটিশ প্রকাশ করুন</span>
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'সব নোটিশ' },
            { id: 'urgent', label: '🚨 জরুরি' },
            { id: 'event', label: '🎉 আয়োজন' },
            { id: 'academic', label: '📚 একাডেমিক' },
            { id: 'scholarship', label: '🎓 বৃত্তি' },
            { id: 'general', label: '📢 সাধারণ' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === item.id
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Notices Timeline / Cards */}
        <div className="space-y-4">
          {filteredNotices.map((n) => (
            <div
              key={n.id}
              className={`glass-card rounded-3xl p-6 border transition-all space-y-3 ${
                n.is_pinned 
                  ? 'border-amber-500/50 bg-amber-950/20 shadow-amber-950/20' 
                  : 'border-slate-800/80 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border ${getCategoryBadge(n.category)}`}>
                    {getCategoryLabelBn(n.category)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    প্রকাশের তারিখ: {new Date(n.created_at).toLocaleDateString('bn-BD')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {n.is_pinned && (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 fill-amber-400" /> পিনকৃত
                    </span>
                  )}
                  {canPublish && (
                    <button
                      onClick={() => deleteNotice(n.id)}
                      className="px-2.5 py-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded-xl border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="নোটিশ মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">{n.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{n.content}</p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  প্রকাশক: <strong className="text-emerald-400">{n.publisher?.full_name_bn || 'এডমিন'}</strong>
                </span>

                {n.file_url && (
                  <a
                    href={n.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>সংযুক্তি ফাইল দেখুন / ডাউনলোড</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for creating notice */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-800 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">নতুন নোটিশ প্রকাশ করুন</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="নোটিশের শিরোনাম"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  >
                    <option value="general">সাধারণ (General)</option>
                    <option value="event">আয়োজন (Event)</option>
                    <option value="academic">একাডেমিক (Academic)</option>
                    <option value="urgent">জরুরি (Urgent)</option>
                    <option value="scholarship">বৃত্তি (Scholarship)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">বিস্তারিত বিবরণ *</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="নোটিশের বিস্তারিত অংশ"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ডিভাইস থেকে সংযুক্তি ফাইল (PDF / ছবি) যুক্ত করুন</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => !isCompressing && fileInputRef.current?.click()}
                    className="p-3.5 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl bg-slate-950/60 cursor-pointer text-center space-y-1 transition-colors"
                  >
                    {isCompressing ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="font-semibold text-xs">ফাইল অপটিমাইজ করা হচ্ছে...</span>
                      </div>
                    ) : fileName ? (
                      <p className="font-bold text-emerald-400">সংযুক্তি ফাইল: {fileName}</p>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <UploadCloud className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-white">ডিভাইস থেকে ফাইল নির্বাচন করতে ক্লিক করুন</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pinCheck"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pinCheck" className="font-semibold text-slate-300">নোটিশটি পিন করে উপরে রাখুন</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg mt-2"
                >
                  প্রকাশ সম্পন্ন করুন
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
