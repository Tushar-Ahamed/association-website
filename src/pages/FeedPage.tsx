import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PostCreateCard } from '../components/feed/PostCreateCard';
import { PostCard } from '../components/feed/PostCard';
import { MessageSquare, Sparkles, Bell, Calendar, Users, MapPin, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UPAZILA_INFO } from '../data/mockData';

export const FeedPage: React.FC = () => {
  const { posts, user, notices, events, profiles } = useAuth();

  return (
    <div className="py-8 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> সামাজিক আলোচনা ও যোগাযোগ
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            ঝিনাইদহ সমিতি সামাজিক ফিড
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            সমিতির অনুষ্ঠান, সাধারণ আলোচনা, পরামর্শ ও শুভেচ্ছা পোস্ট করুন।
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card & Upazila Quick Links (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            
            {/* User Mini Profile Widget */}
            {user ? (
              <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.full_name_bn}
                    className="w-full h-full rounded-2xl object-cover ring-4 ring-emerald-500/50 shadow-lg"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white">{user.full_name_bn}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{user.department}</p>
                  <p className="text-[11px] text-slate-400">{UPAZILA_INFO[user.upazila || 'jhenaidah_sadar'].name_bn}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <p className="font-bold text-amber-400">{user.session_years}</p>
                    <p className="text-[10px] text-slate-500">সেশন</p>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <p className="font-bold text-emerald-400 uppercase">{user.blood_group || 'O+'}</p>
                    <p className="text-[10px] text-slate-500">রক্তের গ্রুপ</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  প্রোফাইল দেখুন
                </Link>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-5 text-center space-y-3">
                <p className="text-xs text-slate-400">ফিডে যুক্ত হতে লগইন করুন</p>
              </div>
            )}

            {/* Quick Upazila Network List */}
            <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" /> উপজেলা ইউনিটসমূহ
              </h4>
              <div className="space-y-1.5">
                {Object.entries(UPAZILA_INFO).map(([key, info]) => (
                  <Link
                    key={key}
                    to={`/upazila?id=${key}`}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{info.name_bn}</span>
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-emerald-400">{info.total_members}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Center Column: Feed Stream (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Post Composer */}
            <PostCreateCard />

            {/* Posts Stream */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right Column: Trending Notices & Events Widget (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            
            {/* Trending Notices Widget */}
            <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-400" /> জরুরি নোটিশ
                </h4>
                <Link to="/notices" className="text-[10px] text-emerald-400 hover:underline">সব</Link>
              </div>
              <div className="space-y-2.5">
                {notices.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1">
                    <h5 className="font-bold text-xs text-white line-clamp-1">{n.title}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events Widget */}
            <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" /> আসন্ন আয়োজন
                </h4>
                <Link to="/events" className="text-[10px] text-emerald-400 hover:underline">সব</Link>
              </div>
              <div className="space-y-2.5">
                {events.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 font-bold text-[10px] flex flex-col items-center justify-center shrink-0 border border-emerald-500/30">
                      <span>{new Date(ev.event_date).getDate()}</span>
                      <span className="text-[8px] uppercase">মাচর্</span>
                    </div>
                    <div className="truncate">
                      <h5 className="font-bold text-xs text-white truncate">{ev.title}</h5>
                      <p className="text-[10px] text-slate-400 truncate">📍 {ev.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
