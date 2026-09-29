import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebsiteScraper } from './services/scraper';
import { SemanticAnalyzer } from './services/analyzer';
import { AIGenerationEngine } from './services/aiEngine';
import { CodeValidator } from './services/validator';
import { CodeModifier } from './services/modifier';
import { ProjectExporter } from './services/exporter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 1. Analyze Website
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    console.log(`[Agent] Initiating deep analysis for URL: ${url}`);
    const rawAnalysis = await WebsiteScraper.scrape(url);
    const enrichedAnalysis = SemanticAnalyzer.analyze(rawAnalysis);

    res.json({
      success: true,
      analysis: enrichedAnalysis
    });
  } catch (err: any) {
    console.error('[Agent] Analysis error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to analyze website' });
  }
});

// 2. Generate Frontend
app.post('/api/generate', async (req, res) => {
  try {
    const { analysis, model, apiKey } = req.body;
    if (!analysis) {
      return res.status(400).json({ success: false, error: 'Analysis data is required' });
    }

    console.log(`[Agent] Synthesizing React frontend components for: ${analysis.title}`);
    const project = await AIGenerationEngine.generateProject(analysis, { model, apiKey });
    
    // Auto-Validation & Healing Loop
    const validation = CodeValidator.validateAndHeal(project.files);
    if (validation.autoFixed && validation.healedFiles) {
      project.files = validation.healedFiles;
    }

    res.json({
      success: true,
      project,
      validation
    });
  } catch (err: any) {
    console.error('[Agent] Generation error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate frontend' });
  }
});

// 3. Validate & Auto-Heal Code
app.post('/api/validate', (req, res) => {
  try {
    const { files } = req.body;
    if (!files) {
      return res.status(400).json({ success: false, error: 'Files are required' });
    }

    const validation = CodeValidator.validateAndHeal(files);
    res.json({ success: true, validation });
  } catch (err: any) {
    console.error('[Agent] Validation error:', err);
    res.status(500).json({ success: false, error: err.message || 'Validation failed' });
  }
});

// 4. Natural-Language Code Modification
app.post('/api/modify', async (req, res) => {
  try {
    const { prompt, currentFiles, model, apiKey } = req.body;
    if (!prompt || !currentFiles) {
      return res.status(400).json({ success: false, error: 'Prompt and current files are required' });
    }

    console.log(`[Agent] Processing NL modification prompt: "${prompt}"`);
    const modification = await CodeModifier.modify(prompt, currentFiles, { model, apiKey });
    
    // Self-Healing on modified code
    const validation = CodeValidator.validateAndHeal(modification.files);
    if (validation.autoFixed && validation.healedFiles) {
      modification.files = validation.healedFiles;
    }

    res.json({
      success: true,
      modification,
      validation
    });
  } catch (err: any) {
    console.error('[Agent] Modification error:', err);
    res.status(500).json({ success: false, error: err.message || 'Modification failed' });
  }
});

// 5. Export as Standalone ZIP Project
app.post('/api/export', (req, res) => {
  try {
    const { project } = req.body;
    if (!project || !project.files) {
      return res.status(400).json({ success: false, error: 'Project data is required' });
    }

    ProjectExporter.exportAsZip(project, res);
  } catch (err: any) {
    console.error('[Agent] Export error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to export project' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [WebClone AI Backend Engine] running on http://localhost:${PORT}`);
});
