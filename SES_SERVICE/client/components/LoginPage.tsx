import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, Loader2, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { userService } from '../lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please check credentials.');
        setLoading(false);
        return;
      }

      userService.setCurrentUser(data.user);
      navigate('/admin');
    } catch (err) {
      setError('Connection error. Please ensure the server is running.');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  const autofill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 transition-transform hover:scale-110 duration-500">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3.5 rounded-2xl shadow-2xl shadow-indigo-500/20">
              <Globe className="h-9 w-9 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Nexus</h1>
          <p className="text-slate-500 font-medium">Authentication Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-1 bg-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            </div>

            {error && (
              <div className="mb-8 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 animate-slide-up">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Identity</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nexus.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-slate-700 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    Authorize Access <ShieldCheck className="h-6 w-6" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5">
              <p className="text-xs font-bold text-slate-600 mb-5 uppercase tracking-widest text-center">Quick Access Prototypes</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => autofill('admin@nexus.com', 'admin123')}
                  className="px-4 py-3 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-xs font-bold text-slate-400 hover:text-indigo-300"
                >
                  ADMIN LEVEL
                </button>
                <button
                  type="button"
                  onClick={() => autofill('viewer@nexus.com', 'viewer123')}
                  className="px-4 py-3 rounded-xl border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-xs font-bold text-slate-400 hover:text-violet-300"
                >
                  VIEWER ONLY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <p className="mt-8 text-center text-slate-600 text-sm font-medium">
          Nexus v2.0 • Enterprise Infrastructure
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
