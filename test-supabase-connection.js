require('dotenv').config();
const { supabaseAdmin } = require('./src/config/supabase');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  try {
    // Test 1: Check if we can query the users table
    console.log('Test 1: Querying users table...');
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('❌ Error querying users table:', usersError);
      return;
    }
    console.log('✅ Users table accessible');
    console.log(`   Found ${users?.length || 0} users\n`);

    // Test 2: Try to insert a test user
    console.log('Test 2: Inserting test user...');
    const testUser = {
      spotify_id: 'test_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      display_name: 'Test User',
      profile_image: null,
      country: 'BR',
      spotify_access_token: 'test_token',
      spotify_refresh_token: 'test_refresh',
      token_expires_at: new Date(Date.now() + 3600000).toISOString(),
      last_login: new Date().toISOString()
    };

    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(testUser)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting test user:', insertError);
      console.error('   Details:', JSON.stringify(insertError, null, 2));
      return;
    }
    console.log('✅ Test user inserted successfully');
    console.log('   User ID:', insertedUser.id);

    // Test 3: Clean up test user
    console.log('\nTest 3: Cleaning up test user...');
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', insertedUser.id);

    if (deleteError) {
      console.error('❌ Error deleting test user:', deleteError);
      return;
    }
    console.log('✅ Test user deleted successfully');

    console.log('\n🎉 All tests passed! Supabase connection is working correctly.');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSupabaseConnection();
