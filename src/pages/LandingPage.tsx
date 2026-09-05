import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  PieChart,
  Target,
  LineChart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  BarChart,
  Users,
  Database
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const handleHeroMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setHeroTilt({
      x: x * 12,
      y: y * -12,
    });
  };

  return (
    <div className="interactive-shell min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <div className="floating-orb left-[8%] top-24 h-28 w-28 bg-brand-200/40" />
      <div className="floating-orb floating-orb--slow right-[10%] top-36 h-40 w-40 bg-sky-200/40" />
      <div className="floating-orb left-[35%] bottom-24 h-24 w-24 bg-emerald-200/30" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm transition-transform duration-200 hover:scale-105">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
              MarketMind <span className="text-brand-600 font-semibold text-xs px-2 py-0.5 rounded bg-brand-50 border border-brand-200">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#explainability" className="nav-link">Explainable AI</a>
            <a href="#benefits" className="nav-link">Benefits</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="hover:-translate-y-0.5">
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')} className="hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-sm transition-transform duration-200 hover:scale-[1.02]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Customer Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Turn customer data into <span className="text-brand-600">smarter marketing decisions.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            MarketMind AI analyzes customer behavior, creates transparent segments, explains <span className="text-slate-800 font-medium">why</span> customers belong to each segment, and generates targeted campaign recommendations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto group hover:-translate-y-0.5"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<ChevronRight className="w-5 h-5" />}
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto group hover:-translate-y-0.5"
            >
              Explore Demo
            </Button>
          </div>

          {/* Product Dashboard Preview */}
          <div
            className="mt-14 max-w-5xl mx-auto p-2 rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_25px_80px_rgba(15,23,42,0.12)] shine"
            onMouseMove={handleHeroMove}
            onMouseLeave={() => setHeroTilt({ x: 0, y: 0 })}
            style={{
              transform: `perspective(1200px) rotateX(${heroTilt.y}deg) rotateY(${heroTilt.x}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <div className="glass-card rounded-xl p-6 text-left space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400 font-mono ml-2">marketmind.app/dashboard</span>
                </div>
                <div className="text-xs text-brand-600 font-medium flex items-center gap-1.5 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                  <Zap className="w-3.5 h-3.5" /> Live Demo View
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="metric-card bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Total Customers</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">105</p>
                  <p className="text-[11px] text-emerald-600 mt-1">+12% vs last month</p>
                </div>
                <div className="metric-card bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">₹1,84,50,000</p>
                  <p className="text-[11px] text-emerald-600 mt-1">+18.4% growth</p>
                </div>
                <div className="metric-card bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">High Value Customers</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">18 (17.1%)</p>
                  <p className="text-[11px] text-slate-400 mt-1">Avg spend: ₹3,45,000</p>
                </div>
                <div className="metric-card bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">At Risk Customers</p>
                  <p className="text-2xl font-bold text-rose-500 mt-1">14 (13.3%)</p>
                  <p className="text-[11px] text-rose-500 mt-1">Needs re-engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" data-reveal className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Built for Data-Driven Marketers</h2>
          <p className="mt-3 text-slate-500 text-base">
            Stop relying on black-box predictions. Understand the exact factors driving customer segmentation and campaign success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverEffect data-reveal className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Smart Segmentation</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Automatically group customers into High Value, Loyal, Regular, New, and At Risk segments using multi-dimensional RFM rules.
            </p>
          </Card>

          <Card hoverEffect data-reveal className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Transparent Explainability</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every segment and insight comes with a "Why this segment?" breakdown explaining the exact criteria met.
            </p>
          </Card>

          <Card hoverEffect data-reveal className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Campaign Recommendations</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Receive segment-specific marketing strategy recommendations, channel selection, and copy templates.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-reveal className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">How MarketMind AI Works</h2>
          <p className="mt-3 text-slate-500 text-base">Four simple steps to transform raw customer data into actionable revenue strategies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Upload Data', desc: 'Drag and drop your customer CSV file or use instant pre-loaded datasets.', icon: <Database className="w-5 h-5" /> },
            { step: '02', title: 'Behavioral Analysis', desc: 'Calculates recency, frequency, spend, and digital engagement scores.', icon: <Users className="w-5 h-5" /> },
            { step: '03', title: 'Segment & Explain', desc: 'Categorizes customers with transparent, human-readable explanations.', icon: <BarChart className="w-5 h-5" /> },
            { step: '04', title: 'Launch Campaigns', desc: 'Execute recommended targeted marketing campaigns across ideal channels.', icon: <LineChart className="w-5 h-5" /> },
          ].map((item, idx) => (
            <Card key={idx} data-reveal className="relative space-y-3">
              <div className="text-xs font-mono font-bold text-brand-600">STEP {item.step}</div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-brand-500">{item.icon}</span> {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" data-reveal className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" /> High ROI Marketing
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Stop guessing. Start personalizing with confidence.
            </h2>
            <p className="mt-4 text-slate-500 text-sm leading-relaxed">
              Generic blast campaigns waste budget and alienate customers. MarketMind AI gives you the exact precision needed to retain high-value buyers and prevent churn before it happens.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Reduce customer churn by up to 34% with proactive At Risk alerts.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Increase campaign conversion with tailored channel suggestions.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% browser-side privacy — your data never leaves your device.</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
                Launch Demo Workspace
              </Button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Segment Distribution Breakdown</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: 'High Value', pct: '17.1%', color: 'bg-emerald-500' },
                { name: 'Loyal Customers', pct: '28.5%', color: 'bg-brand-500' },
                { name: 'Regular Customers', pct: '31.4%', color: 'bg-slate-400' },
                { name: 'New / Potential', pct: '9.5%', color: 'bg-sky-400' },
                { name: 'At Risk', pct: '13.3%', color: 'bg-rose-500' },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{s.name}</span>
                    <span>{s.pct}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: s.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-slate-700">MarketMind AI</span>
            <span>— Explainable Marketing Intelligence</span>
          </div>
          <p>© 2026 MarketMind AI. Built for high-growth e-commerce and SaaS teams.</p>
        </div>
      </footer>
    </div>
  );
};
