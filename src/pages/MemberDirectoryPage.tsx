import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MemberFilter } from '../components/directory/MemberFilter';
import { MemberCard } from '../components/directory/MemberCard';
import { MemberFilters } from '../types';
import { Users, Sparkles } from 'lucide-react';

export const MemberDirectoryPage: React.FC = () => {
  const { user, profiles } = useAuth();
  const [searchParams] = useSearchParams();

  const initialUpazila = searchParams.get('upazila') || undefined;

  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    upazila: initialUpazila,
  });

  const visibleProfiles = useMemo(() => {
    // Hide super_admin accounts from public member directory
    return profiles.filter((p) => p.role !== 'super_admin');
  }, [profiles]);

  const filteredMembers = useMemo(() => {
    return visibleProfiles.filter((m) => {
      // Search text
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = m.full_name_bn.toLowerCase().includes(query) || m.full_name_en.toLowerCase().includes(query);
        const matchesDept = m.department.toLowerCase().includes(query);
        const matchesEmail = m.email.toLowerCase().includes(query);
        const matchesHall = m.hall_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesDept && !matchesEmail && !matchesHall) return false;
      }

      // Upazila
      if (filters.upazila && m.upazila !== filters.upazila) return false;

      // Role
      if (filters.role && m.role !== filters.role) return false;

      // Blood Group
      if (filters.bloodGroup && m.blood_group !== filters.bloodGroup) return false;

      // Session
      if (filters.session && !m.session_years.includes(filters.session)) return false;

      return true;
    });
  }, [visibleProfiles, filters]);

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-amber-400" /> সর্বমোট {profiles.length} জন নিবন্ধিত সদস্য
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            সদস্য ডিরেক্টরি ও অনুসন্ধান পোর্টাল
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ঝিনাইদহ জেলার অন্তর্গত ৬টি উপজেলার শিক্ষক, কর্মকর্তা, বর্তমান ও প্রাক্তন শিক্ষার্থীদের তথ্য খুঁজুন।
          </p>
        </div>

        {/* Filter component */}
        <MemberFilter
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters({ search: '' })}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-medium">
          <span>ফলাফল: <strong className="text-emerald-400 font-bold">{filteredMembers.length}</strong> জন সদস্য পাওয়া গেছে</span>
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-slate-800 max-w-md mx-auto">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">কোনো সদস্য পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400 mt-1">
              আপনার ফিল্টার মান পরিবর্তন করে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
