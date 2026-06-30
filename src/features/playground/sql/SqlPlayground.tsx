'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Database, History, Bookmark, Settings, Download, FileJson, Copy, ArrowUpDown, ArrowUp, ArrowDown, X, Save, Search, ChevronDown, ChevronRight, Terminal, FolderOpen, Code2, Menu } from 'lucide-react';
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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
          
          const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'WITH', 'AS', 'ON'];
          keywords.forEach(kw => {
            suggestions.push({
              label: kw,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: kw,
              range,
            });
          });

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

  // Handle Drag for Results area
  const handleDragY = (e: React.MouseEvent) => {
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

  return (
    <div className="flex flex-col h-full bg-[#131313] text-[#e5e2e1] font-sans overflow-hidden relative"
         style={{
           backgroundImage: 'radial-gradient(rgba(76, 215, 246, 0.05) 1px, transparent 0)',
           backgroundSize: '20px 20px'
         }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(5, 5, 5, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cyan-glow:hover {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
        }
        .sql-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .sql-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
        }
        .sql-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(76, 215, 246, 0.2);
            border-radius: 10px;
        }
        .sql-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(76, 215, 246, 0.4);
        }
      `}} />

      {/* TopNavBar */}
      <header className="bg-[#131313]/80 backdrop-blur-xl border-b border-[#3d494c]/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex flex-wrap justify-between items-center w-full px-4 md:px-6 py-2 sticky top-0 z-50 shrink-0 gap-y-2">
        <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-[#06b6d4] p-1" onClick={() => setShowMobileSidebar(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-base md:text-xl tracking-tighter text-[#06b6d4]">DATA_OS // COMMAND_CENTER</h1>
          </div>
          
          <div className="flex md:hidden items-center gap-3 pl-3 border-l border-[#3d494c]/30">
            <button onClick={() => setShowSchema(!showSchema)} className={`p-1 rounded transition-colors ${showSchema ? 'text-[#06b6d4]' : 'text-[#869397] hover:text-[#06b6d4]'}`} title="Toggle Schema">
               <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex md:hidden flex-1 items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-[#3d494c]/30">
            <Database className="text-[#06b6d4] w-4 h-4 shrink-0" />
            <select 
              value={selectedDB}
              onChange={(e) => {
                const db = e.target.value as DBType;
                setSelectedDB(db);
                setQuery(DEFAULT_QUERIES[db]);
                setResults(null);
                setError(null);
              }}
              className="bg-transparent outline-none font-mono text-xs text-[#bcc9cd] cursor-pointer appearance-none pr-4 w-full"
            >
              <option value="ecommerce">ecommerce.db</option>
              <option value="hr">hr.db</option>
              <option value="sales">sales.db</option>
            </select>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-[#3d494c]/30 hover:border-[#06b6d4]/50 transition-colors">
            <Database className="text-[#06b6d4] w-4 h-4" />
            <select 
              value={selectedDB}
              onChange={(e) => {
                const db = e.target.value as DBType;
                setSelectedDB(db);
                setQuery(DEFAULT_QUERIES[db]);
                setResults(null);
                setError(null);
              }}
              className="bg-transparent outline-none font-mono text-sm text-[#bcc9cd] cursor-pointer appearance-none pr-4"
            >
              <option value="ecommerce">ecommerce.db</option>
              <option value="hr">hr.db</option>
              <option value="sales">sales.db</option>
            </select>
          </div>

          <button 
            onClick={runQuery}
            disabled={isRunning}
            className="bg-[#06b6d4] text-[#003640] font-mono px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-sm cyan-glow active:scale-95 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50 shrink-0"
          >
            {isRunning ? 'EXECUTING...' : 'RUN_QUERY'}
          </button>
          
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[#3d494c]/30">
             <button onClick={() => setShowSchema(!showSchema)} className={`p-1.5 rounded transition-colors ${showSchema ? 'text-[#06b6d4]' : 'text-[#869397] hover:text-[#06b6d4]'}`} title="Toggle Schema">
               <Database className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col items-center py-6 gap-6 bg-[#0e0e0e]/50 backdrop-blur-lg border-r border-[#3d494c]/30 w-16 shrink-0">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/20 flex items-center justify-center border border-[#06b6d4]/40">
              <Terminal className="text-[#06b6d4] w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-[#06b6d4]">NODE_01</span>
          </div>
          <nav className="flex flex-col gap-4 items-center w-full px-2 mt-4">
            <button className="p-2 text-[#06b6d4] bg-[#06b6d4]/10 rounded-lg cursor-pointer transition-all duration-300" title="Workspace">
              <Code2 className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSaved(true)} className="p-2 text-[#869397] hover:bg-[#353534]/50 hover:text-[#06b6d4] rounded-lg cursor-pointer transition-all duration-300" title="Saved Queries">
              <Bookmark className="w-5 h-5" />
            </button>
            <button onClick={() => setShowHistory(true)} className="p-2 text-[#869397] hover:bg-[#353534]/50 hover:text-[#06b6d4] rounded-lg cursor-pointer transition-all duration-300" title="History">
              <History className="w-5 h-5" />
            </button>
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Breadcrumbs Bar */}
          <div className="h-10 glass-panel border-x-0 border-t-0 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2 font-mono text-[12px] text-[#bcc9cd]">
              <span className="hover:text-[#06b6d4] cursor-pointer">workspace</span>
              <span className="text-[#3d494c]">/</span>
              <span className="hover:text-[#06b6d4] cursor-pointer">queries</span>
              <span className="text-[#3d494c]">/</span>
              <span className="text-[#e5e2e1]">untitled.sql</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-mono text-[10px] text-green-500 uppercase tracking-widest font-bold">SESSION: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Editor Split View */}
          <div style={{ height: `${splitRatio * 100}%` }} className="flex overflow-hidden min-h-[100px]">
            {/* Code Editor Area */}
            <section className="flex-1 bg-[#0e0e0e] relative flex flex-col min-w-0 border-r border-[#3d494c]/30 overflow-hidden">
               <Editor
                  height="100%"
                  language="sql"
                  theme="vs-dark"
                  value={query}
                  onChange={(v) => setQuery(v || '')}
                  onMount={(editor) => { editorRef.current = editor; }}
                  options={{
                    fontSize: 15,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
            </section>

            {/* Schema Explorer */}
            <AnimatePresence>
              {showSchema && (
                <motion.aside 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute md:relative right-0 top-0 bottom-0 z-50 h-full w-full max-w-[320px] glass-panel border-y-0 border-r-0 flex flex-col shrink-0"
                >
                  <div className="p-3 border-b border-[#3d494c]/30 bg-[#201f1f] flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#bcc9cd]">SCHEMA_EXPLORER</span>
                    <button onClick={() => setShowSchema(false)} className="md:hidden text-[#869397] hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto sql-scrollbar p-3 space-y-2">
                    {Object.entries(SCHEMAS[selectedDB]).map(([table, columns]) => {
                       const isExpanded = expandedTables[table];
                       return (
                          <div key={table} className="group">
                            <div 
                              className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-[#06b6d4] transition-colors"
                              onClick={() => setExpandedTables(p => ({...p, [table]: !p[table]}))}
                            >
                              {isExpanded ? 
                                <ChevronDown className="w-4 h-4 text-[#06b6d4]" /> : 
                                <ChevronRight className="w-4 h-4 text-[#869397]" />
                              }
                              <Database className="w-4 h-4 text-[#869397] group-hover:text-[#06b6d4]" />
                              <span className="font-mono text-sm">{table}</span>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); insertText(`SELECT * FROM ${table} LIMIT 10;\n`); }}
                                className="opacity-0 group-hover:opacity-100 ml-auto text-[10px] bg-[#06b6d4]/20 text-[#06b6d4] px-1.5 py-0.5 rounded font-mono uppercase"
                              >
                                SELECT
                              </button>
                            </div>
                            
                            {isExpanded && (
                              <div className="pl-6 space-y-1 mt-1 border-l border-[#3d494c]/30 ml-2 mb-2">
                                {columns.map(col => (
                                  <div 
                                    key={col}
                                    onClick={() => insertText(col)}
                                    className="flex justify-between items-center text-[12px] font-mono text-[#bcc9cd] hover:text-[#e5e2e1] cursor-pointer py-1 px-2 hover:bg-white/5 rounded group/col"
                                  >
                                    <span>{col}</span>
                                    <span className="opacity-0 group-hover/col:opacity-100 text-[#06b6d4] text-[10px]">Insert</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                       )
                    })}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          {/* Vertical Drag Handle */}
          <div 
            onMouseDown={handleDragY}
            className="h-2 bg-[#131313] hover:bg-[#06b6d4]/20 cursor-row-resize flex items-center justify-center shrink-0 border-y border-[#3d494c]/30 transition-colors"
          >
            <div className="w-12 h-[2px] bg-white/20 rounded-full" />
          </div>

          {/* Bottom Results Section */}
          <section style={{ height: `${(1 - splitRatio) * 100}%` }} className="glass-panel border-x-0 border-b-0 flex flex-col overflow-hidden shrink-0 min-h-[100px]">
            <div className="flex items-center justify-between px-4 pt-2 border-b border-[#3d494c]/30 bg-[#201f1f]/50 shrink-0 overflow-x-auto sql-scrollbar">
              <div className="flex items-center gap-6 shrink-0">
                <button 
                  onClick={() => setActiveResultTab('results')}
                  className={`flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest pb-2 border-b-2 transition-colors ${activeResultTab === 'results' ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-[#bcc9cd] hover:text-[#06b6d4]'}`}
                >
                  <Database className="w-3.5 h-3.5" /> DATA_RESULTS
                </button>
                <button 
                  onClick={() => setActiveResultTab('info')}
                  className={`flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest pb-2 border-b-2 transition-colors ${activeResultTab === 'info' ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-[#bcc9cd] hover:text-[#06b6d4]'}`}
                >
                  <Terminal className="w-3.5 h-3.5" /> EXECUTION_PLAN
                </button>
              </div>
              
              {activeResultTab === 'results' && results && (
                <div className="flex items-center gap-4 text-[#bcc9cd] font-mono text-[11px] pb-2">
                  <span>Rows: {results.rowCount}</span>
                  <span>Time: {results.executionTime}ms</span>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => setShowSaveDialog(true)} className="p-1 hover:text-[#06b6d4] transition-colors" title="Save Query"><Bookmark className="w-4 h-4"/></button>
                    <button onClick={exportCSV} className="p-1 hover:text-[#06b6d4] transition-colors" title="Download CSV"><Download className="w-4 h-4"/></button>
                    <button onClick={exportJSON} className="p-1 hover:text-[#06b6d4] transition-colors" title="Download JSON"><FileJson className="w-4 h-4"/></button>
                    <button onClick={copyMarkdown} className="p-1 hover:text-[#06b6d4] transition-colors" title="Copy Markdown"><Copy className="w-4 h-4"/></button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto sql-scrollbar bg-black/20 p-4 relative">
              {isRunning && (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 bg-[#3d494c]/20 rounded animate-pulse" />
                  ))}
                </div>
              )}

              {!isRunning && error && (
                <div className="p-4 bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-lg max-w-3xl">
                  <p className="text-[#ffb4ab] font-mono text-sm leading-relaxed">{error}</p>
                  <p className="text-[#ffdad6]/70 text-xs mt-3 font-mono">
                    &gt; SYSTEM_HINT: Verify syntax or check if table exists in '{selectedDB}' schema.
                  </p>
                </div>
              )}

              {!isRunning && !error && activeResultTab === 'results' && results && (
                <>
                  {results.rowCount === 0 ? (
                    <div className="text-center font-mono text-[#869397] mt-10">QUERY_RETURNED_ZERO_ROWS</div>
                  ) : (
                    <table className="text-left border-collapse font-mono text-sm whitespace-nowrap">
                      <thead className="sticky top-0 bg-[#201f1f] z-10 shadow-md">
                        <tr>
                          {results.columns.map((col, i) => (
                            <th 
                              key={i} 
                              onClick={() => {
                                if (sortCol === i) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                else { setSortCol(i); setSortDir('asc'); }
                              }}
                              className="px-6 py-2 border-b border-[#3d494c]/50 text-[#869397] hover:text-[#e5e2e1] uppercase text-[11px] tracking-widest font-bold cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-1">
                                {col}
                                <span className={`text-transparent group-hover:text-[#3d494c] transition-colors ${sortCol === i ? '!text-[#06b6d4]' : ''}`}>
                                  {sortCol === i ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3d494c]/30">
                        {sortedRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#06b6d4]/5 transition-colors group">
                            {row.map((cell, cIdx) => {
                              const isNumber = typeof cell === 'number';
                              return (
                                <td key={cIdx} className={`px-6 py-2.5 ${isNumber ? 'text-[#4cd7f6] text-right' : 'text-[#e5e2e1]'}`}>
                                  {cell === null ? <span className="text-[#869397] italic text-xs border border-[#3d494c]/50 px-1 rounded">NULL</span> : String(cell)}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {!isRunning && !error && activeResultTab === 'info' && results && (
                <div className="space-y-4 max-w-3xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#2a2a2a]/50 border border-[#3d494c]/50">
                      <div className="text-[10px] font-mono font-bold text-[#869397] mb-1 uppercase tracking-wider">DATABASE</div>
                      <div className="font-semibold text-lg">{selectedDB}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#2a2a2a]/50 border border-[#3d494c]/50">
                      <div className="text-[10px] font-mono font-bold text-[#869397] mb-1 uppercase tracking-wider">EXECUTION_TIME</div>
                      <div className="font-semibold text-lg text-[#06b6d4]">{results.executionTime} ms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#2a2a2a]/50 border border-[#3d494c]/50">
                      <div className="text-[10px] font-mono font-bold text-[#869397] mb-1 uppercase tracking-wider">ROWS_RETURNED</div>
                      <div className="font-semibold text-lg">{results.rowCount.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#2a2a2a]/50 border border-[#3d494c]/50">
                      <div className="text-[10px] font-mono font-bold text-[#869397] mb-1 uppercase tracking-wider">QUERY_LENGTH</div>
                      <div className="font-semibold text-lg">{query.length} chars</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#3d494c]/50">
                    <div className="text-[10px] font-mono font-bold text-[#869397] mb-3 uppercase tracking-wider">EXECUTED_PAYLOAD</div>
                    <pre className="text-xs text-[#06b6d4] font-mono whitespace-pre-wrap">{query}</pre>
                  </div>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>

      {/* Status Bar Footer */}
      <footer className="h-8 bg-[#0e0e0e] border-t border-[#3d494c]/50 px-4 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
            <span className="font-mono text-[10px] text-[#06b6d4] font-bold tracking-widest uppercase">LIVE_CONNECTION</span>
          </div>
          <div className="h-3 w-[1px] bg-[#3d494c]"></div>
          <div className="flex items-center gap-1 text-[#869397]">
            <span className="font-mono text-[10px]">Latency: 42ms</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-[#869397]">UTF-8</span>
          <span className="font-mono text-[10px] text-[#869397]">SQL (SQLite)</span>
        </div>
      </footer>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1b1b] border border-[#3d494c] p-6 rounded-xl w-full max-w-md shadow-2xl glass-panel"
            >
              <h3 className="text-lg font-bold text-white mb-4 font-mono tracking-tight">SAVE_QUERY</h3>
              <input 
                autoFocus
                type="text" 
                placeholder="MISSION_LOG_NAME..." 
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveQuery()}
                className="w-full bg-[#0e0e0e] border border-[#3d494c] rounded-lg p-3 text-sm text-[#e5e2e1] font-mono focus:border-[#06b6d4] outline-none mb-6 transition-colors"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 text-sm font-medium text-[#869397] hover:text-white transition-colors">ABORT</button>
                <button onClick={saveQuery} disabled={!saveName} className="px-5 py-2 text-sm font-bold tracking-wider font-mono bg-[#06b6d4] hover:bg-[#4cd7f6] disabled:opacity-50 text-[#003640] rounded transition-colors flex items-center gap-2 cyan-glow">
                  <Save className="w-4 h-4" /> COMMIT
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="absolute inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-96 bg-[#131313] border-l border-[#3d494c] shadow-2xl z-[100] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#3d494c]/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono tracking-tight"><History className="w-5 h-5 text-[#06b6d4]" /> QUERY_LOGS</h3>
                <button onClick={() => setShowHistory(false)} className="text-[#869397] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto sql-scrollbar p-4 space-y-4 bg-[#0e0e0e]">
                {history.length === 0 ? (
                  <p className="text-[#869397] text-sm text-center mt-10 font-mono">NO_RECORDS_FOUND</p>
                ) : history.map(entry => (
                  <div key={entry.id} className="bg-[#1c1b1b] border border-[#3d494c]/50 rounded-lg p-4 group hover:border-[#06b6d4]/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider bg-[#06b6d4]/10 text-[#06b6d4] px-2 py-0.5 rounded border border-[#06b6d4]/20">{entry.database}</span>
                      <span className="text-[10px] font-mono text-[#869397]">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-xs text-[#bcc9cd] font-mono whitespace-pre-wrap line-clamp-3 mb-4">{entry.query}</pre>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#869397]">{entry.rowCount} rows · {entry.executionTime}ms</span>
                      <button 
                        onClick={() => {
                          setQuery(entry.query);
                          setSelectedDB(entry.database);
                          setShowHistory(false);
                        }}
                        className="text-[11px] font-bold tracking-wider font-mono text-[#06b6d4] hover:text-[#4cd7f6] bg-[#06b6d4]/10 px-3 py-1 rounded border border-[#06b6d4]/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        RESTORE
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSaved(false)} className="absolute inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-96 bg-[#131313] border-l border-[#3d494c] shadow-2xl z-[100] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#3d494c]/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono tracking-tight"><Bookmark className="w-5 h-5 text-pink-400" /> SAVED_MISSIONS</h3>
                <button onClick={() => setShowSaved(false)} className="text-[#869397] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto sql-scrollbar p-4 space-y-4 bg-[#0e0e0e]">
                {saved.length === 0 ? (
                  <p className="text-[#869397] font-mono text-sm text-center mt-10">NO_MISSIONS_SAVED</p>
                ) : saved.map(entry => (
                  <div key={entry.id} className="bg-[#1c1b1b] border border-[#3d494c]/50 rounded-lg p-4 group hover:border-pink-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-sm text-white truncate pr-2 font-mono">{entry.name}</h4>
                      <button 
                        onClick={() => setSaved(s => s.filter(x => x.id !== entry.id))}
                        className="text-[#869397] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#869397]">{entry.database}</span>
                    </div>
                    <pre className="text-xs text-[#bcc9cd] font-mono whitespace-pre-wrap line-clamp-2 mb-4 opacity-70">{entry.query}</pre>
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => {
                          setQuery(entry.query);
                          setSelectedDB(entry.database);
                          setShowSaved(false);
                        }}
                        className="text-[11px] font-bold tracking-wider font-mono text-pink-400 bg-pink-500/10 border border-pink-500/30 px-3 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        INITIALIZE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Slide-over */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileSidebar(false)} className="absolute inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden" />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-64 bg-[#131313] border-r border-[#3d494c] shadow-2xl z-[100] flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#3d494c]/50">
                <div className="flex items-center gap-2">
                  <Terminal className="text-[#06b6d4] w-5 h-5" />
                  <span className="font-mono text-xs font-bold text-[#06b6d4]">NODE_01</span>
                </div>
                <button onClick={() => setShowMobileSidebar(false)} className="text-[#869397] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex flex-col gap-2 p-4">
                <button className="flex items-center gap-3 p-3 text-[#06b6d4] bg-[#06b6d4]/10 rounded-lg font-mono text-sm" onClick={() => setShowMobileSidebar(false)}>
                  <Code2 className="w-4 h-4" /> Workspace
                </button>
                <button className="flex items-center gap-3 p-3 text-[#869397] hover:bg-[#353534]/50 hover:text-[#06b6d4] rounded-lg font-mono text-sm transition-colors" onClick={() => { setShowSaved(true); setShowMobileSidebar(false); }}>
                  <Bookmark className="w-4 h-4" /> Saved Queries
                </button>
                <button className="flex items-center gap-3 p-3 text-[#869397] hover:bg-[#353534]/50 hover:text-[#06b6d4] rounded-lg font-mono text-sm transition-colors" onClick={() => { setShowHistory(true); setShowMobileSidebar(false); }}>
                  <History className="w-4 h-4" /> History
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
