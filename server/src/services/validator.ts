import { ValidationResult, ValidationIssue } from '../types';

export class CodeValidator {
  /**
   * Validates generated React/TSX files and automatically applies healing patches for common JSX/TS errors
   */
  public static validateAndHeal(files: Record<string, string>): ValidationResult {
    const issues: ValidationIssue[] = [];
    const healedFiles: Record<string, string> = { ...files };
    let hasHealedAny = false;

    for (const [filename, content] of Object.entries(files)) {
      let currentContent = content;

      // 1. Check for unclosed self-closing void tags: <img>, <input>, <br>, <hr>
      const voidTags = ['img', 'input', 'br', 'hr'];
      for (const tag of voidTags) {
        const unclosedVoidRegex = new RegExp(`<(${tag})\\b([^>]*?[^\\/])>`, 'gi');
        if (unclosedVoidRegex.test(currentContent)) {
          issues.push({
            file: filename,
            message: `Unclosed void tag <${tag}> detected. Auto-healing to self-closing <${tag} />.`,
            type: 'warning',
            autoHealed: true
          });
          currentContent = currentContent.replace(unclosedVoidRegex, '<$1$2 />');
          hasHealedAny = true;
        }
      }

      // 2. Check for invalid HTML 'class=' instead of 'className='
      if (/\bclass=["'](?![^<]*>)/.test(currentContent) || /<[a-zA-Z0-9]+\s+[^>]*?\bclass=/g.test(currentContent)) {
        issues.push({
          file: filename,
          message: `Legacy 'class' attribute detected. Auto-converted to JSX 'className'.`,
          type: 'warning',
          autoHealed: true
        });
        currentContent = currentContent.replace(/(<[a-zA-Z0-9]+\s+[^>]*?)\bclass=([{"'])/g, '$1className=$2');
        hasHealedAny = true;
      }

      // 3. Check for invalid 'for=' attribute instead of 'htmlFor='
      if (/<label\s+[^>]*?\bfor=/g.test(currentContent)) {
        issues.push({
          file: filename,
          message: `HTML attribute 'for' detected in <label>. Auto-converted to 'htmlFor'.`,
          type: 'warning',
          autoHealed: true
        });
        currentContent = currentContent.replace(/(<label\s+[^>]*?)\bfor=/g, '$1htmlFor=');
        hasHealedAny = true;
      }

      // 4. Ensure React import is present
      if (!currentContent.includes("import React") && !currentContent.includes("from 'react'")) {
        currentContent = `import React from 'react';\n` + currentContent;
        issues.push({
          file: filename,
          message: `Missing React import. Auto-injected import React from 'react'.`,
          type: 'warning',
          autoHealed: true
        });
        hasHealedAny = true;
      }

      // 5. Basic bracket / tag balance sanity check
      const openCurly = (currentContent.match(/\{/g) || []).length;
      const closeCurly = (currentContent.match(/\}/g) || []).length;
      if (openCurly !== closeCurly) {
        issues.push({
          file: filename,
          message: `Mismatched curly braces detected (${openCurly} open vs ${closeCurly} close).`,
          type: 'error',
          autoHealed: false
        });
      }

      healedFiles[filename] = currentContent;
    }

    const hasErrors = issues.some(i => i.type === 'error' && !i.autoHealed);

    return {
      isValid: !hasErrors,
      issues,
      autoFixed: hasHealedAny,
      healedFiles: hasHealedAny ? healedFiles : undefined
    };
  }
}
