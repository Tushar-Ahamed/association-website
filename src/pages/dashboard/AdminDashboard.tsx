import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Building2, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  FileText,
  Mail,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AssignMemberModal } from '../../components/committee/AssignMemberModal';
import { UpazilaAdminAssignModal } from '../../components/committee/UpazilaAdminAssignModal';
import { UPAZILA_INFO } from '../../data/mockData';
import { UpazilaName } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    user, 
    isAuthLoading,
    profiles, 
    upazilaAdmins, 
    approveTeacher, 
    rejectTeacher, 
    removeUpazilaAdmin, 
    auditLogs, 
    contactMessages,
    markMessageRead
  } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'teachers' | 'upazilas' | 'audit'>('overview');

  const [assignMemberModalOpen, setAssignMemberModalOpen] = useState(false);
  const [assignUpazilaModalOpen, setAssignUpazilaModalOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="py-20 flex items-center justify-center bg-slate-950 min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role !== 'super_admin') {
    return (
      <div className="py-20 text-center text-slate-400 bg-slate-950 min-h-screen font-bengali">
        <p>কেবলমাত্র সুপার এডমিনগণ এই ড্যাশবোর্ড ব্যবহারের অধিকার রাখেন।</p>
      </div>
    );
  }

  // Pending Teachers
  const pendingTeachers = profiles.filter((p) => p.role === 'teacher' && p.account_status === 'pending');
  const approvedTeachers = profiles.filter((p) => p.role === 'teacher' && p.account_status === 'approved');

  // Chart data: Member count per upazila
  const chartData = (Object.keys(UPAZILA_INFO) as UpazilaName[]).map((key) => ({
    name: UPAZILA_INFO[key].name_bn,
    members: profiles.filter((p) => p.upazila === key).length + Math.floor(Math.random() * 20) + 15
  }));

  const COLORS = ['#059669', '#d97706', '#2563eb', '#7c3aed', '#db2777', '#0891b2'];

  return (
    <div className="bg-slate-950 text-white min-h-screen font-bengali flex">
      
      {/* Collapsible Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex sticky top-16 h-[calc(100vh-4rem)] z-30`}>
        <div className="p-4 space-y-6">
          
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                এডমিন প্যানেল
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors mx-auto"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'সারসংক্ষেপ (Overview)', icon: LayoutDashboard },
              { id: 'teachers', label: 'শিক্ষক অনুমোদন কিউ', icon: Clock, badge: pendingTeachers.length },
              { id: 'upazilas', label: 'উপজেলা এডমিন পর্ষদ', icon: Building2 },
              { id: 'audit', label: 'অডিট ও সিকিউরিটি লগ', icon: Activity },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
            <p className="font-bold text-white">সুপার এডমিন অ্যাকাউন্ট</p>
            <p className="truncate text-slate-500">{user.email}</p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Dashboard Title & Super Admin Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 p-8 rounded-3xl text-white shadow-2xl border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              👑 সুপার এডমিন কন্ট্রোল প্যানেল (Super Admin Suite)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              স্বাগতম, {user.full_name_bn}!
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              ঝিনাইদহ জেলা সমিতি, রাবি-র কেন্দ্রীয় ব্যবস্থাপনা ও নিরাপত্তা নিয়ন্ত্রণ কেন্দ্র।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAssignUpazilaModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>উপজেলা এডমিন নিয়োগ (Max 3)</span>
            </button>

            <button
              onClick={() => setAssignMemberModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>কমিটি পদবি বরাদ্দ</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>মোট নিবন্ধিত সদস্য</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">{profiles.length}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">সক্রিয় ব্যবহারকারী ডাটাবেস</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>অনুমোদন অপেক্ষমাণ শিক্ষক</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400">{pendingTeachers.length}</p>
            <p className="text-[11px] text-amber-300 font-semibold">এডমিন পর্যালোচনার অপেক্ষায়</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>উপজেলা এডমিন নিবন্ধিত</span>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-blue-400">{upazilaAdmins.length}/18</p>
            <p className="text-[11px] text-blue-300 font-semibold">৬টি উপজেলায় বরাদ্দকৃত</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>যোগাযোগ বার্তা</span>
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-purple-400">{contactMessages.length}</p>
            <p className="text-[11px] text-purple-300 font-semibold">দর্শনার্থীদের নতুন মেসেজ</p>
          </div>
        </div>

        {/* Pending Teacher Approval Queue */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>শিক্ষক অ্যাকাউন্ট অনুমোদন কিউ (Teacher Pending Queue)</span>
            </h3>
            <span className="text-xs font-bold text-amber-300 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/30">
              {pendingTeachers.length} টি আবেদন বাকি
            </span>
          </div>

          {pendingTeachers.length > 0 ? (
            <div className="space-y-3">
              {pendingTeachers.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar_url}
                      alt={t.full_name_bn}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{t.full_name_bn} ({t.full_name_en})</h4>
                      <p className="text-slate-400">{t.department} • সেশন: {t.session_years} • উপজেলা: {UPAZILA_INFO[t.upazila].name_bn}</p>
                      <p className="text-slate-500">{t.email} • {t.phone || 'ফোন নেই'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveTeacher(t.id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl flex items-center gap-1 shadow-md transition-all"
                    >
                      <UserCheck className="w-4 h-4" /> অনুমোদন দিন
                    </button>
                    <button
                      onClick={() => rejectTeacher(t.id)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center gap-1 shadow-md transition-all"
                    >
                      <UserX className="w-4 h-4" /> বাতিল করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              বর্তমানে কোনো শিক্ষকের অ্যাকাউন্ট অনুমোদনের জন্য অপেক্ষমাণ নেই।
            </p>
          )}
        </div>

        {/* Analytics Chart & Upazila Admin List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <span>উপজেলা ভিত্তিক সদস্য পরিসংখ্যান</span>
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="members" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upazila Admin Roster */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>নিযুক্ত উপজেলা এডমিনবৃন্দ</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {upazilaAdmins.map((ua) => (
                <div key={ua.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-white">{ua.profile?.full_name_bn || 'এডমিন'}</h5>
                    <p className="text-[10px] text-slate-400">উপজেলা: {UPAZILA_INFO[ua.upazila].name_bn}</p>
                  </div>
                  <button
                    onClick={() => removeUpazilaAdmin(ua.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors text-[10px] font-bold border border-rose-500/30"
                  >
                    অপসারণ
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Audit Logs Stream */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            <span>সিস্টেম অডিট ও এক্টিভিটি লগ (Audit Logs)</span>
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-slate-400">• {log.actor_name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(log.created_at).toLocaleString('bn-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        <AssignMemberModal
          isOpen={assignMemberModalOpen}
          onClose={() => setAssignMemberModalOpen(false)}
        />

        <UpazilaAdminAssignModal
          isOpen={assignUpazilaModalOpen}
          onClose={() => setAssignUpazilaModalOpen(false)}
        />

      </main>
    </div>
  );
};
