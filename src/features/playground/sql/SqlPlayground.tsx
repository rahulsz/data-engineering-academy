'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Database, History, Bookmark, Settings, Download, FileJson, Copy, ArrowUpDown, ArrowUp, ArrowDown, X, Save, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_QUERIES = {
  ecommerce: `SELECT c.name AS customer, c.country,
  COUNT(o.id) AS order_count,
  ROUND(SUM(o.total), 2) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.country
ORDER BY total_spent DESC LIMIT 10;`,
  hr: `SELECT e.name, d.name AS department, e.salary,
  ROUND(AVG(e.salary) OVER (PARTITION BY e.department_id), 2) AS dept_avg,
  RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS salary_rank
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY d.name, salary_rank;`,
  sales: `SELECT s.name AS salesperson, r.name AS region,
  COUNT(CASE WHEN d.stage = 'won' THEN 1 END) AS deals_won,
  ROUND(SUM(CASE WHEN d.stage = 'won' THEN d.amount ELSE 0 END), 2) AS revenue
FROM salespeople s
JOIN regions r ON s.region_id = r.id
LEFT JOIN deals d ON d.salesperson_id = s.id
GROUP BY s.id, s.name, r.name
ORDER BY revenue DESC;`
};

const SCHEMAS = {
  ecommerce: {
    categories: ['id', 'name'],
    products: ['id', 'name', 'category_id', 'price'],
    customers: ['id', 'name', 'email', 'country'],
    orders: ['id', 'customer_id', 'date', 'status', 'total'],
    order_items: ['id', 'order_id', 'product_id', 'quantity', 'price']
  },
  hr: {
    departments: ['id', 'name'],
    employees: ['id', 'name', 'department_id', 'salary', 'manager_id'],
    salaries: ['id', 'employee_id', 'salary', 'from_date', 'to_date'],
    job_history: ['employee_id', 'start_date', 'end_date', 'role']
  },
  sales: {
    regions: ['id', 'name'],
    salespeople: ['id', 'name', 'region_id'],
    deals: ['id', 'salesperson_id', 'amount', 'stage', 'closed_date'],
    targets: ['id', 'salesperson_id', 'quarter', 'target_amount']
  }
};

type DBType = 'ecommerce' | 'hr' | 'sales';
type QueryResult = {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
};
type HistoryEntry = {
  id: number;
  query: string;
  database: DBType;
  rowCount: number;
  executionTime: number;
  timestamp: string;
};
type SavedEntry = HistoryEntry & { name: string };

