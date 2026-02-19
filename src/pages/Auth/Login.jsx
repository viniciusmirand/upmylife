import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Gamepad2, Mail, Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-game-bg flex flex-col justify-center items-center p-4">
            <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-primary to-game-secondary"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-game-primary/20 blur-3xl rounded-full"></div>

                <div className="text-center mb-8 relative z-10">
                    <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-game-primary" />
                    <h1 className="text-3xl font-display text-white mb-2">QU£STFORG£</h1>
                    <p className="text-game-common/70">Enter your credentials to continue the journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-game-common/80 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                className="w-full bg-black/30 border border-gray-700 rounded py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-game-primary focus:ring-1 focus:ring-game-primary transition-colors"
                                placeholder="player@guild.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-game-common/80 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                required
                                className="w-full bg-black/30 border border-gray-700 rounded py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-game-primary focus:ring-1 focus:ring-game-primary transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg"
                    >
                        {loading ? 'Authenticating...' : 'LOG IN'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400 relative z-10">
                    Don't have an account? {' '}
                    <Link to="/register" className="text-game-primary hover:text-indigo-400 transition-colors">
                        Join the Guild
                    </Link>
                </div>
            </div>
        </div>
    );
}
