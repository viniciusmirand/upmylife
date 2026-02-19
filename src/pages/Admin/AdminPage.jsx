import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { ShieldAlert, Box } from 'lucide-react';

export default function AdminPage() {
    const { state, adminAddChests } = useGame();
    const [loading, setLoading] = useState(false);

    const handleGiveChests = async (amount) => {
        setLoading(true);
        await adminAddChests(amount);
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 rounded-2xl border border-red-500/20 relative overflow-hidden bg-red-950/20">
                <div className="relative z-10 flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                        <ShieldAlert size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-red-400 tracking-widest uppercase text-shadow-sm">Admin Sandbox</h1>
                        <p className="text-red-300/60 font-medium tracking-wide">
                            God Mode Tools for Testing Economy and Drops.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-game-legendary/20 flex items-center justify-center text-game-legendary mb-4">
                        <Box size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Inject Chests</h3>
                    <p className="text-game-common/60 text-sm mb-6">Bypass the task system and instantly grant loot boxes to your account for RNG drop tests.</p>

                    <div className="flex gap-4 justify-center">
                        <button
                            disabled={loading}
                            onClick={() => handleGiveChests(5)}
                            className="px-4 py-2 bg-black/60 border border-game-legendary/30 text-game-legendary hover:bg-game-legendary/10 rounded-lg font-bold tracking-widest uppercase transition-colors"
                        >
                            +5 Chests
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleGiveChests(50)}
                            className="px-4 py-2 bg-game-legendary text-black hover:bg-yellow-400 rounded-lg font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(255,184,0,0.4)]"
                        >
                            +50 Chests
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
