// ===== XP & Level Engine =====

// XP required to reach a specific level (exponential curve)
// Level 1 → 0 XP, Level 2 → 100 XP, Level 3 → 220 XP, etc.
export function xpForLevel(level) {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level - 1, 1.5));
}

// XP needed to go FROM current level TO next level
export function xpToNextLevel(level) {
    return xpForLevel(level + 1) - xpForLevel(level);
}

// Calculate what level you'd be at with this total XP
export function levelFromTotalXP(totalXP) {
    let level = 1;
    while (xpForLevel(level + 1) <= totalXP) {
        level++;
        if (level > 999) break; // safety
    }
    return level;
}

// Progress within current level (0.0 to 1.0)
export function levelProgress(totalXP, level) {
    const currentLevelXP = xpForLevel(level);
    const nextLevelXP = xpForLevel(level + 1);
    const range = nextLevelXP - currentLevelXP;
    if (range <= 0) return 1;
    return Math.min(1, (totalXP - currentLevelXP) / range);
}

// Add XP and return result
export function addXP(currentTotalXP, amount) {
    const newTotalXP = currentTotalXP + amount;
    const oldLevel = levelFromTotalXP(currentTotalXP);
    const newLevel = levelFromTotalXP(newTotalXP);
    const levelsGained = newLevel - oldLevel;

    return {
        newTotalXP,
        newLevel,
        levelsGained,
        chestsEarned: levelsGained, // 1 chest per level-up
        progress: levelProgress(newTotalXP, newLevel),
        xpToNext: xpToNextLevel(newLevel),
        currentLevelXP: newTotalXP - xpForLevel(newLevel),
    };
}

// XP reward based on task difficulty
export function xpForDifficulty(difficulty) {
    const table = {
        easy: 25,
        medium: 50,
        hard: 100,
    };
    return table[difficulty] || 50;
}
