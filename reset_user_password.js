const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function reset() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    process.exit(1);
  }

  const user = users.find(u => u.email === 'taylor@sn-x.com');
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: 'Password123!'
  });

  if (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }

  console.log('Password for taylor@sn-x.com reset to Password123!');
}

reset();
