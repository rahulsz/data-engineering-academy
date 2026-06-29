'use client';

import React, { useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Database, Table, FileTerminal, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'sql-formatter';

export function SqlPlayground({ defaultQuery = 'SELECT * FROM customers;' }: { defaultQuery?: string }) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<{ columns: string[], rows: any[], count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const monaco = useMonaco();

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch('/api/sql/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Execution failed');
      }
      
      setResults(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormat = () => {
    try {
      const formatted = format(query, { language: 'sqlite' });
      setQuery(formatted);
    } catch (e) {
      console.error("Format error", e);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-zinc-950 text-slate-300">
      
      {/* Schema Sidebar (Optional for now, but good to have) */}
      <div className="hidden lg:flex flex-col w-64 border-r border-border bg-black/50 p-4">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-indigo-400" />
          Schema
        </h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-white/80 font-medium flex items-center gap-1.5"><Table className="w-3 h-3 text-emerald-400"/> customers</span>
            <span className="text-xs text-white/40 pl-5">id, name, email, country</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/80 font-medium flex items-center gap-1.5"><Table className="w-3 h-3 text-emerald-400"/> orders</span>
            <span className="text-xs text-white/40 pl-5">id, customer_id, date, status, total</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/80 font-medium flex items-center gap-1.5"><Table className="w-3 h-3 text-emerald-400"/> products</span>
            <span className="text-xs text-white/40 pl-5">id, name, category_id, price</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/80 font-medium flex items-center gap-1.5"><Table className="w-3 h-3 text-emerald-400"/> order_items</span>
            <span className="text-xs text-white/40 pl-5">id, order_id, product_id, quantity, price</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/80 font-medium flex items-center gap-1.5"><Table className="w-3 h-3 text-emerald-400"/> categories</span>
            <span className="text-xs text-white/40 pl-5">id, name</span>
          </div>
        </div>
      </div>

      {/* Editor & Results */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/40">
          <div className="flex items-center gap-2">
            <FileTerminal className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-sm text-white/90">query.sql</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleFormat}
              className="text-xs font-medium px-3 py-1.5 text-white/60 hover:text-white transition-colors"
            >
              Format Code
            </button>
            <button 
              onClick={handleRun}
              disabled={loading}
              className={cn(
                "flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-md transition-all",
                loading ? "bg-indigo-500/50 cursor-not-allowed text-white/70" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {loading ? 'Running...' : 'Run Query'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="h-1/2 min-h-[200px] border-b border-border relative">
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme="vs-dark"
            value={query}
            onChange={(val) => setQuery(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'var(--font-inter), monospace',
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              roundedSelection: false,
              renderLineHighlight: 'all',
              wordWrap: 'on'
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="flex-1 overflow-hidden flex flex-col bg-black/60 relative">
          <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between text-xs text-white/50 bg-black/40">
            <span>Query Results</span>
            {results && <span>{results.count} rows returned</span>}
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap font-mono text-sm">{error}</div>
              </div>
            )}

            {results && results.rows.length === 0 && (
              <div className="text-white/40 italic">Query executed successfully, but returned 0 rows.</div>
            )}

            {results && results.rows.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden inline-block min-w-full">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      {results.columns.map((col) => (
                        <th key={col} className="px-4 py-2 font-semibold border-b border-border">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors text-white/80">
                        {results.columns.map((col) => (
                          <td key={col} className="px-4 py-2 font-mono text-xs">{row[col] !== null ? String(row[col]) : <span className="text-white/30 italic">NULL</span>}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!results && !error && !loading && (
              <div className="h-full flex items-center justify-center text-white/20 italic">
                Run a query to see results here
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
