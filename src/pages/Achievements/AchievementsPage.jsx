import { useGame } from '../../contexts/GameContext';
import ACHIEVEMENTS from '../../data/achievements';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

export default function AchievementsPage() {
    const { state } = useGame();

    const unlockedIds = new Set(state.achievements.map(a => a.id));
    const unlockPercentage = Math.round((state.achievements.length / ACHIEVEMENTS.length) * 100) || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative pt-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-game-legendary/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-game-legendary/20 rounded-lg text-game-legendary">
                            <Trophy size={28} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-widest uppercase text-shadow-sm">Milestones</h1>
                    </div>
                    <p className="text-game-common/70 font-medium tracking-wide">
                        Unlock legendary achievements to prove your worth in the guild.
                    </p>
                </div>

                {/* Circular Progress Indicator */}
                <div className="relative z-10 flex items-center justify-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="44" className="stroke-white/10 fill-none" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="44"
                                className="stroke-game-legendary fill-none drop-shadow-[0_0_8px_rgba(255,184,0,0.6)] transition-all duration-1000 ease-out"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="276.46"
                                strokeDashoffset={276.46 - (unlockPercentage / 100) * 276.46}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-display font-bold text-white">{unlockPercentage}%</span>
                        </div>
                    </div>
                    <div className="ml-6">
                        <div className="text-2xl font-bold text-white">{state.achievements.length}</div>
                        <div className="text-[10px] font-bold text-game-common/50 uppercase tracking-widest">Unlocked</div>
                        <div className="w-8 h-px bg-white/10 my-1"></div>
                        <div className="text-lg font-bold text-game-common/50">{ACHIEVEMENTS.length}</div>
                        <div className="text-[10px] font-bold text-game-common/50 uppercase tracking-widest">Total</div>
                    </div>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((achievement, i) => {
                    const unlocked = unlockedIds.has(achievement.id);
                    const unlockData = state.achievements.find(a => a.id === achievement.id);

                    return (
                        <div
                            key={achievement.id}
                            className={`relative glass-panel rounded-xl p-5 border transition-all overflow-hidden flex items-start gap-4 ${unlocked
                                    ? 'bg-gradient-to-r from-game-legendary/10 to-transparent border-game-legendary/30 shadow-[0_0_15px_rgba(255,184,0,0.1)]'
                                    : 'bg-black/40 border-white/5 opacity-70 grayscale-[50%]'
                                }`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {unlocked && (
                                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-game-legendary/5 to-transparent pointer-events-none"></div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl shadow-inner border relative z-10 ${unlocked
                                    ? 'bg-game-legendary/20 border-game-legendary/50 text-game-legendary shadow-[0_0_10px_rgba(255,184,0,0.3)]'
                                    : 'bg-white/5 border-white/10 text-game-common/30'
                                }`}>
                                {unlocked ? achievement.icon : <Lock size={20} strokeWidth={2} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 relative z-10 py-1">
                                <h3 className={`font-bold text-base mb-1 truncate ${unlocked ? 'text-game-legendary' : 'text-game-common/70'}`}>
                                    {achievement.name}
                                </h3>
                                <p className="text-xs text-game-common/60 leading-relaxed mb-2">
                                    {achievement.description}
                                </p>

                                {unlocked && unlockData ? (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-game-legendary/70 bg-black/40 px-2 py-1 rounded inline-block border border-game-legendary/20">
                                        <CheckCircle2 size={12} className="inline" />
                                        Unlocked {new Date(unlockData.unlockedAt || unlockData.unlocked_at).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-game-common/40">
                                        Locked
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
