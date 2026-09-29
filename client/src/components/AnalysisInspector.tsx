import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layers, 
  Image as ImageIcon, 
  Compass, 
  Smartphone, 
  Copy, 
  Check 
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisInspectorProps {
  analysis: AnalysisResult | null;
}

export const AnalysisInspector: React.FC<AnalysisInspectorProps> = ({ analysis }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="text-center py-16 text-gray-500 space-y-3">
        <Layers className="w-10 h-10 mx-auto text-gray-600" />
        <p className="text-xs">No website analyzed yet. Enter a URL above to inspect design tokens and layout structure.</p>
      </div>
    );
  }

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Brand & Title Overview */}
      <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
        <div className="flex items-center space-x-2.5">
          {analysis.favicon ? (
            <img src={analysis.favicon} alt="Favicon" className="w-5 h-5 rounded-md object-contain bg-white/10 p-0.5" />
          ) : (
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] font-bold">W</div>
          )}
          <span className="text-xs font-bold text-white truncate">{analysis.title}</span>
        </div>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
          {analysis.description}
        </p>
      </div>

      {/* 2. Color Palette */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>Extracted Color Tokens</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Primary', hex: analysis.colors.primary },
            { label: 'Secondary', hex: analysis.colors.secondary },
            { label: 'Background', hex: analysis.colors.background },
            { label: 'Accent', hex: analysis.colors.accent },
          ].map((c) => (
            <div 
              key={c.label}
              onClick={() => copyToClipboard(c.hex)}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center space-x-2.5 cursor-pointer hover:border-gray-700 transition group"
            >
              <div 
                className="w-7 h-7 rounded-lg border border-white/10 shadow-inner shrink-0" 
                style={{ backgroundColor: c.hex }} 
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-gray-400 font-medium">{c.label}</div>
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>{c.hex}</span>
                  {copiedHex === c.hex ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extended Palette */}
        {analysis.colors.palette && analysis.colors.palette.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-1">
            {analysis.colors.palette.slice(0, 7).map((color, idx) => (
              <div
                key={idx}
                title={color}
                onClick={() => copyToClipboard(color)}
                className="w-5 h-5 rounded-md cursor-pointer border border-white/10 hover:scale-110 transition shadow"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Typography */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Type className="w-3.5 h-3.5 text-indigo-400" />
          <span>Typography Hierarchy</span>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Heading Font:</span>
            <span className="text-white font-semibold font-mono text-[11px] truncate max-w-[150px]">
              {analysis.typography.headingFont}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Body Font:</span>
            <span className="text-white font-semibold font-mono text-[11px] truncate max-w-[150px]">
              {analysis.typography.bodyFont}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Identified Semantic Sections */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discovered Sections ({analysis.sections.length})</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {analysis.sections.map((section, idx) => (
            <div 
              key={section.id + idx}
              className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-md bg-gray-800 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                  {idx + 1}
                </span>
                <span className="font-semibold text-white capitalize">{section.type}</span>
              </div>
              <span className="text-[10px] text-gray-400 truncate max-w-[140px]">
                {section.heading || 'Default Section'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Navigation Links */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Navigation Flow ({analysis.navigation.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {analysis.navigation.map((item, idx) => (
            <span 
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-gray-300"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Extracted Assets Preview */}
      {analysis.assets && analysis.assets.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Extracted Visual Assets</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {analysis.assets.slice(0, 3).map((asset, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-gray-800 aspect-video bg-gray-950 relative group">
                <img src={asset.url} alt={asset.alt || 'Asset'} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Responsive Structure Notes */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Responsive Layout Notes</span>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400 space-y-1.5">
          {analysis.responsiveNotes.map((note, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-indigo-400">•</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
