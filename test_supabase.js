import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ruqkseyidudveptggnfg.supabase.co';
const supabaseKey = 'sb_publishable_k1XuUQPnEXKAtYXbkp6fjw_KYGErBao';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('box')
    .select('*')
    .eq('device_id', 'ab170023')
    .order('device_time', { ascending: false })
    .limit(14);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

test();
