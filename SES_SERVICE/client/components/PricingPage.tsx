import React from 'react';
import { Check, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
    // Aapka provided data
    const plans = [
        { name: 'Starter', price: '$0', features: ['1,000 Webhooks', 'Basic Inquiries', 'Email Support'] },
        { name: 'Pro', price: '$49', features: ['Unlimited Webhooks', 'Advanced Analytics', 'Priority Support', 'Custom Domains'], recommended: true },
        { name: 'Enterprise', price: 'Custom', features: ['Zero Latency', 'SLA Guarantee', 'Dedicated Manager', 'Custom Integration'] }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-glow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg">
                            <Globe className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight">Nexus</span>
                    </Link>
                    <Link to="/admin" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
                </div>
            </nav>

            <main className="relative pt-40 pb-20 px-6 z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Scalable <span className="text-indigo-500">Pricing.</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-20 leading-relaxed font-medium">
                        Choose the perfect plan for your business needs. No hidden fees, cancel anytime.
                    </p>

                    {/* Pricing Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`group relative p-10 rounded-[42px] border transition-all duration-500 hover:-translate-y-2 ${plan.recommended
                                        ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-105 z-10'
                                        : 'glass-morphism border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline justify-center gap-1 mb-10">
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="text-sm font-bold text-slate-500">/mo</span>}
                                </div>

                                <div className="h-px bg-white/5 w-full mb-10"></div>

                                <ul className="space-y-5 mb-12 text-left">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                                            <div className="mt-0.5 bg-indigo-500/10 p-1 rounded-md border border-indigo-500/20">
                                                <Check className="h-3.5 w-3.5 text-indigo-400" />
                                            </div>
                                            <span className="font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-5 rounded-[24px] font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 active:scale-95 ${plan.recommended
                                        ? 'bg-white text-slate-950 hover:bg-slate-200 shadow-xl'
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                    }`}>
                                    Select Plan <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PricingPage;
