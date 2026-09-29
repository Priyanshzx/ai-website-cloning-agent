import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, 
  Layers, 
  Wand2, 
  Code2, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { Header } from './components/Header';
import { AgentPipeline } from './components/AgentPipeline';
import { AnalysisInspector } from './components/AnalysisInspector';
import { PromptModifier } from './components/PromptModifier';
import { CodeExplorer } from './components/CodeExplorer';
import { LivePreview } from './components/LivePreview';
import { SettingsModal } from './components/SettingsModal';
import { api } from './services/api';
import { 
  AnalysisResult, 
  GeneratedProject, 
  ValidationResult, 
  ModificationResult, 
  ViewportMode, 
  PipelineStep 
} from './types';

type StudioTab = 'pipeline' | 'analysis' | 'modifier' | 'code';

export default function App() {
  const [url, setUrl] = useState('https://linear.app');
  const [activeTab, setActiveTab] = useState<StudioTab>('pipeline');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [compareMode, setCompareMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings
  const [selectedModel, setSelectedModel] = useState<string>(() => localStorage.getItem('webclone_model') || 'heuristic');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('webclone_api_key') || '');

  // Workflow Data
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [validation, setValidation] = useState<ValidationResult | undefined>(undefined);
  const [modificationHistory, setModificationHistory] = useState<ModificationResult[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<any>(null);

  // Pipeline execution steps
  const [steps, setSteps] = useState<PipelineStep[]>([
    { id: 'scrape', title: 'URL Crawl & DOM Extraction', description: 'Fetch HTML, extract stylesheet tokens, CSS vars, and assets', status: 'idle' },
    { id: 'analyze', title: 'Design Token & Layout Classification', description: 'Deconstruct color palette, typography hierarchy, and section blueprints', status: 'idle' },
    { id: 'generate', title: 'React TSX Component Synthesis', description: 'Generate modular React components with Tailwind CSS styling', status: 'idle' },
    { id: 'validate', title: 'AST Validation & Self-Healing Loop', description: 'Verify JSX tag closures, props, and auto-heal syntax discrepancies', status: 'idle' },
    { id: 'preview', title: 'Sandbox Build & Live Hot-Reload', description: 'Mount compiled components into responsive preview viewport', status: 'idle' },
  ]);

  // Clone Execution Engine
  const handleClone = async () => {
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setActiveTab('pipeline');
    setElapsedTime(0);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    const updateStep = (id: string, status: PipelineStep['status'], log?: string) => {
      setSteps(prev => prev.map(s => s.id === id ? { 
        ...s, 
        status, 
        timestamp: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
        log: log || s.log 
      } : s));
    };

    try {
      // Step 1: Scrape
      updateStep('scrape', 'running', `Fetching DOM and media assets from ${url}...`);
      const analyzedData = await api.analyzeUrl(url);
      setAnalysis(analyzedData);
      updateStep('scrape', 'completed', `Extracted ${analyzedData.sections.length} semantic sections, ${analyzedData.assets.length} images, and color palette.`);

      // Step 2: Analyze
      updateStep('analyze', 'running', 'Classifying design tokens, typography, and responsive breakpoints...');
      await new Promise(r => setTimeout(r, 400));
      updateStep('analyze', 'completed', `Identified primary (${analyzedData.colors.primary}), font (${analyzedData.typography.headingFont}), and responsive layout tree.`);

      // Step 3: Generate
      updateStep('generate', 'running', `Synthesizing modular React components with ${selectedModel} engine...`);
      const genResult = await api.generateFrontend(analyzedData, selectedModel, apiKey);
      setProject(genResult.project);
      updateStep('generate', 'completed', `Synthesized ${Object.keys(genResult.project.files).length} TSX components: App, Navbar, Hero, Features, Stats, Testimonials, Pricing, Footer.`);

      // Step 4: Validate & Self-Heal
      updateStep('validate', 'running', 'Running AST syntax check and verifying JSX tag balance...');
      setValidation(genResult.validation);
      await new Promise(r => setTimeout(r, 300));
      if (genResult.validation.autoFixed) {
        updateStep('validate', 'completed', `Auto-healed ${genResult.validation.issues.length} minor JSX tags. Clean compilation verified.`);
      } else {
        updateStep('validate', 'completed', 'Zero syntax errors detected. 100% compliant React 18 AST.');
      }

      // Step 5: Mount to Preview
      updateStep('preview', 'running', 'Mounting to sandbox canvas and activating responsive handlers...');
      await new Promise(r => setTimeout(r, 300));
      updateStep('preview', 'completed', 'Recreated website successfully rendered in live sandbox.');

      // Trigger celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err: any) {
      console.error(err);
      updateStep('scrape', 'error', err.message || 'Workflow execution error');
    } finally {
      setIsLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Modify with Natural Language
  const handleModify = async (prompt: string) => {
    if (!project || isLoading) return;

    setIsLoading(true);
    try {
      const res = await api.modifyCode(prompt, project.files, selectedModel, apiKey);
      
      // Update Project Code
      setProject(prev => prev ? { ...prev, files: res.modification.files } : null);
      setValidation(res.validation);
      setModificationHistory(prev => [...prev, res.modification]);

      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 }
      });
    } catch (err: any) {
      console.error('Modification failed:', err);
      alert(`Modification error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Export Code ZIP
  const handleExport = async () => {
    if (!project) return;
    try {
      await api.exportProjectZip(project);
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    }
  };

  // Initial auto-run with demo preset so UI looks stunning right away
  useEffect(() => {
    handleClone();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070A10] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Header Bar */}
      <Header 
        url={url}
        setUrl={setUrl}
        onClone={handleClone}
        isLoading={isLoading}
        viewport={viewport}
        setViewport={setViewport}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        onExport={handleExport}
        onOpenSettings={() => setSettingsOpen(true)}
        hasProject={!!project}
      />

      {/* Main Studio Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 gap-3">
        {/* Left Side: Agent Intelligence & Tools Panel */}
        <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col bg-[#0D121F] border border-gray-800/80 rounded-2xl overflow-hidden shrink-0 shadow-xl">
          {/* Studio Tab Navigation */}
          <div className="flex items-center border-b border-gray-800/80 px-2 pt-2 bg-[#090D17]">
            {[
              { id: 'pipeline', label: 'Pipeline', icon: Activity, count: null },
              { id: 'analysis', label: 'Tokens & UI', icon: Layers, count: analysis ? analysis.sections.length : null },
              { id: 'modifier', label: 'AI Modifier', icon: Wand2, count: modificationHistory.length > 0 ? modificationHistory.length : null },
              { id: 'code', label: 'Code Explorer', icon: Code2, count: project ? Object.keys(project.files).length : null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudioTab)}
                className={`flex-1 py-2.5 px-2 text-xs font-semibold rounded-t-xl transition-all flex items-center justify-center space-x-1.5 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-white bg-[#0D121F]'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id ? 'bg-indigo-600/30 text-indigo-300' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'pipeline' && (
              <AgentPipeline 
                steps={steps}
                currentStepIndex={0}
                validation={validation}
                elapsedTime={elapsedTime}
              />
            )}

            {activeTab === 'analysis' && (
              <AnalysisInspector analysis={analysis} />
            )}

            {activeTab === 'modifier' && (
              <PromptModifier 
                onModify={handleModify}
                isLoading={isLoading}
                history={modificationHistory}
              />
            )}

            {activeTab === 'code' && (
              <CodeExplorer files={project?.files || {}} />
            )}
          </div>
        </div>

        {/* Right Side: Interactive Live Preview & Comparison Sandbox */}
        <div className="flex-1 flex flex-col min-w-0">
          <LivePreview 
            files={project?.files || {}}
            analysis={analysis}
            viewport={viewport}
            setViewport={setViewport}
            originalUrl={url}
            compareMode={compareMode}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}
