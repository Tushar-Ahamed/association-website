import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Heart, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import { UPAZILA_INFO } from '../../data/mockData';
import { UpazilaName } from '../../types';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900/90 pt-16 pb-8 font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900/80">
          
          {/* Col 1: About & Logo (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-xl font-bengali">
                  ঝ
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white leading-tight font-bengali">ঝিনাইদহ জেলা সমিতি</h3>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400 inline" /> রাজশাহী বিশ্ববিদ্যালয়
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              রাজশাহী বিশ্ববিদ্যালয়ে অধ্যয়নরত ও কর্মরত ঝিনাইদহ জেলার সকল শিক্ষক, কর্মকর্তা, শিক্ষার্থী ও প্রাক্তনীদের প্রাণের প্রিয় সামাজিক সংগঠন।
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ঐক্য • শিক্ষা • সেবামূলক অগ্রগতি</span>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> গুরুত্বপূর্ণ লিংক
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><span className="text-slate-600">•</span> আমাদের পরিচিতি</Link></li>
              <li><Link to="/committee" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><span className="text-slate-600">•</span> জেলা কার্যনির্বাহী কমিটি</Link></li>
              <li><Link to="/members" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><span className="text-slate-600">•</span> সদস্য ডিরেক্টরি</Link></li>
              <li><Link to="/feed" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><span className="text-slate-600">•</span> সামাজিক ফিড ও আলোচনা</Link></li>
              <li><Link to="/notices" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><span className="text-slate-600">•</span> জরুরি নোটিশ বোর্ড</Link></li>
              <li><Link to="/events" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><span className="text-slate-600">•</span> আসন্ন অনুষ্ঠানসমূহ</Link></li>
            </ul>
          </div>

          {/* Col 3: Upazilas (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-emerald-400">উপজেলাসমূহ</h4>
            <ul className="space-y-2 text-xs">
              {(Object.keys(UPAZILA_INFO) as UpazilaName[]).map((key) => (
                <li key={key}>
                  <Link 
                    to={`/upazila?id=${key}`} 
                    className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
                  >
                    <Building2 className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span>{UPAZILA_INFO[key].name_bn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-emerald-400">যোগাযোগ</h4>
            <div className="space-y-3 text-xs">
              <p className="flex items-start gap-2.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>ঝিনাইদহ জেলা সমিতি কক্ষ, ছাত্র-শিক্ষক মিলনায়তন (টিএসসিসি), রাজশাহী বিশ্ববিদ্যালয়</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@jhenaidah-ru.org</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+৮৮০ ১৭০০-০০০০০০</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Developer Credit Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়। সর্বস্বত্ব সংরক্ষিত।</p>
          
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-xs font-medium shadow-lg transition-all">
            <span className="text-slate-300">Designed & Developed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-slate-300">by</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 tracking-wide">
              Tushar Ahammed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
