import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, GraduationCap, Building2, Save, ShieldCheck, Camera, Sparkles, Award, Briefcase, Heart, UploadCloud } from 'lucide-react';
import { UpazilaName } from '../types';
import { UPAZILA_INFO } from '../data/mockData';
import { RU_HALLS, RU_DEPARTMENTS } from '../data/ruData';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400 bg-slate-950 min-h-screen font-bengali">
        <p>প্রোফাইল দেখতে দয়া করে প্রথমে লগইন করুন।</p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview');

  const [fullNameBn, setFullNameBn] = useState(user.full_name_bn);
  const [fullNameEn, setFullNameEn] = useState(user.full_name_en);
  const [phone, setPhone] = useState(user.phone || '');
  const [upazila, setUpazila] = useState<UpazilaName>(user.upazila);
  const [department, setDepartment] = useState(user.department);
  const [sessionYears, setSessionYears] = useState(user.session_years);
  const [hallName, setHallName] = useState(user.hall_name || '');
  const [bloodGroup, setBloodGroup] = useState(user.blood_group || 'O+');
  const [occupation, setOccupation] = useState(user.occupation || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name_bn: fullNameBn,
      full_name_en: fullNameEn,
      phone,
      upazila,
      department,
      session_years: sessionYears,
      hall_name: hallName,
      blood_group: bloodGroup,
      occupation,
      bio,
      avatar_url: avatarUrl
    });
    setActiveTab('overview');
  };

  return (
    <div className="py-8 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Cover Banner & Profile Overlay Header */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          
          {/* Cover Photo */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
              alt="Cover Banner"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>

          {/* Profile Header Content */}
          <div className="px-6 pb-6 pt-0 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative">
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user.full_name_bn}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-slate-950 shadow-2xl shrink-0"
                />
                <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-950"></span>
              </div>

              <div className="space-y-1 pb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.full_name_bn}</h1>
                  <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{user.full_name_en} • {user.email}</p>
                <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <GraduationCap className="w-4 h-4 text-amber-400" /> {user.department} ({user.session_years}) • {UPAZILA_INFO[user.upazila].name_bn}
                </p>
              </div>
            </div>

            {/* Edit / Actions Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                প্রোফাইল সারসংক্ষেপ
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                তথ্য সম্পাদনা
              </button>
            </div>

          </div>
        </div>

        {/* 2-Column Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Center Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {activeTab === 'overview' ? (
              <>
                {/* About Bio Card */}
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> আত্মপরিচিতি ও সংক্ষেপ
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{user.bio || 'ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়ের সাথে একাত্ম হয়ে শিক্ষা ও সেবামূলক কাজে অংশ নিতে প্রতিশ্রুতিবদ্ধ।'}"
                  </p>
                </div>

                {/* Academic & Professional Grid */}
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
                    শিক্ষাগত ও পেশাগত তথ্য
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium">বিভাগ / ইন্সটিটিউট</span>
                      <p className="font-bold text-white text-sm">{user.department}</p>
                    </div>

                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium">শিক্ষাবর্ষ (Session)</span>
                      <p className="font-bold text-amber-400 text-sm">{user.session_years}</p>
                    </div>

                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium">আবাসিক হল</span>
                      <p className="font-bold text-white text-sm">{user.hall_name || 'নির্ধারিত নয়'}</p>
                    </div>

                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium">বর্তমান পেশা / পদবি</span>
                      <p className="font-bold text-emerald-400 text-sm">{user.occupation || 'শিক্ষার্থী'}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Edit Profile Form */
              <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 text-xs">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                  প্রোফাইল তথ্য সম্পাদনা (Edit Profile)
                </h3>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">আপনার পূর্ণ নাম (Full Name)</label>
                  <input
                    type="text"
                    required
                    value={fullNameBn}
                    onChange={(e) => {
                      setFullNameBn(e.target.value);
                      setFullNameEn(e.target.value);
                    }}
                    placeholder="বাংলা বা ইংরেজিতে নাম লিখুন"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">উপজেলা</label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value as UpazilaName)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    >
                      {(Object.keys(UPAZILA_INFO) as UpazilaName[]).map((uKey) => (
                        <option key={uKey} value={uKey}>
                          {UPAZILA_INFO[uKey].name_bn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">বিভাগ / ইনস্টিটিউট</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                    >
                      <option value="">বিভাগ সিলেক্ট করুন...</option>
                      {RU_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">শিক্ষাবর্ষ (Session)</label>
                    <input
                      type="text"
                      value={sessionYears}
                      onChange={(e) => setSessionYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">রক্তের গ্রুপ</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">আবাসিক হলের নাম</label>
                    <select
                      value={hallName}
                      onChange={(e) => setHallName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                    >
                      <option value="">হল নির্বাচন করুন...</option>
                      {RU_HALLS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">বর্তমান পেশা / পদবি</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ডিভাইস থেকে প্রোফাইল ছবি পরিবর্তন করুন</label>
                  <input
                    type="file"
                    id="profileAvatarPicker"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (reader.result) {
                            setAvatarUrl(reader.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <div
                    onClick={() => document.getElementById('profileAvatarPicker')?.click()}
                    className="p-3 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl bg-slate-950/60 cursor-pointer text-center space-y-1 transition-colors flex items-center justify-center gap-2 text-slate-300"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs">গ্যালারি / ক্যামেরা থেকে ছবি পরিবর্তন করুন</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">সংক্ষিপ্ত জীবনবৃত্তান্ত (Bio)</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> পরিবর্তনসমূহ সংরক্ষণ করুন
                </button>
              </form>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Contact Badge Card */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-emerald-400">
                যোগাযোগ ও জরুরি তথ্য
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-slate-400">ইমেইল ঠিকানা</p>
                    <p className="font-semibold text-white truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">মোবাইল নম্বর</p>
                    <p className="font-semibold text-white">{user.phone || '+৮৮০ ১৭০০-০০০০০০'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">রক্তের গ্রুপ</p>
                    <p className="font-bold text-rose-400">{user.blood_group || 'O+'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
