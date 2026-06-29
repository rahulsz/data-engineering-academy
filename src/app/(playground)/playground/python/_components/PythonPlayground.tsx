'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, FileTerminal, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Script from 'next/script';

export function PythonPlayground({ defaultCode = 'print("Hello, Data Engineering!")\n\n# Try writing a generator\ndef squares(n):\n    for i in range(n):\n        yield i**2\n\nprint(list(squares(5)))' }: { defaultCode?: string }) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);

  const initPyodide = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pyodide = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
      });
      pyodideRef.current = pyodide;
      setPyodideReady(true);
    } catch (e) {
      console.error("Failed to load Pyodide:", e);
      setError("Failed to initialize Python environment.");
    }
  };

  const handleRun = async () => {
    if (!pyodideRef.current) return;
    
    setLoading(true);
    setError(null);
    setOutput('');
    
    try {
      // Intercept stdout
      pyodideRef.current.setStdout({ batched: (msg: string) => setOutput(prev => prev + msg + '\n') });
      pyodideRef.current.setStderr({ batched: (msg: string) => setError(prev => (prev || '') + msg + '\n') });
      
      await pyodideRef.current.runPythonAsync(code);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" 
        onLoad={initPyodide}
      />
      
      <div className="flex flex-col lg:flex-row w-full h-full bg-zinc-950 text-slate-300">
        
        {/* Editor & Results */}
        <div className="flex flex-col flex-1 h-full min-w-0">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/40">
            <div className="flex items-center gap-2">
              <FileTerminal className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-sm text-white/90">main.py</span>
            </div>
            <div className="flex items-center gap-3">
              {!pyodideReady && <span className="text-xs text-white/50 animate-pulse">Initializing Python environment...</span>}
              <button 
                onClick={handleRun}
                disabled={loading || !pyodideReady}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-md transition-all",
                  (loading || !pyodideReady) ? "bg-blue-500/50 cursor-not-allowed text-white/70" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                )}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {loading ? 'Running...' : 'Run Python'}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="h-2/3 min-h-[300px] border-b border-border relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'var(--font-inter), monospace',
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                roundedSelection: false,
                renderLineHighlight: 'all',
              }}
            />
          </div>

          {/* Results Panel */}
          <div className="flex-1 overflow-hidden flex flex-col bg-black/60 relative">
            <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between text-xs text-white/50 bg-black/40 font-mono">
              <span>Console Output</span>
            </div>
            
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="whitespace-pre-wrap">{error}</div>
                </div>
              )}

              {output && (
                <div className="whitespace-pre-wrap text-white/80">{output}</div>
              )}

              {!output && !error && !loading && (
                <div className="h-full flex items-center justify-center text-white/20 italic">
                  Run script to see console output
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
