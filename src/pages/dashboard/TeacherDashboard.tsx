import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, BookOpen, Users, Plus, Award, CheckCircle2 } from 'lucide-react';
import { UPAZILA_INFO } from '../../data/mockData';

export const TeacherDashboard: React.FC = () => {
  const { user, isAuthLoading, notices, createNotice, profiles } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (isAuthLoading) {
    return (
      <div className="py-20 flex items-center justify-center bg-slate-950 min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role !== 'teacher' && user?.role !== 'super_admin') {
    return (
      <div className="py-20 text-center text-slate-400 bg-slate-950 min-h-screen font-bengali">
        <p>এই ড্যাশবোর্ড কেবল রাবি সম্মানিত শিক্ষকদের জন্য নির্দিষ্ট।</p>
      </div>
    );
  }

  const deptStudents = profiles.filter((p) => p.department === user?.department);

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    createNotice(title, content, 'academic', undefined, true);
    setTitle('');
    setContent('');
    setModalOpen(false);
  };

  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 p-8 rounded-3xl text-white shadow-2xl border border-purple-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
              👨‍🏫 শিক্ষক ড্যাশবোর্ড (Teacher Portal)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              স্বাগতম, {user.full_name_bn}!
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              {user.occupation || 'অধ্যাপক'} • {user.department}, রাজশাহী বিশ্ববিদ্যালয়
            </p>
          </div>

          {user?.role === 'super_admin' && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন নোটিশ দিন</span>
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>আপনার বিভাগের শিক্ষার্থী</span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">{deptStudents.length} জন</p>
            <p className="text-[11px] text-purple-300 font-semibold mt-1">{user.department}</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>আপনার উপজেলা</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">
              {UPAZILA_INFO[user.upazila].name_bn}
            </p>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1">জেলা সমিতি সদস্য</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>প্রকাশিত নোটিশ</span>
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">{notices.length} টি</p>
            <p className="text-[11px] text-amber-300 font-semibold mt-1">শিক্ষার্থী নির্দেশনাবলী</p>
          </div>
        </div>

        {/* Students list */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white">
            আপনার বিভাগের ঝিনাইদহের শিক্ষার্থী তালিকা ({user.department})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptStudents.map((st) => (
              <div key={st.id} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-1">
                <h4 className="font-bold text-white">{st.full_name_bn}</h4>
                <p className="text-slate-300">শিক্ষাবর্ষ: {st.session_years} • রোল: {st.student_id || 'N/A'}</p>
                <p className="text-slate-400">উপজেলা: {UPAZILA_INFO[st.upazila].name_bn} • রক্ত: {st.blood_group || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for posting notice */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-800 text-white">
              <h3 className="font-bold text-base text-white">একাডেমিক নোটিশ প্রকাশ করুন</h3>

              <form onSubmit={handleSubmitNotice} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">শিরোনাম</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">বিস্তারিত বিবরণ</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg">
                    প্রকাশ করুন
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700">
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
