import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "http://" + window.location.hostname + ":54321";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);