import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { addXP, xpForDifficulty, levelProgress, xpToNextLevel, xpForLevel } from '../utils/xpEngine';
import { openChestWithItems } from '../utils/rarityEngine';
import ITEM_CATALOG from '../data/itemCatalog';
import ACHIEVEMENTS from '../data/achievements';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const GameContext = createContext(null);

// ── Initial State ──
const defaultState = {
    user: {
        id: null,
        name: 'Aventureiro',
        level: 1,
        totalXP: 0,
        chestsAvailable: 0,
        chestsOpened: 0,
    },
    tasks: [],
    inventory: [],
    equippedItems: {
        head: null,
        body: null,
        legs: null,
        accessory: null,
        effect: null,
    },
    achievements: [],
    notifications: [],
};

// ── Check achievements ──
function checkAchievements(state) {
    const stats = {
        tasksCompleted: state.tasks.filter(t => t.status === 'completed').length,
        level: state.user.level,
        itemCount: state.inventory.length,
        rareCount: state.inventory.filter(i => i.rarity === 'rare').length,
        epicCount: state.inventory.filter(i => i.rarity === 'epic').length,
        legendaryCount: state.inventory.filter(i => i.rarity === 'legendary').length,
        chestsOpened: state.user.chestsOpened,
        equippedCount: Object.values(state.equippedItems).filter(Boolean).length,
    };

    const newAchievements = [];
    for (const achievement of ACHIEVEMENTS) {
        const alreadyUnlocked = state.achievements.some(a => a.id === achievement.id);
        if (!alreadyUnlocked && achievement.condition(stats)) {
            newAchievements.push({
                id: achievement.id,
                unlockedAt: new Date().toISOString(),
            });
        }
    }

    return newAchievements;
}

