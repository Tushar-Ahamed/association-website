import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Bell, Calendar, User, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UPAZILA_INFO } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const { user, notices, events } = useAuth();

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400 bg-slate-950 min-h-screen font-bengali">
        <p>দয়া করে প্রথমে সিস্টেমে লগইন করুন।</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-8 rounded-3xl text-white shadow-2xl border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.full_name_bn}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400 shrink-0 shadow-lg"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1 border border-emerald-500/30">
                🎓 শিক্ষার্থী পোর্টাল (Student Dashboard)
              </span>
              <h1 className="text-2xl font-extrabold">{user.full_name_bn}</h1>
              <p className="text-xs text-slate-300">
                {user.department} • সেশন: {user.session_years} • {UPAZILA_INFO[user.upazila].name_bn}
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all self-start md:self-auto"
          >
            প্রোফাইল সম্পাদন
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>আবাসিক হল</span>
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-white">{user.hall_name || 'সাধারণ শিক্ষার্থী'}</p>
            <p className="text-[11px] text-slate-400">আইডি: {user.student_id || 'N/A'}</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>সর্বশেষ নোটিশ</span>
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-sm font-bold text-white line-clamp-1">{notices[0]?.title}</p>
            <Link to="/notices" className="text-[11px] text-emerald-400 font-bold hover:underline flex items-center gap-1">
              <span>নোটিশ বোর্ডে যান</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>সামাজিক ফিড</span>
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm font-bold text-white">অন্যান্য বন্ধুদের সাথে আলোচনা করুন</p>
            <Link to="/feed" className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1">
              <span>ফিডে যান</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>আসন্ন অনুষ্ঠান ও কর্মসূচী</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30">
                  📅 {new Date(ev.event_date).toLocaleDateString('bn-BD')}
                </span>
                <h4 className="font-bold text-white">{ev.title}</h4>
                <p className="text-slate-300">{ev.description}</p>
                <p className="text-slate-400 font-medium">📍 {ev.location}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
