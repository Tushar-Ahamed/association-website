import React, { useState } from 'react';
import { X, LogIn, Mail, Lock, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (forgotPasswordMode) {
      showToast('success', 'পাসওয়ার্ড রিকভারি', 'আপনার ইমেইলে রিসেট লিংক পাঠানো হয়েছে।');
      setForgotPasswordMode(false);
      return;
    }

    const success = await login(email, password);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-white">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 px-6 py-7 text-white relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mb-3">
            <LogIn className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold">
            {forgotPasswordMode ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'ঝিনাইদহ জেলা সমিতিতে প্রবেশ'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {forgotPasswordMode
              ? 'আপনার ইমেইল দিন, পাসওয়ার্ড রিসেট লিংক পাঠানো হবে'
              : 'আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ইমেইল ঠিকানা</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@jhenaidah-ru.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {!forgotPasswordMode && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">পাসওয়ার্ড</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className="text-[11px] text-emerald-400 hover:underline font-medium"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          )}



          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
          >
            {forgotPasswordMode ? (
              <>
                <KeyRound className="w-4 h-4" /> রিসেট লিংক পাঠান
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> লগইন করুন
              </>
            )}
          </button>

          {forgotPasswordMode && (
            <button
              type="button"
              onClick={() => setForgotPasswordMode(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              ← লগইনে ফিরে যান
            </button>
          )}

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            অ্যাকাউন্ট নেই?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-emerald-400 font-bold hover:underline"
            >
              নতুন সদস্য নিবন্ধন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
