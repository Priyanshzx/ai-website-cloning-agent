import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Menu, 
  X, 
  Star, 
  Zap, 
  Shield, 
  BarChart3, 
  Layers, 
  Coffee, 
  Award, 
  Clock, 
  Play, 
  Github, 
  Twitter, 
  Linkedin,
  AlertCircle
} from 'lucide-react';
import { ViewportMode, AnalysisResult } from '../types';

interface LivePreviewProps {
  files: Record<string, string>;
  analysis: AnalysisResult | null;
  viewport: ViewportMode;
  setViewport: (vp: ViewportMode) => void;
  originalUrl: string;
  compareMode: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  files,
  analysis,
  viewport,
  setViewport,
  originalUrl,
  compareMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // If no files yet
  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#070A10] border border-gray-800/80 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">AI Preview Sandbox Ready</h3>
        <p className="text-xs text-gray-400 max-w-md leading-relaxed">
          Enter any public website URL in the top bar and click <strong className="text-indigo-400">"Clone & Recreate"</strong>. The agent will analyze the layout, extract assets, and render a live responsive React preview here.
        </p>
      </div>
    );
  }

  // Determine viewport width styling
  const getViewportContainerStyle = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full my-6 rounded-[36px] border-[8px] border-gray-800 shadow-2xl ring-1 ring-white/10';
      case 'tablet':
        return 'w-[768px] max-w-full my-6 rounded-[24px] border-[6px] border-gray-800 shadow-2xl ring-1 ring-white/10';
      case 'desktop':
      default:
        return 'w-full h-full rounded-2xl border border-gray-800/80';
    }
  };

  // Inspect what components are present in current files
  const hasPricing = !!files['components/Pricing.tsx'] && (!files['App.tsx'] || files['App.tsx'].includes('<Pricing'));
  const hasTestimonials = !!files['components/Testimonials.tsx'] && (!files['App.tsx'] || files['App.tsx'].includes('<Testimonials'));
  const isBakery = (files['components/Hero.tsx'] || '').includes('Bakery') || (files['components/Hero.tsx'] || '').includes('Artisan');
  const isStickyNavbar = (files['components/Navbar.tsx'] || '').includes('sticky top-0');

  // Extract current dominant color
  const colorMatch = (files['components/Hero.tsx'] || '').match(/\[#([0-9a-fA-F]{6})\]/);
  const primaryColor = colorMatch ? `#${colorMatch[1]}` : (analysis?.colors.primary || '#4F46E5');
  const brandName = analysis?.title ? analysis.title.split(' ')[0] : 'Brand';

  return (
    <div className="h-full flex flex-col bg-[#070A10] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Sandbox Top Bar */}
      <div className="px-4 py-2.5 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-gray-700 mx-1" />
          <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-gray-950 border border-gray-800 font-mono text-[11px] text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-400">localhost:3000 /</span>
            <span className="text-white font-semibold">{brandName.toLowerCase()}</span>
          </div>
        </div>

        {/* Viewport indicators & Reload */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
            Viewport: {viewport === 'desktop' ? '1440 × 900 (100%)' : viewport === 'tablet' ? '768 × 1024 (Tablet)' : '375 × 812 (Mobile)'}
          </span>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            title="Reload Sandbox"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 overflow-auto bg-[#04060A] flex justify-center p-2 sm:p-4">
        {compareMode ? (
          /* Split Screen Comparison */
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Recreated React Frontend */}
            <div className="flex flex-col h-full rounded-xl border border-indigo-500/30 overflow-hidden bg-[#0B0F19]">
              <div className="bg-indigo-950/40 px-3 py-1.5 border-b border-indigo-500/20 text-[10px] font-bold text-indigo-300 flex items-center justify-between">
                <span>RECREATED REACT FRONTEND (AI AGENT)</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Live TSX</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <RenderRecreatedApp 
                  files={files}
                  analysis={analysis}
                  primaryColor={primaryColor}
                  brandName={brandName}
                  isBakery={isBakery}
                  isStickyNavbar={isStickyNavbar}
                  hasPricing={hasPricing}
                  hasTestimonials={hasTestimonials}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                  modalOpen={modalOpen}
                  setModalOpen={setModalOpen}
                />
              </div>
            </div>

            {/* Right: Original Website Reference */}
            <div className="flex flex-col h-full rounded-xl border border-gray-800 overflow-hidden bg-[#0B0F19]">
              <div className="bg-gray-900 px-3 py-1.5 border-b border-gray-800 text-[10px] font-bold text-gray-400 flex items-center justify-between">
                <span>ORIGINAL TARGET WEBSITE</span>
                <a href={originalUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center space-x-1">
                  <span>Open URL</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="flex-1 bg-white relative">
                <iframe
                  src={originalUrl}
                  title="Original Website Reference"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single Viewport View */
          <div 
            key={refreshKey} 
            className={`transition-all duration-300 bg-[#0B0F19] overflow-y-auto flex flex-col ${getViewportContainerStyle()}`}
          >
            {/* Phone Notch simulation if mobile */}
            {viewport === 'mobile' && (
              <div className="w-full flex justify-center pt-2 pb-1 bg-[#0B0F19] shrink-0 sticky top-0 z-50">
                <div className="w-24 h-4 bg-gray-800 rounded-full" />
              </div>
            )}

            <RenderRecreatedApp 
              files={files}
              analysis={analysis}
              primaryColor={primaryColor}
              brandName={brandName}
              isBakery={isBakery}
              isStickyNavbar={isStickyNavbar}
              hasPricing={hasPricing}
              hasTestimonials={hasTestimonials}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
            />
          </div>
        )}
      </div>

      {/* Interactive Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Modal State</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This interactive modal was triggered directly from the recreated React component state. All button handlers, mobile menus, and layout behaviors are fully responsive!
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component to render the complete recreated web application
interface RenderProps {
  files: Record<string, string>;
  analysis: AnalysisResult | null;
  primaryColor: string;
  brandName: string;
  isBakery: boolean;
  isStickyNavbar: boolean;
  hasPricing: boolean;
  hasTestimonials: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
}

const RenderRecreatedApp: React.FC<RenderProps> = ({
  files,
  analysis,
  primaryColor,
  brandName,
  isBakery,
  isStickyNavbar,
  hasPricing,
  hasTestimonials,
  mobileMenuOpen,
  setMobileMenuOpen,
  setModalOpen,
}) => {
  const secondaryColor = analysis?.colors.secondary || '#7C3AED';
  const heroImage = isBakery 
    ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80'
    : (analysis?.assets[0]?.url || 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80');

  return (
    <div className={`min-h-full font-sans antialiased text-gray-100 ${isBakery ? 'bg-[#120B08]' : 'bg-[#0B0F19]'}`}>
      {/* 1. NAVBAR */}
      <header className={`z-40 border-b border-gray-800 transition-all ${
        isStickyNavbar ? 'sticky top-0 backdrop-blur-md bg-opacity-80' : 'relative'
      } ${isBakery ? 'bg-[#120B08]' : 'bg-[#0B0F19]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {brandName.charAt(0)}
              </div>
              <span className="text-lg font-bold tracking-tight text-white">{brandName}</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {(analysis?.navigation || [
                { label: 'Overview', href: '#' },
                { label: 'Features', href: '#' },
                ...(hasPricing ? [{ label: 'Pricing', href: '#' }] : []),
                ...(hasTestimonials ? [{ label: 'Reviews', href: '#' }] : []),
              ]).map((nav, i) => (
                <a key={i} href={nav.href} className="text-xs font-medium text-gray-300 hover:text-white transition">
                  {nav.label}
                </a>
              ))}
            </nav>

            {/* Action Button */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition transform active:scale-95 flex items-center space-x-1.5"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <span>{isBakery ? 'Order Online' : 'Get Started'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-800 px-4 py-3 space-y-2 bg-[#0E1424]">
            {(analysis?.navigation || [
              { label: 'Overview', href: '#' },
              { label: 'Features', href: '#' },
              ...(hasPricing ? [{ label: 'Pricing', href: '#' }] : []),
            ]).map((nav, i) => (
              <a key={i} href={nav.href} className="block py-1.5 text-xs text-gray-300 hover:text-white">
                {nav.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
              className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white text-center"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              {isBakery ? 'Order Online' : 'Get Started'}
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO */}
      {isBakery ? (
        /* Bakery Hero */
        <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-amber-800/80 bg-amber-950/40 text-[11px] font-semibold text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Artisanal Bakery & Hearth Oven</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-amber-50 leading-tight">
              Artisanal Breads & Handcrafted Pastries Baked Fresh Daily
            </h1>

            <p className="text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto leading-relaxed">
              Traditional slow fermentation sourdough, flaky buttery viennoiseries, and specialty roast coffee crafted with passion and organic heritage grains.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-amber-600/25 transition transform active:scale-95 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600"
              >
                <span>Explore Today's Fresh Bakes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/60 border border-amber-800/80 transition flex items-center justify-center space-x-2"
              >
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>Reserve Table / Pickup</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-amber-300/80 font-medium">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Oven Fresh at 6:30 AM Daily</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Organic Heritage Flour</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-amber-900/60 shadow-2xl aspect-video max-w-4xl mx-auto">
              <img src={heroImage} alt="Fresh Bakery Goods" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      ) : (
        /* Standard Modern Tech / SaaS Hero */
        <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/80 text-[11px] font-semibold text-gray-300">
              <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
              <span>Next Generation Platform 2.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {analysis?.title || 'Autonomous Engineering Platform'}
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              {analysis?.description || 'Transform complex workflows into seamless automated execution with enterprise stability.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg transition transform active:scale-95 flex items-center justify-center space-x-2"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-gray-300 bg-gray-800/80 border border-gray-700 transition flex items-center justify-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 text-gray-400" />
                <span>Watch Product Tour</span>
              </button>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl aspect-video max-w-4xl mx-auto">
              <img src={heroImage} alt="Product Demo" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* 3. STATS */}
      <section className="py-8 border-y border-gray-800/60 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Uptime Reliability', value: '99.99%' },
            { label: 'Deployment Speed', value: '10x Faster' },
            { label: 'Active Developers', value: '500K+' },
            { label: 'Edge Locations', value: '150+' },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div 
                className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {stat.value}
              </div>
              <div className="text-[11px] text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURES */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Engineered for Production Reliability
            </h2>
            <p className="text-xs text-gray-400">
              Complete feature set purpose-built to accelerate your digital transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Intelligent Orchestration', desc: 'Automate complex flows with predictive workflows and zero overhead.', icon: Zap },
              { title: 'Bank-Grade Security', desc: 'End-to-end encryption with granular role-based access control.', icon: Shield },
              { title: 'Real-Time Insights', desc: 'Deep telemetry and live analytics rendered with millisecond responsiveness.', icon: BarChart3 },
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition space-y-3"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (Toggleable via NL Prompt) */}
      {hasTestimonials && (
        <section className="py-14 px-4 sm:px-6 bg-gray-900/20 border-t border-gray-800/60">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Verified Customer Reviews
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Loved by Modern Engineering Teams
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { quote: 'We cut our front-end iteration cycle in half. Visual fidelity and code quality are unbelievable.', author: 'Sarah Jenkins', role: 'VP Engineering at Apex', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
                { quote: 'The responsiveness and clean component breakdown made onboarding seamless for our entire organization.', author: 'David Chen', role: 'Head of Product at Lumina', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                { quote: 'Modifying sections in real-time with plain natural language feels like pure magic.', author: 'Elena Rostova', role: 'Staff Architect at Vector', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
              ].map((t, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <p className="text-xs text-gray-300 italic leading-relaxed">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center space-x-3 pt-3 border-t border-gray-800">
                    <img src={t.img} alt={t.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.author}</h4>
                      <p className="text-[10px] text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. PRICING (Toggleable via NL Prompt) */}
      {hasPricing && (
        <section className="py-14 px-4 sm:px-6 border-t border-gray-800/60">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                Transparent Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Simple Plans for High-Velocity Teams
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'Starter', price: '$29', desc: 'Ideal for independent developers and quick prototypes.' },
                { name: 'Professional', price: '$79', desc: 'For growing teams requiring fast execution and priority support.', popular: true },
                { name: 'Enterprise', price: '$249', desc: 'Custom SLAs, air-gapped security, and dedicated engineering.' },
              ].map((p, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-2xl flex flex-col justify-between space-y-4 ${
                    p.popular 
                      ? 'bg-gray-900 border-2 shadow-2xl relative md:-translate-y-2' 
                      : 'bg-gray-900/60 border border-gray-800'
                  }`}
                  style={{ borderColor: p.popular ? primaryColor : undefined }}
                >
                  <div className="space-y-3">
                    {p.popular && (
                      <span 
                        className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full text-white inline-block"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-white">{p.price}</span>
                      <span className="text-xs text-gray-400">/mo</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition"
                    style={{ background: p.popular ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` : '#1F2937' }}
                  >
                    Select {p.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. CTA */}
      <section className="py-14 px-4 sm:px-6 bg-gradient-to-b from-transparent to-black/60 border-t border-gray-800/60 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Build the Future?
          </h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Join thousands of visionary builders shipping exceptional interfaces today.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white shadow-xl transition transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 px-4 border-t border-gray-800/80 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} {brandName}. Re-Engineered with AI Autonomous Studio.</span>
          <div className="flex items-center space-x-4 text-gray-400">
            <Twitter className="w-4 h-4 cursor-pointer hover:text-white transition" />
            <Github className="w-4 h-4 cursor-pointer hover:text-white transition" />
            <Linkedin className="w-4 h-4 cursor-pointer hover:text-white transition" />
          </div>
        </div>
      </footer>
    </div>
  );
};
