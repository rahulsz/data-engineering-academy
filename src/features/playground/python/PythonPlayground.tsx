'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Terminal, X, Code2, Copy, Download, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = {
  hello_world: {
    name: '1. Hello World',
    code: `print("Hello, Data Engineering!")
for i in range(5):
    print(f"  Step {i+1}: Processing batch {i+1}...")
print("Pipeline complete! ✓")`
  },
  pandas: {
    name: '2. Pandas DataFrame',
    code: `import pandas as pd
data = {
    'name': ['Alice','Bob','Carol','David','Eve'],
    'department': ['Engineering','Marketing','Engineering','Sales','Marketing'],
    'salary': [95000,72000,88000,65000,78000],
    'years': [5,3,7,2,4]
}
df = pd.DataFrame(data)
print(df.to_string())
print(f"\\nAverage salary: $\\{df['salary'].mean():,.0f}")
print(df.groupby('department')['salary'].agg(['mean','count']).to_string())`
  },
  analysis: {
    name: '3. Data Analysis',
    code: `import pandas as pd, numpy as np
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=100, freq='D')
sales = pd.DataFrame({
    'date': dates,
    'revenue': np.random.normal(10000, 2000, 100).clip(5000),
    'units': np.random.randint(50, 200, 100),
    'region': np.random.choice(['North','South','East','West'], 100)
})
print(f"Total Revenue: $\\{sales['revenue'].sum():,.2f}")
print(f"Best Day: \\{sales.loc[sales['revenue'].idxmax(), 'date'].date()}")
print("\\nBy Region:")
print(sales.groupby('region')['revenue'].sum().sort_values(ascending=False).to_string())`
  },
  chart: {
    name: '4. Matplotlib Chart',
    code: `import matplotlib.pyplot as plt, numpy as np
plt.style.use('dark_background')
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
revenue = [45,52,48,61,55,67,72,69,78,82,88,95]
costs   = [30,32,31,38,36,40,43,42,46,48,52,55]
x = np.arange(len(months))
fig, ax = plt.subplots(figsize=(10, 5))
ax.bar(x - 0.2, revenue, 0.4, label='Revenue', color='#6366f1', alpha=0.85)
ax.bar(x + 0.2, costs,   0.4, label='Costs',   color='#ec4899', alpha=0.85)
ax.set_xticks(x); ax.set_xticklabels(months)
ax.set_title('Annual Revenue vs Costs (2024)')
ax.legend(); plt.tight_layout()
print("Chart rendered above ↑")`
  },
  etl: {
    name: '5. ETL Pipeline Simulation',
    code: `import random
def extract(source):
    print(f"[EXTRACT] Reading from \\{source}...")
    records = [{'id': i, 'value': random.randint(1,100),
                'status': random.choice(['active','inactive','pending'])} for i in range(1,21)]
    print(f"[EXTRACT] ✓ Extracted \\{len(records)} records")
    return records

def transform(records):
    cleaned = [r for r in records if r['status'] == 'active']
    enriched = [{**r, 'value_usd': r['value'] * 1.08} for r in cleaned]
    print(f"[TRANSFORM] ✓ \\{len(enriched)} records (removed \\{len(records)-len(enriched)} inactive)")
    return enriched

def load(records, target):
    print(f"[LOAD] ✓ Loaded \\{len(records)} records to \\{target}")
    return len(records)

print("=" * 50)
raw = extract("PostgreSQL sales_db")
transformed = transform(raw)
count = load(transformed, "Snowflake warehouse")
print(f"\\n✅ Pipeline complete. \\{count} records processed.")`
  }
};

type RunStatus = 'loading' | 'installing' | 'ready' | 'running' | 'done' | 'error';
type OutputState = {
  stdout: string;
  stderr: string;
  chart: string | null;
  elapsed: number;
};

