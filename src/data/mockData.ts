import { 
  UserProfile, 
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

export const UPAZILA_INFO: Record<UpazilaName, { name_bn: string; name_en: string; description: string; total_members: number; image: string }> = {
  jhenaidah_sadar: {
    name_bn: 'ঝিনাইদহ সদর',
    name_en: 'Jhenaidah Sadar',
    description: 'ঐতিহাসিক ঢোল সমুদ্র দীঘি, শহরের ঐতিহ্যবাহী পায়রা চত্বর, পাগলা কানাইয়ের মাজার এবং নবগঙ্গা নদীর তীরবর্তী শহরের জন্য পরিচিত।',
    total_members: 0,
    image: '/upazilas/jhenaidah_sadar.jpg'
  },
  kaliganj: {
    name_bn: 'কালীগঞ্জ',
    name_en: 'Kaliganj',
    description: "প্রাচীন ঐতিহাসিক স্থান ও বন্দর 'বারোবাজার', গলাকাটা মসজিদ এবং মল্লিকপুরের বিখ্যাত বিশাল প্রাচীন বটগাছের জন্য বিখ্যাত।",
    total_members: 0,
    image: '/upazilas/kaliganj.jpg'
  },
  shailkupa: {
    name_bn: 'শৈলকূপা',
    name_en: 'Shailkupa',
    description: 'প্রাচীন শৈলকূপা শাহী মসজিদ এবং কুমার নদের অববাহিকার ঐতিহ্যবাহী জনপদের জন্য পরিচিত।',
    total_members: 0,
    image: '/upazilas/shailkupa.jpg'
  },
  maheshpur: {
    name_bn: 'মহেশপুর',
    name_en: 'Maheshpur',
    description: 'উর্বর কৃষিজমি ও খাদ্যভাণ্ডার খ্যাত সীমান্ত অঞ্চল এবং দত্তনগর কৃষি খামারের জন্য পরিচিত।',
    total_members: 0,
    image: '/upazilas/maheshpur.jpg'
  },
  kotchandpur: {
    name_bn: 'কোটচাঁদপুর',
    name_en: 'Kotchandpur',
    description: 'কপোতাক্ষ নদের তীরবর্তী ঐতিহ্য ও বলুহর মৎস্য হ্যাচারির জন্য বিখ্যাত।',
    total_members: 0,
    image: '/upazilas/kotchandpur.jpg'
  },
  harinakunda: {
    name_bn: 'হরিণাকুণ্ডু',
    name_en: 'Harinakunda',
    description: 'কৃষিপ্রধান অঞ্চল এবং ঐতিহাসিক বিভিন্ন লোক সংস্কৃতির জন্য পরিচিত।',
    total_members: 0,
    image: '/upazilas/harinakunda.jpg'
  }
};

// Clean initial state: 3 official Central Super Admin accounts
export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'super-admin-1',
    email: 'admin1@jhenaidah-ru.org',
    full_name_bn: 'সেন্ট্রাল এডমিন ১',
    full_name_en: 'Central Admin 1',
    phone: '01700000001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'super_admin',
    account_status: 'approved',
    upazila: 'jhenaidah_sadar',
    department: 'সেন্ট্রাল এডমিন',
    session_years: '2020-2021',
    student_id: 'ADMIN001',
    hall_name: 'Sher-e Bangla Fazlul Haque Hall (শের-ই-বাংলা ফজলুল হক হল)',
    blood_group: 'A+',
    occupation: 'সুপার এডমিন ১ (সেন্ট্রাল)',
    organization: 'ঝিনাইদহ জেলা সমিতি, রাবি',
    bio: 'ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়ের সেন্ট্রাল এডমিন ১।',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'super-admin-2',
    email: 'admin2@jhenaidah-ru.org',
    full_name_bn: 'সেন্ট্রাল এডমিন ২',
    full_name_en: 'Central Admin 2',
    phone: '01700000002',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    role: 'super_admin',
    account_status: 'approved',
    upazila: 'kaliganj',
    department: 'সেন্ট্রাল এডমিন',
    session_years: '2020-2021',
    student_id: 'ADMIN002',
    hall_name: 'Shah Makhdum Hall (শাহ্ মখদুম হল)',
    blood_group: 'B+',
    occupation: 'সুপার এডমিন ২ (সেন্ট্রাল)',
    organization: 'ঝিনাইদহ জেলা সমিতি, রাবি',
    bio: 'ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়ের সেন্ট্রাল এডমিন ২।',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'super-admin-3',
    email: 'admin3@jhenaidah-ru.org',
    full_name_bn: 'সেন্ট্রাল এডমিন ৩',
    full_name_en: 'Central Admin 3',
    phone: '01700000003',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role: 'super_admin',
    account_status: 'approved',
    upazila: 'shailkupa',
    department: 'সেন্ট্রাল এডমিন',
    session_years: '2020-2021',
    student_id: 'ADMIN003',
    hall_name: 'Shahid Shamsuzzoha Hall (শহীদ শামসুজ্জোহা হল)',
    blood_group: 'O+',
    occupation: 'সুপার এডমিন ৩ (সেন্ট্রাল)',
    organization: 'ঝিনাইদহ জেলা সমিতি, রাবি',
    bio: 'ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়ের সেন্ট্রাল এডমিন ৩।',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'teacher-sample-1',
    email: 'teacher1@jhenaidah-ru.org',
    full_name_bn: 'ড. শামীম হোসেন',
    full_name_en: 'Dr. Shamim Hossain',
    phone: '01711112233',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    role: 'teacher',
    account_status: 'approved',
    upazila: 'kaliganj',
    department: 'পদার্থবিজ্ঞান (Physics)',
    session_years: '2010-2011',
    student_id: 'TEA-101',
    hall_name: 'Shah Makhdum Hall (শাহ্ মখদুম হল)',
    blood_group: 'A+',
    occupation: 'অধ্যাপক, পদার্থবিজ্ঞান বিভাগ, রাবি',
    organization: 'রাজশাহী বিশ্ববিদ্যালয়',
    bio: 'ঝিনাইদহ জেলার কালীগঞ্জ উপজেলার সন্তান ও রাজশাহী বিশ্ববিদ্যালয়ের পদার্থবিজ্ঞান বিভাগের শিক্ষক।',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'student-sample-1',
    email: 'student1@jhenaidah-ru.org',
    full_name_bn: 'আরিফুর রহমান',
    full_name_en: 'Arifur Rahman',
    phone: '01822334455',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    role: 'student',
    account_status: 'approved',
    upazila: 'jhenaidah_sadar',
    department: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)',
    session_years: '2021-2022',
    student_id: '21105044',
    hall_name: 'Sher-e Bangla Fazlul Haque Hall (শের-ই-বাংলা ফজলুল হক হল)',
    blood_group: 'B+',
    occupation: 'শিক্ষার্থী',
    organization: 'রাজশাহী বিশ্ববিদ্যালয়',
    bio: 'ঝিনাইদহ সদরের সন্তান, সিএসই রাবি ২১-২২ শিক্ষাবর্ষ।',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'alumni-sample-1',
    email: 'alumni1@jhenaidah-ru.org',
    full_name_bn: 'নাসরিন সুলতানা',
    full_name_en: 'Nasrin Sultana',
    phone: '01933445566',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    role: 'alumni',
    account_status: 'approved',
    upazila: 'shailkupa',
    department: 'অর্থনীতি (Economics)',
    session_years: '2015-2016',
    student_id: '15102030',
    hall_name: 'Begum Rokeya Hall (বেগম রোকেয়া হল)',
    blood_group: 'O+',
    occupation: 'সহকারী পরিচালক',
    organization: 'বাংলাদেশ ব্যাংক',
    bio: 'রাবি অর্থনীতি বিভাগের সাবেক শিক্ষার্থী ও প্রাক্তনী।',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_COMMITTEES: Committee[] = [
  {
    id: 'comm-district-2025',
    title_bn: 'জেলা কার্যনির্বাহী কমিটি ২০২৫-২০২৬',
    title_en: 'District Executive Committee 2025-2026',
    term_years: '2025-2026',
    level: 'district',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_COMMITTEE_MEMBERS: CommitteeMember[] = [];

export const INITIAL_UPAZILA_ADMIN_ASSIGNMENTS: UpazilaAdminAssignment[] = [];

export const INITIAL_POSTS: Post[] = [];

export const INITIAL_NOTICES: Notice[] = [];

export const INITIAL_EVENTS: EventItem[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-init',
    actor_id: 'super-admin-main',
    actor_name: 'সিস্টেম এডমিন',
    action: 'SYSTEM_INIT',
    details: { message: 'ঝিনাইদহ জেলা সমিতি রাবি অফিশিয়াল পোর্টাল সক্রিয় করা হয়েছে।' },
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [];