// ── Reducer ──
function gameReducer(state, action) {
    let newState;

    switch (action.type) {
        case 'INIT_STATE': {
            return { ...state, ...action.payload };
        }

        case 'ADD_TASK': {
            newState = { ...state, tasks: [action.payload, ...state.tasks] };
            break;
        }

        case 'EDIT_TASK': {
            newState = {
                ...state,
                tasks: state.tasks.map(t =>
                    t.id === action.payload.id ? { ...t, ...action.payload } : t
                ),
            };
            break;
        }

        case 'COMPLETE_TASK_API': {
            // result payload: { success, xpEarned, coinsEarned, chestDropped, leveledUp, memberStats, task }
            const { xpEarned, coinsEarned, chestDropped, leveledUp, memberStats, task } = action.payload;
            const notifications = [];

            if (leveledUp) {
                notifications.push({
                    id: crypto.randomUUID(),
                    type: 'level_up',
                    message: `Level ${memberStats.level}!`,
                    data: { level: memberStats.level, chestsEarned: chestDropped ? 1 : 0 },
                    seen: false,
                });
            }

            notifications.push({
                id: crypto.randomUUID(),
                type: 'xp_gained',
                message: `+${xpEarned} XP`,
                data: { amount: xpEarned },
                seen: false,
            });

            if (coinsEarned > 0) {
                notifications.push({
                    id: crypto.randomUUID(),
                    type: 'coins_gained',
                    message: `+${coinsEarned} Coins`,
                    data: { amount: coinsEarned },
                    seen: false,
                });
            }

            if (chestDropped && !leveledUp) { // if leveledUp, chest message is clustered
                notifications.push({
                    id: crypto.randomUUID(),
                    type: 'chest_dropped',
                    message: `Loot Box Encontrada!`,
                    data: { chestsEarned: 1 },
                    seen: false,
                });
            }

            newState = {
                ...state,
                tasks: state.tasks.map(t =>
                    t.id === task.id
                        ? { ...t, status: 'completed', completed_at: task.completed_at }
                        : t
                ),
                user: {
                    ...state.user,
                    level: memberStats.level,
                    totalXP: memberStats.xp,
                    coins: memberStats.coins,
                    chestsAvailable: memberStats.chests_available,
                    chestsOpened: memberStats.chests_opened || state.user.chestsOpened
                },
                notifications: [...state.notifications, ...notifications],
            };
            break;
        }

        case 'DELETE_TASK': {
            newState = {
                ...state,
                tasks: state.tasks.filter(t => t.id !== action.payload),
            };
            break;
        }

        case 'OPEN_CHEST_API': {
            // result payload: { success, items, newChestsAvailable, newChestsOpened }
            const { items, newChestsAvailable, newChestsOpened } = action.payload;

            newState = {
                ...state,
                user: {
                    ...state.user,
                    chestsAvailable: newChestsAvailable,
                    chestsOpened: newChestsOpened,
                },
                inventory: [...state.inventory, ...items],
                notifications: [
                    ...state.notifications,
                    {
                        id: crypto.randomUUID(),
                        type: 'chest_opened',
                        message: 'Chest Opened!',
                        data: { items },
                        seen: false,
                    },
                ],
            };
            break;
        }

        case 'ADMIN_ADD_CHESTS': {
            newState = {
                ...state,
                user: {
                    ...state.user,
                    chestsAvailable: state.user.chestsAvailable + action.payload,
                }
            };
            break;
        }

        case 'EQUIP_ITEM': {
            // Action payload now is { item, slot } instead of just instanceId
            const { item, slot } = action.payload;
            const inventoryItem = state.inventory.find(i => i.instanceId === item.instanceId);
            if (!inventoryItem) return state;

            newState = {
                ...state,
                equippedItems: {
                    ...state.equippedItems,
                    [slot]: item.instanceId,
                },
            };
            break;
        }

        case 'UNEQUIP_SLOT': {
            newState = {
                ...state,
                equippedItems: {
                    ...state.equippedItems,
                    [action.payload]: null,
                },
            };
            break;
        }

        case 'DISMISS_NOTIFICATION': {
            newState = {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
            };
            break;
        }

        case 'CLEAR_NOTIFICATIONS': {
            newState = { ...state, notifications: [] };
            break;
        }

        default:
            return state;
    }

    // Check for new achievements
    const newAchievements = checkAchievements(newState);
    if (newAchievements.length > 0) {
        newState = {
            ...newState,
            achievements: [...newState.achievements, ...newAchievements],
            notifications: [
                ...newState.notifications,
                ...newAchievements.map(a => {
                    const def = ACHIEVEMENTS.find(d => d.id === a.id);
                    return {
                        id: crypto.randomUUID(),
                        type: 'achievement',
                        message: def ? def.name : 'New Achievement!',
                        data: { achievementId: a.id },
                        seen: false,
                    };
                }),
            ],
        };
    }

    return newState;
}

