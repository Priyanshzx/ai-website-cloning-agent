import archiver from 'archiver';
import { Response } from 'express';
import { GeneratedProject } from '../types';

export class ProjectExporter {
  /**
   * Bundles generated React components into a standalone Vite+React+Tailwind project ZIP
   */
  public static exportAsZip(project: GeneratedProject, res: Response): void {
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment(`${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-react-frontend.zip`);
    archive.pipe(res);

    // Root package.json
    archive.append(JSON.stringify({
      name: project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'lucide-react': '^0.473.0'
      },
      devDependencies: {
        '@types/react': '^18.3.18',
        '@types/react-dom': '^18.3.5',
        '@vitejs/plugin-react': '^4.3.4',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.49',
        tailwindcss: '^3.4.17',
        typescript: '^5.7.3',
        vite: '^6.0.7'
      }
    }, null, 2), { name: 'package.json' });

    // Tailwind Config
    archive.append(`/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};`, { name: 'tailwind.config.js' });

    // PostCSS Config
    archive.append(`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`, { name: 'postcss.config.js' });

    // Vite config
    archive.append(`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`, { name: 'vite.config.ts' });

    // index.html
    archive.append(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name}</title>
  </head>
  <body class="bg-[#0B0F19] text-gray-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`, { name: 'index.html' });

    // src/main.tsx
    archive.append(`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`, { name: 'src/main.tsx' });

    // src/index.css
    archive.append(`@tailwind base;
@tailwind components;
@tailwind utilities;`, { name: 'src/index.css' });

    // Append all generated components in src/
    for (const [filepath, content] of Object.entries(project.files)) {
      archive.append(content, { name: `src/${filepath}` });
    }

    archive.finalize();
  }
}