export function SqlPlayground() {
  const [query, setQuery] = useState(DEFAULT_QUERIES['ecommerce']);
  const [selectedDB, setSelectedDB] = useState<DBType>('ecommerce');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [splitRatio, setSplitRatio] = useState(0.6);
  const [showSchema, setShowSchema] = useState(true);
  const [activeResultTab, setActiveResultTab] = useState<'results' | 'info'>('results');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  const [showHistory, setShowHistory] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [saved, setSaved] = useState<SavedEntry[]>([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();

  // Load history & saved
  useEffect(() => {
    const h = localStorage.getItem('de_sql_history');
    if (h) setHistory(JSON.parse(h));
    const s = localStorage.getItem('de_sql_saved');
    if (s) setSaved(JSON.parse(s));
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('de_sql_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('de_sql_saved', JSON.stringify(saved));
  }, [saved]);

  // Setup Monaco autocompletion
  useEffect(() => {
    if (monaco) {
      monaco.languages.registerCompletionItemProvider('sql', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          
          const suggestions: any[] = [];
          
          // Keywords
          const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'WITH', 'AS', 'ON'];
          keywords.forEach(kw => {
            suggestions.push({
              label: kw,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: kw,
              range,
            });
          });

          // Tables and Columns for current DB
          const schema = SCHEMAS[selectedDB];
          Object.entries(schema).forEach(([table, cols]) => {
            suggestions.push({
              label: table,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: table,
              range,
            });
            cols.forEach(col => {
              suggestions.push({
                label: col,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: col,
                range,
              });
            });
          });

          return { suggestions };
        }
      });
    }
  }, [monaco, selectedDB]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runQuery();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [query, selectedDB]);

  const runQuery = async () => {
    if (!query.trim() || isRunning) return;
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/sql/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, database: selectedDB })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Execution failed');
      }
      setResults(data);
      
      // Add to history
      const entry: HistoryEntry = {
        id: Date.now(),
        query,
        database: selectedDB,
        rowCount: data.rowCount,
        executionTime: data.executionTime,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [entry, ...prev].slice(0, 50));
      setActiveResultTab('results');
    } catch (e: any) {
      setError(e.message);
      setResults(null);
    } finally {
      setIsRunning(false);
    }
  };

  const formatSql = async () => {
    try {
      const { format } = await import('sql-formatter');
      const formatted = format(query, { language: 'sqlite' });
      setQuery(formatted);
    } catch (e) {
      console.error('Failed to format SQL', e);
    }
  };

  const handleDrag = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startRatio = splitRatio;
    const totalHeight = containerRef.current?.clientHeight || 600;
    
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const newRatio = Math.max(0.2, Math.min(0.8, startRatio + delta / totalHeight));
      setSplitRatio(newRatio);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const insertText = (text: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const id = { major: 1, minor: 1 };             
      const op = {identifier: id, range: selection, text: text, forceMoveMarkers: true};
      editor.executeEdits("my-source", [op]);
      setQuery(editor.getValue());
      editor.focus();
    }
  };

  const saveQuery = () => {
    if (!saveName || !results) return;
    const entry: SavedEntry = {
      id: Date.now(),
      name: saveName,
      query,
      database: selectedDB,
      rowCount: results.rowCount,
      executionTime: results.executionTime,
      timestamp: new Date().toISOString()
    };
    setSaved(prev => [entry, ...prev]);
    setShowSaveDialog(false);
    setSaveName('');
  };

  const exportCSV = () => {
    if (!results) return;
    const header = results.columns.join(',');
    const rows = results.rows.map(r => r.map(c => typeof c === 'string' ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n');
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
  };

  const exportJSON = () => {
    if (!results) return;
    const data = results.rows.map(row => {
      const obj: any = {};
      results.columns.forEach((col, i) => obj[col] = row[i]);
      return obj;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.json';
    a.click();
  };

  const copyMarkdown = () => {
    if (!results) return;
    const header = '| ' + results.columns.join(' | ') + ' |';
    const sep = '|' + results.columns.map(() => '---').join('|') + '|';
    const rows = results.rows.map(r => '| ' + r.map(c => c === null ? '*NULL*' : c).join(' | ') + ' |').join('\n');
    navigator.clipboard.writeText([header, sep, rows].join('\n'));
  };

  let sortedRows = results?.rows || [];
  if (sortCol !== null && results) {
    sortedRows = [...results.rows].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA === null) return sortDir === 'asc' ? -1 : 1;
      if (valB === null) return sortDir === 'asc' ? 1 : -1;
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="flex flex-col h-full bg-background text-slate-300 font-sans relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-12 px-4 bg-card border-b border-border/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Database className="w-4 h-4" />
            <span>SQL Playground</span>
          </div>
          <select 
            value={selectedDB}
            onChange={(e) => {
              const db = e.target.value as DBType;
              setSelectedDB(db);
              setQuery(DEFAULT_QUERIES[db]);
              setResults(null);
              setError(null);
            }}
            className="bg-black border border-border rounded px-2 py-1 text-sm outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="ecommerce">ecommerce.db</option>
            <option value="hr">hr.db</option>
            <option value="sales">sales.db</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSchema(!showSchema)} className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-colors ${showSchema ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Schema
          </button>
          <button onClick={() => setShowHistory(true)} className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-400 flex items-center gap-2 hover:text-white hover:bg-white/5 transition-colors">
            <History className="w-3.5 h-3.5" /> History
          </button>
          <button onClick={() => setShowSaved(true)} className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-400 flex items-center gap-2 hover:text-white hover:bg-white/5 transition-colors">
            <Bookmark className="w-3.5 h-3.5" /> Saved
          </button>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button onClick={formatSql} className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            Format
          </button>
          <button 
            onClick={runQuery}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Running...' : 'Run (Ctrl+Enter)'}
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex flex-col flex-1 overflow-hidden relative">
        {/* Editor Area */}
        <div style={{ height: `${splitRatio * 100}%` }} className="flex min-h-[100px]">
          <div className="flex-1 relative border-r border-border/50">
            <Editor
              height="100%"
              language="sql"
              theme="vs-dark"
              value={query}
              onChange={(v) => setQuery(v || '')}
              onMount={(editor) => { editorRef.current = editor; }}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                padding: { top: 16, bottom: 16 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>
          
          {/* Schema Panel */}
          <AnimatePresence>
            {showSchema && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-card overflow-y-auto flex flex-col shrink-0"
              >
                <div className="p-3 text-xs font-bold text-white/50 tracking-wider uppercase border-b border-border/50">
                  Schema: {selectedDB}
                </div>
                <div className="p-2 space-y-1">
                  {Object.entries(SCHEMAS[selectedDB]).map(([table, columns]) => {
                    const isExpanded = expandedTables[table];
                    return (
                      <div key={table}>
                        <div 
                          className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer group"
                          onClick={() => setExpandedTables(p => ({...p, [table]: !p[table]}))}
                        >
                          <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                            <Database className="w-3.5 h-3.5 text-indigo-400" />
                            {table}
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); insertText(`SELECT * FROM ${table} LIMIT 10;\n`); }}
                            className="opacity-0 group-hover:opacity-100 text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded"
                          >
                            SELECT
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="ml-6 pl-2 border-l border-border space-y-1 mt-1 mb-2">
                            {columns.map(col => (
                              <div 
                                key={col} 
                                onClick={() => insertText(col)}
                                className="text-xs text-slate-400 p-1 hover:text-white hover:bg-white/5 rounded cursor-pointer flex items-center justify-between group"
                              >
                                {col}
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-400">Insert</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drag Handle */}
        <div 
          onMouseDown={handleDrag}
          className="h-2 bg-black hover:bg-indigo-500/20 cursor-row-resize flex items-center justify-center shrink-0 border-y border-border/50 transition-colors"
        >
          <div className="w-10 h-0.5 bg-white/20 rounded-full" />
        </div>

        {/* Results Area */}
        <div style={{ height: `${(1 - splitRatio) * 100}%` }} className="flex flex-col bg-card min-h-[100px]">
          <div className="flex items-center justify-between px-4 h-10 border-b border-border/50 shrink-0 bg-background">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveResultTab('results')}
                className={`text-sm font-medium h-10 border-b-2 transition-colors ${activeResultTab === 'results' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Results
              </button>
              <button 
                onClick={() => setActiveResultTab('info')}
                className={`text-sm font-medium h-10 border-b-2 transition-colors ${activeResultTab === 'info' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Query Info
              </button>
            </div>
            
            {activeResultTab === 'results' && results && (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSaveDialog(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Save Query">
                  <Bookmark className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button onClick={exportCSV} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Download CSV">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={exportJSON} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Download JSON">
                  <FileJson className="w-4 h-4" />
                </button>
                <button onClick={copyMarkdown} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Copy as Markdown">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 relative">
            {isRunning && (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
                ))}
              </div>
            )}

            {!isRunning && error && (
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-mono text-sm">{error}</p>
                {error.includes('syntax error') && (
                  <p className="text-red-300/70 text-xs mt-1">Tip: Check for typos. Common mistake: FORM instead of FROM.</p>
                )}
                {error.includes('no such table') && (
                  <p className="text-red-300/70 text-xs mt-1">Available tables: {Object.keys(SCHEMAS[selectedDB]).join(', ')}</p>
                )}
              </div>
            )}

            {!isRunning && !error && activeResultTab === 'results' && results && (
              <>
                {results.rowCount === 0 ? (
                  <div className="text-center text-slate-500 mt-10">Query returned 0 rows.</div>
                ) : (
                  <div className="w-full">
                    {results.rowCount > 1000 && (
                      <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 text-xs rounded-md flex items-center justify-center">
                        Showing 1,000 of {results.rowCount.toLocaleString()} rows
                      </div>
                    )}
                    <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                      <thead>
                        <tr>
                          {results.columns.map((col, i) => (
                            <th 
                              key={i} 
                              onClick={() => {
                                if (sortCol === i) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                else { setSortCol(i); setSortDir('asc'); }
                              }}
                              className="sticky top-0 bg-card border-b border-border p-2 font-semibold text-slate-300 cursor-pointer hover:bg-white/5 transition-colors group"
                            >
                              <div className="flex items-center gap-1">
                                {col}
                                <span className={`text-white/20 group-hover:text-white/50 transition-colors ${sortCol === i ? 'text-indigo-400' : ''}`}>
                                  {sortCol === i ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-border/50 hover:bg-white/[0.02]">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-2 ${typeof cell === 'number' ? 'text-right font-mono text-indigo-200' : 'text-slate-300'}`}>
                                {cell === null ? <span className="text-white/30 italic text-xs">NULL</span> : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {!isRunning && !error && activeResultTab === 'info' && results && (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Database</div>
                    <div className="font-semibold">{selectedDB}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Execution Time</div>
                    <div className="font-semibold text-indigo-400">{results.executionTime} ms</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Rows Returned</div>
                    <div className="font-semibold">{results.rowCount.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Query Length</div>
                    <div className="font-semibold">{query.length} chars</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black border border-border">
                  <div className="text-xs text-white/50 mb-2 uppercase tracking-wider">Executed SQL</div>
                  <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap">{query}</pre>
                </div>
              </div>
            )}
          </div>

          {!isRunning && !error && results && activeResultTab === 'results' && (
            <div className="h-8 shrink-0 bg-background border-t border-border/50 flex items-center px-4 text-xs text-slate-500">
              {results.rowCount.toLocaleString()} rows · {results.executionTime}ms
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border p-6 rounded-xl w-96 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Save Query</h3>
              <input 
                autoFocus
                type="text" 
                placeholder="Give your query a name..." 
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveQuery()}
                className="w-full bg-black border border-border rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 outline-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancel</button>
                <button onClick={saveQuery} disabled={!saveName} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Slide-over */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><History className="w-5 h-5 text-indigo-400" /> Query History</h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center mt-10">No queries run yet.</p>
                ) : history.map(entry => (
                  <div key={entry.id} className="bg-white/5 border border-border rounded-lg p-3 group hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded text-white/70">{entry.database}</span>
                      <span className="text-[10px] text-white/40">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap line-clamp-3 mb-3">{entry.query}</pre>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{entry.rowCount} rows · {entry.executionTime}ms</span>
                      <button 
                        onClick={() => {
                          setQuery(entry.query);
                          setSelectedDB(entry.database);
                          setShowHistory(false);
                        }}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Load Query
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Saved Queries Slide-over */}
      <AnimatePresence>
        {showSaved && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSaved(false)} className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Bookmark className="w-5 h-5 text-pink-400" /> Saved Queries</h3>
                <button onClick={() => setShowSaved(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {saved.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center mt-10">No saved queries yet.</p>
                ) : saved.map(entry => (
                  <div key={entry.id} className="bg-white/5 border border-border rounded-lg p-3 group hover:border-pink-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-white truncate pr-2">{entry.name}</h4>
                      <button 
                        onClick={() => setSaved(s => s.filter(x => x.id !== entry.id))}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded text-white/70">{entry.database}</span>
                    </div>
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap line-clamp-2 mb-3 opacity-60">{entry.query}</pre>
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => {
                          setQuery(entry.query);
                          setSelectedDB(entry.database);
                          setShowSaved(false);
                        }}
                        className="text-xs font-medium text-pink-400 hover:text-pink-300 bg-pink-500/10 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Load Query
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
