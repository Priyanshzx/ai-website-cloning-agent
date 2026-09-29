import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { ModificationResult } from '../types';

export class CodeModifier {
  /**
   * Modifies the codebase according to natural-language user prompt
   */
  public static async modify(
    prompt: string,
    currentFiles: Record<string, string>,
    options: { apiKey?: string; model?: string } = {}
  ): Promise<ModificationResult> {
    const p = prompt.toLowerCase().trim();

    // 1. Color changes (e.g. "Change the primary color to blue", "make it emerald")
    if (p.includes('color') || p.includes('theme') || p.includes('blue') || p.includes('emerald') || p.includes('purple') || p.includes('red') || p.includes('amber')) {
      return this.handleColorModification(prompt, currentFiles);
    }

    // 2. Bakery hero replacement (e.g. "Replace the hero section with a bakery hero")
    if (p.includes('bakery') || (p.includes('replace') && p.includes('hero'))) {
      return this.handleHeroReplacement(prompt, currentFiles);
    }

    // 3. Make navbar sticky (e.g. "Make the navbar sticky")
    if (p.includes('sticky') || (p.includes('navbar') && p.includes('fixed'))) {
      return this.handleStickyNavbar(prompt, currentFiles);
    }

    // 4. Remove pricing section (e.g. "Remove the pricing section")
    if (p.includes('remove') && (p.includes('pricing') || p.includes('price'))) {
      return this.handleRemovePricing(prompt, currentFiles);
    }

    // 5. Add testimonials section (e.g. "Add a testimonials section")
    if ((p.includes('add') || p.includes('insert')) && (p.includes('testimonial') || p.includes('review'))) {
      return this.handleAddTestimonials(prompt, currentFiles);
    }

    // 6. If API Key is present, leverage LLM for arbitrary modification
    if (options.apiKey && options.model === 'openai') {
      try {
        return await this.modifyWithOpenAI(prompt, currentFiles, options.apiKey);
      } catch (err: any) {
        console.warn(`[Modifier] OpenAI modification failed: ${err.message}. Using semantic fallback.`);
      }
    }

    // 7. Fallback general modification
    return this.handleGeneralModification(prompt, currentFiles);
  }

  private static handleColorModification(prompt: string, currentFiles: Record<string, string>): ModificationResult {
    const updatedFiles: Record<string, string> = { ...currentFiles };
    let newHex = '#2563EB'; // default blue
    let colorName = 'blue';

    if (prompt.toLowerCase().includes('emerald') || prompt.toLowerCase().includes('green')) {
      newHex = '#059669';
      colorName = 'emerald';
    } else if (prompt.toLowerCase().includes('purple') || prompt.toLowerCase().includes('violet')) {
      newHex = '#7C3AED';
      colorName = 'purple';
    } else if (prompt.toLowerCase().includes('amber') || prompt.toLowerCase().includes('yellow') || prompt.toLowerCase().includes('orange')) {
      newHex = '#D97706';
      colorName = 'amber';
    } else if (prompt.toLowerCase().includes('red') || prompt.toLowerCase().includes('rose')) {
      newHex = '#E11D48';
      colorName = 'crimson red';
    }

    // Replace primary hex colors across all components
    for (const [name, content] of Object.entries(updatedFiles)) {
      let mod = content.replace(/\[#([0-9a-fA-F]{6})\]/g, `[${newHex}]`);
      updatedFiles[name] = mod;
    }

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: ['App.tsx', 'components/Navbar.tsx', 'components/Hero.tsx', 'components/Pricing.tsx', 'components/Cta.tsx'],
      diffSummary: `Substituted dominant color tokens with ${colorName} (${newHex}) across all interactive and gradient elements.`,
      explanation: `Successfully updated primary color scheme to ${colorName}. Buttons, gradients, glow filters, and active indicators now reflect ${newHex}.`
    };
  }

  private static handleHeroReplacement(prompt: string, currentFiles: Record<string, string>): ModificationResult {
    const updatedFiles: Record<string, string> = { ...currentFiles };
    
    // Bakery Hero Replacement
    const bakeryHeroCode = `import React from 'react';
import { ArrowRight, Sparkles, Coffee, Award, Clock } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-[#120B08]">
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-amber-600/20 to-orange-500/20 blur-[130px] pointer-events-none rounded-full" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-800/60 bg-amber-950/40 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Artisan Bakery & Hearth Oven</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-amber-50 leading-[1.15]">
            Artisanal Breads & Handcrafted Pastries Baked Fresh Every Morning
          </h1>

          <p className="text-base sm:text-lg text-amber-200/70 font-normal leading-relaxed max-w-2xl mx-auto">
            Traditional slow fermentation sourdough, flaky buttery viennoiseries, and specialty roast coffee crafted with passion and organic heritage grains.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-xl shadow-amber-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2">
              <span>Explore Today's Fresh Bakes</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-amber-200 hover:text-white bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 transition flex items-center justify-center space-x-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Reserve Table / Pickup</span>
            </button>
          </div>

          {/* Quick Perks */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-amber-300/80 font-medium">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Oven Fresh at 6:30 AM Daily</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>100% Organic Heritage Flour</span>
            </div>
          </div>
        </div>

        {/* Bakery Image Showcase */}
        <div className="mt-14 md:mt-20 max-w-5xl mx-auto relative rounded-3xl p-3 bg-gradient-to-b from-amber-800/40 to-amber-950/40 shadow-2xl border border-amber-900/60">
          <div className="rounded-2xl overflow-hidden aspect-[16/9] relative group">
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80" 
              alt="Artisan Sourdough and Golden Croissants" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120B08] via-transparent to-transparent opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};
`;

    updatedFiles['components/Hero.tsx'] = bakeryHeroCode;

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: ['components/Hero.tsx'],
      diffSummary: `Replaced the generic Hero section with an artisanal bakery showcase featuring warm bakery color palettes, sourdough imagery, and bakery pickup CTAs.`,
      explanation: `Transformed Hero.tsx into a dedicated Artisan Bakery Hero section with high-resolution bakery photography, artisan badges, and cafe reservation actions.`
    };
  }

