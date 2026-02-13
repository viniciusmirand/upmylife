import { useGame } from '../../contexts/GameContext';
import ACHIEVEMENTS from '../../data/achievements';
import './AchievementsPage.css';

export default function AchievementsPage() {
    const { state } = useGame();

    const completedTasks = state.tasks.filter(t => t.completed).length;
    const stats = {
        tasksCompleted: completedTasks,
        level: state.user.level,
        itemCount: state.inventory.length,
        rareCount: state.inventory.filter(i => i.rarity === 'rare').length,
        epicCount: state.inventory.filter(i => i.rarity === 'epic').length,
        legendaryCount: state.inventory.filter(i => i.rarity === 'legendary').length,
        chestsOpened: state.user.chestsOpened,
        equippedCount: Object.values(state.equippedItems).filter(Boolean).length,
    };

    const unlockedIds = new Set(state.achievements.map(a => a.id));

    return (
        <div className="achievements-page animate-fade-in">
            <div className="achievements-header">
                <div>
                    <h1>🏆 Conquistas</h1>
                    <p>{state.achievements.length} de {ACHIEVEMENTS.length} desbloqueadas</p>
                </div>
                <div className="achievements-progress-ring">
                    <svg viewBox="0 0 100 100" className="progress-ring-svg">
                        <circle cx="50" cy="50" r="44" className="progress-ring-bg" />
                        <circle
                            cx="50" cy="50" r="44"
                            className="progress-ring-fill"
                            strokeDasharray={`${(state.achievements.length / ACHIEVEMENTS.length) * 276.46} 276.46`}
                        />
                    </svg>
                    <div className="progress-ring-text">
                        <span className="progress-ring-value">{Math.round((state.achievements.length / ACHIEVEMENTS.length) * 100)}%</span>
                    </div>
                </div>
            </div>

            <div className="achievements-grid">
                {ACHIEVEMENTS.map((achievement, i) => {
                    const unlocked = unlockedIds.has(achievement.id);
                    const unlockData = state.achievements.find(a => a.id === achievement.id);

                    return (
                        <div
                            key={achievement.id}
                            className={`achievement-card glass-card ${unlocked ? 'unlocked' : 'locked'}`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="achievement-icon">
                                {unlocked ? achievement.icon : '🔒'}
                            </div>
                            <div className="achievement-info">
                                <h3>{achievement.name}</h3>
                                <p>{achievement.description}</p>
                                {unlocked && unlockData && (
                                    <span className="achievement-date">
                                        {new Date(unlockData.unlockedAt).toLocaleDateString('pt-BR')}
                                    </span>
                                )}
                            </div>
                            {unlocked && <div className="achievement-check">✅</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
