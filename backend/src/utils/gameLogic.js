// Core Gamification Constants & Math

const DIFFICULTY_MULTIPLIERS = {
    'easy': 1,
    'medium': 1.5,
    'hard': 2.5,
    'epic': 5
};

const DROP_CHANCES = {
    'easy': 0.05,   // 5% chance to drop a chest
    'medium': 0.15, // 15%
    'hard': 0.30,   // 30%
    'epic': 1.0     // 100% chance
};

const RARITIES = {
    common: { chance: 0.60, name: 'Comum' },
    uncommon: { chance: 0.25, name: 'Incomum' },
    rare: { chance: 0.10, name: 'Raro' },
    epic: { chance: 0.04, name: 'Épico' },
    legendary: { chance: 0.01, name: 'Lendário' }
};

// Math to calculate Level based on total XP
function calculateLevel(totalXp) {
    // Basic curve: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, Level 4 = 450 XP
    // Formula approximation: xp = 50 * (level - 1)^2 + 50 * (level - 1)
    let level = 1;
    let requiredXp = 100;
    let currentXp = totalXp;

    while (currentXp >= requiredXp) {
        currentXp -= requiredXp;
        level++;
        requiredXp = Math.floor(requiredXp * 1.2 + 50); // Increment curve
    }
    return level;
}

// Roll for a chest drop
function rollForChest(difficulty) {
    const chance = DROP_CHANCES[difficulty] || 0;
    return Math.random() < chance;
}

// Roll for an item rarity from a chest
function rollRarity() {
    const roll = Math.random();
    let cumulative = 0;
    for (const [rarity, data] of Object.entries(RARITIES)) {
        cumulative += data.chance;
        if (roll <= cumulative) {
            return rarity;
        }
    }
    return 'common'; // Fallback
}

module.exports = {
    DIFFICULTY_MULTIPLIERS,
    DROP_CHANCES,
    RARITIES,
    calculateLevel,
    rollForChest,
    rollRarity
};
