import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Image, 
  Calendar, 
  Bell, 
  Mail, 
  MessageSquare, 
  Home, 
  Info, 
  MapPin, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profiles, logout, switchRoleDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'হোম', path: '/', icon: Home },
    { name: 'পরিচিতি', path: '/about', icon: Info },
    { name: 'কমিটি', path: '/committee', icon: ShieldCheck },
    { name: 'উপজেলা', path: '/upazila', icon: Building2 },
    { name: 'সদস্য ডিরেক্টরি', path: '/members', icon: Users },
    { name: 'সামাজিক ফিড', path: '/feed', icon: MessageSquare },
    { name: 'গ্যালারি', path: '/gallery', icon: Image },
    { name: 'আয়োজন', path: '/events', icon: Calendar },
    { name: 'নোটিশ', path: '/notices', icon: Bell },
    { name: 'যোগাযোগ', path: '/contact', icon: Mail },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin':
        return '/dashboard/admin';
      case 'teacher':
        return '/dashboard/teacher';
      case 'upazila_admin':
        return '/dashboard/upazila';
      case 'alumni':
        return '/dashboard/alumni';
      case 'student':
      case 'committee_member':
      default:
        return '/dashboard/student';
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-900/50';
      case 'teacher': return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-900/50';
      case 'upazila_admin': return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm shadow-blue-900/50';
      case 'committee_member': return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-900/50';
      case 'alumni': return 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm shadow-violet-900/50';
      case 'student': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm shadow-emerald-900/50';
      default: return 'bg-slate-700 text-slate-200';
    }
  };

  const getRoleNameBn = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'সুপার এডমিন';
      case 'teacher': return 'শিক্ষক';
      case 'upazila_admin': return 'উপজেলা এডমিন';
      case 'committee_member': return 'কমিটি সদস্য';
      case 'alumni': return 'প্রাক্তন শিক্ষার্থী';
      case 'student': return 'বর্তমান শিক্ষার্থী';
      default: return 'দর্শনার্থী (Logged Out)';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-2xl transition-all">
      {/* Top Banner Notice / Role Quick Selector */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-900 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/60 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold border border-amber-500/20 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> রাজশাহী বিশ্ববিদ্যালয়
          </span>
          <span className="hidden md:inline text-slate-300 text-[11px] font-medium">
            ঝিনাইদহ জেলা সমিতি • ঐক্য, শিক্ষা ও অগ্রগতি
          </span>
        </div>

        {/* Quick Header Auth Status */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-300 font-semibold hidden sm:inline">
                লগইন আছেন: <strong className="text-emerald-400">{user.full_name_bn}</strong> ({getRoleNameBn(user.role)})
              </span>
              <button
                onClick={logout}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>লগআউট</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                <span>লগইন করুন</span>
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={onOpenRegister}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>রেজিস্ট্রেশন</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-xl font-bengali">
                ঝ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg text-white leading-tight tracking-tight group-hover:text-emerald-400 transition-colors font-bengali">
                  ঝিনাইদহ জেলা সমিতি
                </h1>
              </div>
              <p className="text-[11px] text-emerald-400/90 font-medium tracking-wide flex items-center gap-1 font-bengali">
                <GraduationCap className="w-3 h-3 inline text-amber-400" /> রাজশাহী বিশ্ববিদ্যালয়
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span className="font-bengali">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: User Profile / Auth (Visible on both Mobile & Desktop) */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 pl-2 pr-3 py-1.5 rounded-2xl transition-all shadow-md"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.full_name_bn}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/60 shadow"
                  />
                  <div className="text-left text-xs max-w-[100px] sm:max-w-[120px] truncate hidden sm:block">
                    <p className="font-bold text-slate-100 truncate font-bengali">{user.full_name_bn}</p>
                    <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${getRoleBadgeColor(user.role)}`}>
                      {getRoleNameBn(user.role)}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-950/50 rounded-xl mb-1">
                      <p className="text-xs font-bold text-white truncate font-bengali">{user.full_name_bn}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${getRoleBadgeColor(user.role)}`}>
                        {getRoleNameBn(user.role)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        navigate(getDashboardPath());
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-emerald-950/70 hover:text-emerald-300 flex items-center gap-2.5 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      <span>আমার ড্যাশবোর্ড</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-all"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>আমার প্রোফাইল</span>
                    </button>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 flex items-center gap-2.5 transition-colors border border-rose-500/30"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>লগআউট করুন (Log Out)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5 transition-all border border-slate-700/80"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>লগইন</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/60"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">রেজিস্টার</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-900 border border-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="font-bengali">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate(getDashboardPath());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-bengali">আমার ড্যাশবোর্ডে প্রবেশ করুন</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-950/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-rose-500/40"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>লগআউট করুন (Log Out)</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" /> লগইন
                </button>
                <button
                  onClick={() => {
                    onOpenRegister();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50"
                >
                  <UserPlus className="w-4 h-4" /> রেজিস্টার
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
