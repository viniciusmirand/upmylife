require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDb() {
    console.log("Fetching all workspace_members...");
    const { data: members, error } = await supabase.from('workspace_members').select('*');
    console.log("Members:", members);
    if (error) console.error("Error:", error);

    console.log("Fetching all tasks...");
    const { data: tasks, error: tErr } = await supabase.from('tasks').select('*');
    console.log("Tasks:", tasks);
    if (tErr) console.error("Error:", tErr);
}

checkDb();
