import React from 'react';
import { Globe, ShieldCheck, Zap, Activity, Info, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const SolutionsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-glow"></div>
                <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
            </div>

            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg">
                            <Globe className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white">Nexus</span>
                    </Link>
                    <div className="flex space-x-8">
                        <Link to="/features" className="text-slate-400 hover:text-white font-medium transition-colors">Features</Link>
                        <Link to="/solutions" className="text-white font-bold transition-colors">Solutions</Link>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 px-6 z-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight">Enterprise <br /><span className="text-indigo-500">Solutions.</span></h1>

                    <div className="grid md:grid-cols-2 gap-12 mt-20">
                        <div className="glass-morphism p-10 rounded-[32px] border border-white/5">
                            <Zap className="h-10 w-10 text-indigo-400 mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">Real-time Data Sync</h2>
                            <p className="text-slate-400 leading-relaxed">Connect your entire tech stack with our high-speed webhook engine. Zero latency, maximum reliability.</p>
                        </div>
                        <div className="glass-morphism p-10 rounded-[32px] border border-white/5">
                            <ShieldCheck className="h-10 w-10 text-purple-400 mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">Advanced Security</h2>
                            <p className="text-slate-400 leading-relaxed">Enterprise-grade encryption and zero-trust architecture to keep your customer inquiries secure.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SolutionsPage;
