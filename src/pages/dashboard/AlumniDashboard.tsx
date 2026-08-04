import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Briefcase, Users, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UPAZILA_INFO } from '../../data/mockData';

export const AlumniDashboard: React.FC = () => {
  const { user, profiles } = useAuth();

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400 bg-slate-950 min-h-screen font-bengali">
        <p>দয়া করে প্রথমে সিস্টেমে লগইন করুন।</p>
      </div>
    );
  }

  const alumniList = profiles.filter((p) => p.role === 'alumni');

  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 p-8 rounded-3xl text-white shadow-2xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.full_name_bn}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400 shrink-0 shadow-lg"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1 border border-indigo-500/30">
                🏛️ প্রাক্তনী অ্যালুমনি পোর্টাল (Alumni Suite)
              </span>
              <h1 className="text-2xl font-extrabold">{user.full_name_bn}</h1>
              <p className="text-xs text-indigo-200">
                {user.occupation || 'প্রাক্তনী'} • {user.organization || 'বিসিএস / করপোরেট'} • {user.department} ({user.session_years})
              </p>
            </div>
          </div>

          <Link
            to="/feed"
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all self-start md:self-auto"
          >
            ক্যারিয়ার গাইডলাইন পোস্ট করুন
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>মোট নিবন্ধিত প্রাক্তনী</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">{alumniList.length} জন</p>
            <p className="text-[11px] text-indigo-300 font-semibold mt-1">নেটওয়ার্ক মেম্বার</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>উপজেলা ইউনিট</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-white mt-2">{UPAZILA_INFO[user.upazila].name_bn}</p>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1">প্রাক্তন শিক্ষার্থী সমিতি</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>মেন্টরশিপ প্রোগ্রাম</span>
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xl font-bold text-white mt-2">সক্রিয় রয়েছে</p>
            <p className="text-[11px] text-amber-300 font-semibold mt-1">নবীনদের দিকনির্দেশনা</p>
          </div>
        </div>

        {/* Registered Alumni Spotlight */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>প্রাক্তনী কৃতি সদস্যবৃন্দ (Alumni Network Spotlight)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alumniList.map((alm) => (
              <div key={alm.id} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3 text-xs">
                <img
                  src={alm.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={alm.full_name_bn}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-400 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-white">{alm.full_name_bn} ({alm.full_name_en})</h4>
                  <p className="text-slate-300">{alm.occupation || 'পেশাজীবী'} • {alm.organization || 'বিসিএস ক্যাডার'}</p>
                  <p className="text-slate-400">{alm.department} ({alm.session_years}) • {UPAZILA_INFO[alm.upazila].name_bn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
