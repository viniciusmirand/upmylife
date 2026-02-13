import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Plus, Check, Trash2, Edit3, X, Star, Filter } from 'lucide-react';
import './TasksPage.css';

const CATEGORIES = [
    { key: 'all', label: 'Todas', emoji: '📋' },
    { key: 'daily', label: 'Diária', emoji: '📅' },
    { key: 'weekly', label: 'Semanal', emoji: '📆' },
    { key: 'goal', label: 'Meta', emoji: '🎯' },
    { key: 'event', label: 'Evento', emoji: '🎪' },
];

const DIFFICULTIES = [
    { key: 'easy', label: 'Fácil', xp: 25, color: 'var(--diff-easy)' },
    { key: 'medium', label: 'Médio', xp: 50, color: 'var(--diff-medium)' },
    { key: 'hard', label: 'Difícil', xp: 100, color: 'var(--diff-hard)' },
];

export default function TasksPage() {
    const { state, dispatch, pendingTasks, completedTasks } = useGame();
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
            dispatch({
                type: 'EDIT_TASK',
                payload: { id: editingTask.id, title: formTitle, description: formDesc, category: formCat, difficulty: formDiff },
            });
        } else {
            dispatch({
                type: 'ADD_TASK',
                payload: { title: formTitle, description: formDesc, category: formCat, difficulty: formDiff },
            });
        }
        resetForm();
    };

    const filteredPending = filter === 'all' ? pendingTasks : pendingTasks.filter(t => t.category === filter);
    const filteredHistory = filter === 'all' ? completedTasks : completedTasks.filter(t => t.category === filter);

    return (
        <div className="tasks-page animate-fade-in">
            <div className="tasks-header">
                <div>
                    <h1>📋 Tarefas</h1>
                    <p>{pendingTasks.length} pendente{pendingTasks.length !== 1 ? 's' : ''} • {completedTasks.length} completa{completedTasks.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    <Plus size={16} /> Nova Tarefa
                </button>
            </div>

            {/* Filters */}
            <div className="task-filters">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        className={`filter-chip ${filter === cat.key ? 'active' : ''}`}
                        onClick={() => setFilter(cat.key)}
                    >
                        {cat.emoji} {cat.label}
                    </button>
                ))}
            </div>

            {/* Task Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={resetForm}>
                    <form className="task-form glass-card animate-scale-in" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                            <button type="button" className="btn-icon" onClick={resetForm}><X size={18} /></button>
                        </div>

                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={formTitle}
                                onChange={e => setFormTitle(e.target.value)}
                                placeholder="Ex: Estudar React por 30 min"
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label>Descrição (opcional)</label>
                            <textarea
                                value={formDesc}
                                onChange={e => setFormDesc(e.target.value)}
                                placeholder="Detalhes da tarefa..."
                                rows={2}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Categoria</label>
                                <div className="chip-group">
                                    {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                                        <button
                                            key={cat.key}
                                            type="button"
                                            className={`chip cat-${cat.key} ${formCat === cat.key ? 'selected' : ''}`}
                                            onClick={() => setFormCat(cat.key)}
                                        >
                                            {cat.emoji} {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Dificuldade</label>
                                <div className="chip-group">
                                    {DIFFICULTIES.map(diff => (
                                        <button
                                            key={diff.key}
                                            type="button"
                                            className={`chip diff-chip ${formDiff === diff.key ? 'selected' : ''}`}
                                            onClick={() => setFormDiff(diff.key)}
                                            style={{ '--diff-color': diff.color }}
                                        >
                                            <Star size={12} /> {diff.label} ({diff.xp} XP)
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                            {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
                        </button>
                    </form>
                </div>
            )}

            {/* Task List */}
            <div className="task-list">
                {filteredPending.length === 0 && !showHistory ? (
                    <div className="empty-state">
                        <span className="empty-icon">🎯</span>
                        <p>Nenhuma tarefa {filter !== 'all' ? 'nessa categoria' : 'pendente'}!</p>
                        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }} style={{ marginTop: '12px' }}>
                            <Plus size={16} /> Criar Tarefa
                        </button>
                    </div>
                ) : (
                    filteredPending.map((task, i) => (
                        <div
                            key={task.id}
                            className="task-card glass-card"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <button
                                className="task-complete-btn"
                                onClick={() => dispatch({ type: 'COMPLETE_TASK', payload: task.id })}
                                title="Completar tarefa"
                            >
                                <Check size={18} />
                            </button>

                            <div className="task-card-content">
                                <div className="task-card-top">
                                    <h3>{task.title}</h3>
                                    <div className="task-card-actions">
                                        <button className="btn-icon" onClick={() => openEdit(task)} title="Editar">
                                            <Edit3 size={14} />
                                        </button>
                                        <button className="btn-icon" onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })} title="Excluir">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                {task.description && <p className="task-desc">{task.description}</p>}
                                <div className="task-card-meta">
                                    <span className={`cat-badge cat-${task.category}`}>
                                        {CATEGORIES.find(c => c.key === task.category)?.emoji} {CATEGORIES.find(c => c.key === task.category)?.label}
                                    </span>
                                    <span className="task-xp-badge">+{task.xpReward} XP</span>
                                    <span className="task-diff" style={{ color: DIFFICULTIES.find(d => d.key === task.difficulty)?.color }}>
                                        {'★'.repeat(task.difficulty === 'easy' ? 1 : task.difficulty === 'medium' ? 2 : 3)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* History Toggle */}
            {completedTasks.length > 0 && (
                <>
                    <button
                        className="btn-secondary history-toggle"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? 'Ocultar' : 'Mostrar'} Histórico ({filteredHistory.length})
                    </button>

                    {showHistory && (
                        <div className="task-list history">
                            {filteredHistory.map(task => (
                                <div key={task.id} className="task-card glass-card completed">
                                    <div className="task-complete-done">✅</div>
                                    <div className="task-card-content">
                                        <h3>{task.title}</h3>
                                        <div className="task-card-meta">
                                            <span className={`cat-badge cat-${task.category}`}>
                                                {CATEGORIES.find(c => c.key === task.category)?.emoji} {CATEGORIES.find(c => c.key === task.category)?.label}
                                            </span>
                                            <span className="task-xp-badge">+{task.xpReward} XP</span>
                                            <span className="task-date">
                                                {new Date(task.completedAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
