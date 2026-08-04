import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, ShieldCheck, Plus, Users, Award, Trash2 } from 'lucide-react';
import { UPAZILA_INFO } from '../../data/mockData';
import { AssignMemberModal } from '../../components/committee/AssignMemberModal';

export const UpazilaAdminDashboard: React.FC = () => {
  const { user, isAuthLoading, profiles, committeeMembers, removeCommitteeMember } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="py-20 flex items-center justify-center bg-slate-950 min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role !== 'upazila_admin' && user?.role !== 'super_admin') {
    return (
      <div className="py-20 text-center text-slate-400 bg-slate-950 min-h-screen font-bengali">
        <p>কেবলমাত্র উপজেলা এডমিনগণ এই ড্যাশবোর্ড ব্যবহারের অধিকার রাখেন।</p>
      </div>
    );
  }

  const assignedUpazila = user.upazila;
  const upazilaInfo = UPAZILA_INFO[assignedUpazila];

  // Upazila members
  const upazilaMembers = profiles.filter((p) => p.upazila === assignedUpazila);

  // Upazila Committee Members
  const upazilaCommitteeList = committeeMembers.filter(
    (cm) => cm.profile?.upazila === assignedUpazila
  );

  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 p-8 rounded-3xl text-white shadow-2xl border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              🏢 {upazilaInfo.name_bn} উপজেলা এডমিন প্যানেল
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              স্বাগতম, {user.full_name_bn}!
            </h1>
            <p className="text-xs text-blue-200 mt-1">
              আপনার দায়িত্বপ্রাপ্ত এলাকা: <strong className="text-emerald-400 font-bold">{upazilaInfo.name_bn}</strong> ({upazilaInfo.name_en})
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>উপজেলা কমিটি পদবি প্রদান</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>উপজেলার মোট নিবন্ধিত সদস্য</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">{upazilaMembers.length} জন</p>
            <p className="text-[11px] text-blue-300 font-semibold mt-1">{upazilaInfo.name_bn} উপজেলা</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>উপজেলা কমিটির সদস্য</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-2">{upazilaCommitteeList.length} জন</p>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1">দায়িত্বপ্রাপ্ত কর্মকর্তা</p>
          </div>
        </div>

        {/* Committee list table */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>{upazilaInfo.name_bn} উপজেলা কমিটি সদস্য তালিকা</span>
          </h3>

          {upazilaCommitteeList.length > 0 ? (
            <div className="space-y-2">
              {upazilaCommitteeList.map((cm) => (
                <div key={cm.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-400">{cm.position_bn}</span> — <strong className="text-white">{cm.profile?.full_name_bn}</strong>
                    <p className="text-[10px] text-slate-400">{cm.profile?.department} ({cm.profile?.session_years})</p>
                  </div>

                  <button
                    onClick={() => removeCommitteeMember(cm.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 border border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> পদবি বাতিল
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4">
              আপনার উপজেলায় এখনো কোনো কমিটি পদবি নির্ধারণ করা হয়নি।
            </p>
          )}
        </div>

        <AssignMemberModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

      </div>
    </div>
  );
};
