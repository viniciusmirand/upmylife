const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://zndfideewkbxttiwexby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZGZpZGVld2tieHR0aXdleGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzM5NjAsImV4cCI6MjA4NzEwOTk2MH0.cOoh8Zr7JI8_PKG2mdNBNjsw2dbw22SpZAJkIz74m9Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendInsert() {
    let user;
    for (const pass of ['password123', 'password', '123456', 'test1234']) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: 'test@test.com', password: pass });
        if (!error && data?.user) {
            console.log("Logged in with " + pass);
            user = data.user;
            break;
        }
    }
    if (!user) { console.log("Failed all passwords"); return; }

    const { data: workspaces, error: wpErr } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id);
    const wpId = workspaces[0].workspace_id;

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
