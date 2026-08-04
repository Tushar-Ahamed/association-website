// Domain Types for Jhenaidah Zila Somiti - Rajshahi University

export type UserRole = 
  | 'super_admin'
  | 'teacher'
  | 'student'
  | 'alumni'
  | 'upazila_admin'
  | 'committee_member'
  | 'visitor';

export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type UpazilaName = 
  | 'jhenaidah_sadar'
  | 'kaliganj'
  | 'kotchandpur'
  | 'maheshpur'
  | 'shailkupa'
  | 'harinakunda';

export type CommitteeLevel = 'district' | 'upazila';

export type ReactionType = 'like' | 'love' | 'congrats' | 'support';

export type NoticeCategory = 'general' | 'academic' | 'event' | 'urgent' | 'scholarship';

export interface UserProfile {
  id: string;
  email: string;
  full_name_bn: string;
  full_name_en: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  account_status: AccountStatus;
  upazila: UpazilaName;
  union_ward?: string;
  village?: string;
  department: string;
  session_years: string;
  passing_year?: number;
  student_id?: string;
  hall_name?: string;
  blood_group?: string;
  occupation?: string;
  organization?: string;
  bio?: string;
  facebook_url?: string;
  linkedin_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Committee {
  id: string;
  title_bn: string;
  title_en: string;
  term_years: string;
  level: CommitteeLevel;
  upazila?: UpazilaName;
  is_active: boolean;
  created_at: string;
}

export interface CommitteeMember {
  id: string;
  committee_id: string;
  user_id: string;
  position_bn: string;
  position_en: string;
  rank_order: number;
  assigned_by?: string;
  created_at: string;
  profile?: UserProfile;
}

export interface UpazilaAdminAssignment {
  id: string;
  user_id: string;
  upazila: UpazilaName;
  assigned_by?: string;
  created_at: string;
  profile?: UserProfile;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction: ReactionType;
  created_at: string;
  profile?: UserProfile;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: UserProfile;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  images?: string[];
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
  author?: UserProfile;
  reactions?: PostReaction[];
  comments?: PostComment[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  file_url?: string;
  is_pinned: boolean;
  published_by: string;
  created_at: string;
  publisher?: UserProfile;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  banner_url?: string;
  created_by: string;
  created_at: string;
  creator?: UserProfile;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  uploaded_by?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface MemberFilters {
  search: string;
  upazila?: string;
  role?: string;
  department?: string;
  session?: string;
  bloodGroup?: string;
  hall?: string;
}
