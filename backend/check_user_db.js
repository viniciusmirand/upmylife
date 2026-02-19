require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === 'viniciusmiranda342@hotmail.com');
    if (!user) { console.log("User not found!"); return; }
    console.log("User ID:", user.id);

    const { data: members, error: mErr } = await supabase.from('workspace_members').select('*').eq('user_id', user.id);
    console.log("Memberships:", members?.length, mErr);

    const { data: tasks, error: tErr } = await supabase.from('tasks').select('*').eq('created_by', user.id);
    console.log("Tasks created:", tasks?.length, tErr);

    // Fix if no membership
    if (!members || members.length === 0) {
        console.log("Fixing: Giving user a workspace...");
        const rp = await supabase.from('workspaces').insert({ name: 'Auto-Fixed Workspace' }).select().single();
        await supabase.from('workspace_members').insert({ workspace_id: rp.data.id, user_id: user.id, role: 'owner' });
        console.log("Fixed! Workspace created.", rp.data.id);
    } else {
        console.log("User already has a workspace:", members[0].workspace_id);
    }
}
check();
