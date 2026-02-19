import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    ListChecks,
    Backpack,
    Trophy,
    Box,
    Menu,
    X,
    Crown,
    LogOut,
    Gamepad2,
    ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/tasks', label: 'Quests', icon: ListChecks },
    { path: '/chests', label: 'Loot Boxes', icon: Box },
    { path: '/inventory', label: 'Arsenal', icon: Backpack },
    { path: '/achievements', label: 'Milestones', icon: Trophy },
    { path: '/upgrade', label: 'PRO Edition', icon: Crown },
    { path: '/admin', label: 'Admin Sandbox', icon: ShieldAlert },
];

const NOTIF_ICONS = {
    xp_gained: '⚡',
    level_up: '🎉',
    achievement: '🏆',
    chest_opened: '📦',
};

export default function Layout({ children }) {
    const { state, dispatch, progress, currentLevelXP, xpNeeded } = useGame();
    const { signOut } = useAuth();
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

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="flex h-screen bg-game-bg text-game-common overflow-hidden font-sans">

            {/* Mobile header / toggle */}
            <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-game-card/90 backdrop-blur-md z-40 border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex items-center space-x-2 text-game-legendary font-display text-xl">
                    <Gamepad2 className="w-6 h-6" />
                    <span>QUESTFORGE</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-white/5 rounded-lg text-game-common hover:bg-white/10 transition-colors"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-72 bg-game-card/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-game-primary to-game-secondary flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-shadow">
                            <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-xl tracking-wider text-white font-bold">QUESTFORGE</h1>
                            <p className="text-[10px] text-game-primary tracking-widest uppercase opacity-80">Guild OS V1.0</p>
                        </div>
                    </div>
                </div>

                {/* Player Stats Widget */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-black/50 border-2 border-game-uncommon flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(0,255,102,0.2)]">
                                🧙
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-game-uncommon text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-game-card">
                                LVL {state.user.level}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold truncate">{state.user.name.split('@')[0]}</h3>
                            <p className="text-xs text-game-common/60">Acolyte</p>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase text-game-common/70">
                            <span>{currentLevelXP} XP</span>
                            <span>{xpNeeded} XP</span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-game-uncommon to-teal-400 shadow-[0_0_10px_rgba(0,255,102,0.5)] transition-all duration-500 ease-out"
                                style={{ width: `${Math.round(progress * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    <div className="text-[10px] font-bold tracking-widest text-game-common/40 uppercase mb-4 ml-3">Menu</div>

                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-game-primary/10 text-game-rare border border-game-primary/20 shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                                    : 'text-game-common/70 hover:bg-white/5 hover:text-white border border-transparent'}
                                ${item.path === '/upgrade' ? 'mt-4 border-game-legendary/20 text-game-legendary hover:bg-game-legendary/10 hover:text-game-legendary' : ''}
                            `}
                            end={item.path === '/'}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={18} className={item.path === '/upgrade' ? 'text-game-legendary' : ''} />
                                <span>{item.label}</span>
                            </div>

                            {item.path === '/chests' && state.user.chestsAvailable > 0 && (
                                <span className="bg-game-legendary text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,184,0,0.5)]">
                                    {state.user.chestsAvailable}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 w-full px-3 py-3 text-sm font-medium text-game-common/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-game-primary/10 via-game-bg to-game-bg pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-20 custom-scrollbar relative z-10 px-4 md:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Notifications Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none">
                {state.notifications.slice(0, 3).map(notif => (
                    <div
                        key={notif.id}
                        className="pointer-events-auto flex items-center space-x-3 bg-game-card/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-slide-up transform hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id })}
                    >
                        <div className="text-2xl">{NOTIF_ICONS[notif.type] || '🔔'}</div>
                        <div className="flex-1">
                            <p className="text-white text-sm font-bold">{notif.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
