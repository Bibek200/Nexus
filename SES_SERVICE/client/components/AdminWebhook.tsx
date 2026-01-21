import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Check, AlertCircle, Loader2, ShieldCheck, Zap, Server } from 'lucide-react';
import { WebhookConfig } from '../types';
import { db } from '../lib/api';

const AdminWebhook: React.FC = () => {
  const [config, setConfig] = useState<WebhookConfig>({
    email: '',
    domain: '',
    isActive: true
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setInitialLoading(true);
        const savedConfig = await db.getConfig();
        setConfig(savedConfig);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await db.saveConfig(config);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Infrastructure</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Protocol & Notification Governance</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-2">
          <div className={`h-2.5 w-2.5 rounded-full ${config.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{config.isActive ? 'Active Node' : 'Node Suspended'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Helper Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-morphism p-8 rounded-[32px] border border-white/5 group">
            <div className="bg-indigo-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Real-time Sync</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-secondary">Webhooks are dispatched within 200ms of data ingestion. Enterprise reliability guaranteed.</p>
          </div>

          <div className="glass-morphism p-8 rounded-[32px] border border-white/5 group">
            <div className="bg-purple-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Secure Payloads</h3>
            <p className="text-sm text-slate-500 leading-relaxed">All outgoing hooks include a cryptographic signature for origin verification.</p>
          </div>
        </div>

        {/* Main Configuration Card */}
        <div className="lg:col-span-2">
          <div className="glass-morphism rounded-[40px] border border-white/5 overflow-hidden shadow-2xl relative">
            {initialLoading ? (
              <div className="py-32 flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Decrypting Config...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-10 space-y-10">
                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-indigo-400" />
                    </div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Global Admin Alerts</label>
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] px-8 py-5 focus:ring-2 focus:ring-indigo-500 focus:bg-white/[0.05] outline-none transition-all placeholder:text-slate-800 text-white font-bold"
                      placeholder="vault@nexus.inc"
                      value={config.email}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-slate-600 font-medium px-2 italic">Critical security alerts and conversion notifications route through this channel.</p>
                </div>

                <div className="h-px bg-white/5 mx-[-40px]"></div>

                {/* Domain Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Server className="h-4 w-4 text-purple-400" />
                    </div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Endpoint Protocol</label>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] px-8 py-5 focus:ring-2 focus:ring-purple-500 focus:bg-white/[0.05] outline-none transition-all placeholder:text-slate-800 text-white font-mono text-sm tracking-tight"
                      placeholder="https://api.nexus-node.com/v1/inbound"
                      value={config.domain}
                      onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-slate-600 font-medium px-2 italic">Requires HTTPS. Standard POST payload format: application/json.</p>
                </div>

                <div className="h-px bg-white/5 mx-[-40px]"></div>

                {/* Status Section */}
                <div className="flex items-center justify-between p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${config.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">Active Ingestion</p>
                      <p className="text-xs text-slate-500 font-medium leading-none mt-1">Global switch for webhook distribution</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${config.isActive ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800'
                      }`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition-all duration-500 ease-spring ${config.isActive ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-6 pt-6">
                  {isSaved && (
                    <div className="flex items-center gap-2 text-emerald-400 animate-slide-up">
                      <div className="h-8 w-8 rounded-full bg-emerald-400/10 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Vault Updated</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative px-10 py-5 rounded-[24px] bg-white text-slate-950 font-black text-sm tracking-widest uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 overflow-hidden"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                      <>
                        Commit Changes <Save className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWebhook;
