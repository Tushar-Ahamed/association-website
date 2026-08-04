import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { submitContactMessage } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    submitContactMessage(name, email, phone, subject || 'সাধারণ যোগাযোগ', message);
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-amber-400" /> সর্বক্ষণ আপনার সেবায়
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            যোগাযোগ করুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয় সংক্রান্ত যেকোনো তথ্য বা মতামতের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Info Card */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-8 text-white space-y-6 shadow-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white">কার্যালয় সংক্রান্ত তথ্য</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-200">কক্ষ ঠিকানা:</h4>
                  <p className="text-slate-400 leading-relaxed">
                    ঝিনাইদহ জেলা সমিতি রুম, ছাত্র-শিক্ষক মিলনায়তন (টিএসসিসি), রাজশাহী বিশ্ববিদ্যালয় ক্যাম্পাস, রাজশাহী-৬২০৫।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-200">ইমেইল ঠিকানা:</h4>
                  <p className="text-slate-400">contact@jhenaidah-ru.org</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-200">জরুরি হেল্পলাইন:</h4>
                  <p className="text-slate-400">+৮৮০ ১৭০০-০০০০০০ (সভাপতি / সা: সম্পাদক)</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400">
              <p className="font-bold text-amber-400">জরুরি পরামর্শ ও দিকনির্দেশনা:</p>
              <p className="mt-1">নতুন শিক্ষার্থী বন্ধুদের যেকোনো জরুরি প্রয়োজনে সমিতি কক্ষে সরাসরি যোগাযোগ করার জন্য অনুরোধ করা হলো।</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  সমিতি কর্তৃপক্ষ খুব শীঘ্রই আপনার সাথে ইমেইল বা ফোনের মাধ্যমে যোগাযোগ করবে। ধন্যবাদ।
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-lg font-bold text-white mb-2">অনলাইন বার্তা পাঠান</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="নাম লিখুন"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">ইমেইল *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">ফোন নম্বর</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">বিষয় (Subject)</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="বার্তা বিষয়"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">বার্তা বা মন্তব্য *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> বার্তা সাবমিট করুন
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
