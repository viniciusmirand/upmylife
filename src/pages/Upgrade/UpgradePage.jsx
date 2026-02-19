import React, { useState } from 'react';
import { Crown, Check, Zap, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function UpgradePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = () => {
        setLoading(true);
        // FIXME: Integrate with Stripe Checkout here
        setTimeout(() => {
            alert('Stripe Integration Pending - Would redirect to checkout.');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <Crown className="w-16 h-16 mx-auto mb-4 text-game-legendary" />
                <h1 className="text-4xl font-display text-white mb-4">Upgrade to PRO</h1>
                <p className="text-xl text-game-common/70 max-w-2xl mx-auto">
                    Unlock your true potential. Get exclusive cosmetics, advanced analytics, and unlimited quests.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Free Plan */}
                <div className="glass-panel p-8 opacity-70 hover:opacity-100 transition-opacity">
                    <h2 className="text-2xl font-display text-white mb-2">Bronze Guild</h2>
                    <div className="text-3xl font-bold text-white mb-6">Free</div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-game-common/80">
                            <Check className="w-5 h-5 text-game-uncommon mr-3" />
                            Up to 50 active tasks
                        </li>
                        <li className="flex items-center text-game-common/80">
                            <Check className="w-5 h-5 text-game-uncommon mr-3" />
                            Basic cosmetics
                        </li>
                        <li className="flex items-center text-game-common/80">
                            <Check className="w-5 h-5 text-game-uncommon mr-3" />
                            Standard drop rates
                        </li>
                    </ul>

                    <button className="w-full btn-secondary py-3 text-game-common cursor-not-allowed opacity-50">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="glass-panel p-8 relative overflow-hidden border-game-legendary/30 shadow-[0_0_30px_rgba(255,184,0,0.15)]">
                    <div className="absolute top-0 right-0 bg-game-legendary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                    </div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-game-legendary/20 blur-3xl rounded-full"></div>

                    <h2 className="text-2xl font-display text-game-legendary mb-2 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2" /> Legendary
                    </h2>
                    <div className="text-3xl font-bold text-white mb-1">$8<span className="text-lg text-game-common/50 font-normal"> / month</span></div>
                    <p className="text-game-common/60 mb-6 text-sm">Cancel anytime.</p>

                    <ul className="space-y-4 mb-8 relative z-10">
                        <li className="flex items-center text-white">
                            <Zap className="w-5 h-5 text-game-legendary mr-3" />
                            Unlimited tasks & projects
                        </li>
                        <li className="flex items-center text-white">
                            <Shield className="w-5 h-5 text-game-legendary mr-3" />
                            Exclusive "Legendary" Avatar borders
                        </li>
                        <li className="flex items-center text-white">
                            <Crown className="w-5 h-5 text-game-legendary mr-3" />
                            +20% drop rate for Rare chests
                        </li>
                        <li className="flex items-center text-white">
                            <Check className="w-5 h-5 text-game-legendary mr-3" />
                            Advanced Productivity Analytics
                        </li>
                    </ul>

                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-game-legendary to-amber-500 hover:from-amber-500 hover:to-game-legendary text-black font-bold py-3 px-4 rounded transition-all duration-300 shadow-[0_0_15px_rgba(255,184,0,0.4)] hover:shadow-[0_0_25px_rgba(255,184,0,0.6)] text-lg relative z-10"
                    >
                        {loading ? 'Initializing...' : 'UPGRADE NOW'}
                    </button>
                </div>
            </div>
        </div>
    );
}
