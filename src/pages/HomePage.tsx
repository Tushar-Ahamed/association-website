import React, { useState } from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { AboutSection } from '../components/public/AboutSection';
import { UpazilaCards } from '../components/public/UpazilaCards';
import { CommitteeShowcase } from '../components/public/CommitteeShowcase';
import { AssignMemberModal } from '../components/committee/AssignMemberModal';
import { Link } from 'react-router-dom';
import { Bell, Calendar, ArrowRight, MessageSquare, Image, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { notices, events, gallery, posts } = useAuth();
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  return (
    <div className="space-y-0 bg-slate-950 text-white font-bengali">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Notice Marquee & Pinned Banner */}
      <div className="bg-slate-900/90 border-y border-slate-800/80 py-3 px-4 text-xs text-white backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 px-3.5 py-1 rounded-full font-bold text-[11px] shrink-0 shadow-md">
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" /> সর্বশেষ নোটিশ:
          </div>
          <div className="flex-1 overflow-hidden font-medium text-slate-200">
            <p className="truncate">
              {notices[0]?.title || 'ঝিনাইদহ জেলা সমিতি রাবি-র অনলাইন পোর্টালে সকলকে স্বাগতম!'} — {notices[0]?.content}
            </p>
          </div>
          <Link to="/notices" className="text-emerald-400 font-bold hover:underline shrink-0 text-[11px] flex items-center gap-1">
            <span>সব নোটিশ দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Upazila Cards Section */}
      <UpazilaCards />

      {/* Committee Showcase Section */}
      <CommitteeShowcase onOpenAssignModal={() => setAssignModalOpen(true)} />

      {/* Recent Events & Social Feed Highlight Grid */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Events Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>আসন্ন ইভেন্ট ও আয়োজন</span>
                </h3>
                <Link to="/events" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  <span>সব ইভেন্ট</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {events.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="glass-card rounded-3xl p-5 border border-slate-800/80 hover:border-emerald-500/40 flex flex-col sm:flex-row gap-4 items-start transition-all">
                    <img
                      src={ev.banner_url}
                      alt={ev.title}
                      className="w-full sm:w-36 h-32 rounded-2xl object-cover shrink-0 ring-1 ring-slate-800"
                    />
                    <div className="space-y-2 flex-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {new Date(ev.event_date).toLocaleDateString('bn-BD')}
                      </span>
                      <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ev.description}</p>
                      <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Feed Highlight Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>সামাজিক ফিড আপডেট</span>
                </h3>
                <Link to="/feed" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  <span>ফিডে প্রবেশ করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {posts.slice(0, 2).map((p) => (
                  <div key={p.id} className="glass-card rounded-3xl p-5 border border-slate-800/80 hover:border-emerald-500/40 space-y-3 transition-all">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={p.author?.full_name_bn}
                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-white">{p.author?.full_name_bn}</h5>
                        <p className="text-[10px] text-slate-400">{p.author?.department}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{p.content}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>👍 {p.reactions?.length || 0} রিয়েকশন</span>
                      <span>💬 {p.comments?.length || 0} কমেন্ট</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <AssignMemberModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
      />

    </div>
  );
};
