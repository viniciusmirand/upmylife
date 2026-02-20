const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://zndfideewkbxttiwexby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZGZpZGVld2tieHR0aXdleGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzM5NjAsImV4cCI6MjA4NzEwOTk2MH0.cOoh8Zr7JI8_PKG2mdNBNjsw2dbw22SpZAJkIz74m9Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testApi() {
    console.log("=== STARTING API TEST ===");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'viniciusmiranda342@hotmail.com',
        password: 'viniciusmiranda342@hotmail.com'
    });

    if (authErr || !authData?.user) {
        console.error("Login failed:", authErr);
        return;
    }
    const token = authData.session.access_token;
    console.log("✅ Logged in. Token fetched.");

    console.log("\n--- Testing Add Chests API ---");
    try {
        const res = await fetch(`http://localhost:4000/api/admin/add-chests`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: 50 })
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log("Response:", text);
    } catch (e) {
        console.error("Network Error:", e);
    }

    // Now test Complete Task API (using a fake ID or just seeing if it 400s or 500s)
    console.log("\n--- Testing Complete Task API ---");
    try {
        // Find a pending task
        const { data: tasks } = await supabase.from('tasks').select('*').eq('status', 'pending').limit(1);
        if (tasks && tasks.length > 0) {
            const taskId = tasks[0].id;
            console.log("Found pending task:", taskId);
            const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const text = await res.text();
            console.log(`Status: ${res.status}`);
            console.log("Response:", text);
        } else {
            console.log("No pending tasks to test.");
        }
    } catch (e) {
        console.error("Network Error:", e);
    }

    console.log("=== DONE ===");
}

testApi();