export function PythonPlayground() {
  const [code, setCode] = useState(PRESETS.hello_world.code);
  const [status, setStatus] = useState<RunStatus>('loading');
  const [pyodide, setPyodide] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [output, setOutput] = useState<OutputState>({ stdout: '', stderr: '', chart: null, elapsed: 0 });
  const [splitRatio, setSplitRatio] = useState(0.55);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const monaco = useMonaco();

  useEffect(() => {
    async function loadPyodide() {
      setStatus('loading');
      try {
        if ((window as any).__pyodide) {
          setPyodide((window as any).__pyodide);
          setStatus('ready');
          return;
        }
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
          document.head.appendChild(script);
        });
        const py = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
        });
        setStatus('installing');
        await py.loadPackagesFromImports('import numpy, pandas, matplotlib');
        py.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
        `);
        (window as any).__pyodide = py;
        setPyodide(py);
        setStatus('ready');
      } catch (e) {
        setStatus('error');
        setLoadError(e instanceof Error ? e.message : 'Failed to load Python runtime');
      }
    }
    loadPyodide();
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runCode();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, pyodide, status]);

  async function runCode() {
    if (!pyodide || status === 'running' || status === 'loading' || status === 'installing') return;
    setStatus('running');
    setOutput({ stdout: '', stderr: '', chart: null, elapsed: 0 });
    const startTime = performance.now();
    try {
      await pyodide.runPythonAsync(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      pyodide.runPython('sys.stdout = io.StringIO(); sys.stderr = io.StringIO()');
      let chart: string | null = null;
      try {
        chart = pyodide.runPython(`
import matplotlib.pyplot as plt, base64, io as _io
if plt.get_fignums():
    buf = _io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#0a0a0a', dpi=120)
    plt.close('all')
    base64.b64encode(buf.getvalue()).decode()
else:
    ''
        `);
        if (!chart) chart = null;
      } catch { chart = null; }
      
      const elapsed = Math.round(performance.now() - startTime);
      setOutput({ stdout, stderr, chart, elapsed });
      setStatus('done');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      pyodide.runPython('sys.stdout = io.StringIO(); sys.stderr = io.StringIO()');
      setOutput({ stdout: '', stderr: msg, chart: null, elapsed: 0 });
      setStatus('error');
    }
  }

  const handleDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startRatio = splitRatio;
    const totalWidth = containerRef.current?.clientWidth || 1000;
    
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newRatio = Math.max(0.2, Math.min(0.8, startRatio + delta / totalWidth));
      setSplitRatio(newRatio);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const isRunning = status === 'running';

  return (
    <div className="flex flex-col h-full bg-background text-slate-300 font-sans relative">
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {/* Editor Panel */}
        <div style={{ width: `${splitRatio * 100}%` }} className="flex flex-col min-w-[200px] border-r border-border/50">
          <div className="h-12 bg-card border-b border-border/50 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Code2 className="w-4 h-4" />
                <span>Python Playground</span>
              </div>
              <select 
                onChange={(e) => setCode(PRESETS[e.target.value as keyof typeof PRESETS].code)}
                className="bg-black border border-border rounded px-2 py-1 text-xs outline-none focus:border-emerald-500 transition-colors text-slate-300"
              >
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>{preset.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCode('')} 
                className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={runCode}
                disabled={isRunning || status === 'loading' || status === 'installing'}
                className="px-4 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isRunning ? 'Running...' : 'Run (Ctrl+Enter)'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                padding: { top: 16, bottom: 16 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>
        </div>

        {/* Drag Handle */}
        <div 
          onMouseDown={handleDrag}
          className="w-2 bg-black hover:bg-emerald-500/20 cursor-col-resize flex flex-col items-center justify-center shrink-0 border-x border-border/50 transition-colors"
        >
          <div className="w-0.5 h-10 bg-white/20 rounded-full" />
        </div>

        {/* Output Panel */}
        <div style={{ width: `${(1 - splitRatio) * 100}%` }} className="flex flex-col min-w-[200px] bg-card">
          <div className="h-12 bg-background border-b border-border/50 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Terminal className="w-4 h-4" /> Output
            </div>
            {output.stdout && (
              <button 
                onClick={() => navigator.clipboard.writeText(output.stdout)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" 
                title="Copy output"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-auto p-4 relative font-mono text-sm leading-relaxed">
            {isRunning ? (
              <div className="flex flex-col items-center justify-center h-full text-white/30 gap-3">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <div className="text-xs tracking-widest uppercase">Executing Python</div>
              </div>
            ) : (
              <>
                {output.chart && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-border bg-black p-2 flex justify-center">
                    <img src={`data:image/png;base64,${output.chart}`} alt="Matplotlib output" className="max-w-full h-auto object-contain" />
                  </div>
                )}
                {output.stderr && (
                  <div className="text-red-400 whitespace-pre-wrap mb-4 font-mono text-[13px] bg-red-950/20 p-4 rounded-lg border border-red-500/20">
                    {output.stderr}
                  </div>
                )}
                {output.stdout && (
                  <div className="text-slate-300 whitespace-pre-wrap font-mono text-[13px]">
                    {output.stdout}
                  </div>
                )}
                {!output.stdout && !output.stderr && !output.chart && status !== 'error' && (
                  <div className="text-white/20 italic mt-4 text-center">Output will appear here</div>
                )}
              </>
            )}
          </div>
          
          {/* Status Bar */}
          <div className="h-8 shrink-0 bg-background border-t border-border/50 flex items-center justify-between px-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              {status === 'loading' && <><RefreshCw className="w-3 h-3 animate-spin" /> Loading Python runtime...</>}
              {status === 'installing' && <><RefreshCw className="w-3 h-3 animate-spin" /> Installing pandas, numpy, matplotlib...</>}
              {status === 'ready' && <><div className="w-2 h-2 rounded-full bg-emerald-500" /> Ready</>}
              {status === 'running' && <><RefreshCw className="w-3 h-3 animate-spin text-emerald-500" /> Running...</>}
              {status === 'done' && <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Done in {output.elapsed}ms</>}
              {status === 'error' && <><X className="w-3 h-3 text-red-500" /> {loadError || 'Error'}</>}
            </div>
            <div className="text-white/30">Powered by Pyodide 0.25 · Python 3.11</div>
          </div>
        </div>
      </div>
    </div>
  );
}
