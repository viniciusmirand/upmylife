# ⚔️ Quest Tasks — Gamificação de Tarefas Pessoais

Aplicação gamificada para gerenciamento de tarefas pessoais, onde o usuário completa tarefas para ganhar XP, subir de nível, abrir baús de recompensa com itens aleatórios e personalizar um avatar.

![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)

## ✨ Features

- 📋 **Tarefas** — CRUD com categorias (Diária, Semanal, Meta, Evento) e 3 dificuldades
- ⚡ **Sistema de XP** — Curva exponencial de progressão com barra animada
- 📦 **Baús de Recompensa** — Animação de abertura com drop aleatório de 3 itens
- 🎲 **Raridade** — Comum (50%), Incomum (30%), Raro (15%), Épico (4%), Lendário (1%)
- 🧙 **Avatar** — Personalizável com 5 slots de equipamento
- 🎒 **Inventário** — 44 itens RPG com filtros por slot e raridade
- 🏆 **Conquistas** — 19 milestones com detecção automática
- 🔔 **Notificações** — Toast alerts para XP, level-up, conquistas e baús
- 💾 **Persistência** — Dados salvos via localStorage

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- npm 9+

### Instalação

```bash
git clone https://github.com/SEU_USUARIO/quest-tasks.git
cd quest-tasks
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acessar em [http://localhost:5173](http://localhost:5173)

### Build de Produção

```bash
npm run build
npm run preview
```

## 🏗️ Arquitetura

```
src/
├── components/       # Componentes reutilizáveis
│   └── Layout/       # Sidebar, navegação, notificações
├── contexts/         # GameContext (estado global com useReducer)
├── data/             # Catálogo de itens e conquistas
├── pages/            # Páginas da aplicação
│   ├── Dashboard/    # Tela inicial com resumo
│   ├── Tasks/        # CRUD de tarefas
│   ├── Chest/        # Abertura de baús
│   ├── Inventory/    # Inventário de itens
│   ├── AvatarPage/   # Personalização do avatar
│   └── Achievements/ # Conquistas
└── utils/            # XP engine, rarity engine
```

## 🎮 Sistema de Raridades

| Raridade | Chance | Cor |
|----------|--------|-----|
| Comum | 50% | 🔘 Cinza |
| Incomum | 30% | 🟢 Verde |
| Raro | 15% | 🔵 Azul |
| Épico | 4% | 🟣 Roxo |
| Lendário | 1% | 🟡 Dourado |

## 📄 Licença

MIT
