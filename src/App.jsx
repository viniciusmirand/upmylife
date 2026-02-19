import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import TasksPage from './pages/Tasks/TasksPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import AchievementsPage from './pages/Achievements/AchievementsPage';
import ChestPage from './pages/Chest/ChestPage';
import UpgradePage from './pages/Upgrade/UpgradePage';
import AdminPage from './pages/Admin/AdminPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <GameProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route path="*" element={
                            <ProtectedRoute>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/tasks" element={<TasksPage />} />
                                        <Route path="/inventory" element={<InventoryPage />} />
                                        <Route path="/achievements" element={<AchievementsPage />} />
                                        <Route path="/chests" element={<ChestPage />} />
                                        <Route path="/upgrade" element={<UpgradePage />} />
                                        <Route path="/admin" element={<AdminPage />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </BrowserRouter>
            </GameProvider>
        </AuthProvider>
    );
}

export default App;
