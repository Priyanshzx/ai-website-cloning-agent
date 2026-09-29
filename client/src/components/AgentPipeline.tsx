import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCw, 
  Globe, 
  Layout, 
  Code2, 
  ShieldCheck, 
  Eye, 
  Wand2 
} from 'lucide-react';
import { PipelineStep, ValidationResult } from '../types';

interface AgentPipelineProps {
  steps: PipelineStep[];
  currentStepIndex: number;
  validation?: ValidationResult;
  elapsedTime: number;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  steps,
  currentStepIndex,
  validation,
  elapsedTime,
}) => {
  const getStepIcon = (id: string, status: string) => {
    if (status === 'running') {
      return <RotateCw className="w-4 h-4 text-indigo-400 animate-spin" />;
    }
    if (status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (status === 'warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }

    switch (id) {
      case 'scrape': return <Globe className="w-4 h-4 text-gray-500" />;
      case 'analyze': return <Layout className="w-4 h-4 text-gray-500" />;
      case 'generate': return <Code2 className="w-4 h-4 text-gray-500" />;
      case 'validate': return <ShieldCheck className="w-4 h-4 text-gray-500" />;
      case 'preview': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with timer */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Agent Execution Pipeline</h3>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-gray-400 bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{(elapsedTime / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* Stepper list */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'running';

          return (
            <div key={step.id} className="relative group">
              {/* Dot Icon */}
              <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isDone 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : isCurrent 
                  ? 'bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/50' 
                  : 'bg-gray-900 border border-gray-800 text-gray-500'
              }`}>
                {getStepIcon(step.id, step.status)}
              </div>

              {/* Step info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isDone ? 'text-white' : isCurrent ? 'text-indigo-400' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                  {step.timestamp && (
                    <span className="text-[10px] text-gray-500 font-mono">{step.timestamp}</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Log snippet if present */}
                {step.log && (
                  <div className="mt-2 p-2 rounded-lg bg-gray-950/80 border border-gray-800 text-[10px] text-gray-300 font-mono leading-tight">
                    {step.log}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-Healing summary banner */}
      {validation && (
        <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 mt-4 ${
          validation.autoFixed 
            ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' 
            : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
        }`}>
          <div className="flex items-center space-x-2 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>AST Self-Healing & Validation Engine</span>
          </div>
          <p className="text-gray-400 text-[11px]">
            {validation.autoFixed 
              ? `Auto-healed ${validation.issues.filter(i => i.autoHealed).length} potential JSX/AST issues. Production syntax verified.`
              : '100% clean compilation. All component tags and TypeScript types validated.'}
          </p>
        </div>
      )}
    </div>
  );
};
