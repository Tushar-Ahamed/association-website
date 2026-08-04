import React from 'react';
import { UserProfile } from '../../types';
import { UPAZILA_INFO } from '../../data/mockData';
import { Mail, Phone, MapPin, GraduationCap, Building2, CheckCircle2, Facebook, Linkedin } from 'lucide-react';

interface MemberCardProps {
  member: UserProfile;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950';
      case 'teacher': return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white';
      case 'upazila_admin': return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white';
      case 'committee_member': return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white';
      case 'alumni': return 'bg-gradient-to-r from-violet-600 to-purple-600 text-white';
      default: return 'bg-emerald-600 text-white';
    }
  };

  const getRoleLabelBn = (role: string) => {
    switch (role) {
      case 'super_admin': return 'সুপার এডমিন';
      case 'teacher': return 'শিক্ষক';
      case 'upazila_admin': return 'উপজেলা এডমিন';
      case 'committee_member': return 'কমিটি সদস্য';
      case 'alumni': return 'প্রাক্তনী (Alumni)';
      default: return 'শিক্ষার্থী';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group font-bengali">
      <div>
        {/* Top bar with Role badge & verification */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] px-3 py-0.5 rounded-full font-extrabold uppercase shadow-sm ${getRoleBadge(member.role)}`}>
            {getRoleLabelBn(member.role)}
          </span>

          {member.is_verified && (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>

        {/* Profile Avatar & Info */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={member.full_name_bn}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 group-hover:scale-105 transition-transform shrink-0 shadow-lg"
          />
          <div className="min-w-0">
            <h3 className="font-extrabold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
              {member.full_name_bn}
            </h3>
            <p className="text-xs text-slate-400 truncate">{member.full_name_en}</p>
            <p className="text-xs font-semibold text-emerald-400 mt-1 truncate">
              {member.department} ({member.session_years})
            </p>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
          <p className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>উপজেলা: <strong className="text-white">{UPAZILA_INFO[member.upazila || 'jhenaidah_sadar'].name_bn}</strong></span>
          </p>

          <p className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>হল: <strong className="text-white">{member.hall_name || 'সাধারণ সদস্য'}</strong></span>
          </p>

          {member.occupation && (
            <p className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>পেশা: <strong className="text-white">{member.occupation}</strong></span>
            </p>
          )}

          {member.phone && (
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{member.phone}</span>
            </p>
          )}

          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{member.email}</span>
          </p>
        </div>
      </div>

      {/* Footer info: Blood group & Social links */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {member.blood_group ? (
          <span className="px-2.5 py-1 bg-rose-950/80 text-rose-300 font-bold rounded-lg border border-rose-500/30">
            🩸 {member.blood_group}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500">রক্তের গ্রুপ উল্লেখ নেই</span>
        )}

        <div className="flex items-center gap-2 text-slate-400">
          {member.facebook_url && (
            <a href={member.facebook_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
