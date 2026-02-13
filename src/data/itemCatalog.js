// ===== Item Catalog =====
// Fantasy/RPG themed items across 5 equipment slots

const ITEM_CATALOG = [
    // ── HEAD (10 items) ──
    { id: 'head_01', name: 'Capuz do Viajante', description: 'Um capuz puído que já viu muitas estradas.', slot: 'head', rarity: 'common', emoji: '🧢' },
    { id: 'head_02', name: 'Bandana do Mercador', description: 'Bandana colorida usada por mercadores ágeis.', slot: 'head', rarity: 'common', emoji: '🎀' },
    { id: 'head_03', name: 'Chapéu de Explorador', description: 'Protege do sol e da chuva em qualquer expedição.', slot: 'head', rarity: 'uncommon', emoji: '🤠' },
    { id: 'head_04', name: 'Elmo do Sentinela', description: 'Elmo reforçado usado pelos guardiões da muralha.', slot: 'head', rarity: 'uncommon', emoji: '⛑️' },
    { id: 'head_05', name: 'Coroa de Espinhos Florais', description: 'Espinhos entrelaçados com flores místicas.', slot: 'head', rarity: 'rare', emoji: '👑' },
    { id: 'head_06', name: 'Tiara do Crepúsculo', description: 'Brilha suavemente ao entardecer.', slot: 'head', rarity: 'rare', emoji: '✨' },
    { id: 'head_07', name: 'Máscara do Arcano', description: 'Revela segredos ocultos em runas antigas.', slot: 'head', rarity: 'rare', emoji: '🎭' },
    { id: 'head_08', name: 'Elmo do Dragão Carmesim', description: 'Forjado nas chamas do dragão ancestral.', slot: 'head', rarity: 'epic', emoji: '🐉' },
    { id: 'head_09', name: 'Coroa Estelar', description: 'Fragmentos de estrelas cadentes compõem esta coroa.', slot: 'head', rarity: 'epic', emoji: '💫' },
    { id: 'head_10', name: 'Auréola do Ascendente', description: 'Concedida aos que transcenderam os limites mortais.', slot: 'head', rarity: 'legendary', emoji: '😇' },

    // ── BODY (10 items) ──
    { id: 'body_01', name: 'Túnica de Linho', description: 'Simples mas confortável para o dia a dia.', slot: 'body', rarity: 'common', emoji: '👕' },
    { id: 'body_02', name: 'Colete de Couro', description: 'Proteção leve para aventuras casuais.', slot: 'body', rarity: 'common', emoji: '🦺' },
    { id: 'body_03', name: 'Armadura de Escamas', description: 'Escamas costuradas oferecem boa mobilidade.', slot: 'body', rarity: 'uncommon', emoji: '🛡️' },
    { id: 'body_04', name: 'Manto do Sábio', description: 'Tecido com fios encantados de sabedoria.', slot: 'body', rarity: 'uncommon', emoji: '🧥' },
    { id: 'body_05', name: 'Peitoral do Guardião', description: 'Pesado mas quase impenetrável.', slot: 'body', rarity: 'rare', emoji: '🏋️' },
    { id: 'body_06', name: 'Manto das Sombras', description: 'Envolve o portador em escuridão protetora.', slot: 'body', rarity: 'rare', emoji: '🌑' },
    { id: 'body_07', name: 'Couraça Rúnica', description: 'Runas protetoras gravadas por artesãos élficos.', slot: 'body', rarity: 'rare', emoji: '🔮' },
    { id: 'body_08', name: 'Armadura do Fênix', description: 'Regenera-se como a fênix que a inspirou.', slot: 'body', rarity: 'epic', emoji: '🔥' },
    { id: 'body_09', name: 'Manto Celestial', description: 'Tecido com luz das constelações.', slot: 'body', rarity: 'epic', emoji: '🌌' },
    { id: 'body_10', name: 'Égide do Criador', description: 'A armadura suprema, forjada no início dos tempos.', slot: 'body', rarity: 'legendary', emoji: '⚡' },

    // ── LEGS (8 items) ──
    { id: 'legs_01', name: 'Calças de Algodão', description: 'Básicas e funcionais.', slot: 'legs', rarity: 'common', emoji: '👖' },
    { id: 'legs_02', name: 'Botas de Trilha', description: 'Firmes em qualquer terreno.', slot: 'legs', rarity: 'common', emoji: '🥾' },
    { id: 'legs_03', name: 'Grevas do Patrulheiro', description: 'Leves e silenciosas para missões furtivas.', slot: 'legs', rarity: 'uncommon', emoji: '🦿' },
    { id: 'legs_04', name: 'Saias de Batalha', description: 'Combinam proteção com liberdade de movimento.', slot: 'legs', rarity: 'uncommon', emoji: '⚔️' },
    { id: 'legs_05', name: 'Botas Aladas', description: 'Permitem saltos impossíveis.', slot: 'legs', rarity: 'rare', emoji: '🪽' },
    { id: 'legs_06', name: 'Grevas de Adamantium', description: 'O metal mais resistente conhecido.', slot: 'legs', rarity: 'rare', emoji: '🦾' },
    { id: 'legs_07', name: 'Botas do Relâmpago', description: 'Velocidade sobre-humana ao portador.', slot: 'legs', rarity: 'epic', emoji: '⚡' },
    { id: 'legs_08', name: 'Sandálias do Tempo', description: 'Caminhe entre os segundos.', slot: 'legs', rarity: 'legendary', emoji: '⏳' },

    // ── ACCESSORY (8 items) ──
    { id: 'acc_01', name: 'Mochila Simples', description: 'Carrega o essencial para o dia.', slot: 'accessory', rarity: 'common', emoji: '🎒' },
    { id: 'acc_02', name: 'Amuleto de Sorte', description: 'Um talismã com leve brilho.', slot: 'accessory', rarity: 'common', emoji: '🍀' },
    { id: 'acc_03', name: 'Capa do Vento', description: 'Ondula dramaticamente em qualquer brisa.', slot: 'accessory', rarity: 'uncommon', emoji: '🧣' },
    { id: 'acc_04', name: 'Anel do Foco', description: 'Aumenta concentração e clareza mental.', slot: 'accessory', rarity: 'uncommon', emoji: '💍' },
    { id: 'acc_05', name: 'Grimório Portátil', description: 'Contém encantamentos de bolso.', slot: 'accessory', rarity: 'rare', emoji: '📖' },
    { id: 'acc_06', name: 'Relicário dos Ancestrais', description: 'Guarda a sabedoria das gerações passadas.', slot: 'accessory', rarity: 'rare', emoji: '📿' },
    { id: 'acc_07', name: 'Asas Mecânicas', description: 'Engenharia arcana permite voo curto.', slot: 'accessory', rarity: 'epic', emoji: '🦅' },
    { id: 'acc_08', name: 'Orbe do Infinito', description: 'Pulsa com a energia do cosmos.', slot: 'accessory', rarity: 'legendary', emoji: '🔮' },

    // ── EFFECT (8 items) ──
    { id: 'eff_01', name: 'Rastro de Poeira', description: 'Deixa um leve rastro ao caminhar.', slot: 'effect', rarity: 'common', emoji: '💨' },
    { id: 'eff_02', name: 'Brilho Suave', description: 'Uma aura tênue emana do corpo.', slot: 'effect', rarity: 'common', emoji: '✨' },
    { id: 'eff_03', name: 'Partículas de Folhas', description: 'Folhas douradas flutuam ao redor.', slot: 'effect', rarity: 'uncommon', emoji: '🍂' },
    { id: 'eff_04', name: 'Chamas Frias', description: 'Fogo azul que não queima.', slot: 'effect', rarity: 'uncommon', emoji: '🔵' },
    { id: 'eff_05', name: 'Aura Relampejante', description: 'Faíscas elétricas dançam pelo corpo.', slot: 'effect', rarity: 'rare', emoji: '⚡' },
    { id: 'eff_06', name: 'Névoa Sombria', description: 'Sombras vivas circulam misteriosamente.', slot: 'effect', rarity: 'rare', emoji: '🌫️' },
    { id: 'eff_07', name: 'Aurora Boreal', description: 'Luzes do norte dançam em seu rastro.', slot: 'effect', rarity: 'epic', emoji: '🌈' },
    { id: 'eff_08', name: 'Singularidade Cósmica', description: 'O espaço-tempo distorce ao seu redor.', slot: 'effect', rarity: 'legendary', emoji: '🌀' },
];

export default ITEM_CATALOG;

export const SLOTS = {
    head: { name: 'Cabeça', emoji: '🎩' },
    body: { name: 'Corpo', emoji: '👕' },
    legs: { name: 'Pernas', emoji: '👖' },
    accessory: { name: 'Acessório', emoji: '🎒' },
    effect: { name: 'Efeito', emoji: '✨' },
};
