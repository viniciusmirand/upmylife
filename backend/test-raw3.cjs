const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const supabaseUrl = 'https://zndfideewkbxttiwexby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZGZpZGVld2tieHR0aXdleGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzM5NjAsImV4cCI6MjA4NzEwOTk2MH0.cOoh8Zr7JI8_PKG2mdNBNjsw2dbw22SpZAJkIz74m9Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepDebug() {
    console.log("=== STARTING DEEP DEBUG ===");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'viniciusmiranda342@hotmail.com',
        password: 'viniciusmiranda342@hotmail.com'
    });

    if (authErr || !authData?.user) {
        console.error("Login failed:", authErr);
        return;
    }
    const user = authData.user;
    console.log("✅ Logged in:", user.id);

    // Check Workspaces
    const { data: workspaces, error: wpErr } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id);
    if (wpErr) {
        console.error("❌ Failed to fetch workspaces", wpErr);
        return;
    }

    let wpId;
    if (!workspaces || workspaces.length === 0) {
        console.log("⚠️ No workspaces found. Attempting to create one just like GameContext WITH CLIENT-SIDE UUID...");
        const newWpId = crypto.randomUUID();

        // Notice: No .select(). We just insert.
        const { error: createWpErr } = await supabase.from('workspaces').insert({ id: newWpId, name: 'Personal Quests DBG' });

        if (createWpErr) {
            console.error("❌ Failed to create workspace", createWpErr);
            return;
        }
        console.log("✅ Created Workspace blindly (No RLS SELECT block!):", newWpId);

        const { error: insertMemberErr } = await supabase.from('workspace_members').insert({
            workspace_id: newWpId,
            user_id: user.id,
            role: 'owner'
        });

        if (insertMemberErr) {
            console.error("❌ Failed to insert workspace member:", insertMemberErr);
            return;
        }
        console.log("✅ Inserted workspace member.");
        wpId = newWpId;
    } else {
        wpId = workspaces[0].workspace_id;
        console.log("✅ Found existing Workspace:", wpId);
    }

    const newTask = {
        title: 'Deep Debug Quest',
        description: 'Finding the bug that prevents insertion',
        category: 'daily',
        difficulty: 'epic',
        base_xp: 50,
        status: 'pending',
        created_by: user.id,
        workspace_id: wpId
    };

    console.log("\nAttempting to insert task:", newTask);
    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();

    if (error) {
        console.error("\n🔥 EXACT INSERT ERROR:");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("\n✅ INSERT SUCCESS!");
        console.log(data);
        await supabase.from('tasks').delete().eq('id', data.id);
        console.log("✅ Cleaned up task.");
    }
    console.log("=== END DEEP DEBUG ===");
}

deepDebug();
