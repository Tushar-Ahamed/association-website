import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateSelectedFile, ALLOWED_IMAGE_TYPES } from '../utils/fileValidation';
import { Image, Plus, Trash2, X, UploadCloud } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { user, gallery, addGalleryItem, deleteGalleryItem } = useAuth();
  const { showToast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Sports');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canManageGallery = user?.role === 'super_admin' || user?.role === 'committee_member' || user?.role === 'upazila_admin';

  const categories = ['All', 'Sports', 'Cultural', 'Social Service'];

  const filtered = gallery.filter((g) =>
    categoryFilter === 'All' ? true : g.category === categoryFilter
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateSelectedFile(file, {
        maxSizeMB: 2,
        allowedTypes: ALLOWED_IMAGE_TYPES
      });
      if (!validation.valid) {
        showToast('error', 'গ্যালারি ছবি ত্রুটি', validation.errorMessage || 'ছবিটির আকার সর্বোচ্চ 2 MB এবং JPG, PNG, WEBP হওয়া আবশ্যক।');
        if (e.target) e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    addGalleryItem(title, imageUrl, category);
    setTitle('');
    setImageUrl('');
    setModalOpen(false);
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <Image className="w-3.5 h-3.5 text-amber-400" /> ফটো অ্যালবামের স্মৃতিমালা
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ঝিনাইদহ জেলা সমিতি ফটো গ্যালারি
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              বিভিন্ন সময় আয়োজিত সাংস্কৃতিক অনুষ্ঠান, টুর্নামেন্ট, রক্তদান কর্মসূচী ও শিক্ষা সফরের বর্ণিল আলোকচিত্র।
            </p>
          </div>

          {canManageGallery && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ছবি যুক্ত করুন</span>
            </button>
          )}
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex justify-center flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'সব ছবি' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                {/* Delete button overlay for admins */}
                {canManageGallery && (
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="absolute top-3 right-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 p-2 rounded-xl text-xs font-bold border border-rose-500/40 shadow-md transition-colors flex items-center gap-1 opacity-90 hover:opacity-100"
                    title="ছবিটি মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>মুছে ফেলুন</span>
                  </button>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm inline-block">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 leading-tight">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding photo */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-800 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">নতুন ছবি অ্যালবামে যুক্ত করুন</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ছবি শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ছবিটির শিরোনাম"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  >
                    <option value="Sports">Sports (খেলাধুলা)</option>
                    <option value="Cultural">Cultural (সাংস্কৃতিক)</option>
                    <option value="Social Service">Social Service (সমাজসেবা)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ডিভাইস থেকে ছবি নির্বাচন করুন *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-950/60 cursor-pointer text-center space-y-2 transition-colors"
                  >
                    {imageUrl ? (
                      <div className="relative h-40 rounded-xl overflow-hidden">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] text-emerald-400 font-bold">
                          ছবি নির্বাচিত হয়েছে (পরিবর্তন করতে ক্লিক করুন)
                        </span>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2 text-slate-400">
                        <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="font-semibold text-white">ডিভাইস থেকে ফটো ফাইল সিলেক্ট করতে ক্লিক করুন</p>
                        <p className="text-[10px] text-slate-500">JPG, PNG, WEBP ফরম্যাট সমর্থিত</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!imageUrl || !title}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg mt-2"
                >
                  ছবি সংরক্ষণ ও প্রকাশ করুন
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
