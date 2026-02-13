import { useGame } from '../../contexts/GameContext';
import { Link } from 'react-router-dom';
import { ListChecks, Box, Trophy, TrendingUp, Zap, Target } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const { state, progress, currentLevelXP, xpNeeded, pendingTasks, completedTasks } = useGame();

    const todayTasks = pendingTasks.filter(t => t.category === 'daily');
    const recentCompleted = completedTasks.slice(0, 5);

    const stats = [
        { label: 'Tarefas Completadas', value: completedTasks.length, icon: ListChecks, color: 'var(--cat-daily)' },
        { label: 'XP Total', value: state.user.totalXP.toLocaleString(), icon: Zap, color: 'var(--accent-primary)' },
        { label: 'Baús Disponíveis', value: state.user.chestsAvailable, icon: Box, color: 'var(--rarity-epic)' },
        { label: 'Conquistas', value: state.achievements.length, icon: Trophy, color: 'var(--rarity-legendary)' },
    ];

    return (
        <div className="dashboard animate-fade-in">
            {/* Hero */}
            <div className="dashboard-hero glass-card">
                <div className="hero-left">
                    <div className="hero-avatar">
                        <div className="hero-avatar-circle">🧙</div>
                        <div className="hero-avatar-glow" />
                    </div>
                    <div className="hero-info">
                        <h1>Olá, {state.user.name}!</h1>
                        <p className="hero-subtitle">Nível {state.user.level} • Aventureiro</p>
                        <div className="hero-xp-bar">
                            <div className="hero-xp-track">
                                <div
                                    className="hero-xp-fill"
                                    style={{ width: `${Math.round(progress * 100)}%` }}
                                />
                            </div>
                            <div className="hero-xp-text">
                                <span>{currentLevelXP} / {xpNeeded} XP</span>
                                <span>Nível {state.user.level + 1}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="hero-level-badge">
                        <span className="level-number">{state.user.level}</span>
                        <span className="level-label">NÍVEL</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="dashboard-stats">
                {stats.map(stat => (
                    <div key={stat.label} className="stat-card glass-card">
                        <div className="stat-icon" style={{ color: stat.color }}>
                            <stat.icon size={22} />
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-grid">
                {/* Today's Tasks */}
                <div className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2><Target size={20} /> Tarefas Pendentes</h2>
                        <Link to="/tasks" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>Ver Todas</Link>
                    </div>
                    <div className="section-content">
                        {pendingTasks.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">🎯</span>
                                <p>Nenhuma tarefa pendente!</p>
                                <Link to="/tasks" className="btn-primary" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                                    Criar Tarefa
                                </Link>
                            </div>
                        ) : (
                            <div className="quick-task-list">
                                {pendingTasks.slice(0, 5).map(task => (
                                    <div key={task.id} className="quick-task-item">
                                        <div className={`quick-task-cat cat-${task.category}`}>
                                            {task.category === 'daily' ? '📅' : task.category === 'weekly' ? '📆' : task.category === 'goal' ? '🎯' : '🎪'}
                                        </div>
                                        <div className="quick-task-info">
                                            <span className="quick-task-title">{task.title}</span>
                                            <span className="quick-task-xp">+{task.xpReward} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2><TrendingUp size={20} /> Atividade Recente</h2>
                    </div>
                    <div className="section-content">
                        {recentCompleted.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">📋</span>
                                <p>Complete tarefas para ver atividade!</p>
                            </div>
                        ) : (
                            <div className="quick-task-list">
                                {recentCompleted.map(task => (
                                    <div key={task.id} className="quick-task-item completed">
                                        <div className="quick-task-check">✅</div>
                                        <div className="quick-task-info">
                                            <span className="quick-task-title">{task.title}</span>
                                            <span className="quick-task-xp">+{task.xpReward} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chests CTA */}
            {state.user.chestsAvailable > 0 && (
                <Link to="/chests" className="chests-cta glass-card animate-float">
                    <span className="cta-emoji">📦</span>
                    <div className="cta-text">
                        <h3>Você tem {state.user.chestsAvailable} baú{state.user.chestsAvailable > 1 ? 's' : ''} para abrir!</h3>
                        <p>Clique para revelar seus itens</p>
                    </div>
                    <span className="cta-arrow">→</span>
                </Link>
            )}
        </div>
    );
}
