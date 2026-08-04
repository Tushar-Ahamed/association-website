import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to check live Supabase or fallback
export const getSupabaseClient = () => {
  if (!supabase) {
    console.info('ℹ️ Running Jhenaidah Zila Somiti App in Simulated Storage Mode (No Supabase keys set).');
  }
  return supabase;
};

function handleSupabaseError(context: string, error: any) {
  if (error?.message?.includes('Invalid API key') || error?.status === 401) {
    console.warn(`⚠️ Supabase (${context}): Invalid API key or unauthorized (401). Using local fallback data.`);
  } else {
    console.error(`Error fetching ${context} from Supabase:`, error?.message);
  }
}

// Database Query Helpers with graceful fallbacks
export async function dbFetchProfiles() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('profiles', error);
    return null;
  }
  return data;
}

export async function dbFetchCommittees() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('committees')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('committees', error);
    return null;
  }
  return data;
}

export async function dbFetchCommitteeMembers() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('committee_members')
    .select('*')
    .order('rank_order', { ascending: true });
  if (error) {
    handleSupabaseError('committee members', error);
    return null;
  }
  return data;
}

export async function dbFetchUpazilaAdmins() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('upazila_admin_assignments')
    .select('*');
  if (error) {
    handleSupabaseError('upazila admin assignments', error);
    return null;
  }
  return data;
}

export async function dbFetchPosts() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('posts')
    .select('*, reactions:post_reactions(*), comments:post_comments(*)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('posts', error);
    return null;
  }
  return data;
}

export async function dbFetchNotices() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('notices', error);
    return null;
  }
  return data;
}

export async function dbFetchEvents() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
  if (error) {
    handleSupabaseError('events', error);
    return null;
  }
  return data;
}

export async function dbFetchGallery() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('gallery', error);
    return null;
  }
  return data;
}

export async function dbFetchContactMessages() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('contact messages', error);
    return null;
  }
  return data;
}

export async function dbFetchAuditLogs() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    handleSupabaseError('audit logs', error);
    return null;
  }
  return data;
}
