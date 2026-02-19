import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Gamepad2, Mail, Lock } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Create user in Supabase Auth
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            // In a real app we might need email verification
            // For MVP just redirect to login with a message
            alert('Registration successful! Please log in.');
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-game-bg flex flex-col justify-center items-center p-4">
            <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-secondary to-game-primary"></div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-game-secondary/20 blur-3xl rounded-full"></div>

                <div className="text-center mb-8 relative z-10">
                    <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-game-secondary" />
                    <h1 className="text-3xl font-display text-white mb-2">NEW CHALLEGER</h1>
                    <p className="text-game-common/70">Create an account to begin your journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-game-common/80 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                className="w-full bg-black/30 border border-gray-700 rounded py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-game-secondary focus:ring-1 focus:ring-game-secondary transition-colors"
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
                                className="w-full bg-black/30 border border-gray-700 rounded py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-game-secondary focus:ring-1 focus:ring-game-secondary transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-game-secondary hover:bg-pink-500 text-white font-bold py-3 px-4 rounded transition-colors duration-200 shadow-[0_0_10px_rgba(236,72,153,0.5)] hover:shadow-[0_0_15px_rgba(236,72,153,0.8)] text-lg"
                    >
                        {loading ? 'Creating Character...' : 'REGISTER'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400 relative z-10">
                    Already have an account? {' '}
                    <Link to="/login" className="text-game-secondary hover:text-pink-400 transition-colors">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
