import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import {
    LayoutDashboard,
    ListChecks,
    Backpack,
    User,
    Trophy,
    Box,
    Menu,
    X,
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tarefas', icon: ListChecks },
    { path: '/chests', label: 'Baús', icon: Box },
    { path: '/inventory', label: 'Inventário', icon: Backpack },
    { path: '/avatar', label: 'Avatar', icon: User },
    { path: '/achievements', label: 'Conquistas', icon: Trophy },
];

const NOTIF_ICONS = {
    xp_gained: '⚡',
    level_up: '🎉',
    achievement: '🏆',
    chest_opened: '📦',
};

export default function Layout({ children }) {
    const { state, dispatch, progress, currentLevelXP, xpNeeded } = useGame();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Auto-dismiss notifications
    useEffect(() => {
        if (state.notifications.length > 0) {
            const timer = setTimeout(() => {
                dispatch({ type: 'DISMISS_NOTIFICATION', payload: state.notifications[0]?.id });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.notifications, dispatch]);

    return (
        <div className="app-layout">
            {/* Mobile toggle */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <h1>⚔️ Quest Tasks</h1>
                    <p>Gamifique suas tarefas</p>
                </div>

                {/* User section */}
                <div className="sidebar-user">
                    <div className="sidebar-user-info">
                        <div className="sidebar-avatar-mini">🧙</div>
                        <div className="sidebar-user-meta">
                            <h3>{state.user.name}</h3>
                            <p>Nível {state.user.level}</p>
                        </div>
                    </div>
                    <div className="sidebar-xp-bar">
                        <div className="sidebar-xp-track">
                            <div
                                className="sidebar-xp-fill"
                                style={{ width: `${Math.round(progress * 100)}%` }}
                            />
                        </div>
                        <div className="sidebar-xp-text">
                            <span>{currentLevelXP} XP</span>
                            <span>{xpNeeded} XP</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end={item.path === '/'}
                        >
                            <item.icon size={18} />
                            {item.label}
                            {item.path === '/chests' && state.user.chestsAvailable > 0 && (
                                <span className="nav-badge">{state.user.chestsAvailable}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="app-main">
                {children}
            </main>

            {/* Notifications */}
            <div className="notifications-container">
                {state.notifications.slice(0, 3).map(notif => (
                    <div
                        key={notif.id}
                        className={`notification-toast ${notif.type}`}
                        onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id })}
                    >
                        <span className="notification-icon">{NOTIF_ICONS[notif.type] || '🔔'}</span>
                        <span className="notification-text">{notif.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
