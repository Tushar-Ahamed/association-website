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

interface AuthContextType {
  user: UserProfile | null;
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
  login: (email: string, role?: UserRole) => boolean;
  register: (profileData: Partial<UserProfile>) => { success: boolean; message: string };
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

  // Load or initialize state from localStorage (always merging INITIAL_PROFILES for central admins)
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

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem('jzs_current_user_id');
    if (!savedId || savedId === 'visitor') return null;
    const found = profiles.find((p) => p.id === savedId);
    return found || null; // Start logged out by default for real security
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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jzs_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jzs_current_user_id', currentUser.id);
    } else {
      localStorage.setItem('jzs_current_user_id', 'visitor');
    }
  }, [currentUser]);

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
  };

  const login = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    let found = profiles.find((p) => p.email.trim().toLowerCase() === cleanEmail);
    
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
    showToast('success', 'স্বাগতম!', `${found.full_name_bn} হিসেবে সফলভাবে লগইন করেছেন।`);
    addAuditLog('USER_LOGIN', { user_id: found.id, email: found.email });
    return true;
  };

  const register = (profileData: Partial<UserProfile>): { success: boolean; message: string } => {
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

    const newProfile: UserProfile = {
      id: isSuperAdminEmail ? `super-admin-${Date.now()}` : 'user-' + Date.now(),
      email: profileData.email || '',
      full_name_bn: profileData.full_name_bn || 'নতুন ব্যবহারকারী',
      full_name_en: profileData.full_name_en || 'New User',
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

    setProfiles((prev) => [newProfile, ...prev]);

    if (assignedStatus === 'approved') {
      setCurrentUser(newProfile);
      showToast('success', isSuperAdminEmail ? 'সুপার এডমিন অ্যাকাউন্ট সক্রিয়' : 'নিবন্ধন সফল', 
        isSuperAdminEmail ? 'আপনি সেন্ট্রাল সুপার এডমিন হিসেবে নিবন্ধিত ও সক্রিয় হয়েছেন।' : 'আপনার ইমেইল যাচাই সম্পন্ন হয়েছে এবং অ্যাকাউন্ট সক্রিয় করা হয়েছে।');
    } else {
      showToast('info', 'নিবন্ধন গৃহীত হয়েছে', 'শিক্ষক অ্যাকাউন্টের জন্য আপনার আবেদন সুপার এডমিনের অনুমোদনের অপেক্ষায় রয়েছে।');
    }

    addAuditLog('USER_REGISTER', { email: newProfile.email, role: newProfile.role, status: newProfile.account_status });

    return { 
      success: true, 
      message: isTeacher 
        ? 'নিবন্ধন সম্পন্ন হয়েছে! শিক্ষক হিসেবে আপনার অ্যাকাউন্টটি এডমিন অনুমোদনের পর সক্রিয় হবে।' 
        : 'সফলভাবে নিবন্ধিত এবং ইমেইল যাচাইকৃত হয়েছে!' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
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
    showToast('success', 'প্রোফাইল আপডেট', 'আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।');
  };

  const approveTeacher = (teacherId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === teacherId ? { ...p, account_status: 'approved' as const } : p))
    );
    showToast('success', 'অনুমোদন প্রদান', 'শিক্ষক অ্যাকাউন্টটি সফলভাবে অনুমোদন দেওয়া হলো।');
    addAuditLog('TEACHER_APPROVE', { teacher_id: teacherId });
  };

  const rejectTeacher = (teacherId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === teacherId ? { ...p, account_status: 'rejected' as const } : p))
    );
    showToast('warning', 'অনুমোদন প্রত্যাখ্যান', 'শিক্ষক আবেদনটি প্রত্যাখ্যান করা হয়েছে।');
    addAuditLog('TEACHER_REJECT', { teacher_id: teacherId });
  };

  const assignUpazilaAdmin = (userId: string, upazila: UpazilaName): { success: boolean; message: string } => {
    // Check max 3 upazila admin limit for this upazila
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

    // Update user role to upazila_admin
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, role: 'upazila_admin' as const } : p))
    );

    setUpazilaAdmins((prev) => [...prev, newAssignment]);
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

    showToast('success', 'কমিটি পদবি বরাদ্দ', `${targetUser.full_name_bn}-কে ${positionBn} পদবি দেওয়া হয়েছে।`);
    addAuditLog('COMMITTEE_MEMBER_ASSIGN', { committee_id: committeeId, user_id: userId, position: positionBn });
    return { success: true, message: 'কমিটিতে সদস্য পদ যুক্ত করা হয়েছে।' };
  };

  const removeCommitteeMember = (memberId: string) => {
    setCommitteeMembers((prev) => prev.filter((cm) => cm.id !== memberId));
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
            newReactions.splice(existingIdx, 1); // remove
          } else {
            newReactions[existingIdx].reaction = reaction; // update
          }
        } else {
          newReactions.push({
            id: 'r-' + Date.now(),
            post_id: postId,
            user_id: currentUser.id,
            reaction,
            created_at: new Date().toISOString(),
            profile: currentUser
          });
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
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newComments = [
          ...(p.comments || []),
          {
            id: 'c-' + Date.now(),
            post_id: postId,
            author_id: currentUser.id,
            content,
            created_at: new Date().toISOString(),
            author: currentUser
          }
        ];
        return { ...p, comments: newComments };
      })
    );
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
    showToast('success', 'নোটিশ প্রকাশিত', 'নতুন নোটিশ সফলভাবে বোর্ডে যুক্ত হয়েছে।');
    addAuditLog('NOTICE_CREATE', { title, category });
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
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
    showToast('success', 'ইভেন্ট প্রকাশিত', 'নতুন ইভেন্ট সফলভাবে প্রকাশ করা হয়েছে।');
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
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
    showToast('success', 'ছবি প্রকাশ সম্পন্ন', 'নতুন আলোকচিত্র সফলভাবে গ্যালারিতে প্রকাশ করা হয়েছে।');
    addAuditLog('GALLERY_ADD', { title, category });
  };

  const deleteGalleryItem = (itemId: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== itemId));
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
    showToast('success', 'বার্তা প্রেরিত', 'আপনার বার্তা সফলভাবে এডমিন কর্তৃপক্ষের কাছে পাঠানো হয়েছে। ধন্যবাদ!');
  };

  const markMessageRead = (messageId: string) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
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
