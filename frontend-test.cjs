require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendInsert() {
    console.log("Supabase URL:", supabaseUrl ? "OK" : "Missing");
    console.log("Supabase Key:", supabaseKey ? "OK" : "Missing");

    // Login as the user
    console.log("Logging in as user...");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: 'password123'
    });

    let user = authData?.user;
    if (authErr || !user) {
        console.log("Login failed with password123, trying 123456");
        const { data: authData2, error: authErr2 } = await supabase.auth.signInWithPassword({
            email: 'test@test.com',
            password: 'password'
        });
        if (authErr2) {
            const { data: authData3, error: authErr3 } = await supabase.auth.signInWithPassword({
                email: 'test@test.com',
                password: '123456'
            });
            if (authErr3) {
                console.log("Login failed completely", authErr3);
                return;
            }
            user = authData3.user;
        } else {
            user = authData2.user;
        }
    }

    console.log("Logged in as", user.id);

    console.log("Fetching workspace array...");
    const { data: workspaces, error: wpErr } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id);
    if (wpErr || !workspaces || workspaces.length === 0) {
        console.log("WP Error:", wpErr, workspaces);
        return;
    }

    const wpId = workspaces[0].workspace_id;
    console.log("Using Workspace ID:", wpId);

    const newTask = {
        title: 'Debug Quest',
        description: 'Finding the bug',
        category: 'daily',
        difficulty: 'epic',
        base_xp: 50,
        status: 'pending',
        created_by: user.id,
        workspace_id: wpId
    };

    console.log("Inserting Task:", newTask);
    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
    if (error) {
        console.error("🔥 INSERT FAILED:", JSON.stringify(error, null, 2));
    } else {
        console.log("✅ INSERT SUCCESS:", data);
    }
}
testFrontendInsert();
