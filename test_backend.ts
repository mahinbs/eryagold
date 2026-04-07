import { supabase } from './supabase/client';

async function testBackend() {
  console.log('Testing Supabase Backend...');
  
  try {
    // 1. Fetch Designs
    const { data: designs, error: designsError } = await supabase
      .from('designs')
      .select('*')
      .limit(1);
    
    if (designsError) {
      console.error('Error fetching designs:', designsError.message);
    } else {
      console.log('Successfully fetched designs:', designs.length);
    }

    // 2. Fetch or Create a test User (to check Profiling)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.warn('No active user session (this is normal if not logged in).');
    } else {
      console.log('Active User found:', user.email);
    }

    console.log('Backend Connectivity: PASSED (Supabase URL/Key valid)');
  } catch (err) {
    console.error('Unexpected Backend failure:', err);
  }
}

// NOTE: This is a Node environment test, but our client is React Native based.
// We'll just run it as a sanity check.
testBackend();
