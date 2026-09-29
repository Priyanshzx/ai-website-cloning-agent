import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Folder, 
  Download, 
  Code2, 
  ChevronRight,
  Terminal
} from 'lucide-react';

interface CodeExplorerProps {
  files: Record<string, string>;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ files }) => {
  const fileKeys = Object.keys(files);
  const [selectedFile, setSelectedFile] = useState<string>(fileKeys[0] || 'App.tsx');
  const [copied, setCopied] = useState(false);

  // If selected file was removed (e.g. pricing), fallback to first available
  const activeFile = files[selectedFile] ? selectedFile : fileKeys[0];
  const fileContent = files[activeFile] || '// No content available';

  const copyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = fileContent.split('\n').length;

  return (
    <div className="space-y-4">
      {/* File Navigation Tabs / Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 uppercase tracking-wider">
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Virtual Codebase ({fileKeys.length} Files)</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">React 18 + TSX</span>
        </div>

        {/* File Pills */}
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {fileKeys.map((filename) => (
            <button
              key={filename}
              onClick={() => setSelectedFile(filename)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 ${
                activeFile === filename
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>{filename.replace('components/', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Window */}
      <div className="rounded-xl border border-gray-800 bg-[#0B0E17] overflow-hidden shadow-2xl flex flex-col">
        {/* Editor Title Bar */}
        <div className="px-4 py-2.5 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-gray-300 text-[11px] ml-2 flex items-center space-x-1">
              <span>src/{activeFile}</span>
              <span className="text-gray-600">({lineCount} lines)</span>
            </span>
          </div>

          <button
            onClick={copyCode}
            className="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition flex items-center space-x-1 text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[480px] font-mono text-[11px] leading-relaxed text-gray-300 selection:bg-indigo-600 selection:text-white">
          <pre className="whitespace-pre">
            <code>{fileContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
