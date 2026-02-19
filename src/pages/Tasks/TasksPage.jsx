import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Plus, Check, Trash2, Edit3, X, Star, Filter, Target } from 'lucide-react';

const CATEGORIES = [
    { key: 'all', label: 'All', emoji: '📋' },
    { key: 'daily', label: 'Daily', emoji: '📅' },
    { key: 'weekly', label: 'Weekly', emoji: '📆' },
    { key: 'goal', label: 'Goal', emoji: '🎯' },
    { key: 'event', label: 'Event', emoji: '🎪' },
];

const DIFFICULTIES = [
    { key: 'easy', label: 'Easy', xp: 25, color: 'text-green-400', bg: 'bg-green-400/20', border: 'border-green-400/50' },
    { key: 'medium', label: 'Medium', xp: 50, color: 'text-game-primary', bg: 'bg-game-primary/20', border: 'border-game-primary/50' },
    { key: 'hard', label: 'Hard', xp: 100, color: 'text-game-secondary', bg: 'bg-game-secondary/20', border: 'border-game-secondary/50' },
];

export default function TasksPage() {
    const { state, addTask, completeTask, deleteTask, pendingTasks, completedTasks } = useGame();
    const [showForm, setShowForm] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [filter, setFilter] = useState('all');
    const [editingTask, setEditingTask] = useState(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formCat, setFormCat] = useState('daily');
    const [formDiff, setFormDiff] = useState('medium');

    const resetForm = () => {
        setFormTitle('');
        setFormDesc('');
        setFormCat('daily');
        setFormDiff('medium');
        setEditingTask(null);
        setShowForm(false);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setFormTitle(task.title);
        setFormDesc(task.description);
        setFormCat(task.category);
        setFormDiff(task.difficulty);
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formTitle.trim()) return;

        if (editingTask) {
            // Edit not implemented in MVP Backend yet, ignoring
        } else {
            addTask({ title: formTitle, description: formDesc, category: formCat, difficulty: formDiff });
        }
        resetForm();
    };

    const filteredPending = filter === 'all' ? pendingTasks : pendingTasks.filter(t => t.category === filter);
    const filteredHistory = filter === 'all' ? completedTasks : completedTasks.filter(t => t.category === filter);

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-game-primary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-game-primary/20 rounded-lg text-game-primary">
                            <Target size={24} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Quests</h1>
                    </div>
                    <p className="text-game-common/60 font-medium tracking-wide">
                        <strong className="text-game-primary">{pendingTasks.length}</strong> active • <strong className="text-game-uncommon">{completedTasks.length}</strong> completed
                    </p>
                </div>
                <button
                    className="btn-primary flex items-center justify-center gap-2 py-3 px-6 shadow-[0_0_15px_rgba(99,102,241,0.4)] relative z-10"
                    onClick={() => { resetForm(); setShowForm(true); }}
                >
                    <Plus size={18} /> Accept Quest
                </button>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto custom-scrollbar pb-2 gap-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-all ${filter === cat.key
                                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                : 'glass-panel text-game-common/70 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'
                            }`}
                        onClick={() => setFilter(cat.key)}
                    >
                        <span>{cat.emoji}</span> {cat.label}
                    </button>
                ))}
            </div>

            {/* Task Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <form
                        className="glass-panel w-full max-w-lg p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden animate-scale-in"
                        onClick={e => e.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-primary to-game-secondary"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
                                {editingTask ? 'Edit Quest' : 'New Quest'}
                            </h2>
                            <button type="button" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-game-common/70 flex transition-colors" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-game-common/60 uppercase tracking-wider mb-2">Quest Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                    placeholder="Ex: Slay the React component bug"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-game-primary focus:ring-1 focus:ring-game-primary transition-all shadow-inner"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-game-common/60 uppercase tracking-wider mb-2">Description / Lore (Optional)</label>
                                <textarea
                                    value={formDesc}
                                    onChange={e => setFormDesc(e.target.value)}
                                    placeholder="Details of the bounty..."
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-game-primary focus:ring-1 focus:ring-game-primary transition-all shadow-inner resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-game-common/60 uppercase tracking-wider mb-2">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                                        <button
                                            key={cat.key}
                                            type="button"
                                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border ${formCat === cat.key
                                                    ? 'bg-game-primary/20 text-game-primary border-game-primary/50'
                                                    : 'bg-black/40 text-game-common/50 border-white/5 hover:bg-white/5 hover:text-white'
                                                }`}
                                            onClick={() => setFormCat(cat.key)}
                                        >
                                            {cat.emoji} {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-game-common/60 uppercase tracking-wider mb-2">Difficulty & Rewards</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {DIFFICULTIES.map(diff => (
                                        <button
                                            key={diff.key}
                                            type="button"
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${formDiff === diff.key
                                                    ? `${diff.bg} ${diff.border} ${diff.color}`
                                                    : 'bg-black/40 border-white/5 text-game-common/50 hover:bg-white/5 hover:text-white'
                                                }`}
                                            onClick={() => setFormDiff(diff.key)}
                                        >
                                            <div className="flex items-center gap-1 mb-1 text-sm font-bold uppercase">
                                                <Star size={14} fill={formDiff === diff.key ? 'currentColor' : 'none'} />
                                                {diff.label}
                                            </div>
                                            <div className="text-xs opacity-80">+{diff.xp} XP</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full btn-primary py-4 text-base tracking-widest uppercase mt-4 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                {editingTask ? 'Save Scroll' : 'Scribe Quest'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Task List */}
            <div className="space-y-4">
                {filteredPending.length === 0 && !showHistory ? (
                    <div className="glass-panel border-dashed border-2 border-white/10 p-12 rounded-2xl flex flex-col items-center justify-center text-center mt-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-game-primary/5 pattern-dots pointer-events-none"></div>
                        <div className="w-20 h-20 bg-game-card rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl border border-white/5 relative z-10 text-game-primary">
                            <Target size={32} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2 relative z-10">No Active Bounties</h2>
                        <p className="text-game-common/60 max-w-md mx-auto mb-6 relative z-10">Your quest log is completely empty for this category. Ready to take on a new challenge?</p>
                        <button className="btn-primary relative z-10" onClick={() => { resetForm(); setShowForm(true); }}>
                            <Plus size={18} className="inline mr-2" /> Find Quests
                        </button>
                    </div>
                ) : (
                    filteredPending.map((task, i) => {
                        const diffConfig = DIFFICULTIES.find(d => d.key === task.difficulty) || DIFFICULTIES[1];
                        const catConfig = CATEGORIES.find(c => c.key === task.category);

                        return (
                            <div
                                key={task.id}
                                className="group relative glass-panel rounded-2xl border border-white/5 p-5 hover:border-white/20 hover:bg-white/5 transition-all overflow-hidden flex flex-col md:flex-row gap-4 md:items-center"
                            >
                                {/* Difficulty Glow line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${diffConfig.bg}`}></div>

                                <button
                                    className="w-12 h-12 shrink-0 rounded-xl bg-black/40 border border-white/10 hover:border-game-uncommon hover:bg-game-uncommon/20 hover:text-game-uncommon text-game-common/30 flex items-center justify-center transition-all cursor-pointer group-hover:shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                                    onClick={() => completeTask(task.id)}
                                    title="Complete Quest"
                                >
                                    <Check size={24} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-game-primary transition-colors truncate">{task.title}</h3>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-game-common/50 hover:text-white bg-black/40 hover:bg-white/10 rounded-lg transition-colors" onClick={() => openEdit(task)} title="Edit">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="p-2 text-game-common/50 hover:text-red-400 bg-black/40 hover:bg-red-500/20 rounded-lg transition-colors" onClick={() => deleteTask(task.id)} title="Abandon">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {task.description && <p className="text-sm text-game-common/60 line-clamp-2 mb-3">{task.description}</p>}

                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-game-common/80 border border-white/5">
                                            {catConfig?.emoji} {catConfig?.label}
                                        </span>
                                        <span className="flex items-center gap-1 bg-game-uncommon/10 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-game-uncommon border border-game-uncommon/20">
                                            +{task.base_xp || diffConfig.xp} XP
                                        </span>
                                        <span className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${diffConfig.color} bg-black/40 border border-white/5`}>
                                            <Star size={12} fill="currentColor" /> {diffConfig.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* History Toggle & List */}
            {completedTasks.length > 0 && (
                <div className="pt-8 border-t border-white/5">
                    <div className="flex justify-center mb-6">
                        <button
                            className="bg-black/40 hover:bg-white/10 text-game-common/60 hover:text-white border border-white/5 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            {showHistory ? 'Hide Chronicles' : 'View Chronicles'} ({filteredHistory.length})
                        </button>
                    </div>

                    {showHistory && (
                        <div className="space-y-3">
                            {filteredHistory.map(task => {
                                const catConfig = CATEGORIES.find(c => c.key === task.category);
                                return (
                                    <div key={task.id} className="glass-panel p-4 rounded-xl border border-white/5 bg-white/5 opacity-70 flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-game-uncommon/20 text-game-uncommon flex items-center justify-center border border-game-uncommon/30 shadow-[0_0_10px_rgba(0,255,102,0.2)]">
                                            <Check size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-white line-through decoration-white/30 truncate mb-2">{task.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-xs text-game-common/50 uppercase tracking-wider flex items-center gap-1">
                                                    {catConfig?.emoji} {catConfig?.label}
                                                </span>
                                                <span className="text-xs font-bold text-game-uncommon uppercase tracking-wider">
                                                    +{task.base_xp} XP
                                                </span>
                                                <span className="text-xs text-game-common/40">
                                                    {new Date(task.completed_at || task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
