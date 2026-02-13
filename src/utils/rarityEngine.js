// ===== Rarity Drop Engine =====

export const RARITIES = {
    common: { name: 'Comum', color: 'var(--rarity-common)', chance: 0.50, value: 10 },
    uncommon: { name: 'Incomum', color: 'var(--rarity-uncommon)', chance: 0.30, value: 25 },
    rare: { name: 'Raro', color: 'var(--rarity-rare)', chance: 0.15, value: 60 },
    epic: { name: 'Épico', color: 'var(--rarity-epic)', chance: 0.04, value: 150 },
    legendary: { name: 'Lendário', color: 'var(--rarity-legendary)', chance: 0.01, value: 500 },
};

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// Weighted random selection
export function rollRarity() {
    const roll = Math.random();
    let cumulative = 0;

    for (const key of RARITY_ORDER) {
        cumulative += RARITIES[key].chance;
        if (roll < cumulative) return key;
    }

    return 'common'; // fallback
}

// Open a chest: returns array of N item drops (rarity keys)
export function openChest(itemCount = 3) {
    const drops = [];
    for (let i = 0; i < itemCount; i++) {
        drops.push(rollRarity());
    }
    return drops;
}

// Get a random item from the catalog matching a rarity
export function getRandomItemByRarity(catalog, rarity) {
    const matching = catalog.filter(item => item.rarity === rarity);
    if (matching.length === 0) {
        // fallback to any item of lower rarity
        const idx = RARITY_ORDER.indexOf(rarity);
        for (let i = idx - 1; i >= 0; i--) {
            const fallback = catalog.filter(item => item.rarity === RARITY_ORDER[i]);
            if (fallback.length > 0) {
                return fallback[Math.floor(Math.random() * fallback.length)];
            }
        }
        return catalog[Math.floor(Math.random() * catalog.length)];
    }
    return matching[Math.floor(Math.random() * matching.length)];
}

// Full chest opening: returns actual items
export function openChestWithItems(catalog, itemCount = 3) {
    const rarities = openChest(itemCount);
    return rarities.map(rarity => {
        const item = getRandomItemByRarity(catalog, rarity);
        return {
            ...item,
            instanceId: crypto.randomUUID(),
            acquiredAt: new Date().toISOString(),
        };
    });
}
