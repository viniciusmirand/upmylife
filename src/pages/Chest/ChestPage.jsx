import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { RARITIES } from '../../utils/rarityEngine';
import './ChestPage.css';

export default function ChestPage() {
    const { state, dispatch } = useGame();
    const [opening, setOpening] = useState(false);
    const [phase, setPhase] = useState('idle'); // idle, shaking, reveal
    const [revealedItems, setRevealedItems] = useState([]);
    const [revealIndex, setRevealIndex] = useState(-1);

    const handleOpen = () => {
        if (state.user.chestsAvailable <= 0 || opening) return;

        setOpening(true);
        setPhase('shaking');

        // Shake phase
        setTimeout(() => {
            dispatch({ type: 'OPEN_CHEST' });

            // Get items from the latest notification
            setTimeout(() => {
                const chestNotif = state.notifications.find(n => n.type === 'chest_opened');
                // We dispatch and then read from updated state, but since reducer is sync,
                // we need to get items from the action itself. Let's use a workaround.
                setPhase('reveal');
            }, 500);
        }, 1500);
    };

    // Listen for chest_opened notifications to get items
    const lastChestNotif = [...state.notifications].reverse().find(n => n.type === 'chest_opened');

    const startReveal = () => {
        if (!lastChestNotif?.data?.items) return;
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
    };

    // Trigger reveal when phase changes
    if (phase === 'reveal' && revealedItems.length === 0 && lastChestNotif?.data?.items) {
        startReveal();
    }

    return (
        <div className="chest-page animate-fade-in">
            <div className="chest-header">
                <h1>📦 Baús de Recompensa</h1>
                <p>Abra baús para descobrir itens aleatórios com diferentes raridades!</p>
            </div>

            {/* Chest display */}
            <div className="chest-arena">
                {state.user.chestsAvailable > 0 || phase !== 'idle' ? (
                    <div className="chest-container" onClick={phase === 'idle' ? handleOpen : undefined}>
                        <div className={`chest-box ${phase}`}>
                            <div className="chest-emoji">
                                {phase === 'idle' ? '📦' : phase === 'shaking' ? '📦' : '✨'}
                            </div>
                            {phase === 'idle' && (
                                <div className="chest-label">
                                    <span className="chest-count">{state.user.chestsAvailable}</span>
                                    <span>baú{state.user.chestsAvailable > 1 ? 's' : ''} disponíve{state.user.chestsAvailable > 1 ? 'is' : 'l'}</span>
                                </div>
                            )}
                            {phase === 'idle' && (
                                <button className="btn-primary chest-open-btn">
                                    Abrir Baú
                                </button>
                            )}
                            {phase === 'shaking' && <p className="chest-opening-text animate-pulse">Abrindo...</p>}
                        </div>

                        {/* Revealed items */}
                        {phase === 'reveal' && revealedItems.length > 0 && (
                            <div className="chest-items-reveal">
                                {revealedItems.map((item, i) => (
                                    <div
                                        key={item.instanceId}
                                        className={`reveal-item ${i < revealIndex ? 'visible' : ''} rarity-glow-${item.rarity}`}
                                        style={{ animationDelay: `${i * 0.2}s` }}
                                    >
                                        <div className="reveal-item-emoji">{item.emoji}</div>
                                        <div className="reveal-item-name">{item.name}</div>
                                        <span className={`rarity-badge rarity-${item.rarity}`}>
                                            {RARITIES[item.rarity]?.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="chest-empty">
                        <div className="empty-chest-icon">📭</div>
                        <h2>Nenhum baú disponível</h2>
                        <p>Complete tarefas e suba de nível para ganhar baús!</p>
                    </div>
                )}
            </div>

            {/* Rarity Table */}
            <div className="rarity-info glass-card">
                <h3>🎲 Tabela de Raridades</h3>
                <div className="rarity-table">
                    {Object.entries(RARITIES).map(([key, r]) => (
                        <div key={key} className="rarity-row">
                            <span className={`rarity-badge rarity-${key}`}>{r.name}</span>
                            <div className="rarity-bar-track">
                                <div
                                    className="rarity-bar-fill"
                                    style={{ width: `${r.chance * 100}%`, background: r.color }}
                                />
                            </div>
                            <span className="rarity-chance">{Math.round(r.chance * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="chest-stats glass-card">
                <h3>📊 Estatísticas</h3>
                <div className="chest-stats-grid">
                    <div className="chest-stat">
                        <span className="chest-stat-value">{state.user.chestsOpened}</span>
                        <span className="chest-stat-label">Baús Abertos</span>
                    </div>
                    <div className="chest-stat">
                        <span className="chest-stat-value">{state.inventory.length}</span>
                        <span className="chest-stat-label">Itens Obtidos</span>
                    </div>
                    <div className="chest-stat">
                        <span className="chest-stat-value">
                            {state.inventory.filter(i => i.rarity === 'legendary').length}
                        </span>
                        <span className="chest-stat-label">Lendários</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
