import React, { useState } from 'react';
import { X, Key, Cpu, Zap, DollarSign, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  setSelectedModel,
  apiKey,
  setApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [model, setModel] = useState(selectedModel);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    setSelectedModel(model);
    localStorage.setItem('webclone_api_key', tempKey);
    localStorage.setItem('webclone_model', model);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Agent Engine Settings</h2>
              <p className="text-xs text-gray-400">Configure LLM providers and cost optimization settings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Synthesis Engine</label>
          <div className="space-y-2">
            {/* Heuristic */}
            <div 
              onClick={() => setModel('heuristic')}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                model === 'heuristic' 
                  ? 'border-indigo-500 bg-indigo-950/20 text-white' 
                  : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Autonomous Heuristic Synthesizer</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Free & Instant</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">High-fidelity deterministic AST synthesizer. Zero API tokens required, guaranteed 100% valid JSX.</p>
              </div>
            </div>

            {/* Gemini */}
            <div 
              onClick={() => setModel('gemini')}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                model === 'gemini' 
                  ? 'border-indigo-500 bg-indigo-950/20 text-white' 
                  : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Google Gemini 1.5 Flash</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">High Accuracy</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Multimodal semantic analysis with fine-tuned copywriting synthesis.</p>
              </div>
            </div>

            {/* OpenAI */}
            <div 
              onClick={() => setModel('openai')}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                model === 'openai' 
                  ? 'border-indigo-500 bg-indigo-950/20 text-white' 
                  : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">OpenAI GPT-4o-mini</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">Creative Refactor</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">State-of-the-art coding model with rich conversational edits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Input (if LLM selected) */}
        {model !== 'heuristic' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center justify-between">
              <span>{model === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}</span>
              <span className="text-[11px] text-gray-400 font-normal">Stored locally in browser</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder={model === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Cost Awareness Callout */}
        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800/80 text-xs text-gray-400 space-y-1.5">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>Cost & Efficiency Optimization</span>
          </div>
          <p>
            By leveraging client-side DOM parsing and selective LLM invocation with strict caching, average generation cost is reduced by up to <strong>88%</strong> compared to sending full raw HTML to LLM context.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
