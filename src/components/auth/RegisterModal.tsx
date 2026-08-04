import React, { useState } from 'react';
import { X, UserPlus, Mail, Lock, User, GraduationCap, Building2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UpazilaName, UserRole } from '../../types';
import { UPAZILA_INFO } from '../../data/mockData';
import { RU_HALLS, RU_DEPARTMENTS } from '../../data/ruData';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [fullNameBn, setFullNameBn] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [upazila, setUpazila] = useState<UpazilaName>('jhenaidah_sadar');
  const [department, setDepartment] = useState('');
  const [sessionYears, setSessionYears] = useState('2022-2023');
  const [studentId, setStudentId] = useState('');
  const [passingYear, setPassingYear] = useState<string>('');
  const [hallName, setHallName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [occupation, setOccupation] = useState('');

  const [registeredNotice, setRegisteredNotice] = useState<{ isTeacher: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameBn || !email || !department) return;

    const res = register({
      full_name_bn: fullNameBn,
      full_name_en: fullNameEn || fullNameBn,
      email,
      phone,
      role,
      upazila,
      department,
      session_years: sessionYears,
      student_id: studentId,
      passing_year: passingYear ? parseInt(passingYear) : undefined,
      hall_name: hallName,
      blood_group: bloodGroup,
      occupation: occupation || (role === 'teacher' ? 'শিক্ষক' : undefined)
    });

    if (res.success) {
      setRegisteredNotice({
        isTeacher: role === 'teacher',
        message: res.message
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto font-bengali">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-white my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 px-6 py-6 text-white relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">নতুন সদস্য অনলাইন নিবন্ধন</h2>
              <p className="text-xs text-slate-400">ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়</p>
            </div>
          </div>
        </div>

        {registeredNotice ? (
          <div className="p-8 text-center space-y-4">
            {registeredNotice.isTeacher ? (
              <div className="w-16 h-16 bg-amber-950 text-amber-400 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            
            <h3 className="text-lg font-bold text-white">
              {registeredNotice.isTeacher ? 'আবেদন সফলভাবে সংগৃহীত!' : 'নিবন্ধন সফল ও ইমেইল যাচাই সম্পন্ন!'}
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {registeredNotice.message}
            </p>

            <div className="pt-4 flex gap-3 justify-center">
              {!registeredNotice.isTeacher && (
                <button
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  এখনই লগইন করুন
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">আপনার পরিচয় (রোল)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', label: '🎓 শিক্ষার্থী (Student)', desc: 'অনতিবিলম্বে সক্রিয়' },
                  { id: 'alumni', label: '🏛️ প্রাক্তনী (Alumni)', desc: 'অনতিবিলম্বে সক্রিয়' },
                  { id: 'teacher', label: '👨‍🏫 শিক্ষক (Teacher)', desc: 'এডমিন অনুমোদন সাপেক্ষ' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setRole(item.id as UserRole)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === item.id
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 font-bold shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <p className="font-bold text-[11px]">{item.label}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">আপনার পূর্ণ নাম (Full Name) *</label>
              <input
                type="text"
                required
                value={fullNameBn}
                onChange={(e) => {
                  setFullNameBn(e.target.value);
                  setFullNameEn(e.target.value);
                }}
                placeholder=""
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Upazila & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">উপজেলা *</label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value as UpazilaName)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                >
                  {(Object.keys(UPAZILA_INFO) as UpazilaName[]).map((uKey) => (
                    <option key={uKey} value={uKey}>
                      {UPAZILA_INFO[uKey].name_bn} ({UPAZILA_INFO[uKey].name_en})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">বিভাগ / ইনস্টিটিউট *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                >
                  <option value="">বিভাগ সিলেক্ট করুন...</option>
                  {RU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session & Student ID / Passing Year */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">শিক্ষাবর্ষ (Session) *</label>
                <input
                  type="text"
                  required
                  value={sessionYears}
                  onChange={(e) => setSessionYears(e.target.value)}
                  placeholder="2021-2022"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">আইডি / রোল নম্বর</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="যেমন: 21105044"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">রক্তের গ্রুপ</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hall Name & Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">আবাসিক হলের নাম</label>
                <select
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                >
                  <option value="">হল নির্বাচন করুন...</option>
                  {RU_HALLS.map((hall) => (
                    <option key={hall} value={hall}>
                      {hall}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">বর্তমান পেশা / পদবি (যদি থাকে)</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="যেমন: শিক্ষার্থী / শিক্ষক / বিসিএস ক্যাডার"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <UserPlus className="w-4 h-4" /> নিবন্ধন সম্পন্ন করুন
            </button>

            <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
              ইতিমধ্যে অ্যাকাউন্ট রয়েছে?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                লগইন করুন
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
