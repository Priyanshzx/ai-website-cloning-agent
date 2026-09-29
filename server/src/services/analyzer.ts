import { AnalysisResult, AnalyzedSection, ColorPalette } from '../types';

export class SemanticAnalyzer {
  /**
   * Refines scraped data into structural component blueprints with enriched design tokens
   */
  public static analyze(raw: AnalysisResult): AnalysisResult {
    const refinedSections = raw.sections.map(section => this.enrichSection(section, raw.colors));
    
    // Ensure all critical sections exist
    const hasNavbar = refinedSections.some(s => s.type === 'navbar');
    const hasHero = refinedSections.some(s => s.type === 'hero');
    const hasFooter = refinedSections.some(s => s.type === 'footer');

    if (!hasNavbar) {
      refinedSections.unshift({
        id: 'navbar',
        type: 'navbar',
        heading: raw.title.split(' ')[0] || 'Brand',
      });
    }

    if (!hasHero) {
      refinedSections.splice(1, 0, {
        id: 'hero',
        type: 'hero',
        heading: raw.title,
        subheading: raw.description,
        ctaButtons: [{ text: 'Get Started', variant: 'primary' }, { text: 'Learn More', variant: 'outline' }]
      });
    }

    if (!hasFooter) {
      refinedSections.push({
        id: 'footer',
        type: 'footer',
        heading: raw.title.split(' ')[0] || 'Brand'
      });
    }

    return {
      ...raw,
      sections: refinedSections,
    };
  }

  private static enrichSection(section: AnalyzedSection, colors: ColorPalette): AnalyzedSection {
    // Ensure items have proper structure
    if (section.type === 'pricing' && (!section.items || section.items.length === 0)) {
      section.items = [
        { title: 'Starter', price: '$29/mo', description: 'Essential features for individuals and small teams.' },
        { title: 'Growth', price: '$79/mo', description: 'Advanced power tools with team collaboration and priority support.' },
        { title: 'Enterprise', price: '$199/mo', description: 'Custom security, unlimited volume, and dedicated infrastructure.' }
      ];
    }

    if (section.type === 'features' && (!section.items || section.items.length === 0)) {
      section.items = [
        { title: 'High Velocity', description: 'Engineered for microsecond latency and immediate feedback.', icon: 'Zap' },
        { title: 'Deep Security', description: 'Strict compliance and automated auditing at every layer.', icon: 'Shield' },
        { title: 'Real-time Telemetry', description: 'Live event streaming with intuitive visual dashboards.', icon: 'BarChart3' }
      ];
    }

    return section;
  }
}
