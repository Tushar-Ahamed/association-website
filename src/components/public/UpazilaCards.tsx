import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { UPAZILA_INFO } from '../../data/mockData';
import { UpazilaName } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UpazilaCards: React.FC = () => {
  const { profiles, upazilaAdmins } = useAuth();

  const keys = Object.keys(UPAZILA_INFO) as UpazilaName[];

  return (
    <section className="py-20 bg-slate-950 text-white relative font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" /> উপজেলা ইউনিট নেটওয়ার্ক
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ঝিনাইদহ জেলার ৬টি উপজেলা ইউনিট
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              প্রতিটি উপজেলা ইউনিটে সর্বোচ্চ ৩ জন দায়িত্বপ্রাপ্ত উপজেলা এডমিন পরিষদ কাজ পরিচালনা করছেন।
            </p>
          </div>

          <Link
            to="/upazila"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/30"
          >
            <span>সব উপজেলার বিস্তারিত দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid of 6 Upazilas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {keys.map((key) => {
            const info = UPAZILA_INFO[key];
            const assignedAdmins = upazilaAdmins.filter((ua) => ua.upazila === key);
            const memberCount = profiles.filter((p) => p.upazila === key).length;

            return (
              <div
                key={key}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={info.image}
                      alt={info.name_bn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-300 border border-slate-700/80 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {info.name_en}
                    </span>

                    <span className="absolute bottom-3 right-3 bg-emerald-600/90 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1 backdrop-blur-md">
                      <Users className="w-3.5 h-3.5" /> {memberCount} জন সদস্য
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                      {info.name_bn}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {info.description}
                    </p>

                    {/* Upazila Admins status */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> উপজেলা এডমিন (সর্বোচ্চ ৩)
                        </span>
                        <span className="font-mono font-bold text-emerald-400">{assignedAdmins.length}/3 নিযুক্ত</span>
                      </div>

                      {assignedAdmins.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {assignedAdmins.map((adm) => (
                            <div key={adm.id} className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg text-[10px] text-slate-200 border border-slate-800">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span className="truncate max-w-[90px] font-medium">{adm.profile?.full_name_bn || 'এডমিন'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 italic">এখনো এডমিন নির্ধারিত হয়নি</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/members?upazila=${key}`}
                    className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-800 hover:border-emerald-500/40 shadow-sm"
                  >
                    <span>সদস্য তালিকা দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
