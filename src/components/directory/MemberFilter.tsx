import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { MemberFilters, UpazilaName } from '../../types';
import { UPAZILA_INFO } from '../../data/mockData';
import { RU_HALLS, RU_DEPARTMENTS } from '../../data/ruData';

interface MemberFilterProps {
  filters: MemberFilters;
  onFilterChange: (newFilters: MemberFilters) => void;
  onReset: () => void;
}

export const MemberFilter: React.FC<MemberFilterProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-xl space-y-4 font-bengali">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>ফিল্টার ও অনুসন্ধান</span>
        </h3>

        <button
          onClick={onReset}
          className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold"
        >
          <RefreshCw className="w-3 h-3" /> রিসেট
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="নাম, বিভাগ, হল বা ইমেইল দিয়ে সদস্য খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        
        {/* Upazila */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">উপজেলা</label>
          <select
            value={filters.upazila || ''}
            onChange={(e) => onFilterChange({ ...filters, upazila: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          >
            <option value="">সব উপজেলা</option>
            {(Object.keys(UPAZILA_INFO) as UpazilaName[]).map((uKey) => (
              <option key={uKey} value={uKey}>
                {UPAZILA_INFO[uKey].name_bn}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">রোল / পদবি</label>
          <select
            value={filters.role || ''}
            onChange={(e) => onFilterChange({ ...filters, role: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          >
            <option value="">সব রোল</option>
            <option value="teacher">শিক্ষক</option>
            <option value="upazila_admin">উপজেলা এডমিন</option>
            <option value="committee_member">কমিটি সদস্য</option>
            <option value="alumni">প্রাক্তনী (Alumni)</option>
            <option value="student">শিক্ষার্থী (Student)</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">বিভাগ</label>
          <select
            value={filters.department || ''}
            onChange={(e) => onFilterChange({ ...filters, department: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          >
            <option value="">সব বিভাগ</option>
            {RU_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Hall Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">আবাসিক হল</label>
          <select
            value={filters.hall || ''}
            onChange={(e) => onFilterChange({ ...filters, hall: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          >
            <option value="">সব হল</option>
            {RU_HALLS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">রক্তের গ্রুপ</label>
          <select
            value={filters.bloodGroup || ''}
            onChange={(e) => onFilterChange({ ...filters, bloodGroup: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          >
            <option value="">সব রক্তের গ্রুপ</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        {/* Session */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">শিক্ষাবর্ষ</label>
          <input
            type="text"
            value={filters.session || ''}
            onChange={(e) => onFilterChange({ ...filters, session: e.target.value || undefined })}
            placeholder="যেমন: 2021-2022"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500"
          />
        </div>

      </div>
    </div>
  );
};
