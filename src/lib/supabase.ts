import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const key = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// Site vitrine : sans clés Supabase, on crée un client inactif pour que le site s'affiche quand même
export const supabaseActif = Boolean(url && key);

export const supabase = createClient(
  url || 'https://supabase-inactif.invalid',
  key || 'cle-inactive',
);
