import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export async function getProfile(userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) throw error;
  return profile;
}

export async function updateProfile(updates: Partial<Profile>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', updates.id!)
    .select()
    .single();

  if (error) throw error;
  return profile;
}