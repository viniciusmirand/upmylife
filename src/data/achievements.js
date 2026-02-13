// ===== Achievements Data =====

const ACHIEVEMENTS = [
    // Task milestones
    { id: 'tasks_1', name: 'Primeiro Passo', description: 'Complete sua primeira tarefa.', icon: '🎯', condition: (s) => s.tasksCompleted >= 1 },
    { id: 'tasks_5', name: 'Produtivo', description: 'Complete 5 tarefas.', icon: '📋', condition: (s) => s.tasksCompleted >= 5 },
    { id: 'tasks_10', name: 'Disciplinado', description: 'Complete 10 tarefas.', icon: '🏆', condition: (s) => s.tasksCompleted >= 10 },
    { id: 'tasks_25', name: 'Máquina de Produção', description: 'Complete 25 tarefas.', icon: '⚙️', condition: (s) => s.tasksCompleted >= 25 },
    { id: 'tasks_50', name: 'Imparável', description: 'Complete 50 tarefas.', icon: '🚀', condition: (s) => s.tasksCompleted >= 50 },
    { id: 'tasks_100', name: 'Centurião', description: 'Complete 100 tarefas.', icon: '💯', condition: (s) => s.tasksCompleted >= 100 },

    // Level milestones
    { id: 'level_5', name: 'Aventureiro', description: 'Alcance o nível 5.', icon: '⭐', condition: (s) => s.level >= 5 },
    { id: 'level_10', name: 'Veterano', description: 'Alcance o nível 10.', icon: '🌟', condition: (s) => s.level >= 10 },
    { id: 'level_20', name: 'Lenda Viva', description: 'Alcance o nível 20.', icon: '👑', condition: (s) => s.level >= 20 },

    // Item milestones
    { id: 'items_5', name: 'Colecionador', description: 'Colete 5 itens.', icon: '🎁', condition: (s) => s.itemCount >= 5 },
    { id: 'items_15', name: 'Acumulador', description: 'Colete 15 itens.', icon: '🗃️', condition: (s) => s.itemCount >= 15 },
    { id: 'items_30', name: 'Museu Pessoal', description: 'Colete 30 itens.', icon: '🏛️', condition: (s) => s.itemCount >= 30 },

    // Rarity milestones
    { id: 'rare_1', name: 'Achado Raro', description: 'Obtenha seu primeiro item Raro.', icon: '💎', condition: (s) => s.rareCount >= 1 },
    { id: 'epic_1', name: 'Descoberta Épica', description: 'Obtenha seu primeiro item Épico.', icon: '🔮', condition: (s) => s.epicCount >= 1 },
    { id: 'legendary_1', name: 'Toque do Destino', description: 'Obtenha seu primeiro item Lendário.', icon: '⚡', condition: (s) => s.legendaryCount >= 1 },

    // Chest milestones
    { id: 'chests_3', name: 'Caçador de Tesouros', description: 'Abra 3 baús.', icon: '📦', condition: (s) => s.chestsOpened >= 3 },
    { id: 'chests_10', name: 'Saqueador', description: 'Abra 10 baús.', icon: '🏴‍☠️', condition: (s) => s.chestsOpened >= 10 },

    // Avatar
    { id: 'equip_1', name: 'Estiloso', description: 'Equipe seu primeiro item no avatar.', icon: '👤', condition: (s) => s.equippedCount >= 1 },
    { id: 'equip_full', name: 'Totalmente Equipado', description: 'Equipe itens em todos os 5 slots.', icon: '🦸', condition: (s) => s.equippedCount >= 5 },
];

export default ACHIEVEMENTS;
