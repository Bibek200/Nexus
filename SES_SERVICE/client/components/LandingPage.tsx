import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Code,
  Globe,
  MessageSquare,
  Shield,
  Loader2,
  Activity,
  Zap,
  Layers,
  ChevronRight,
  Mail,
  User,
  Send
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { db, emailService } from '../lib/api';

const FeatureCard = ({ icon: Icon, title, description, delay, colorClass }: any) => (
  <div
    className="group relative p-8 rounded-3xl glass-morphism transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05]"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${colorClass}`} style={{ zIndex: -1 }}></div>
    <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon className="h-8 w-8 text-indigo-400 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{description}</p>
    <div className="mt-6 flex items-center text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
      Learn more <ChevronRight className="ml-1 h-4 w-4" />
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section scrolling from URL hash without # in URL
  useEffect(() => {
    if (location.state && (location.state as any).targetId) {
      const id = (location.state as any).targetId;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // We don't change the URL at all here, keeping it clean
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await db.addInquiry(formData);
      const config = await db.getConfig();

      await emailService.send(
        formData.email,
        `Message Received - Nexus Team`,
        `<h2>Hi ${formData.name},</h2><p>Thank you for contacting Nexus. We have received your message: "${formData.message}".</p><p>Our team will get back to you shortly.</p><p>Best,<br/>Nexus Team</p>`
      );

      if (config.isActive && config.email) {
        await emailService.send(
          config.email,
          `New Inquiry: ${formData.name}`,
          `<h2>New Lead</h2><p><strong>Name:</strong> ${formData.name}</p><p><strong>Email:</strong> ${formData.email}</p><p><strong>Message:</strong> ${formData.message}</p>`
        );
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 glass border-b border-white/10' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-600/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Nexus</span>
          </Link>
          <div className="hidden md:flex items-center space-x-10">
            <button onClick={(e) => scrollToSection(e, 'features')} className="text-slate-400 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest">Features</button>
            <Link to="/solutions" className="text-slate-400 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest">Solutions</Link>
            <Link to="/pricing" className="text-slate-400 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest">Pricing</Link>
            <Link to="/admin" className="px-6 py-2.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">Platform v2.0 is live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 animate-slide-up leading-[0.9]">
            Manage Webhooks <br />
            <span className="text-gradient">With Superpowers.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The ultimate infrastructure for modern developers. Scale your webhooks and customer engagement with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button onClick={(e) => scrollToSection(e, 'contact')} className="group relative inline-flex items-center px-10 py-5 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 group-hover:opacity-90"></div>
              <span className="relative flex items-center text-white text-base">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <Link to="/admin" className="group inline-flex items-center px-10 py-5 font-bold rounded-2xl glass-morphism hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              <span className="flex items-center text-white text-base">
                View Demo
              </span>
            </Link>
          </div>

          {/* Stats / Proof */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              { label: 'Uptime', value: '99.9%' },
              { label: 'Requests/sec', value: '50k+' },
              { label: 'Secured Data', value: '256-bit' },
              { label: 'Response', value: '<2ms' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-indigo-500 font-bold tracking-[0.2em] uppercase text-sm mb-4">Core Capabilities</h2>
            <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Built for <span className="text-gradient">Modern Scale.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Activity}
              title="Webhook Engine"
              description="Enterprise-grade webhook distribution with automatic retries and detailed logs."
              delay={0.1}
              colorClass="from-indigo-600/20 to-transparent"
            />
            <FeatureCard
              icon={Layers}
              title="Lead Management"
              description="Capture, track, and route customer inquiries from any source with ease."
              delay={0.2}
              colorClass="from-purple-600/20 to-transparent"
            />
            <FeatureCard
              icon={Shield}
              title="Zero-Trust Security"
              description="End-to-end encryption for all payload data and inquiry content."
              delay={0.3}
              colorClass="from-pink-600/20 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-morphism rounded-[40px] overflow-hidden grid md:grid-cols-2">
            <div className="p-12 bg-gradient-to-br from-indigo-600/20 to-violet-600/10 flex flex-col justify-center border-r border-white/5">
              <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-6">Let's build <br />something epic.</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Have questions about our API or pricing? Drop us a message and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span>support@nexus.inc</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span>Instant API setup</span>
                </div>
              </div>
            </div>

            <div className="p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Cooper"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Work</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 resize-none text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                    <>
                      Send Message <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </button>

                {submitted && (
                  <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl justify-center animate-fade-in">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-bold text-sm">Message received! We'll be in touch.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl text-white">Nexus</span>
          </Link>

          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>

          <p className="text-slate-500 text-sm">
            © 2024 Nexus Inc. Powered by <span className="text-white font-medium">SES Service</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;