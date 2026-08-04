import React from 'react';
import { Target, Compass, Award, Shield, Users, Sparkles, Quote } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: Users,
      title: 'ঐক্য ও ভ্রাতৃত্ববোধ',
      desc: 'রাজশাহী বিশ্ববিদ্যালয়ে পড়ালেখা করতে আসা ঝিনাইদহ জেলার সকল শিক্ষার্থীর মধ্যে একটি নিবিড় পারিবারিক সম্পর্ক তৈরি করা।'
    },
    {
      icon: Target,
      title: 'শিক্ষা ও সহায়তা',
      desc: 'নতুন ভর্তি হওয়া ছোট ভাই-বোনদের হল সিট, বইপত্র ও অ্যাকাডেমিক দিকনির্দেশনায় সর্বোচ্চ সহযোগিতার হাত বাড়িয়ে দেওয়া।'
    },
    {
      icon: Compass,
      title: 'ক্যারিয়ার গাইডলাইন',
      desc: 'প্রাক্তন সফল শিক্ষক ও বিসিএস/চাকরিজীবী অ্যালুমনিদের মাধ্যমে নিয়মিত ক্যারিয়ার ওয়ার্কশপ ও সেমিনার আয়োজন করা।'
    },
    {
      icon: Award,
      title: 'কৃতি শিক্ষার্থী সংবর্ধনা',
      desc: 'মেধাবী ও কৃতী শিক্ষার্থীদের উৎসাহিত করতে বাৎসরিক বৃত্তি ও সম্মাননা স্মারক প্রদান।'
    }
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden text-slate-100 font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> আমাদের মূল আদর্শ ও উদ্দেশ্য
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ঝিনাইদহ জেলা সমিতি, রাবি পরিচিতি
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            দীর্ঘ কয়েক দশক ধরে মতিহারের সবুজ চত্বরে ঝিনাইদহের সন্তানদের পারস্পরিক সহযোগিতা, ভালোবাসা ও ঐক্যের মূর্ত প্রতীক হিসেবে কাজ করে আসছে এই সমিতি।
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 font-bold shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advisor Message Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-6 text-slate-800/40 pointer-events-none">
            <Quote className="w-32 h-32" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 flex justify-center">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-emerald-500/40 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Advisor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-9 space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                প্রধান উপদেষ্টার বার্তা
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">"ঐক্যের শক্তি দিয়ে আমরা অনেক দূরে এগিয়ে যাব"</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "রাজশাহী বিশ্ববিদ্যালয় আমাদের জ্ঞানের আলোকবর্তিকা। এই অঙ্গনে ঝিনাইদহের প্রতিটি সন্তান যাতে নিরাপদে, স্বাচ্ছন্দে তাদের উচ্চশিক্ষা সম্পন্ন করতে পারে এবং নিজেদের দক্ষ নাগরিক হিসেবে গড়ে তুলতে পারে, সে লক্ষ্যেই জেলা সমিতি নিরলস কাজ করে যাচ্ছে।"
              </p>
              <div className="pt-2">
                <h4 className="text-sm font-bold text-emerald-300">ড. মো: রফিকুল ইসলাম</h4>
                <p className="text-xs text-slate-400">অধ্যাপক, রসায়ন বিভাগ ও প্রধান উপদেষ্টা, ঝিনাইদহ জেলা সমিতি, রাবি</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
