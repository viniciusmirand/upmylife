const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://zndfideewkbxttiwexby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZGZpZGVld2tieHR0aXdleGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzM5NjAsImV4cCI6MjA4NzEwOTk2MH0.cOoh8Zr7JI8_PKG2mdNBNjsw2dbw22SpZAJkIz74m9Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendInsert() {
    console.log("Supabase URL:", supabaseUrl ? "OK" : "Missing");

    // Login as the user
    console.log("Logging in as user test@test.com with 123456...");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: '123456'
    });

    let user = authData?.user;
    if (authErr || !user) {
        console.log("Login failed", authErr);
        return;
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
        await supabase.from('tasks').delete().eq('id', data.id);
    }
}
testFrontendInsert();
