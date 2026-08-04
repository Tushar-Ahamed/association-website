import React from 'react';
import { AboutSection } from '../components/public/AboutSection';
import { History } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 bg-slate-950 text-white space-y-12 font-bengali min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <History className="w-3.5 h-3.5 text-amber-400" /> ঐতিহ্য ও সংহতি
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয় এর পরিচিতি
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          মতিহারের সবুজ চত্বরে আমাদের অস্তিত্ব, ঐতিহ্য এবং আগামী প্রজন্মের জন্য এক আলোকিত আগামী বিনির্মাণের অঙ্গীকার।
        </p>
      </div>

      <AboutSection />
    </div>
  );
};