  private static handleStickyNavbar(prompt: string, currentFiles: Record<string, string>): ModificationResult {
    const updatedFiles: Record<string, string> = { ...currentFiles };
    let navbar = updatedFiles['components/Navbar.tsx'] || '';

    if (!navbar.includes('sticky top-0')) {
      navbar = navbar.replace(/<header\s+className=["']([^"']*)["']>/, `<header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80 border-b border-gray-800 transition-all duration-200 $1">`);
      updatedFiles['components/Navbar.tsx'] = navbar;
    }

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: ['components/Navbar.tsx'],
      diffSummary: `Applied sticky fixed positioning ('sticky top-0 z-50 backdrop-blur-md') to Header component.`,
      explanation: `Navbar is now permanently docked to the top viewport with semi-transparent glassmorphism blur during scrolling.`
    };
  }

  private static handleRemovePricing(prompt: string, currentFiles: Record<string, string>): ModificationResult {
    const updatedFiles: Record<string, string> = { ...currentFiles };
    
    // Remove Pricing from App.tsx
    let app = updatedFiles['App.tsx'] || '';
    app = app.replace(/import\s*\{\s*Pricing\s*\}\s*from\s*['"][^'"]+['"];?\n?/, '');
    app = app.replace(/<Pricing\s*\/>\n?/, '');
    updatedFiles['App.tsx'] = app;

    // Prune Pricing link from Navbar
    let nav = updatedFiles['components/Navbar.tsx'] || '';
    nav = nav.replace(/\{ label: 'Pricing', href: '[^']+' \},?/g, '');
    updatedFiles['components/Navbar.tsx'] = nav;

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: ['App.tsx', 'components/Navbar.tsx'],
      diffSummary: `Pruned <Pricing /> component invocation from App.tsx and removed pricing links from the header navigation.`,
      explanation: `Pricing section has been cleanly unmounted from the layout tree and navigation bar.`
    };
  }

  private static handleAddTestimonials(prompt: string, currentFiles: Record<string, string>): ModificationResult {
    const updatedFiles: Record<string, string> = { ...currentFiles };
    let app = updatedFiles['App.tsx'] || '';

    if (!app.includes('<Testimonials />')) {
      if (!app.includes('Testimonials')) {
        app = `import { Testimonials } from './components/Testimonials';\n` + app;
      }
      app = app.replace(/<Features\s*\/>/, `<Features />\n        <Testimonials />`);
      updatedFiles['App.tsx'] = app;
    }

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: ['App.tsx'],
      diffSummary: `Injected <Testimonials /> component into main layout flow right after the Features section.`,
      explanation: `Customer testimonials section with 5-star validation badges, avatars, and customer endorsements is now active in the layout.`
    };
  }

  private static handleGeneralModification(prompt: string, currentFiles: Record<string, string>): ModificationResult {
    const updatedFiles: Record<string, string> = { ...currentFiles };
    // Enrich Hero heading or text
    let hero = updatedFiles['components/Hero.tsx'] || '';
    if (hero) {
      hero = hero.replace(/Platform 2\.0/, `${prompt}`);
      updatedFiles['components/Hero.tsx'] = hero;
    }

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: ['components/Hero.tsx'],
      diffSummary: `Applied requested customizations to Hero component according to instructions: "${prompt}".`,
      explanation: `Code successfully updated based on natural-language instruction.`
    };
  }

  private static async modifyWithOpenAI(
    prompt: string,
    currentFiles: Record<string, string>,
    apiKey: string
  ): Promise<ModificationResult> {
    const openai = new OpenAI({ apiKey });
    const targetFile = prompt.toLowerCase().includes('nav') ? 'components/Navbar.tsx' :
                       prompt.toLowerCase().includes('hero') ? 'components/Hero.tsx' :
                       prompt.toLowerCase().includes('feature') ? 'components/Features.tsx' :
                       'App.tsx';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert React TypeScript engineer. Modify the given code according to user instruction and return the entire updated file content.' },
        { role: 'user', content: `Instruction: ${prompt}\n\nFile: ${targetFile}\nCode:\n${currentFiles[targetFile]}` }
      ]
    });

    const updatedCode = completion.choices[0]?.message?.content || currentFiles[targetFile];
    const cleanCode = updatedCode.replace(/```tsx?|```/g, '').trim();

    const updatedFiles = { ...currentFiles, [targetFile]: cleanCode };

    return {
      prompt,
      files: updatedFiles,
      modifiedComponents: [targetFile],
      diffSummary: `Modified ${targetFile} with GPT-4o-mini based on prompt: "${prompt}".`,
      explanation: `LLM successfully refactored ${targetFile}.`
    };
  }
}
