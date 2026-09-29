import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  Settings, 
  Columns, 
  Play, 
  RotateCw,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ViewportMode } from '../types';

interface HeaderProps {
  url: string;
  setUrl: (url: string) => void;
  onClone: () => void;
  isLoading: boolean;
  viewport: ViewportMode;
  setViewport: (vp: ViewportMode) => void;
  compareMode: boolean;
  setCompareMode: (val: boolean) => void;
  onExport: () => void;
  onOpenSettings: () => void;
  hasProject: boolean;
}

const PRESET_WEBSITES = [
  { label: 'Linear App', url: 'https://linear.app', desc: 'Modern Dark SaaS' },
  { label: 'Stripe', url: 'https://stripe.com', desc: 'Fintech Payments' },
  { label: 'Supabase', url: 'https://supabase.com', desc: 'Developer Backend' },
  { label: 'Vercel', url: 'https://vercel.com', desc: 'Deployment Cloud' },
  { label: 'Artisan Bakery', url: 'https://tartinebakery.com', desc: 'Food & Dining Cafe' },
];

export const Header: React.FC<HeaderProps> = ({
  url,
  setUrl,
  onClone,
  isLoading,
  viewport,
  setViewport,
  compareMode,
  setCompareMode,
  onExport,
  onOpenSettings,
  hasProject,
}) => {
  const [presetsOpen, setPresetsOpen] = useState(false);

  const selectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setPresetsOpen(false);
  };

  return (
    <header className="bg-[#0D121F] border-b border-gray-800/80 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center space-x-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">WebClone AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Agent v2.4
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Autonomous Frontend Re-Engineering Studio</p>
            </div>
          </div>

          {/* Quick Preset Selector for Mobile */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setPresetsOpen(!presetsOpen)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-800 text-gray-300 flex items-center space-x-1"
            >
              <span>Presets</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {presetsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-1 z-50">
                {PRESET_WEBSITES.map(p => (
                  <button
                    key={p.label}
                    onClick={() => selectPreset(p.url)}
                    className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-gray-800"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Central URL Input & Action */}
        <div className="flex-1 max-w-3xl w-full flex items-center space-x-2">
          {/* Preset dropdown desktop */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setPresetsOpen(!presetsOpen)}
              className="h-10 px-3 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-600 text-xs font-medium text-gray-300 flex items-center space-x-1.5 transition"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Examples</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {presetsOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-[#111827] border border-gray-700/80 rounded-xl shadow-2xl py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Select Evaluation Website
                </div>
                {PRESET_WEBSITES.map(p => (
                  <button
                    key={p.label}
                    onClick={() => selectPreset(p.url)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 transition flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-white">{p.label}</span>
                    <span className="text-[10px] text-gray-400">{p.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* URL Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter public website URL (e.g. https://linear.app)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && onClone()}
              className="w-full h-10 bg-gray-900/90 border border-gray-700/80 rounded-xl pl-3.5 pr-20 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition shadow-inner font-mono"
            />
            {url && (
              <button
                onClick={() => setUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Run Clone Button */}
          <button
            onClick={onClone}
            disabled={isLoading || !url.trim()}
            className={`h-10 px-5 rounded-xl text-xs font-bold text-white transition-all flex items-center space-x-2 shadow-lg ${
              isLoading || !url.trim()
                ? 'bg-indigo-600/50 cursor-not-allowed text-gray-300'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Re-Engineering...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clone & Recreate</span>
              </>
            )}
          </button>
        </div>

        {/* Viewport & Controls */}
        <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
          {/* Viewport Switcher */}
          <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setViewport('desktop')}
              title="Desktop View (1440px)"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewport === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewport === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewport === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Comparison Mode Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            title="Toggle Split Comparison with Original Site"
            className={`h-9 px-3 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition ${
              compareMode
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Export Code ZIP */}
          <button
            onClick={onExport}
            disabled={!hasProject}
            title="Download Standalone React Project ZIP"
            className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
              hasProject
                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export ZIP</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Configure AI Models & Keys"
            className="h-9 w-9 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 flex items-center justify-center transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
