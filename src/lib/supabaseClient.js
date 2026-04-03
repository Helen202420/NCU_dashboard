import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ruqkseyidudveptggnfg.supabase.co';
const supabaseKey = 'sb_publishable_k1XuUQPnEXKAtYXbkp6fjw_KYGErBao';

export const supabase = createClient(supabaseUrl, supabaseKey);
