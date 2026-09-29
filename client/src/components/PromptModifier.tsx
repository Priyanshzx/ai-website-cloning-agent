import React, { useState } from 'react';
import { 
  Wand2, 
  Send, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileCode,
  ArrowRight
} from 'lucide-react';
import { ModificationResult } from '../types';

interface PromptModifierProps {
  onModify: (prompt: string) => void;
  isLoading: boolean;
  history: ModificationResult[];
}

const SUGGESTED_PROMPTS = [
  "Change the primary color to blue.",
  "Add a testimonials section.",
  "Replace the hero section with a bakery hero.",
  "Make the navbar sticky.",
  "Remove the pricing section.",
  "Change the primary color to emerald.",
];

export const PromptModifier: React.FC<PromptModifierProps> = ({
  onModify,
  isLoading,
  history,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onModify(prompt.trim());
    setPrompt('');
  };

  const handleChipClick = (suggestion: string) => {
    setPrompt(suggestion);
    onModify(suggestion);
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Natural-Language Modifier</h3>
        </div>
        <p className="text-[11px] text-gray-400">
          Enter plain English instructions to mutate components, styles, content, or layout in real-time.
        </p>
      </div>

      {/* Suggested Quick Action Chips */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Quick Benchmark Prompts</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(suggestion)}
              disabled={isLoading}
              className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-indigo-500/60 hover:bg-gray-800/80 transition flex items-center space-x-1 disabled:opacity-50"
            >
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={3}
          placeholder="E.g. 'Replace the hero section with a bakery hero' or 'Make the navbar sticky'..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="w-full bg-gray-900 border border-gray-700/80 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none font-sans shadow-inner"
        />

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">Press Enter ↵ to apply</span>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center space-x-1.5 shadow-lg ${
              !prompt.trim() || isLoading
                ? 'bg-indigo-600/40 cursor-not-allowed text-gray-400'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Refactoring...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Modify Code</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modification History & Diffs */}
      <div className="space-y-3 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Modification History ({history.length})
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-xs">
            No modifications applied yet. Try one of the quick benchmark prompts above.
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.slice().reverse().map((item, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5 font-semibold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>"{item.prompt}"</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Applied</span>
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {item.diffSummary}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.modifiedComponents.map((comp) => (
                    <span 
                      key={comp}
                      className="px-2 py-0.5 rounded-md bg-gray-800 text-[10px] font-mono text-gray-400 border border-gray-700/50 flex items-center space-x-1"
                    >
                      <FileCode className="w-2.5 h-2.5 text-indigo-400" />
                      <span>{comp}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
