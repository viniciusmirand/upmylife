import { useGame } from '../../contexts/GameContext';
import { Link } from 'react-router-dom';
import { ListChecks, Box, Trophy, TrendingUp, Zap, Target, Star, ChevronRight } from 'lucide-react';

export default function Dashboard() {
    const { state, progress, currentLevelXP, xpNeeded, pendingTasks, completedTasks } = useGame();

    const todayTasks = pendingTasks.filter(t => t.category === 'daily');
    const recentCompleted = completedTasks.slice(0, 5);

    const stats = [
        { label: 'Quests Completed', value: completedTasks.length, icon: ListChecks, color: 'text-game-uncommon', bg: 'bg-game-uncommon/10', border: 'border-game-uncommon/20' },
        { label: 'Total XP', value: state.user.totalXP.toLocaleString(), icon: Zap, color: 'text-game-primary', bg: 'bg-game-primary/10', border: 'border-game-primary/20' },
        { label: 'Loot Boxes', value: state.user.chestsAvailable, icon: Box, color: 'text-game-epic', bg: 'bg-game-epic/10', border: 'border-game-epic/20' },
        { label: 'Milestones', value: state.achievements.length, icon: Trophy, color: 'text-game-legendary', bg: 'bg-game-legendary/10', border: 'border-game-legendary/20' },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl">
                {/* Background Details */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-game-primary/20 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-game-secondary/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-game-primary to-game-secondary p-1 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                                <div className="w-full h-full bg-game-bg rounded-xl flex items-center justify-center text-4xl shadow-inner">
                                    🧙
                                </div>
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-game-legendary rounded-lg rotate-12 flex items-center justify-center border-2 border-game-bg shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                                <Star className="w-4 h-4 text-black" fill="currentColor" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-wider">Greetings, {state.user.name.split('@')[0]}!</h1>
                            <p className="text-game-uncommon font-medium mb-4 tracking-widest text-sm uppercase">Level {state.user.level} Acolyte</p>

                            <div className="max-w-md">
                                <div className="flex justify-between text-xs font-bold text-game-common/60 mb-2 uppercase tracking-wider">
                                    <span>{currentLevelXP} XP</span>
                                    <span>Next: {xpNeeded} XP</span>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-game-uncommon to-teal-400 shadow-[0_0_15px_rgba(0,255,102,0.5)] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.round(progress * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className={`glass-panel p-6 rounded-2xl border ${stat.border} flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg`}>
                        <div className={`w-12 h-12 rounded-xl border border-white/10 ${stat.bg} ${stat.color} flex items-center justify-center mb-3 shadow-inner`}>
                            <stat.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="text-3xl font-display font-bold text-white mb-1 tracking-wider">{stat.value}</div>
                        <div className="text-xs font-medium text-game-common/60 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Pending Tasks */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-game-primary/20 rounded-lg text-game-primary">
                                <Target size={20} />
                            </div>
                            <h2 className="text-lg font-display font-bold text-white tracking-widest uppercase">Active Quests</h2>
                        </div>
                        <Link to="/tasks" className="text-xs font-bold text-game-primary hover:text-indigo-400 flex items-center gap-1 uppercase tracking-wider transition-colors">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {pendingTasks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4">🎯</div>
                                <h3 className="text-white font-bold mb-2">No Active Quests</h3>
                                <p className="text-sm text-game-common/60 mb-6">Your quest log is empty. Visit the bounty board to start a new journey.</p>
                                <Link to="/tasks" className="btn-primary text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                    Accept Quest
                                </Link>
                            </div>
                        ) : (
                            pendingTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform">
                                            {task.category === 'daily' ? '📅' : task.category === 'weekly' ? '📆' : task.category === 'goal' ? '🎯' : '🎪'}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium text-sm md:text-base group-hover:text-game-primary transition-colors">{task.title}</h4>
                                            <p className="text-xs text-game-common/50 uppercase tracking-wider mt-1">{task.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-game-uncommon font-bold text-sm whitespace-nowrap bg-game-uncommon/10 px-2 py-1 rounded-md border border-game-uncommon/20 shadow-inner">
                                        +{task.base_xp || task.xpReward} XP
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-[400px]">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                        <div className="p-2 bg-game-epic/20 rounded-lg text-game-epic">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="text-lg font-display font-bold text-white tracking-widest uppercase">Chronicles</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative">
                        {/* Timeline line */}
                        {recentCompleted.length > 0 && (
                            <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-game-epic/50 to-transparent pointer-events-none"></div>
                        )}

                        {recentCompleted.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4">📜</div>
                                <h3 className="text-white font-bold mb-2">Blank Slate</h3>
                                <p className="text-sm text-game-common/60">Complete quests to write your legend in the chronicles.</p>
                            </div>
                        ) : (
                            recentCompleted.map((task, index) => (
                                <div key={task.id} className="relative pl-14 opacity-80 hover:opacity-100 transition-opacity">
                                    {/* Timeline dot */}
                                    <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-game-epic border-2 border-black shadow-[0_0_10px_rgba(176,38,255,0.8)] z-10"></div>

                                    <div className="p-4 rounded-xl bg-gradient-to-r from-game-epic/10 to-transparent border border-game-epic/10 backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-white font-medium text-sm truncate pr-4 line-through decoration-game-common/30">{task.title}</h4>
                                            <span className="text-game-epic font-bold text-xs whitespace-nowrap drop-shadow-md">
                                                +{task.base_xp || task.xpReward} XP
                                            </span>
                                        </div>
                                        <div className="text-xs text-game-common/50 capitalize flex items-center gap-1">
                                            <span className="text-green-400">✓ Completed</span>
                                            <span className="opacity-50">•</span>
                                            <span>{new Date(task.completed_at || task.completedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Loot Boxes Call to Action */}
            {state.user.chestsAvailable > 0 && (
                <Link to="/chests" className="group block relative overflow-hidden glass-panel rounded-2xl p-6 border-2 border-game-legendary shadow-[0_0_30px_rgba(255,184,0,0.15)] hover:shadow-[0_0_40px_rgba(255,184,0,0.3)] transition-all transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-game-legendary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-5xl drop-shadow-[0_0_15px_rgba(255,184,0,0.8)] animate-pulse">
                                📦
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-game-legendary mb-1">Unclaimed Loot!</h3>
                                <p className="text-white/80">You have <strong className="text-white">{state.user.chestsAvailable}</strong> chest{state.user.chestsAvailable > 1 ? 's' : ''} waiting to be opened.</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-game-legendary/20 flex items-center justify-center text-game-legendary group-hover:bg-game-legendary group-hover:text-black transition-colors">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
}
