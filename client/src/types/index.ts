export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  palette: string[];
}

export interface TypographyInfo {
  headingFont: string;
  bodyFont: string;
  fontSizes: string[];
}

export interface PageAsset {
  type: 'image' | 'icon' | 'svg' | 'logo';
  url: string;
  alt?: string;
}

export interface NavItem {
  label: string;
  href: string;
  isCta?: boolean;
}

export interface AnalyzedSection {
  id: string;
  type: string;
  heading?: string;
  subheading?: string;
  contentSnippet?: string;
  items?: any[];
  ctaButtons?: any[];
}

export interface AnalysisResult {
  url: string;
  title: string;
  description: string;
  favicon: string;
  colors: ColorPalette;
  typography: TypographyInfo;
  sections: AnalyzedSection[];
  assets: PageAsset[];
  navigation: NavItem[];
  responsiveNotes: string[];
}

export interface GeneratedProject {
  id: string;
  name: string;
  files: Record<string, string>;
  entryComponent: string;
  summary: string;
  tokensUsed?: number;
  engineUsed: string;
  createdAt: string;
}

export interface ValidationIssue {
  file: string;
  line?: number;
  message: string;
  type: 'error' | 'warning';
  autoHealed?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  autoFixed: boolean;
  healedFiles?: Record<string, string>;
}

export interface ModificationResult {
  prompt: string;
  files: Record<string, string>;
  diffSummary: string;
  modifiedComponents: string[];
  explanation: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface PipelineStep {
  id: string;
  title: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'warning' | 'error';
  timestamp?: string;
  log?: string;
}
