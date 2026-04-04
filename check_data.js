import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ruqkseyidudveptggnfg.supabase.co';
const supabaseKey = 'sb_publishable_k1XuUQPnEXKAtYXbkp6fjw_KYGErBao';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking weather_logs table...');
  const { data, error } = await supabase
    .from('weather_logs')
    .select('*')
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample data:', JSON.stringify(data, null, 2));

  console.log('\nChecking unique device IDs:');
  const { data: devices, error: devErr } = await supabase
    .from('weather_logs')
    .select('device_id')
    .limit(100);
  
  if (devErr) {
    console.error('Error:', devErr);
  } else {
    const uniqueIds = [...new Set(devices.map(d => d.device_id))];
    console.log('Unique device IDs in table:', uniqueIds);
  }
}

check();
