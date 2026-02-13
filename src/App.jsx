import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import TasksPage from './pages/Tasks/TasksPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import AvatarPage from './pages/AvatarPage/AvatarPage';
import AchievementsPage from './pages/Achievements/AchievementsPage';
import ChestPage from './pages/Chest/ChestPage';
import './App.css';

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/avatar" element={<AvatarPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/chests" element={<ChestPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </GameProvider>
    );
}

export default App;
