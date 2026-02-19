import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { RARITIES } from '../../utils/rarityEngine';
import { Box, Sparkles, AlertCircle } from 'lucide-react';

export default function ChestPage() {
    const { state, dispatch, openChest } = useGame();
    const [opening, setOpening] = useState(false);
    const [phase, setPhase] = useState('idle'); // idle, shaking, reveal
    const [revealedItems, setRevealedItems] = useState([]);
    const [revealIndex, setRevealIndex] = useState(-1);

    const handleOpen = async () => {
        if (state.user.chestsAvailable <= 0 || opening) return;

        setOpening(true);
        setPhase('shaking');

        // Allow shake animation to play, then call API
        setTimeout(async () => {
            const result = await openChest();
            if (result && result.success) {
                // Wait a bit for the state to update and the notification to trigger
                setTimeout(() => {
                    setPhase('reveal');
                }, 500);
            } else {
                setOpening(false);
                setPhase('idle');
                alert("Erro ao abrir o baú no servidor.");
            }
        }, 1500);
    };

    // Listen for chest_opened notifications to get items
    const lastChestNotif = [...state.notifications].reverse().find(n => n.type === 'chest_opened');

    // Trigger reveal when phase changes
    if (phase === 'reveal' && revealedItems.length === 0 && lastChestNotif?.data?.items) {
        const items = lastChestNotif.data.items;
        setRevealedItems(items);
        setRevealIndex(0);

        items.forEach((_, i) => {
            setTimeout(() => {
                setRevealIndex(prev => prev + 1);
            }, (i + 1) * 600);
        });

        setTimeout(() => {
            setOpening(false);
            setPhase('idle');
            setRevealIndex(-1);
            dispatch({ type: 'DISMISS_NOTIFICATION', payload: lastChestNotif.id });
        }, items.length * 600 + 2000);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in relative pt-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-game-legendary/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10 w-full flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-game-legendary/20 rounded-lg text-game-legendary">
                                <Box size={28} strokeWidth={1.5} />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-widest uppercase text-shadow-sm">Loot Boxes</h1>
                        </div>
                        <p className="text-game-common/70 font-medium tracking-wide">
                            Open chests to discover random gear with varying rarities!
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                        <span className="text-3xl text-game-legendary drop-shadow-md">📦</span>
                        <div>
                            <div className="text-2xl font-display font-bold text-white leading-none">{state.user.chestsAvailable}</div>
                            <div className="text-[10px] font-bold text-game-common/50 uppercase tracking-widest">Available</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6">

                {/* Chest Arena (Left col) */}
                <div className="md:col-span-8 lg:col-span-8 space-y-6">
                    <div className="glass-panel rounded-2xl border border-white/5 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-game-bg via-black/80 to-black/90 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">

                        {/* Interactive Area */}
                        {state.user.chestsAvailable > 0 || phase !== 'idle' ? (
                            <div className="relative z-20 flex flex-col items-center">

                                {/* Chest Itself */}
                                <div
                                    className={`relative cursor-pointer transition-transform duration-300 flex flex-col items-center
                                        ${phase === 'idle' && !opening ? 'hover:scale-105 hover:-translate-y-2' : ''}
                                        ${phase === 'shaking' ? 'animate-[shake_0.5s_infinite]' : ''}
                                    `}
                                    onClick={phase === 'idle' ? handleOpen : undefined}
                                >
                                    {/* Glow behind chest */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] -z-10 transition-all duration-500
                                        ${phase === 'idle' ? 'w-48 h-48 bg-game-legendary/20' : ''}
                                        ${phase === 'shaking' ? 'w-64 h-64 bg-game-primary/40 animate-pulse' : ''}
                                        ${phase === 'reveal' ? 'w-96 h-96 bg-game-legendary/40 animate-[spin_4s_linear_infinite]' : ''}
                                    `}></div>

                                    <div className="text-9xl drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] z-10 relative select-none">
                                        {phase === 'idle' ? '📦' : phase === 'shaking' ? '📦' : '✨'}
                                    </div>

                                    {phase === 'idle' && (
                                        <button className="mt-8 px-8 py-3 bg-gradient-to-r from-game-legendary to-yellow-500 text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(255,184,0,0.6)] hover:scale-105 transition-all w-full max-w-[200px]">
                                            Unlock
                                        </button>
                                    )}

                                    {phase === 'shaking' && (
                                        <div className="mt-8 text-game-primary font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                                            <Sparkles size={18} /> Decrypting...
                                        </div>
                                    )}
                                </div>

                                {/* Revealed Items Showcase */}
                                {phase === 'reveal' && revealedItems.length > 0 && (
                                    <div className="absolute inset-0 z-30 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm rounded-2xl animate-fade-in">
                                        <div className="flex gap-6 justify-center items-center flex-wrap max-w-2xl">
                                            {revealedItems.map((item, i) => {
                                                const isVisible = i < revealIndex;
                                                const rarityColor = RARITIES[item.rarity]?.color || 'white';

                                                return (
                                                    <div
                                                        key={item.instanceId}
                                                        className={`transform transition-all duration-700 w-40 h-56 relative
                                                            ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-50 pointer-events-none'}
                                                        `}
                                                        style={{ boxShadow: isVisible ? `0 0 40px ${rarityColor}40` : 'none' }}>
                                                        <div className={`p-10 rounded-2xl bg-black/80 flex flex-col items-center justify-center gap-4 relative overflow-hidden h-full ${isVisible ? 'border border-[' + rarityColor + ']/50' : ''}`}>
                                                            {/* Rarity Background Glow */}
                                                            <div className={`absolute inset-0 bg-gradient-to-t from-['${rarityColor}']/20 to-transparent`}></div>

                                                            <div className={`text-6xl drop-shadow-[0_0_15px_${rarityColor}] z-10 animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }}>
                                                                <img src={item.image_url} alt={item.name} className="w-24 h-24 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" />
                                                            </div>
                                                            <div className="z-10 text-center">
                                                                <h3 className="text-xl font-bold text-white mb-1" style={{ color: rarityColor }}>{item.name}</h3>
                                                                <p className="text-game-common/60 text-xs font-bold uppercase tracking-widest">{RARITIES[item.rarity]?.name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center max-w-md z-10 relative">
                                <div className="text-6xl mb-4 opacity-50 drop-shadow-md">📭</div>
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest text-shadow-sm">Storage Empty</h2>
                                <p className="text-game-common/60 font-medium">
                                    You have no loot boxes to open. Complete quests and level up to earn more rewards!
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Info Sidebar (Right col) */}
                <div className="md:col-span-4 lg:col-span-4 space-y-6">

                    {/* Stats */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle size={16} className="text-game-primary" />
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Vault Stats</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-game-common/60 uppercase tracking-widest">Opened</span>
                                <span className="text-lg font-display font-bold text-white">{state.user.chestsOpened}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-game-common/60 uppercase tracking-widest">Total Items</span>
                                <span className="text-lg font-display font-bold text-white">{state.inventory.length}</span>
                            </div>
                            <div className="flex justify-between items-center bg-game-legendary/10 p-3 rounded-lg border border-game-legendary/20">
                                <span className="text-xs font-bold text-game-legendary/80 uppercase tracking-widest">Legendaries</span>
                                <span className="text-lg font-display font-bold text-game-legendary drop-shadow-md">
                                    {state.inventory.filter(i => i.rarity === 'legendary').length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rarity Table */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Drop Rates</h3>

                        <div className="space-y-3">
                            {Object.entries(RARITIES).map(([key, r]) => (
                                <div key={key} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/5">
                                    <div className="w-24 shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-center" style={{ backgroundColor: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40` }}>
                                        {r.name}
                                    </div>
                                    <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden">
                                        <div
                                            className="h-full shadow-[0_0_5px_currentColor]"
                                            style={{ width: `${Math.max(r.chance * 100, 2)}%`, backgroundColor: r.color }}
                                        ></div>
                                    </div>
                                    <div className="w-12 text-right text-xs font-bold text-white opacity-80">
                                        {r.chance * 100}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
