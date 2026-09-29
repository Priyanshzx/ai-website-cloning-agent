import { AnalysisResult, GeneratedProject, ValidationResult, ModificationResult } from '../types';

const API_BASE = '/api';

export const api = {
  async analyzeUrl(url: string): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to analyze website');
    return data.analysis;
  },

  async generateFrontend(
    analysis: AnalysisResult,
    model: string = 'heuristic',
    apiKey?: string
  ): Promise<{ project: GeneratedProject; validation: ValidationResult }> {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis, model, apiKey }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to generate frontend');
    return { project: data.project, validation: data.validation };
  },

  async modifyCode(
    prompt: string,
    currentFiles: Record<string, string>,
    model: string = 'heuristic',
    apiKey?: string
  ): Promise<{ modification: ModificationResult; validation: ValidationResult }> {
    const res = await fetch(`${API_BASE}/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, currentFiles, model, apiKey }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to modify code');
    return { modification: data.modification, validation: data.validation };
  },

  async validateCode(files: Record<string, string>): Promise<ValidationResult> {
    const res = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Validation failed');
    return data.validation;
  },

  async exportProjectZip(project: GeneratedProject): Promise<void> {
    const res = await fetch(`${API_BASE}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project }),
    });
    if (!res.ok) throw new Error('Failed to export project ZIP');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-react-frontend.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};
