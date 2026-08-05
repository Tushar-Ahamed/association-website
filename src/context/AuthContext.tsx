import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  Committee, 
  CommitteeMember, 
  UpazilaAdminAssignment, 
  Post, 
  Notice, 
  EventItem, 
  GalleryItem, 
  AuditLog, 
  ContactMessage, 
  UpazilaName
} from '../types';
import { 
  INITIAL_PROFILES, 
  INITIAL_COMMITTEES, 
  INITIAL_COMMITTEE_MEMBERS, 
  INITIAL_UPAZILA_ADMIN_ASSIGNMENTS, 
  INITIAL_POSTS, 
  INITIAL_NOTICES, 
  INITIAL_EVENTS, 
  INITIAL_GALLERY, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_CONTACT_MESSAGES 
} from '../data/mockData';
import { useToast } from './ToastContext';
import { 
  supabase, 
  isSupabaseConfigured,
  dbFetchProfiles,
  dbFetchCommittees,
  dbFetchCommitteeMembers,
  dbFetchUpazilaAdmins,
  dbFetchPosts,
  dbFetchNotices,
  dbFetchEvents,
  dbFetchGallery,
  dbFetchContactMessages,
  dbFetchAuditLogs
} from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthLoading: boolean;
  profiles: UserProfile[];
  committees: Committee[];
  committeeMembers: CommitteeMember[];
  upazilaAdmins: UpazilaAdminAssignment[];
  posts: Post[];
  notices: Notice[];
  events: EventItem[];
  gallery: GalleryItem[];
  auditLogs: AuditLog[];
  contactMessages: ContactMessage[];
  
  // Auth actions
  login: (email: string, password?: string) => Promise<boolean>;
  register: (profileData: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRoleDemo: (profileId: string) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  
  // Admin & Committee management
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string) => void;
  assignUpazilaAdmin: (userId: string, upazila: UpazilaName) => { success: boolean; message: string };
  removeUpazilaAdmin: (assignmentId: string) => void;
  assignCommitteeMember: (committeeId: string, userId: string, positionBn: string, positionEn: string, rankOrder?: number) => { success: boolean; message: string };
  removeCommitteeMember: (memberId: string) => void;
  
  // Social Feed actions
  createPost: (content: string, images?: string[]) => void;
  toggleReaction: (postId: string, reaction: 'like' | 'love' | 'congrats' | 'support') => void;
  addComment: (postId: string, content: string) => void;
  
  // Gallery & Notices & Events & Contact
  addGalleryItem: (title: string, imageUrl: string, category: string) => void;
  deleteGalleryItem: (itemId: string) => void;
  createNotice: (title: string, content: string, category: any, fileUrl?: string, isPinned?: boolean) => void;
  deleteNotice: (noticeId: string) => void;
  createEvent: (title: string, description: string, date: string, location: string, bannerUrl?: string) => void;
  deleteEvent: (eventId: string) => void;
  submitContactMessage: (name: string, email: string, phone: string, subject: string, message: string) => void;
  markMessageRead: (messageId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Primary state initialized from LocalStorage (for offline cache), updated asynchronously from Supabase
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('jzs_profiles');
    if (!saved) return INITIAL_PROFILES;
    try {
      const parsed: UserProfile[] = JSON.parse(saved);
      const merged = [...parsed];
      INITIAL_PROFILES.forEach((initP) => {
        if (!merged.some((p) => p.email.trim().toLowerCase() === initP.email.trim().toLowerCase())) {
          merged.unshift(initP);
        }
      });
      return merged;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const cachedUser = localStorage.getItem('jzs_current_user_data');
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }
      const savedId = localStorage.getItem('jzs_current_user_id');
      if (!savedId || savedId === 'visitor') return null;
      return INITIAL_PROFILES.find((p) => p.id === savedId) || null;
    } catch {
      return null;
    }
  });

  const [committees, setCommittees] = useState<Committee[]>(() => {
    const saved = localStorage.getItem('jzs_committees');
    return saved ? JSON.parse(saved) : INITIAL_COMMITTEES;
  });

  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem('jzs_committee_members');
    return saved ? JSON.parse(saved) : INITIAL_COMMITTEE_MEMBERS;
  });

  const [upazilaAdmins, setUpazilaAdmins] = useState<UpazilaAdminAssignment[]>(() => {
    const saved = localStorage.getItem('jzs_upazila_admins');
    return saved ? JSON.parse(saved) : INITIAL_UPAZILA_ADMIN_ASSIGNMENTS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('jzs_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('jzs_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('jzs_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('jzs_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('jzs_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('jzs_contact_messages');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_MESSAGES;
  });

  // Async load & sync from Supabase when configured
  useEffect(() => {
    let isMounted = true;
    async function syncFromSupabase() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const [dbProf, dbComm, dbCommMem, dbUpAdmin, dbPost, dbNot, dbEv, dbGal, dbCont, dbLog] = await Promise.all([
          dbFetchProfiles(),
          dbFetchCommittees(),
          dbFetchCommitteeMembers(),
          dbFetchUpazilaAdmins(),
          dbFetchPosts(),
          dbFetchNotices(),
          dbFetchEvents(),
          dbFetchGallery(),
          dbFetchContactMessages(),
          dbFetchAuditLogs()
        ]);

        if (!isMounted) return;

        if (dbProf && dbProf.length > 0) {
          setProfiles(() => {
            const merged = [...(dbProf as UserProfile[])];
            INITIAL_PROFILES.forEach((initP) => {
              if (!merged.some((p) => p.email.trim().toLowerCase() === initP.email.trim().toLowerCase())) {
                merged.push(initP);
              }
            });
            return merged;
          });
        }
        if (dbComm && dbComm.length > 0) setCommittees(dbComm as Committee[]);
        if (dbCommMem) setCommitteeMembers(dbCommMem as CommitteeMember[]);
        if (dbUpAdmin) setUpazilaAdmins(dbUpAdmin as UpazilaAdminAssignment[]);
        if (dbPost && dbPost.length > 0) setPosts(dbPost as Post[]);
        if (dbNot && dbNot.length > 0) setNotices(dbNot as Notice[]);
        if (dbEv && dbEv.length > 0) setEvents(dbEv as EventItem[]);
        if (dbGal) setGallery(dbGal as GalleryItem[]);
        if (dbCont) setContactMessages(dbCont as ContactMessage[]);
        if (dbLog && dbLog.length > 0) setAuditLogs(dbLog as AuditLog[]);
      } catch (err) {
        console.error('Supabase initial fetch warning:', err);
      }
    }
    syncFromSupabase();
    return () => { isMounted = false; };
  }, []);

  // Helper to resolve or construct a valid UserProfile for any authenticated user
  const resolveUserProfile = async (authUser: any): Promise<UserProfile | null> => {
    if (!authUser) return null;
    const userEmail = (authUser.email || '').toLowerCase();
    const userId = authUser.id;

    // 1. Search in current profiles list
    let found = profiles.find((p) => p.id === userId || p.email.toLowerCase() === userEmail);
    if (found) return found;

    // 2. Search in INITIAL_PROFILES
    found = INITIAL_PROFILES.find((p) => p.id === userId || p.email.toLowerCase() === userEmail);
    if (found) return found;

    // 3. Query Supabase profiles table
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProf } = await supabase
          .from('profiles')
          .select('*')
          .or(`id.eq.${userId},email.eq.${userEmail}`)
          .maybeSingle();

        if (dbProf) {
          const profile = dbProf as UserProfile;
          setProfiles((prev) => {
            if (prev.some((p) => p.id === profile.id)) return prev;
            return [profile, ...prev];
          });
          return profile;
        }
      } catch (err) {
        console.warn('⚠️ [Auth Debug] Error fetching profile from Supabase table:', err);
      }
    }

    // 4. Fallback profile from authUser metadata
    const metadata = authUser.user_metadata || {};
    const fallbackProfile: UserProfile = {
      id: userId,
      email: userEmail,
      full_name_bn: metadata.full_name_bn || metadata.full_name || 'নিবন্ধিত সদস্য',
      full_name_en: metadata.full_name_en || 'Registered Member',
      phone: metadata.phone || '',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userEmail || 'User')}`,
      role: metadata.role || 'student',
      account_status: 'approved',
      upazila: metadata.upazila || 'jhenaidah_sadar',
      department: metadata.department || 'সাধারণ',
      session_years: metadata.session_years || '2023-2024',
      is_verified: true,
      created_at: authUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProfiles((prev) => [fallbackProfile, ...prev]);
    return fallbackProfile;
  };

  // Supabase Auth session restoration and state synchronization listener
  useEffect(() => {
    let isMounted = true;

    const initializeAuthSession = async () => {
      console.log('🔍 [Auth Debug] Starting initializeAuthSession()...');
      let activeUser: UserProfile | null = null;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
          console.log('🔑 [Auth Debug] getSession() result:', { session, error: sessionErr });

          const sbAuthTokens = Object.keys(localStorage).filter(
            (k) => k.startsWith('sb-') || k.includes('auth-token')
          );
          console.log('📦 [Auth Debug] LocalStorage Supabase Auth tokens present:', sbAuthTokens);

          if (session?.user && isMounted) {
            activeUser = await resolveUserProfile(session.user);
            console.log('✅ [Auth Debug] Session successfully restored from Supabase Auth:', activeUser?.email);
          }
        } catch (error) {
          console.warn('⚠️ [Auth Debug] Error during getSession():', error);
        }
      }

      // Fallback: Restore cached user from LocalStorage if no Supabase session returned
      if (!activeUser && isMounted) {
        try {
          const cachedUserJson = localStorage.getItem('jzs_current_user_data');
          if (cachedUserJson) {
            activeUser = JSON.parse(cachedUserJson);
            console.log('✅ [Auth Debug] Session restored from LocalStorage cached user:', activeUser?.email);
          } else {
            const savedId = localStorage.getItem('jzs_current_user_id');
            if (savedId && savedId !== 'visitor') {
              const found = INITIAL_PROFILES.find((p) => p.id === savedId);
              if (found) {
                activeUser = found;
                console.log('✅ [Auth Debug] Session restored from initial profiles ID:', activeUser?.email);
              }
            }
          }
        } catch (e) {
          console.warn('⚠️ [Auth Debug] Error parsing cached user data:', e);
        }
      }

      if (isMounted) {
        if (activeUser) {
          setCurrentUser(activeUser);
          localStorage.setItem('jzs_current_user_id', activeUser.id);
          localStorage.setItem('jzs_current_user_data', JSON.stringify(activeUser));
        }
        setIsAuthLoading(false);
        console.log('🎉 [Auth Debug] initializeAuthSession() completed. Final user state:', activeUser?.email || 'Guest / Unauthenticated');
      }
    };

    initializeAuthSession();

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
        console.log(`⚡ [Auth Debug] onAuthStateChange event received: "${event}"`, session);

        if (!isMounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          if (session?.user) {
            const resolvedUser = await resolveUserProfile(session.user);
            if (resolvedUser && isMounted) {
              console.log(`✅ [Auth Debug] User state synchronized on "${event}":`, resolvedUser.email);
              setCurrentUser(resolvedUser);
              localStorage.setItem('jzs_current_user_id', resolvedUser.id);
              localStorage.setItem('jzs_current_user_data', JSON.stringify(resolvedUser));
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 [Auth Debug] SIGNED_OUT event triggered. Clearing auth state.');
          setCurrentUser(null);
          localStorage.removeItem('jzs_current_user_id');
          localStorage.removeItem('jzs_current_user_data');
        }
      });

      return () => {
        isMounted = false;
        authListener?.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync profiles to local storage cache
  useEffect(() => {
    localStorage.setItem('jzs_profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Sync currentUser to local storage cache (never clear here; clearing only happens in explicit logout)
  useEffect(() => {
    if (isAuthLoading) return;
    if (currentUser) {
      localStorage.setItem('jzs_current_user_id', currentUser.id);
      localStorage.setItem('jzs_current_user_data', JSON.stringify(currentUser));
    }
  }, [currentUser, isAuthLoading]);

  useEffect(() => {
    localStorage.setItem('jzs_committees', JSON.stringify(committees));
  }, [committees]);

  useEffect(() => {
    localStorage.setItem('jzs_committee_members', JSON.stringify(committeeMembers));
  }, [committeeMembers]);

  useEffect(() => {
    localStorage.setItem('jzs_upazila_admins', JSON.stringify(upazilaAdmins));
  }, [upazilaAdmins]);

  useEffect(() => {
    localStorage.setItem('jzs_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('jzs_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('jzs_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('jzs_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('jzs_contact_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  const addAuditLog = (action: string, details?: any) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      actor_id: currentUser?.id,
      actor_name: currentUser?.full_name_bn || 'সিস্টেম',
      action,
      details,
      ip_address: '103.112.44.12',
      created_at: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('audit_logs').insert([newLog]).then();
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (authErr) {
          console.warn('Supabase signInWithPassword error:', authErr.message);
          showToast('error', 'লগইন ব্যর্থ', authErr.message === 'Invalid login credentials' ? 'ভুল ইমেইল বা পাসওয়ার্ড!' : authErr.message);
          return false;
        }
      } catch (err: any) {
        console.warn('Supabase auth exception:', err);
        showToast('error', 'লগইন ত্রুটি', err?.message || 'লগইন করার সময় একটি সমস্যা হয়েছে।');
        return false;
      }
    }

    let found = profiles.find((p) => p.email.trim().toLowerCase() === cleanEmail);

    if (!found && isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('email', cleanEmail).maybeSingle();
        if (data) {
          found = data as UserProfile;
          setProfiles((prev) => [found!, ...prev]);
        }
      } catch (err) {
        console.error('Error querying profile from Supabase on login:', err);
      }
    }
    
    if (!found) {
      found = INITIAL_PROFILES.find((p) => p.email.trim().toLowerCase() === cleanEmail);
      if (found) {
        setProfiles((prev) => [found!, ...prev]);
      }
    }

    if (!found) {
      showToast('error', 'লগইন ব্যর্থ', 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।');
      return false;
    }
    if (found.account_status === 'pending') {
      showToast('warning', 'অনুমোদন অপেক্ষমাণ', 'আপনার শিক্ষক অ্যাকাউন্টটি সুপার এডমিনের অনুমোদনের অপেক্ষায় আছে।');
      return false;
    }
    setCurrentUser(found);
    localStorage.setItem('jzs_current_user_id', found.id);
    localStorage.setItem('jzs_current_user_data', JSON.stringify(found));
    showToast('success', 'স্বাগতম!', `${found.full_name_bn} হিসেবে সফলভাবে লগইন করেছেন।`);
    addAuditLog('USER_LOGIN', { user_id: found.id, email: found.email });
    return true;
  };

  const register = async (profileData: Partial<UserProfile> & { password?: string }): Promise<{ success: boolean; message: string }> => {
    const emailLower = (profileData.email || '').trim().toLowerCase();

    const existing = profiles.find((p) => p.email?.trim().toLowerCase() === emailLower);
    if (existing) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত আছে।' };
    }

    const isSuperAdminEmail = 
      emailLower === 'admin1@jhenaidah-ru.org' || 
      emailLower === 'admin2@jhenaidah-ru.org' || 
      emailLower === 'admin3@jhenaidah-ru.org' || 
      emailLower === 'admin@jhenaidah-ru.org' ||
      (emailLower.startsWith('admin') && emailLower.endsWith('@jhenaidah-ru.org'));

    const isTeacher = profileData.role === 'teacher';
    const assignedRole = isSuperAdminEmail ? 'super_admin' : (profileData.role || 'student');
    const assignedStatus = isSuperAdminEmail ? 'approved' : (isTeacher ? 'pending' : 'approved');

    let generatedId = isSuperAdminEmail ? `super-admin-${Date.now()}` : 'user-' + Date.now();

    // Supabase Auth Integration
    if (isSupabaseConfigured && supabase) {
      const userPassword = profileData.password || 'Password123!';
      
      console.log('🔄 [Supabase Debug] Executing supabase.auth.signUp() for:', emailLower);

      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailLower,
        password: userPassword,
        options: {
          data: {
            full_name_bn: profileData.full_name_bn || 'নতুন ব্যবহারকারী',
            full_name_en: profileData.full_name_en || profileData.full_name_bn || 'New User',
            role: assignedRole,
            account_status: assignedStatus,
            upazila: profileData.upazila || 'jhenaidah_sadar',
            department: profileData.department || 'সাধারণ',
            session_years: profileData.session_years || '2023-2024',
            phone: profileData.phone || '',
            student_id: profileData.student_id || '',
            hall_name: profileData.hall_name || '',
            blood_group: profileData.blood_group || '',
            occupation: isSuperAdminEmail ? 'সেন্ট্রাল এডমিন' : (profileData.occupation || '')
          }
        }
      });

      console.log('📌 [Supabase Debug] signUp() complete result:', {
        'data.user': authData?.user,
        'data.session': authData?.session,
        'error': authError
      });

      if (authError) {
        console.error('❌ [Supabase Auth Error]:', authError);
        const errMsg = authError.message || authError.name || 'Supabase Auth Error';
        showToast('error', 'নিবন্ধন ব্যর্থ (Supabase Auth)', errMsg);
        return { success: false, message: `Supabase Auth error: ${errMsg}` };
      }

      if (!authData.user || !authData.user.id) {
        console.error('❌ [Supabase Auth Error] No user returned. authData:', authData);
        showToast('error', 'নিবন্ধন ব্যর্থ', 'Supabase ব্যবহারকারী তৈরি করতে ব্যর্থ হয়েছে।');
        return { success: false, message: 'Supabase Auth did not return a valid user.' };
      }

      generatedId = authData.user.id;

      // 2. Construct profile representation for local React state
      const newProfile: UserProfile = {
        id: generatedId,
        email: emailLower,
        full_name_bn: profileData.full_name_bn || 'নতুন ব্যবহারকারী',
        full_name_en: profileData.full_name_en || profileData.full_name_bn || 'New User',
        phone: profileData.phone || '',
        avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.full_name_en || 'User')}`,
        role: assignedRole,
        account_status: assignedStatus,
        upazila: profileData.upazila || 'jhenaidah_sadar',
        department: profileData.department || 'সাধারণ',
        session_years: profileData.session_years || '2023-2024',
        passing_year: profileData.passing_year,
        student_id: profileData.student_id,
        hall_name: profileData.hall_name,
        blood_group: profileData.blood_group,
        occupation: isSuperAdminEmail ? 'সেন্ট্রাল এডমিন' : profileData.occupation,
        organization: profileData.organization,
        bio: profileData.bio,
        facebook_url: profileData.facebook_url,
        linkedin_url: profileData.linkedin_url,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('✅ Supabase Auth user created successfully. DB trigger handle_new_user() creates profile row for:', newProfile.email);

      setProfiles((prev) => [newProfile, ...prev.filter((p) => p.id !== newProfile.id)]);

      if (assignedStatus === 'approved') {
        if (authData.session) {
          setCurrentUser(newProfile);
        }
        showToast(
          'success', 
          isSuperAdminEmail ? 'সুপার এডমিন অ্যাকাউন্ট সক্রিয়' : 'নিবন্ধন আবেদন সফল', 
          isSuperAdminEmail 
            ? 'আপনি সেন্ট্রাল সুপার এডমিন হিসেবে নিবন্ধিত হয়েছেন।' 
            : 'আপনার অ্যাকাউন্ট তৈরি হয়েছে। আপনার ইমেইল ইনবক্সে পাঠানো যাচাইকরণ লিঙ্কে ক্লিক করুন।'
        );
      } else {
        showToast('info', 'নিবন্ধন গৃহীত হয়েছে', 'শিক্ষক অ্যাকাউন্টের জন্য আপনার আবেদন সুপার এডমিনের অনুমোদনের অপেক্ষায় রয়েছে।');
      }

      addAuditLog('USER_REGISTER', { email: newProfile.email, role: newProfile.role, status: newProfile.account_status });

      return { 
        success: true, 
        message: isTeacher 
          ? 'নিবন্ধন সম্পন্ন হয়েছে! শিক্ষক হিসেবে আপনার অ্যাকাউন্টটি এডমিন অনুমোদনের পর সক্রিয় হবে।' 
          : 'সফলভাবে নিবন্ধিত এবং ইমেইল নিশ্চিতকরণ পাঠানো হয়েছে। অনুগ্রহ করে ইমেইল ইনবক্স চেক করুন।' 
      };
    }

    // Offline / Unconfigured fallback only when Supabase is not available
    const fallbackProfile: UserProfile = {
      id: generatedId,
      email: emailLower,
      full_name_bn: profileData.full_name_bn || 'নতুন ব্যবহারকারী',
      full_name_en: profileData.full_name_en || profileData.full_name_bn || 'New User',
      phone: profileData.phone || '',
      avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.full_name_en || 'User')}`,
      role: assignedRole,
      account_status: assignedStatus,
      upazila: profileData.upazila || 'jhenaidah_sadar',
      department: profileData.department || 'সাধারণ',
      session_years: profileData.session_years || '2023-2024',
      passing_year: profileData.passing_year,
      student_id: profileData.student_id,
      hall_name: profileData.hall_name,
      blood_group: profileData.blood_group,
      occupation: isSuperAdminEmail ? 'সেন্ট্রাল এডমিন' : profileData.occupation,
      organization: profileData.organization,
      bio: profileData.bio,
      facebook_url: profileData.facebook_url,
      linkedin_url: profileData.linkedin_url,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProfiles((prev) => [fallbackProfile, ...prev.filter((p) => p.id !== fallbackProfile.id)]);

    if (assignedStatus === 'approved') {
      setCurrentUser(fallbackProfile);
      showToast('success', 'নিবন্ধন সফল (অফলাইন)', 'অফলাইন মোডে নিবন্ধন সম্পন্ন হয়েছে।');
    } else {
      showToast('info', 'নিবন্ধন গৃহীত হয়েছে', 'শিক্ষক অ্যাকাউন্টের আবেদন অপেক্ষমাণ।');
    }

    addAuditLog('USER_REGISTER', { email: fallbackProfile.email, role: fallbackProfile.role, status: fallbackProfile.account_status });

    return { 
      success: true, 
      message: 'অফলাইন সিমুলেটেড নিবন্ধন সম্পন্ন হয়েছে।' 
    };
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('jzs_current_user_id');
    localStorage.removeItem('jzs_current_user_data');
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error signing out of Supabase:', err);
      }
    }
    showToast('info', 'লগআউট সম্পন্ন', 'আপনি সফলভাবে লগআউট করেছেন।');
  };

  const switchRoleDemo = (profileId: string) => {
    if (profileId === 'visitor') {
      setCurrentUser(null);
      showToast('info', 'দর্শনার্থী মোড', 'আপনি এখন ভিজিটর বা সাধারণ দর্শনার্থী হিসেবে ওয়েবাসাইট ব্রাউজ করছেন।');
      return;
    }
    const target = profiles.find((p) => p.id === profileId);
    if (target) {
      setCurrentUser(target);
      showToast('success', 'রোল পরিবর্তিত', `আপনি এখন ${target.full_name_bn} (${target.role.toUpperCase()}) রোল ব্যবহার করছেন।`);
    }
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData, updated_at: new Date().toISOString() };
    setCurrentUser(updated);
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').update(updatedData).eq('id', currentUser.id).then();
    }

    showToast('success', 'প্রোফাইল আপডেট', 'আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।');
  };

  const approveTeacher = (teacherId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === teacherId ? { ...p, account_status: 'approved' as const } : p))
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').update({ account_status: 'approved' }).eq('id', teacherId).then();
    }

    showToast('success', 'অনুমোদন প্রদান', 'শিক্ষক অ্যাকাউন্টটি সফলভাবে অনুমোদন দেওয়া হলো।');
    addAuditLog('TEACHER_APPROVE', { teacher_id: teacherId });
  };

  const rejectTeacher = (teacherId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === teacherId ? { ...p, account_status: 'rejected' as const } : p))
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').update({ account_status: 'rejected' }).eq('id', teacherId).then();
    }

    showToast('warning', 'অনুমোদন প্রত্যাখ্যান', 'শিক্ষক আবেদনটি প্রত্যাখ্যান করা হয়েছে।');
    addAuditLog('TEACHER_REJECT', { teacher_id: teacherId });
  };

  const assignUpazilaAdmin = (userId: string, upazila: UpazilaName): { success: boolean; message: string } => {
    const currentCount = upazilaAdmins.filter((ua) => ua.upazila === upazila).length;
    if (currentCount >= 3) {
      return { success: false, message: `নিরাপত্তা নিয়ম: এই উপজেলায় ইতিমধ্যে সর্বোচ্চ ৩ জন উপজেলা এডমিন বিদ্যমান!` };
    }

    const existingAssigned = upazilaAdmins.find((ua) => ua.user_id === userId && ua.upazila === upazila);
    if (existingAssigned) {
      return { success: false, message: 'এই সদস্য ইতিমধ্যে এই উপজেলার এডমিন হিসেবে নির্ধারিত আছেন।' };
    }

    const targetUser = profiles.find((p) => p.id === userId);
    if (!targetUser) return { success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' };

    const newAssignment: UpazilaAdminAssignment = {
      id: 'uaa-' + Date.now(),
      user_id: userId,
      upazila,
      assigned_by: currentUser?.id,
      created_at: new Date().toISOString(),
      profile: targetUser
    };

    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, role: 'upazila_admin' as const } : p))
    );

    setUpazilaAdmins((prev) => [...prev, newAssignment]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('upazila_admin_assignments').insert([{
        user_id: userId,
        upazila,
        assigned_by: currentUser?.id
      }]).then();
      supabase.from('profiles').update({ role: 'upazila_admin' }).eq('id', userId).then();
    }

    showToast('success', 'উপজেলা এডমিন নিয়োগ', `${targetUser.full_name_bn}-কে উপজেলা এডমিন পদে নিয়োগ দেওয়া হয়েছে।`);
    addAuditLog('UPAZILA_ADMIN_ASSIGN', { user_id: userId, upazila });
    return { success: true, message: 'উপজেলা এডমিন সফলভাবে নিয়োগ দেওয়া হয়েছে।' };
  };

  const removeUpazilaAdmin = (assignmentId: string) => {
    const target = upazilaAdmins.find((ua) => ua.id === assignmentId);
    if (target) {
      setUpazilaAdmins((prev) => prev.filter((ua) => ua.id !== assignmentId));
      setProfiles((prev) =>
        prev.map((p) => (p.id === target.user_id ? { ...p, role: 'student' as const } : p))
      );

      if (isSupabaseConfigured && supabase) {
        supabase.from('upazila_admin_assignments').delete().eq('id', assignmentId).then();
        supabase.from('profiles').update({ role: 'student' }).eq('id', target.user_id).then();
      }

      showToast('info', 'উপজেলা এডমিন অপসারণ', 'উপজেলা এডমিন পদবী বাতিল করা হয়েছে।');
      addAuditLog('UPAZILA_ADMIN_REMOVE', { assignment_id: assignmentId });
    }
  };

  const assignCommitteeMember = (
    committeeId: string, 
    userId: string, 
    positionBn: string, 
    positionEn: string, 
    rankOrder: number = 99
  ): { success: boolean; message: string } => {
    const targetUser = profiles.find((p) => p.id === userId);
    if (!targetUser) return { success: false, message: 'সদস্য পাওয়া যায়নি।' };

    const newMember: CommitteeMember = {
      id: 'cm-' + Date.now(),
      committee_id: committeeId,
      user_id: userId,
      position_bn: positionBn,
      position_en: positionEn,
      rank_order: rankOrder,
      assigned_by: currentUser?.id,
      created_at: new Date().toISOString(),
      profile: targetUser
    };

    setCommitteeMembers((prev) => [...prev, newMember]);
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId && p.role !== 'super_admin' ? { ...p, role: 'committee_member' as const } : p))
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('committee_members').insert([{
        committee_id: committeeId,
        user_id: userId,
        position_bn: positionBn,
        position_en: positionEn,
        rank_order: rankOrder,
        assigned_by: currentUser?.id
      }]).then();
    }

    showToast('success', 'কমিটি পদবি বরাদ্দ', `${targetUser.full_name_bn}-কে ${positionBn} পদবি দেওয়া হয়েছে।`);
    addAuditLog('COMMITTEE_MEMBER_ASSIGN', { committee_id: committeeId, user_id: userId, position: positionBn });
    return { success: true, message: 'কমিটিতে সদস্য পদ যুক্ত করা হয়েছে।' };
  };

  const removeCommitteeMember = (memberId: string) => {
    setCommitteeMembers((prev) => prev.filter((cm) => cm.id !== memberId));
    if (isSupabaseConfigured && supabase) {
      supabase.from('committee_members').delete().eq('id', memberId).then();
    }
    showToast('info', 'কমিটি সদস্য অপসারিত', 'কমিটি পদবি থেকে অপসারণ করা হয়েছে।');
  };

  const createPost = (content: string, images: string[] = []) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: 'post-' + Date.now(),
      author_id: currentUser.id,
      content,
      images,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: currentUser,
      reactions: [],
      comments: []
    };
    setPosts((prev) => [newPost, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('posts').insert([{
        author_id: currentUser.id,
        content,
        images
      }]).then();
    }

    showToast('success', 'পোস্ট প্রকাশিত', 'আপনার পোস্টটি সামাজিক ফিডে যুক্ত হয়েছে।');
  };

  const toggleReaction = (postId: string, reaction: 'like' | 'love' | 'congrats' | 'support') => {
    if (!currentUser) {
      showToast('warning', 'লগইন প্রয়োজন', 'রিয়েকশন দিতে দয়া করে প্রথমে লগইন করুন।');
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentReactions = p.reactions || [];
        const existingIdx = currentReactions.findIndex((r) => r.user_id === currentUser.id);

        let newReactions = [...currentReactions];
        if (existingIdx >= 0) {
          if (newReactions[existingIdx].reaction === reaction) {
            newReactions.splice(existingIdx, 1);
            if (isSupabaseConfigured && supabase) {
              supabase.from('post_reactions').delete().eq('post_id', postId).eq('user_id', currentUser.id).then();
            }
          } else {
            newReactions[existingIdx].reaction = reaction;
            if (isSupabaseConfigured && supabase) {
              supabase.from('post_reactions').update({ reaction }).eq('post_id', postId).eq('user_id', currentUser.id).then();
            }
          }
        } else {
          const newRec = {
            id: 'r-' + Date.now(),
            post_id: postId,
            user_id: currentUser.id,
            reaction,
            created_at: new Date().toISOString(),
            profile: currentUser
          };
          newReactions.push(newRec);
          if (isSupabaseConfigured && supabase) {
            supabase.from('post_reactions').insert([{
              post_id: postId,
              user_id: currentUser.id,
              reaction
            }]).then();
          }
        }
        return { ...p, reactions: newReactions };
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) {
      showToast('warning', 'লগইন প্রয়োজন', 'মতামত বা কমেন্ট করতে দয়া করে লগইন করুন।');
      return;
    }
    const newComment = {
      id: 'c-' + Date.now(),
      post_id: postId,
      author_id: currentUser.id,
      content,
      created_at: new Date().toISOString(),
      author: currentUser
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, comments: [...(p.comments || []), newComment] };
      })
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('post_comments').insert([{
        post_id: postId,
        author_id: currentUser.id,
        content
      }]).then();
    }

    showToast('success', 'কমেন্ট যুক্ত হয়েছে', 'আপনার মন্তব্য প্রকাশিত হয়েছে।');
  };

  const createNotice = (title: string, content: string, category: any, fileUrl?: string, isPinned = false) => {
    if (!currentUser) return;
    const newNotice: Notice = {
      id: 'notice-' + Date.now(),
      title,
      content,
      category,
      file_url: fileUrl,
      is_pinned: isPinned,
      published_by: currentUser.id,
      created_at: new Date().toISOString(),
      publisher: currentUser
    };
    setNotices((prev) => [newNotice, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('notices').insert([{
        title,
        content,
        category,
        file_url: fileUrl,
        is_pinned: isPinned,
        published_by: currentUser.id
      }]).then();
    }

    showToast('success', 'নোটিশ প্রকাশিত', 'নতুন নোটিশ সফলভাবে বোর্ডে যুক্ত হয়েছে।');
    addAuditLog('NOTICE_CREATE', { title, category });
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
    if (isSupabaseConfigured && supabase) {
      supabase.from('notices').delete().eq('id', noticeId).then();
    }
    showToast('info', 'নোটিশ মোছা হয়েছে', 'নোটিশটি সফলভাবে সিস্টেম থেকে মুছে ফেলা হয়েছে।');
    addAuditLog('NOTICE_DELETE', { notice_id: noticeId });
  };

  const createEvent = (title: string, description: string, date: string, location: string, bannerUrl?: string) => {
    if (!currentUser) return;
    const newEvent: EventItem = {
      id: 'event-' + Date.now(),
      title,
      description,
      event_date: date,
      location,
      banner_url: bannerUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      creator: currentUser
    };
    setEvents((prev) => [newEvent, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('events').insert([{
        title,
        description,
        event_date: date,
        location,
        banner_url: bannerUrl,
        created_by: currentUser.id
      }]).then();
    }

    showToast('success', 'ইভেন্ট প্রকাশিত', 'নতুন ইভেন্ট সফলভাবে প্রকাশ করা হয়েছে।');
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (isSupabaseConfigured && supabase) {
      supabase.from('events').delete().eq('id', eventId).then();
    }
    showToast('info', 'ইভেন্ট মোছা হয়েছে', 'ইভেন্টটি সফলভাবে সিস্টেম থেকে মুছে ফেলা হয়েছে।');
    addAuditLog('EVENT_DELETE', { event_id: eventId });
  };

  const addGalleryItem = (title: string, imageUrl: string, category: string) => {
    if (!currentUser) return;
    const newItem: GalleryItem = {
      id: 'gallery-' + Date.now(),
      title,
      image_url: imageUrl,
      category,
      uploaded_by: currentUser.id,
      created_at: new Date().toISOString()
    };
    setGallery((prev) => [newItem, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('gallery_images').insert([{
        title,
        image_url: imageUrl,
        category,
        uploaded_by: currentUser.id
      }]).then();
    }

    showToast('success', 'ছবি প্রকাশ সম্পন্ন', 'নতুন আলোকচিত্র সফলভাবে গ্যালারিতে প্রকাশ করা হয়েছে।');
    addAuditLog('GALLERY_ADD', { title, category });
  };

  const deleteGalleryItem = (itemId: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== itemId));
    if (isSupabaseConfigured && supabase) {
      supabase.from('gallery_images').delete().eq('id', itemId).then();
    }
    showToast('info', 'ছবি মোছা হয়েছে', 'ছবিটি গ্যালারি থেকে অপসারণ করা হয়েছে।');
    addAuditLog('GALLERY_DELETE', { item_id: itemId });
  };

  const submitContactMessage = (name: string, email: string, phone: string, subject: string, message: string) => {
    const newMessage: ContactMessage = {
      id: 'cm-' + Date.now(),
      name,
      email,
      phone,
      subject,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setContactMessages((prev) => [newMessage, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('contact_messages').insert([{
        name,
        email,
        phone,
        subject,
        message
      }]).then();
    }

    showToast('success', 'বার্তা প্রেরিত', 'আপনার বার্তা সফলভাবে এডমিন কর্তৃপক্ষের কাছে পাঠানো হয়েছে। ধন্যবাদ!');
  };

  const markMessageRead = (messageId: string) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('contact_messages').update({ is_read: true }).eq('id', messageId).then();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthLoading,
        profiles,
        committees,
        committeeMembers,
        upazilaAdmins,
        posts,
        notices,
        events,
        gallery,
        auditLogs,
        contactMessages,
        login,
        register,
        logout,
        switchRoleDemo,
        updateProfile,
        approveTeacher,
        rejectTeacher,
        assignUpazilaAdmin,
        removeUpazilaAdmin,
        assignCommitteeMember,
        removeCommitteeMember,
        createPost,
        toggleReaction,
        addComment,
        addGalleryItem,
        deleteGalleryItem,
        createNotice,
        deleteNotice,
        createEvent,
        deleteEvent,
        submitContactMessage,
        markMessageRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
