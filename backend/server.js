require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const { DIFFICULTY_MULTIPLIERS, rollForChest, calculateLevel, rollRarity } = require('./src/utils/gameLogic');

const app = express();
const port = process.env.PORT || 4000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Supabase JWT Verification Middleware
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or malformed Authorization header' });
        }
        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) return res.status(401).json({ error: 'Invalid token', details: error?.message });
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Authentication Error' });
    }
};

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 🛡️ ANTI-CHEAT SERVER-SIDE XP ENGINE 🛡️
// Endpoint: Complete a task and roll the gacha securely
app.post('/api/tasks/:id/complete', authenticateUser, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        // 1. Fetch and Lock Task (Anti-Cheat check: ensure it hasn't been completed already)
        // Since we are not doing a direct serializable DB lock here, we update it immediately, relying on standard concurrency.
        const { data: updatedTask, error: taskUpdateError } = await supabase
            .from('tasks')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('id', taskId)
            .neq('status', 'completed')
            .select()
            .single();

        if (taskUpdateError || !updatedTask) {
            return res.status(400).json({
                error: 'Cheat detected or task not found',
                message: 'Task is already completed or does not exist.'
            });
        }

        // 2. Fetch current user state in that workspace
        const { data: memberStats, error: memberError } = await supabase
            .from('workspace_members')
            .select('*')
            .eq('user_id', userId)
            .eq('workspace_id', updatedTask.workspace_id)
            .single();

        if (memberError || !memberStats) {
            return res.status(400).json({ error: 'Member not found in workspace' });
        }

        // 3. Game Engine Calculus
        const xpMultiplier = DIFFICULTY_MULTIPLIERS[updatedTask.difficulty] || 1;
        const earnedXp = Math.floor(updatedTask.base_xp * xpMultiplier);
        const earnedCoins = Math.floor((earnedXp / 2) + Math.random() * 5); // Some RNG for coins

        const newTotalXp = memberStats.xp + earnedXp;
        const newCalculatedLevel = calculateLevel(newTotalXp);
        const leveledUp = newCalculatedLevel > memberStats.level;

        // Gacha logic
        let chestDropped = false;
        // If leveled up or RNG hits from the task difficulty
        if (leveledUp || rollForChest(updatedTask.difficulty)) {
            chestDropped = true;
        }

        const newChestsAvailable = memberStats.chests_available + (chestDropped ? 1 : 0);

        // 4. Persistence
        const { data: finalStats, error: finalStatsError } = await supabase
            .from('workspace_members')
            .update({
                xp: newTotalXp,
                level: newCalculatedLevel,
                coins: memberStats.coins + earnedCoins,
                chests_available: newChestsAvailable,
                last_active_date: new Date().toISOString().split('T')[0] // For streaks
            })
            .eq('id', memberStats.id)
            .select()
            .single();

        if (finalStatsError) throw finalStatsError;

        // Give them a transaction log for the coins
        await supabase.from('transactions').insert({
            user_id: userId,
            workspace_id: updatedTask.workspace_id,
            amount: earnedCoins,
            type: 'earned',
            description: `Recompensa pela tarefa: ${updatedTask.title}`
        });

        // 5. Build Result Payload
        res.json({
            success: true,
            xpEarned: earnedXp,
            coinsEarned: earnedCoins,
            chestDropped,
            leveledUp,
            memberStats: finalStats,
            task: updatedTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Gamification Error' });
    }
});

// 📦 OPEN LOOT BOX ENIGNE 📦
app.post('/api/shop/open-chest', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { workspaceId } = req.body;

        if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

        // Lock & Check
        const { data: member, error } = await supabase
            .from('workspace_members')
            .select('id, chests_available, chests_opened')
            .eq('user_id', userId)
            .eq('workspace_id', workspaceId)
            .single();

        if (error || member.chests_available <= 0) {
            return res.status(400).json({ error: 'No chests available' });
        }

        // Deduct chest immediately
        await supabase.from('workspace_members')
            .update({
                chests_available: member.chests_available - 1,
                chests_opened: member.chests_opened + 1
            })
            .eq('id', member.id);

        // Calculate Drop RNG
        const numItems = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
        const droppedItems = [];

        // Fetch all generic cosmetic items globally
        const { data: allItems } = await supabase.from('items').select('*');
        if (!allItems || allItems.length === 0) {
            return res.status(500).json({ error: 'No items in database to drop!' });
        }

        for (let i = 0; i < numItems; i++) {
            const rolledRarity = rollRarity();
            // Filter catalog by rarity
            let catalogPool = allItems.filter(item => item.rarity === rolledRarity);
            // Fallback if we don't have items of that rarity yet
            if (catalogPool.length === 0) catalogPool = allItems;

            const droppedItem = catalogPool[Math.floor(Math.random() * catalogPool.length)];
            droppedItems.push(droppedItem);

            // Upsert into inventory securely using Service Role
            const { data: inventoryItem } = await supabase
                .from('inventories')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('item_id', droppedItem.id)
                .maybeSingle();

            if (inventoryItem) {
                await supabase.from('inventories').update({ quantity: inventoryItem.quantity + 1 }).eq('id', inventoryItem.id);
            } else {
                await supabase.from('inventories').insert({ user_id: userId, item_id: droppedItem.id, quantity: 1 });
            }
        }

        res.json({
            success: true,
            items: droppedItems,
            newChestsAvailable: member.chests_available - 1,
            newChestsOpened: member.chests_opened + 1
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Gamification Error' });
    }
});

// 👑 ADMIN SANDBOX: ADD CHESTS 👑
app.post('/api/admin/add-chests', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // 1. Get user's primary workspace
        const { data: workspaces, error: wpError } = await supabase
            .from('workspace_members')
            .select('workspace_id, chests_available')
            .eq('user_id', userId);

        if (wpError || !workspaces || workspaces.length === 0) {
            return res.status(400).json({ error: 'User is not in any workspace' });
        }

        const workspaceId = workspaces[0].workspace_id;
        const currentChests = workspaces[0].chests_available || 0;
        const newTotal = currentChests + amount;

        // 2. Update securely bypassing RLS via Service Role Key
        const { error: updateError } = await supabase
            .from('workspace_members')
            .update({ chests_available: newTotal })
            .eq('user_id', userId)
            .eq('workspace_id', workspaceId);

        if (updateError) throw updateError;

        res.json({ success: true, newTotal });

    } catch (err) {
        console.error('Admin Add Chests Error:', err);
        res.status(500).json({ error: 'Failed to add chests' });
    }
});

app.listen(port, () => {
    console.log(`🚀 QuestForge Backend Engine running on port ${port}`);
});
