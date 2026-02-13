import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { RARITIES, RARITY_ORDER } from '../../utils/rarityEngine';
import { SLOTS } from '../../data/itemCatalog';
import { Filter, Package } from 'lucide-react';
import './InventoryPage.css';

export default function InventoryPage() {
    const { state, dispatch } = useGame();
    const [slotFilter, setSlotFilter] = useState('all');
    const [rarityFilter, setRarityFilter] = useState('all');

    let filtered = state.inventory;
    if (slotFilter !== 'all') filtered = filtered.filter(i => i.slot === slotFilter);
    if (rarityFilter !== 'all') filtered = filtered.filter(i => i.rarity === rarityFilter);

    const isEquipped = (instanceId) => {
        return Object.values(state.equippedItems).includes(instanceId);
    };

    return (
        <div className="inventory-page animate-fade-in">
            <div className="inventory-header">
                <div>
                    <h1>🎒 Inventário</h1>
                    <p>{state.inventory.length} ite{state.inventory.length !== 1 ? 'ns' : 'm'}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="inventory-filters">
                <div className="filter-section">
                    <span className="filter-label"><Filter size={14} /> Slot:</span>
                    <button className={`filter-chip ${slotFilter === 'all' ? 'active' : ''}`} onClick={() => setSlotFilter('all')}>Todos</button>
                    {Object.entries(SLOTS).map(([key, slot]) => (
                        <button
                            key={key}
                            className={`filter-chip ${slotFilter === key ? 'active' : ''}`}
                            onClick={() => setSlotFilter(key)}
                        >
                            {slot.emoji} {slot.name}
                        </button>
                    ))}
                </div>
                <div className="filter-section">
                    <span className="filter-label">Raridade:</span>
                    <button className={`filter-chip ${rarityFilter === 'all' ? 'active' : ''}`} onClick={() => setRarityFilter('all')}>Todas</button>
                    {RARITY_ORDER.map(key => (
                        <button
                            key={key}
                            className={`filter-chip ${rarityFilter === key ? 'active' : ''}`}
                            onClick={() => setRarityFilter(key)}
                        >
                            <span className={`rarity-dot rarity-dot-${key}`} />
                            {RARITIES[key].name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items grid */}
            {filtered.length === 0 ? (
                <div className="empty-state" style={{ marginTop: '60px' }}>
                    <span className="empty-icon">📭</span>
                    <p>{state.inventory.length === 0 ? 'Seu inventário está vazio. Abra baús para obter itens!' : 'Nenhum item encontrado com esses filtros.'}</p>
                </div>
            ) : (
                <div className="inventory-grid">
                    {filtered.map((item, i) => {
                        const equipped = isEquipped(item.instanceId);
                        return (
                            <div
                                key={item.instanceId}
                                className={`item-card glass-card rarity-glow-${item.rarity} ${equipped ? 'equipped' : ''}`}
                                style={{ animationDelay: `${i * 0.03}s` }}
                                onClick={() => {
                                    if (equipped) {
                                        dispatch({ type: 'UNEQUIP_SLOT', payload: item.slot });
                                    } else {
                                        dispatch({ type: 'EQUIP_ITEM', payload: item.instanceId });
                                    }
                                }}
                            >
                                {equipped && <div className="equipped-badge">Equipado</div>}
                                <div className="item-card-emoji">{item.emoji}</div>
                                <div className="item-card-name">{item.name}</div>
                                <span className={`rarity-badge rarity-${item.rarity}`}>
                                    {RARITIES[item.rarity]?.name}
                                </span>
                                <div className="item-card-slot">{SLOTS[item.slot]?.emoji} {SLOTS[item.slot]?.name}</div>
                                <div className="item-card-desc">{item.description}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
