import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { addXP, xpForDifficulty, levelProgress, xpToNextLevel, xpForLevel } from '../utils/xpEngine';
import { openChestWithItems } from '../utils/rarityEngine';
import ITEM_CATALOG from '../data/itemCatalog';
import ACHIEVEMENTS from '../data/achievements';

const GameContext = createContext(null);

const STORAGE_KEY = 'quest-tasks-state';

// ── Initial State ──
const defaultState = {
    user: {
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
    notifications: [], // { id, type, message, data, seen }
};

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...defaultState, ...parsed };
        }
    } catch (e) {
        console.warn('Failed to load state:', e);
    }
    return defaultState;
}

function saveState(state) {
    try {
        // Don't persist notifications
        const { notifications, ...rest } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch (e) {
        console.warn('Failed to save state:', e);
    }
}

// ── Check achievements ──
function checkAchievements(state) {
    const stats = {
        tasksCompleted: state.tasks.filter(t => t.completed).length,
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
        case 'ADD_TASK': {
            const task = {
                id: crypto.randomUUID(),
                title: action.payload.title,
                description: action.payload.description || '',
                category: action.payload.category || 'daily',
                difficulty: action.payload.difficulty || 'medium',
                xpReward: xpForDifficulty(action.payload.difficulty || 'medium'),
                completed: false,
                completedAt: null,
                createdAt: new Date().toISOString(),
            };
            newState = { ...state, tasks: [task, ...state.tasks] };
            break;
        }

        case 'EDIT_TASK': {
            newState = {
                ...state,
                tasks: state.tasks.map(t =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            ...action.payload,
                            xpReward: action.payload.difficulty
                                ? xpForDifficulty(action.payload.difficulty)
                                : t.xpReward,
                        }
                        : t
                ),
            };
            break;
        }

        case 'COMPLETE_TASK': {
            const task = state.tasks.find(t => t.id === action.payload);
            if (!task || task.completed) return state;

            const xpResult = addXP(state.user.totalXP, task.xpReward);
            const notifications = [];

            if (xpResult.levelsGained > 0) {
                notifications.push({
                    id: crypto.randomUUID(),
                    type: 'level_up',
                    message: `Nível ${xpResult.newLevel}!`,
                    data: { level: xpResult.newLevel, chestsEarned: xpResult.chestsEarned },
                    seen: false,
                });
            }

            notifications.push({
                id: crypto.randomUUID(),
                type: 'xp_gained',
                message: `+${task.xpReward} XP`,
                data: { amount: task.xpReward },
                seen: false,
            });

            newState = {
                ...state,
                tasks: state.tasks.map(t =>
                    t.id === action.payload
                        ? { ...t, completed: true, completedAt: new Date().toISOString() }
                        : t
                ),
                user: {
                    ...state.user,
                    level: xpResult.newLevel,
                    totalXP: xpResult.newTotalXP,
                    chestsAvailable: state.user.chestsAvailable + xpResult.chestsEarned,
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

        case 'OPEN_CHEST': {
            if (state.user.chestsAvailable <= 0) return state;
            const items = openChestWithItems(ITEM_CATALOG, 3);

            newState = {
                ...state,
                user: {
                    ...state.user,
                    chestsAvailable: state.user.chestsAvailable - 1,
                    chestsOpened: state.user.chestsOpened + 1,
                },
                inventory: [...state.inventory, ...items],
                notifications: [
                    ...state.notifications,
                    {
                        id: crypto.randomUUID(),
                        type: 'chest_opened',
                        message: 'Baú aberto!',
                        data: { items },
                        seen: false,
                    },
                ],
            };
            break;
        }

        case 'EQUIP_ITEM': {
            const item = state.inventory.find(i => i.instanceId === action.payload);
            if (!item) return state;

            newState = {
                ...state,
                equippedItems: {
                    ...state.equippedItems,
                    [item.slot]: action.payload,
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

        case 'SET_USER_NAME': {
            newState = {
                ...state,
                user: { ...state.user, name: action.payload },
            };
            break;
        }

        case 'RESET_GAME': {
            newState = { ...defaultState };
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
                        message: def ? def.name : 'Nova conquista!',
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
    const [state, dispatch] = useReducer(gameReducer, null, loadState);

    // Persist on every change
    useEffect(() => {
        saveState(state);
    }, [state]);

    // Computed values
    const progress = levelProgress(state.user.totalXP, state.user.level);
    const xpNeeded = xpToNextLevel(state.user.level);
    const currentLevelXP = state.user.totalXP - xpForLevel(state.user.level);

    const completedTasks = state.tasks.filter(t => t.completed);
    const pendingTasks = state.tasks.filter(t => !t.completed);
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
