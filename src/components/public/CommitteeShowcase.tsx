import React, { useState } from 'react';
import { ShieldCheck, User, Phone, Mail, Award, Plus, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpazilaName } from '../../types';
import { UPAZILA_INFO } from '../../data/mockData';

interface CommitteeShowcaseProps {
  onOpenAssignModal?: () => void;
}

export const CommitteeShowcase: React.FC<CommitteeShowcaseProps> = ({ onOpenAssignModal }) => {
  const { user, committees, committeeMembers } = useAuth();
  const [activeTab, setActiveTab] = useState<'district' | UpazilaName>('district');

  const isSuperAdmin = user?.role === 'super_admin';
  const isUpazilaAdmin = user?.role === 'upazila_admin';

  const currentMembers = committeeMembers.filter((cm) => {
    if (activeTab === 'district') {
      return !cm.committee_id || cm.committee_id === 'comm-district-2025';
    } else {
      return cm.profile?.upazila === activeTab;
    }
  });

  return (
    <section className="py-20 bg-slate-950 text-white relative font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-slate-900 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> কার্যনির্বাহী পরিষদ
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ঝিনাইদহ জেলা সমিতি কমিটি সেশন ২০২৫-২০২৬
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              জেলা কেন্দ্রীয় পর্ষদ ও উপজেলা ইউনিটসমূহের দায়িত্বপ্রাপ্ত সকল কর্মকর্তা
            </p>
          </div>

          {/* Super Admin or Upazila Admin Assign Button */}
          {(isSuperAdmin || isUpazilaAdmin) && onOpenAssignModal && (
            <button
              onClick={onOpenAssignModal}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>কমিটি পদবি বরাদ্দ করুন</span>
            </button>
          )}
        </div>

        {/* Committee Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveTab('district')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'district'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>জেলা কার্যনির্বাহী কমিটি</span>
          </button>

          {(Object.keys(UPAZILA_INFO) as UpazilaName[]).map((uKey) => (
            <button
              key={uKey}
              onClick={() => setActiveTab(uKey)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === uKey
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{UPAZILA_INFO[uKey].name_bn} কমিটি</span>
            </button>
          ))}
        </div>

        {/* Member Grid */}
        {currentMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMembers.map((cm) => {
              const prof = cm.profile;
              return (
                <div
                  key={cm.id}
                  className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
                >
                  {/* Executive Position Badge */}
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 px-4 py-1 rounded-bl-2xl text-xs font-black shadow-md">
                    {cm.position_bn}
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={prof?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={prof?.full_name_bn}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="pr-16">
                        <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">
                          {prof?.full_name_bn}
                        </h3>
                        <p className="text-xs text-slate-400">{prof?.full_name_en}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-medium">
                          {prof?.department} ({prof?.session_years})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                      <p className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>হল: <strong className="text-white">{prof?.hall_name || 'নির্ধারিত নয়'}</strong></span>
                      </p>
                      {prof?.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{prof.phone}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{prof?.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">উপজেলা: {UPAZILA_INFO[prof?.upazila || 'jhenaidah_sadar'].name_bn}</span>
                    {prof?.blood_group && (
                      <span className="px-2 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold rounded-lg">
                        🩸 {prof.blood_group}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-slate-800 max-w-lg mx-auto">
            <User className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">কমিটি পদবি ফাঁকা আছে</h3>
            <p className="text-xs text-slate-400 mt-1">
              এই ইউনিটে এখনো কোনো পদবি বরাদ্দ করা হয়নি। সুপার এডমিন বা উপজেলা এডমিন হিসেবে পদবি যুক্ত করুন।
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
