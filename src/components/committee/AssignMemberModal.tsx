import React, { useState } from 'react';
import { X, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AssignMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignMemberModal: React.FC<AssignMemberModalProps> = ({ isOpen, onClose }) => {
  const { profiles, committees, assignCommitteeMember } = useAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || '');
  const [positionBn, setPositionBn] = useState('');
  const [positionEn, setPositionEn] = useState('');
  const [rankOrder, setRankOrder] = useState<number>(1);

  if (!isOpen) return null;

  const filteredProfiles = profiles.filter((p) =>
    p.full_name_bn.toLowerCase().includes(search.toLowerCase()) ||
    p.full_name_en.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !positionBn) {
      showToast('warning', 'সতর্কতা', 'দয়া করে সদস্য ও পদবি নিশ্চিত করুন।');
      return;
    }

    const res = assignCommitteeMember(
      selectedCommitteeId,
      selectedUserId,
      positionBn,
      positionEn || positionBn,
      rankOrder
    );

    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 px-6 py-5 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">কমিটি পদবি নির্ধারণ (Role Assignment)</h2>
              <p className="text-xs text-slate-400">নিবন্ধিত শিক্ষার্থী/প্রাক্তনীকে কমিটিতে পদবি দিন</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Target Committee */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">কমিটি নির্বাচন করুন</label>
            <select
              value={selectedCommitteeId}
              onChange={(e) => setSelectedCommitteeId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
            >
              {committees.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title_bn} ({c.level === 'district' ? 'জেলা কমিটি' : `${c.upazila} উপজেলা`})
                </option>
              ))}
            </select>
          </div>

          {/* Search Member */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">সদস্য খুঁজুন ও নির্বাচন করুন *</label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম বা ইমেইল লিখে খুঁজুন..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500"
              />
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1 border border-slate-800 rounded-xl p-1 bg-slate-950">
              {filteredProfiles.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedUserId(p.id)}
                  className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    selectedUserId === p.id ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate">{p.full_name_bn} ({p.department})</p>
                    <p className="text-[10px] opacity-80">{p.email} • {p.upazila}</p>
                  </div>
                  {selectedUserId === p.id && <UserCheck className="w-4 h-4 shrink-0 ml-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Position Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">পদবি (বাংলায়) *</label>
              <input
                type="text"
                required
                value={positionBn}
                onChange={(e) => setPositionBn(e.target.value)}
                placeholder="যেমন: সভাপতি / সাধারণ সম্পাদক"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Position Title (English)</label>
              <input
                type="text"
                value={positionEn}
                onChange={(e) => setPositionEn(e.target.value)}
                placeholder="e.g. President / Secretary"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">ক্রম নম্বর (Rank Order)</label>
            <input
              type="number"
              value={rankOrder}
              onChange={(e) => setRankOrder(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedUserId || !positionBn}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> পদবি সংরক্ষণ ও বরাদ্দ করুন
          </button>
        </form>
      </div>
    </div>
  );
};
