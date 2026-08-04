import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, ShieldCheck, Sparkles, ArrowRight, BookOpen, HeartHandshake, Award, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeroSection: React.FC = () => {
  const { profiles, committees } = useAuth();
  
  const totalMembers = profiles.length;
  const totalTeachers = profiles.filter((p) => p.role === 'teacher').length;
  const activeCommittees = committees.length;

  return (
    <section className="relative overflow-hidden hero-gradient text-white pt-12 pb-24 lg:pt-20 lg:pb-32 font-bengali">
      {/* Dynamic Background Patterns */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>ঝিনাইদহ জেলা সমিতি • রাজশাহী বিশ্ববিদ্যালয়</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-bengali">
              ঐক্য, ভাইচারা ও শিক্ষা <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                অগ্রগতির এক মেলবন্ধন
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              রাজশাহী বিশ্ববিদ্যালয় অঙ্গনে ঝিনাইদহ জেলার সম্মানিত শিক্ষক, প্রাক্তনী, শিক্ষার্থীবৃন্দের ঐক্যবদ্ধ সামাজিক ও সেবামূলক প্ল্যাটফর্ম। আমরা একে অপরের পাশে দাঁড়াতে এবং মেধা বিকাশ প্রসারে অঙ্গীকারবদ্ধ।
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/members"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/80 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>সদস্য ডিরেক্টরি খুঁজুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/committee"
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700/80 shadow-md flex items-center gap-2 transition-all hover:border-emerald-500/40"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>কার্যনির্বাহী কমিটি</span>
              </Link>
            </div>

            {/* Stat Counters Bar */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/60">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">{totalMembers} জন</p>
                <p className="text-xs text-slate-400 font-medium">নিবন্ধিত শিক্ষার্থী ও সদস্য</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/60">
                <p className="text-2xl sm:text-3xl font-black text-amber-400">{totalTeachers} জন</p>
                <p className="text-xs text-slate-400 font-medium">সম্মানিত রাবি শিক্ষকগণ</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/60">
                <p className="text-2xl sm:text-3xl font-black text-teal-300">৬ টি</p>
                <p className="text-xs text-slate-400 font-medium">উপজেলা ইউনিট শাখা</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-2xl p-3 space-y-3">
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80"
                  alt="Rajshahi University Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                {/* Floating Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-white space-y-1.5 shadow-2xl">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-amber-400" /> সুসংগঠিত পরিবার
                    </span>
                    <span className="bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-600/40 text-[10px]">সেশন ২০২৫-২০২৬</span>
                  </div>
                  <p className="text-sm font-bold text-slate-100">
                    "সবুজের দেশ ঝিনাইদহ, বিদ্যাপিঠ রাজশাহী বিশ্ববিদ্যালয়"
                  </p>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link to="/upazila" className="p-3 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 flex items-center gap-2.5 transition-all group">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-slate-200">৬টি উপজেলা</p>
                    <p className="text-[10px] text-slate-400">ইউনিট পরিষদ কমিটি</p>
                  </div>
                </Link>

                <Link to="/events" className="p-3 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 flex items-center gap-2.5 transition-all group">
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-slate-200">শিক্ষা ও কল্যাণ</p>
                    <p className="text-[10px] text-slate-400">বৃত্তি ও গাইডলাইন</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