// ── Provider ──
export function GameProvider({ children }) {
    const { user: authUser, workspace } = useAuth();
    const [state, dispatch] = useReducer(gameReducer, defaultState);

    // Fetch initial data from Supabase
    useEffect(() => {
        if (!authUser) return;

        const fetchData = async () => {
            // MVP Simplification: If no workspace is selected, we fetch/create a personal workspace
            let activeWorkspaceId = workspace?.id;
            let activeMember = null;

            if (!activeWorkspaceId) {
                // Check if user has any workspaces
                const { data: workspaces } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', authUser.id);

                if (workspaces && workspaces.length > 0) {
                    activeWorkspaceId = workspaces[0].workspace_id;
                } else {
                    // Create personal workspace for new users with a client-side UUID to bypass RLS SELECT trap (42501)
                    const newWpId = crypto.randomUUID();
                    await supabase.from('workspaces').insert({ id: newWpId, name: 'Personal Quests' }); // Blind insert, no .select()

                    activeWorkspaceId = newWpId;

                    // Link the user to the new workspace so RLS allows task creation
                    await supabase.from('workspace_members').insert({ workspace_id: newWpId, user_id: authUser.id, role: 'owner' });
                }
            }

            if (!activeWorkspaceId) return;

            // Fetch member data (XP, Level)
            const { data: memberData } = await supabase
                .from('workspace_members')
                .select('*')
                .eq('workspace_id', activeWorkspaceId)
                .eq('user_id', authUser.id)
                .single();

            activeMember = memberData;

            // Fetch tasks
            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .eq('workspace_id', activeWorkspaceId)
                .order('created_at', { ascending: false });

            dispatch({
                type: 'INIT_STATE',
                payload: {
                    user: {
                        id: authUser.id,
                        name: authUser.email,
                        level: activeMember?.level || 1,
                        totalXP: activeMember?.xp || 0,
                        coins: activeMember?.coins || 0,
                        chestsAvailable: activeMember?.chests_available || 0,
                        chestsOpened: activeMember?.chests_opened || 0,
                        streakDays: activeMember?.streak_days || 0
                    },
                    tasks: tasksData || [],
                } // Preserving inventory as local for now until items table is populated via script
            });
        };

        fetchData();
    }, [authUser, workspace]);


    // Action Creators that sync with Supabase
    const addTask = async (payload) => {
        const newTask = {
            title: payload.title,
            description: payload.description || '',
            category: payload.category || 'daily',
            difficulty: payload.difficulty || 'medium',
            base_xp: xpForDifficulty(payload.difficulty || 'medium'),
            status: 'pending',
            created_by: state.user.id
        };

        // Get workspace id (simplification: first workspace of user)
        const { data: workspaces } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', state.user.id);
        if (!workspaces || workspaces.length === 0) return;

        newTask.workspace_id = workspaces[0].workspace_id;

        const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
        if (!error && data) {
            dispatch({ type: 'ADD_TASK', payload: data });
        } else {
            console.error("Failed to insert task:", error);
        }
    };

    const completeTask = async (taskId) => {
        const taskToComplete = state.tasks.find(t => t.id === taskId);
        if (!taskToComplete) return;

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;

            const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/complete`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();

            if (result.success) {
                dispatch({ type: 'COMPLETE_TASK_API', payload: result });
            } else {
                console.error("Failed to complete task on server:", result.error, result.message);
            }
        } catch (e) {
            console.error("Error completing task via API:", e);
        }
    };

    const openChest = async () => {
        if (state.user.chestsAvailable <= 0) return;
        try {
            const { data: workspaces } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', state.user.id);
            if (!workspaces || workspaces.length === 0) return;
            const workspaceId = workspaces[0].workspace_id;

            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;

            const res = await fetch(`http://localhost:4000/api/shop/open-chest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ workspaceId })
            });

            const result = await res.json();
            if (result.success) {
                dispatch({ type: 'OPEN_CHEST_API', payload: result });
                return result; // returning it so ChestPage can hook into animations
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteTask = async (taskId) => {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (!error) {
            dispatch({ type: 'DELETE_TASK', payload: taskId });
        }
    };

    const adminAddChests = async (amount) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;

            const res = await fetch(`http://localhost:4000/api/admin/add-chests`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            const result = await res.json();

            if (result.success) {
                dispatch({ type: 'ADMIN_ADD_CHESTS', payload: amount });
            } else {
                console.error('Failed to add chests via API:', result.error);
            }
        } catch (e) {
            console.error('Network error adding chests:', e);
        }
    };

    // Computed values
    const progress = levelProgress(state.user.totalXP, state.user.level);
    const xpNeeded = xpToNextLevel(state.user.level);
    const currentLevelXP = state.user.totalXP - xpForLevel(state.user.level);

    const completedTasks = state.tasks.filter(t => t.status === 'completed');
    const pendingTasks = state.tasks.filter(t => t.status !== 'completed');
    const unseenNotifications = state.notifications.filter(n => !n.seen);

    const getEquippedItem = useCallback((slot) => {
        const instanceId = state.equippedItems[slot];
        if (!instanceId) return null;
        return state.inventory.find(i => i.instanceId === instanceId) || null;
    }, [state.equippedItems, state.inventory]);

    const value = {
        state,
        dispatch,
        progress,
        xpNeeded,
        currentLevelXP,
        completedTasks,
        pendingTasks,
        unseenNotifications,
        getEquippedItem,

        // Expose new async actions
        addTask,
        completeTask,
        deleteTask,
        openChest,
        adminAddChests
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

export default GameContext;
