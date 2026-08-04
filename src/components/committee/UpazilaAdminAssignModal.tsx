import React, { useState } from 'react';
import { X, Search, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpazilaName } from '../../types';
import { UPAZILA_INFO } from '../../data/mockData';

interface UpazilaAdminAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpazilaAdminAssignModal: React.FC<UpazilaAdminAssignModalProps> = ({ isOpen, onClose }) => {
  const { profiles, upazilaAdmins, assignUpazilaAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [targetUpazila, setTargetUpazila] = useState<UpazilaName>('jhenaidah_sadar');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentUpazilaAdmins = upazilaAdmins.filter((ua) => ua.upazila === targetUpazila);

  const [showAllUpazilas, setShowAllUpazilas] = useState(false);

  const filteredProfiles = profiles.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q ||
      (p.full_name_bn && p.full_name_bn.toLowerCase().includes(q)) ||
      (p.full_name_en && p.full_name_en.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q));

    const matchesUpazila = showAllUpazilas || p.upazila === targetUpazila;
    return matchesSearch && matchesUpazila;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedUserId) return;

    const res = assignUpazilaAdmin(selectedUserId, targetUpazila);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 px-6 py-5 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">উপজেলা এডমিন নিয়োগ (Super Admin Only)</h2>
              <p className="text-xs text-slate-400">প্রতিটি উপজেলায় সর্বোচ্চ ৩ জন এডমিন নিয়োগের নিয়ম কার্যকর</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">উপজেলা নির্বাচন করুন</label>
            <select
              value={targetUpazila}
              onChange={(e) => {
                setTargetUpazila(e.target.value as UpazilaName);
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
            >
              {(Object.keys(UPAZILA_INFO) as UpazilaName[]).map((uKey) => (
                <option key={uKey} value={uKey}>
                  {UPAZILA_INFO[uKey].name_bn} ({UPAZILA_INFO[uKey].name_en})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              বর্তমান নিযুক্ত এডমিন সংখ্যা: <strong className="text-emerald-400 font-mono">{currentUpazilaAdmins.length}/3</strong>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300">সদস্য খুঁজুন *</label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-amber-400 font-semibold">
                <input
                  type="checkbox"
                  checked={showAllUpazilas}
                  onChange={(e) => setShowAllUpazilas(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                <span>সকল উপজেলার সদস্য খুঁজুন</span>
              </label>
            </div>
            
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, বিভাগ, ইমেইল বা ফোন নম্বর লিখুন..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500"
              />
            </div>

            <div className="max-h-44 overflow-y-auto space-y-1.5 border border-slate-800 rounded-xl p-1.5 bg-slate-950">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedUserId(p.id)}
                    className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                      selectedUserId === p.id 
                        ? 'bg-amber-600 text-white font-bold shadow-md' 
                        : 'hover:bg-slate-800/80 text-slate-300 border border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={p.full_name_bn}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-amber-400/40"
                      />
                      <div className="truncate">
                        <p className="truncate font-semibold text-xs">{p.full_name_bn} ({p.department})</p>
                        <p className="text-[10px] opacity-80 truncate">{p.email} • {UPAZILA_INFO[p.upazila]?.name_bn || p.upazila}</p>
                      </div>
                    </div>
                    {selectedUserId === p.id && <UserCheck className="w-4 h-4 shrink-0 ml-2 text-white" />}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 space-y-1">
                  <p className="font-semibold text-xs text-amber-300">কোনো সদস্য পাওয়া যায়নি</p>
                  <p className="text-[10px] text-slate-500">
                    তালিকায় সদস্য দেখতে উপরে <strong>"সকল উপজেলার সদস্য খুঁজুন"</strong> টিক দিন অথবা নাম/ইমেইল নিশ্চিত করুন।
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedUserId || currentUpazilaAdmins.length >= 3}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> উপজেলা এডমিন হিসেবে নিশ্চিত করুন
          </button>
        </form>
      </div>
    </div>
  );
};
