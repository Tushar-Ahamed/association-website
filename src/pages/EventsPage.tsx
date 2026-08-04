import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateSelectedFile, ALLOWED_IMAGE_TYPES } from '../utils/fileValidation';
import { Calendar, MapPin, Plus, X, Sparkles, CheckCircle2, Trash2, UploadCloud } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { user, events, createEvent, deleteEvent } = useAuth();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canManageEvents = user?.role === 'super_admin' || user?.role === 'committee_member' || user?.role === 'upazila_admin';

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateSelectedFile(file, {
        maxSizeMB: 3,
        allowedTypes: ALLOWED_IMAGE_TYPES
      });
      if (!validation.valid) {
        showToast('error', 'ইভেন্ট ব্যানার ত্রুটি', validation.errorMessage || 'ব্যনার ছবিটির সর্বোচ্চ আকার 3 MB এবং JPG, PNG, WEBP হতে হবে।');
        if (e.target) e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setBannerUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) return;
    createEvent(title, description, date, location, bannerUrl || undefined);
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setBannerUrl('');
    setModalOpen(false);
  };

  const handleRegister = (eventId: string) => {
    setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> বার্ষিক অনুষ্ঠান ও মিলনমেলা
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              আসন্ন ইভেন্ট ও কর্মসূচী
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              ঝিনাইদহ জেলা সমিতি রাবি আয়োজিত শিক্ষা সফর, স্পোর্টস, নবীন বরণ ও সামাজিক ইভেন্ট।
            </p>
          </div>

          {canManageEvents && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ইভেন্ট যুক্ত করুন</span>
            </button>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => {
            const isRSVP = registeredEvents[ev.id];

            return (
              <div key={ev.id} className="glass-card rounded-3xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={ev.banner_url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-slate-700/80 shadow-md">
                      📅 {new Date(ev.event_date).toLocaleDateString('bn-BD')}
                    </div>

                    {canManageEvents && (
                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className="absolute top-3 right-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 p-2 rounded-xl text-xs font-bold border border-rose-500/40 shadow-md transition-colors flex items-center gap-1"
                        title="ইভেন্ট মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
                    
                    <div className="pt-3 border-t border-slate-800/80 text-xs font-medium text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => handleRegister(ev.id)}
                    disabled={isRSVP}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                      isRSVP
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white'
                    }`}
                  >
                    {isRSVP ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>নথিভুক্তকরণ সম্পন্ন হয়েছে</span>
                      </>
                    ) : (
                      <span>অংশগ্রহণের জন্য নাম নথিভুক্ত করুন</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for creating event */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-800 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">নতুন ইভেন্ট প্রকাশ করুন</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ইভেন্ট শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ইভেন্টের নাম"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">তারিখ ও সময় *</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">স্থান (Location) *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="যেমন: রাবি টিএসসিসি মিলনায়তন"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">বিস্তারিত বিবরণ</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ইভেন্টের রূপরেখা ও সূচি"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ডিভাইস থেকে ব্যানার ছবি যুক্ত করুন</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleBannerSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-950/60 cursor-pointer text-center space-y-2 transition-colors"
                  >
                    {bannerUrl ? (
                      <div className="relative h-32 rounded-xl overflow-hidden">
                        <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] text-emerald-400 font-bold">
                          ব্যানার ছবি নির্বাচিত
                        </span>
                      </div>
                    ) : (
                      <div className="py-2 text-slate-400 flex items-center justify-center gap-2">
                        <UploadCloud className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-white">ডিভাইস থেকে ফটো ফাইল সিলেক্ট করতে ক্লিক করুন</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg mt-2"
                >
                  ইভেন্ট সংরক্ষণ ও প্রকাশ করুন
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
