import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check live Supabase or fallback
export const getSupabaseClient = () => {
  if (!supabase) {
    console.info('ℹ️ Running Jhenaidah Zila Somiti App in Simulated Storage Mode (No Supabase keys set).');
  }
  return supabase;
};

// Database Query Helpers with graceful fallbacks
export async function dbFetchProfiles() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching profiles from Supabase:', error.message);
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
    console.error('Error fetching committees from Supabase:', error.message);
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
    console.error('Error fetching committee members from Supabase:', error.message);
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
    console.error('Error fetching upazila admin assignments:', error.message);
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
    console.error('Error fetching posts from Supabase:', error.message);
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
    console.error('Error fetching notices from Supabase:', error.message);
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
    console.error('Error fetching events from Supabase:', error.message);
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
    console.error('Error fetching gallery from Supabase:', error.message);
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
    console.error('Error fetching contact messages from Supabase:', error.message);
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
    console.error('Error fetching audit logs from Supabase:', error.message);
    return null;
  }
  return data;
}
