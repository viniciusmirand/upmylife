import { useGame } from '../../contexts/GameContext';
import { SLOTS } from '../../data/itemCatalog';
import { RARITIES } from '../../utils/rarityEngine';
import './AvatarPage.css';

export default function AvatarPage() {
    const { state, dispatch, getEquippedItem } = useGame();

    const slots = Object.entries(SLOTS);

    return (
        <div className="avatar-page animate-fade-in">
            <div className="avatar-header">
                <h1>🧙 Meu Avatar</h1>
                <p>Equipe itens do inventário para personalizar seu avatar</p>
            </div>

            <div className="avatar-layout">
                {/* Avatar Preview */}
                <div className="avatar-preview glass-card">
                    <div className="avatar-figure">
                        <div className="avatar-base animate-float">
                            {/* Effect layer */}
                            {getEquippedItem('effect') && (
                                <div className="avatar-effect-layer">{getEquippedItem('effect').emoji}</div>
                            )}

                            {/* Head */}
                            <div className="avatar-layer avatar-head">
                                {getEquippedItem('head') ? (
                                    <span className="avatar-item-display">{getEquippedItem('head').emoji}</span>
                                ) : (
                                    <span className="avatar-placeholder-part">😐</span>
                                )}
                            </div>

                            {/* Body */}
                            <div className="avatar-layer avatar-body">
                                {getEquippedItem('body') ? (
                                    <span className="avatar-item-display">{getEquippedItem('body').emoji}</span>
                                ) : (
                                    <span className="avatar-placeholder-part">👕</span>
                                )}
                            </div>

                            {/* Legs */}
                            <div className="avatar-layer avatar-legs">
                                {getEquippedItem('legs') ? (
                                    <span className="avatar-item-display">{getEquippedItem('legs').emoji}</span>
                                ) : (
                                    <span className="avatar-placeholder-part">👖</span>
                                )}
                            </div>

                            {/* Accessory */}
                            {getEquippedItem('accessory') && (
                                <div className="avatar-accessory">
                                    <span>{getEquippedItem('accessory').emoji}</span>
                                </div>
                            )}
                        </div>

                        <div className="avatar-name-plate">
                            <h2>{state.user.name}</h2>
                            <p>Nível {state.user.level}</p>
                        </div>
                    </div>
                </div>

                {/* Equipment Slots */}
                <div className="avatar-equipment">
                    <h3>⚔️ Equipamentos</h3>

                    <div className="equipment-slots">
                        {slots.map(([slotKey, slotInfo]) => {
                            const equipped = getEquippedItem(slotKey);
                            const availableItems = state.inventory.filter(i => i.slot === slotKey);

                            return (
                                <div key={slotKey} className={`equipment-slot glass-card ${equipped ? 'has-item' : ''}`}>
                                    <div className="slot-header">
                                        <span className="slot-icon">{slotInfo.emoji}</span>
                                        <span className="slot-name">{slotInfo.name}</span>
                                        {equipped && (
                                            <button
                                                className="slot-unequip"
                                                onClick={() => dispatch({ type: 'UNEQUIP_SLOT', payload: slotKey })}
                                                title="Desequipar"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {equipped ? (
                                        <div className={`slot-equipped rarity-glow-${equipped.rarity}`}>
                                            <span className="slot-equipped-emoji">{equipped.emoji}</span>
                                            <div className="slot-equipped-info">
                                                <span className="slot-equipped-name">{equipped.name}</span>
                                                <span className={`rarity-badge rarity-${equipped.rarity}`}>
                                                    {RARITIES[equipped.rarity]?.name}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="slot-empty">
                                            <span>Vazio</span>
                                        </div>
                                    )}

                                    {/* Available items for this slot */}
                                    {availableItems.length > 0 && (
                                        <div className="slot-available">
                                            <span className="slot-available-label">Itens disponíveis:</span>
                                            <div className="slot-available-items">
                                                {availableItems.map(item => (
                                                    <button
                                                        key={item.instanceId}
                                                        className={`slot-item-btn ${state.equippedItems[slotKey] === item.instanceId ? 'active' : ''}`}
                                                        onClick={() => dispatch({ type: 'EQUIP_ITEM', payload: item.instanceId })}
                                                        title={`${item.name} (${RARITIES[item.rarity]?.name})`}
                                                        style={{ borderColor: RARITIES[item.rarity]?.color }}
                                                    >
                                                        {item.emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
