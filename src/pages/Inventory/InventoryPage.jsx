import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { RARITIES, RARITY_ORDER } from '../../utils/rarityEngine';
import { SLOTS } from '../../data/itemCatalog';
import { Filter, Backpack } from 'lucide-react';

export default function InventoryPage() {
    const { state, dispatch } = useGame();
    const [slotFilter, setSlotFilter] = useState('all');
    const [rarityFilter, setRarityFilter] = useState('all');

    let filtered = [...state.inventory];
    if (slotFilter !== 'all') filtered = filtered.filter(i => i.slot === slotFilter);
    if (rarityFilter !== 'all') filtered = filtered.filter(i => i.rarity === rarityFilter);

    // Sort by Rarity (Highest first)
    filtered.sort((a, b) => {
        const orderA = RARITY_ORDER.indexOf(a.rarity);
        const orderB = RARITY_ORDER.indexOf(b.rarity);
        return orderB - orderA; // Highest index (Mythic) first
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative pt-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-game-secondary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-game-secondary/20 rounded-lg text-game-secondary">
                            <Backpack size={24} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Arsenal</h1>
                    </div>
                    <p className="text-game-common/60 font-medium tracking-wide">
                        <strong className="text-white">{state.inventory.length}</strong> Item{state.inventory.length !== 1 ? 's' : ''} stored in your vault.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 space-y-4">

                {/* Slot Filter */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-game-common/50 uppercase tracking-widest w-24 shrink-0">
                        <Filter size={14} /> Slot
                    </span>
                    <div className="flex overflow-x-auto custom-scrollbar pb-1 md:pb-0 gap-2 flex-1">
                        <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${slotFilter === 'all' ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-black/40 text-game-common/60 border-white/5 hover:bg-white/10 hover:text-white'}`}
                            onClick={() => setSlotFilter('all')}
                        >
                            All Slots
                        </button>
                        {Object.entries(SLOTS).map(([key, slot]) => (
                            <button
                                key={key}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${slotFilter === key ? 'bg-game-primary/20 text-game-primary border-game-primary/50' : 'bg-black/40 text-game-common/60 border-white/5 hover:bg-white/10 hover:text-white'}`}
                                onClick={() => setSlotFilter(key)}
                            >
                                <span>{slot.emoji}</span> {slot.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                {/* Rarity Filter */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-game-common/50 uppercase tracking-widest w-24 shrink-0">
                        <Filter size={14} /> Rarity
                    </span>
                    <div className="flex overflow-x-auto custom-scrollbar pb-1 md:pb-0 gap-2 flex-1">
                        <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${rarityFilter === 'all' ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-black/40 text-game-common/60 border-white/5 hover:bg-white/10 hover:text-white'}`}
                            onClick={() => setRarityFilter('all')}
                        >
                            All Rarities
                        </button>
                        {RARITY_ORDER.map(key => (
                            <button
                                key={key}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${rarityFilter === key ? 'bg-white/10 text-white border-white/20' : 'bg-black/40 text-game-common/60 border-white/5 hover:bg-white/10 hover:text-white'}`}
                                onClick={() => setRarityFilter(key)}
                            >
                                <span className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: RARITIES[key].color }}></span>
                                {RARITIES[key].name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            {filtered.length === 0 ? (
                <div className="glass-panel border-dashed border-2 border-white/10 p-12 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden mt-6">
                    <div className="w-20 h-20 bg-game-card rounded-full flex items-center justify-center text-4xl mb-4 relative z-10 text-game-common/20">
                        📭
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2 relative z-10 uppercase tracking-wider">Vault Empty</h2>
                    <p className="text-game-common/60 max-w-md mx-auto relative z-10 text-sm">
                        {state.inventory.length === 0
                            ? 'Your arsenal is completely barren. Open Loot Boxes by completing Quests to find gear!'
                            : 'No items match the cryptic filters you have selected.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filtered.map((item, i) => {
                        const rarityColor = RARITIES[item.rarity]?.color || 'white';

                        return (
                            <div
                                key={item.instanceId}
                                className={`group relative flex flex-col items-center p-4 rounded-xl border transition-all overflow-hidden bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5`}
                                style={{ animationDelay: `${i * 0.03}s` }}
                            >
                                {/* Rarity Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[40px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" style={{ backgroundColor: rarityColor }}></div>

                                <div className="text-5xl mb-3 drop-shadow-lg transform group-hover:scale-110 transition-transform relative z-10">
                                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]" />
                                </div>

                                <div className="w-full text-center relative z-10">
                                    <h3 className="text-white font-bold text-sm truncate w-full mb-1 group-hover:text-game-primary transition-colors">{item.name}</h3>

                                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                        <span className="bg-black/50 px-1.5 py-0.5 rounded text-game-common/60 inline-flex items-center gap-1 border border-white/5">
                                            {SLOTS[item.slot]?.emoji} {SLOTS[item.slot]?.name}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-0.5 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full shadow-[0_0_5px_currentColor]" style={{ width: '100%', backgroundColor: rarityColor }}></div>
                                    </div>
                                </div>

                                {/* Hover Tooltip (Simulated via group-hover if desktop, but simple layout works better) */}
                                <div className="absolute inset-0 bg-black/95 p-3 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 translate-y-2 group-hover:translate-y-0 text-center rounded-xl border border-white/10 pointer-events-none">
                                    <p className="text-xs text-game-common/80 leading-snug font-medium mb-3">{item.description}</p>
                                    <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-block mx-auto border" style={{ color: rarityColor, borderColor: `${rarityColor}40`, backgroundColor: `${rarityColor}10` }}>
                                        {RARITIES[item.rarity]?.name} Tier
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
