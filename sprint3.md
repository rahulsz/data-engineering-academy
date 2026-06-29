# DataEngineering.Academy — Sprint 3 Prompt
## Interactive Playgrounds + SQL/DE Visualizers + Quiz Engine + Practice

---

## CONTEXT

You are a world-class Senior Full Stack Engineer continuing **DataEngineering.Academy**.

Sprints 1 & 2 are **100% COMPLETE** and verified in production. The following are live on Vercel:

- Next.js 16 App Router + React 19 + Tailwind CSS v4
- Clerk auth (static imports only — no dynamic imports anywhere)
- MongoDB Atlas + all 17 Mongoose models (cold-start registered)
- XP / streak / achievement engine (`src/lib/xp.ts`) — all 5 functions working
- Dashboard: bento grid, Recharts weekly XP chart, module progress grid, activity timeline, recommended topics
- User Profile: react-hook-form + zod + `updateProfile` server action
- Learn catalog: 15 courses, search, filter, sort
- SQL module page: 6 sections, 24 lessons, lock/unlock logic
- Lesson viewer: MDX renderer, 70/30 layout, mark complete → XP → confetti
- Seed script: 15 courses + SQL module + 24 lessons in MongoDB
- Loading skeletons + error boundaries on all routes
- `<VisualizerEmbed />` and `<QuizEmbed />` are **placeholders** — replace them this sprint

**DO NOT rebuild anything from Sprints 1 or 2. Import and extend only.**

---

## PRODUCTION RULES — APPLY TO EVERY SINGLE FILE

These rules come from real Vercel deployment failures fixed in Sprint 2. Breaking any rule will crash production.

### Rule 1 — Static imports only (no dynamic imports in server code)

```ts
// ❌ NEVER — breaks Vercel/Turbopack at runtime
const { currentUser } = await import('@clerk/nextjs/server')

// ✅ ALWAYS — top-level static imports
import { currentUser, auth } from '@clerk/nextjs/server'
```

### Rule 2 — Mongoose cold-start registration in every server file

Every route handler and server action that touches MongoDB **MUST** import every model that any `.populate()` references — even if not directly used in that file. Add the comment `// Mongoose cold-start registration`.

```ts
// Mongoose cold-start registration
import User from '@/models/User'
import Course from '@/models/Course'
import Module from '@/models/Module'
import Lesson from '@/models/Lesson'
import Progress from '@/models/Progress'
import Achievement from '@/models/Achievement'
import Quiz from '@/models/Quiz'
import QuizAttempt from '@/models/QuizAttempt'
import Flashcard from '@/models/Flashcard'
import Challenge from '@/models/Challenge'
import InterviewQuestion from '@/models/InterviewQuestion'
```

### Rule 3 — Decouple static content from auth

Never call `auth()` or `currentUser()` in the same RSC that uses `generateStaticParams()`. Auth and progress must load in separate Client Components that hydrate **after** static HTML is delivered.

### Rule 4 — Bulletproof upsert (never `User.create()`)

```ts
// ❌ NEVER
await User.create({ clerkId, email })

// ✅ ALWAYS — handles orphaned accounts from Clerk re-registration
await User.findOneAndUpdate(
  { $or: [{ clerkId }, { email }] },
  { $set: { clerkId, email, ...data } },
  { upsert: true, new: true }
)
```

### Rule 5 — `server-only` guard on all server files

Add `import 'server-only'` at the very top of:
- Every file in `src/app/api/`
- All server action files (`"use server"`)
- `src/lib/db.ts`
- `src/lib/xp.ts`
- Any file importing `better-sqlite3`

### Rule 6 — `better-sqlite3` is strictly server-only

Never import `better-sqlite3` in any Client Component or shared utility. Only use inside Route Handlers with `server-only` guard.

Add to `next.config.ts`:
```ts
serverExternalPackages: ['better-sqlite3']
```

### Rule 7 — `next/dynamic` is allowed in Client Components

`dynamic()` from `next/dynamic` is **allowed** in `'use client'` files. The Rule 1 ban only applies to Server Actions and Route Handlers. `VisualizerEmbed.tsx` is a Client Component — `dynamic()` is correct there.

---

## NEW PACKAGES TO INSTALL

Add to `package.json`:

```json
"@monaco-editor/react": "^4.6.0",
"@xyflow/react": "^12.0.0",
"better-sqlite3": "^9.4.0",
"@types/better-sqlite3": "^7.6.8",
"sql-formatter": "^15.3.0",
"server-only": "^0.0.1"
```

> Pyodide: CDN only — `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js` — do NOT npm install.

---

## FILE OUTPUT ORDER

Generate files in this exact order. No truncation. No placeholders. Every file complete.

```
1.  next.config.ts                                          ← add serverExternalPackages
2.  src/app/api/sql/run/route.ts                            ← SQL execution engine
3.  src/app/api/quiz/[quizId]/route.ts                      ← GET quiz by ID
4.  src/app/api/quiz/submit/route.ts                        ← POST submit attempt
5.  src/app/api/flashcards/[moduleSlug]/route.ts            ← GET flashcards
6.  src/app/api/challenges/route.ts                         ← GET challenges (filterable)
7.  src/app/api/challenges/[id]/check/route.ts              ← POST check answer
8.  src/app/api/interview-questions/route.ts                ← GET questions (filterable)
9.  src/features/visualizers/sql/VisualizerControls.tsx     ← shared control bar
10. src/features/visualizers/sql/ExecutionOrderVisualizer.tsx
11. src/features/visualizers/sql/SelectVisualizer.tsx
12. src/features/visualizers/sql/WhereVisualizer.tsx
13. src/features/visualizers/sql/GroupByVisualizer.tsx
14. src/features/visualizers/sql/HavingVisualizer.tsx
15. src/features/visualizers/sql/JoinVisualizer.tsx
16. src/features/visualizers/sql/SubqueryVisualizer.tsx
17. src/features/visualizers/sql/CorrelatedSubqueryVisualizer.tsx
18. src/features/visualizers/sql/WindowFunctionVisualizer.tsx
19. src/features/visualizers/sql/CTEVisualizer.tsx
20. src/features/visualizers/de/EtlPipelineVisualizer.tsx
21. src/features/visualizers/de/SparkArchVisualizer.tsx
22. src/features/visualizers/de/KafkaArchVisualizer.tsx
23. src/features/visualizers/de/AirflowDagVisualizer.tsx
24. src/components/mdx/VisualizerEmbed.tsx                  ← full replacement
25. src/features/quiz/components/QuizUI.tsx
26. src/components/mdx/QuizEmbed.tsx                        ← full replacement
27. src/features/flashcards/components/FlashcardDeck.tsx
28. src/features/playground/sql/SqlPlayground.tsx
29. src/features/playground/python/PythonPlayground.tsx
30. src/app/(playground)/layout.tsx
31. src/app/(playground)/playground/sql/page.tsx
32. src/app/(playground)/playground/python/page.tsx
33. src/app/(practice)/practice/page.tsx
34. src/app/(interview)/interview/page.tsx
35. src/scripts/seed.ts                                     ← APPEND only, do not replace
```

---

## DELIVERABLE 1 — `next.config.ts`

Add `serverExternalPackages: ['better-sqlite3']` to the existing config. Keep all other settings untouched.

---

## DELIVERABLE 2 — SQL Playground Backend

**File:** `src/app/api/sql/run/route.ts`

```
POST /api/sql/run
Body:     { query: string, database: 'ecommerce' | 'hr' | 'sales' }
Response: { columns: string[], rows: unknown[][], rowCount: number, executionTime: number, error?: string }
```

### Implementation

```ts
import 'server-only'
import Database from 'better-sqlite3'

const dbCache: Record<string, Database.Database> = {}

function getDB(name: string): Database.Database {
  if (!dbCache[name]) dbCache[name] = createAndSeedDB(name)
  return dbCache[name]
}
```

### SQL Security — whitelist + blacklist

```ts
// Allow only these statement types
const ALLOWED = /^\s*(SELECT|WITH|EXPLAIN)\b/i

// Block these patterns even inside SELECT
const BLOCKED = [
  /INTO\s+OUTFILE/i,
  /INTO\s+DUMPFILE/i,
  /LOAD_FILE/i,
  /ATTACH\s+DATABASE/i,
]

// Block multiple statements: semicolon not at very end of trimmed string
const hasMultipleStatements = (q: string) => /;(?!\s*$)/.test(q)
```

### Execution

```ts
try {
  const start = performance.now()
  const stmt = db.prepare(query)
  const rows = stmt.all() as Record<string, unknown>[]
  const executionTime = Math.round(performance.now() - start)
  const columns = rows.length > 0 ? Object.keys(rows[0]) : []
  const limited = rows.slice(0, 1000)
  const rowArrays = limited.map(r => columns.map(c => r[c] ?? null))
  return NextResponse.json({ columns, rows: rowArrays, rowCount: rows.length, executionTime })
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : 'Unknown error'
  return NextResponse.json({ error: msg }, { status: 400 })
}
```

### Seed Data — `ecommerce.db`

Tables: `categories`, `products`, `customers`, `orders`, `order_items`

| Table | Rows | Notes |
|-------|------|-------|
| categories | 8 | Electronics, Clothing, Books, Home & Garden, Sports, Toys, Food, Beauty |
| products | 30 | Price range $5–$1,200 across all categories |
| customers | 50 | USA(20), UK(10), Germany(8), India(7), Japan(5). **IDs 46–50 have ZERO orders** (LEFT JOIN demo) |
| orders | 200 | Dates spread across 2023–2024. Status mix: pending(5+), processing, shipped, delivered, cancelled(3+) |
| order_items | ~500 | Average 2–3 items per order |

### Seed Data — `hr.db`

Tables: `departments`, `employees`, `salaries`, `job_history`

| Table | Rows | Notes |
|-------|------|-------|
| departments | 8 | Engineering, Marketing, Sales, HR, Finance, Product, Design, Operations |
| employees | 40 | ID 1 = CEO (manager_id = NULL). 3–4 VPs report to CEO. Salary ranges: Engineering 70k–120k, Marketing 45k–75k, etc. **Two employees must share identical salary in same dept** (for RANK/DENSE_RANK tie demo) |
| salaries | ~100 | Every employee has 2–3 records (hire salary + raises). `to_date` NULL = current |
| job_history | ~30 | 15 employees who changed roles |

### Seed Data — `sales.db`

Tables: `regions`, `salespeople`, `deals`, `targets`

| Table | Rows | Notes |
|-------|------|-------|
| regions | 5 | North America, Europe, Asia Pacific, Latin America, Middle East |
| salespeople | 20 | Even distribution across regions |
| deals | 300 | ~40% won (closed_date set), ~25% lost (closed_date NULL), ~35% pipeline stages |
| targets | 160 | All 20 salespeople × 4 quarters × 2 years (2023, 2024) |

---

## DELIVERABLE 3 — SQL Playground Frontend

**File:** `src/features/playground/sql/SqlPlayground.tsx` — `'use client'`

### State

```ts
const [query, setQuery] = useState(DEFAULT_QUERIES[selectedDB])
const [selectedDB, setSelectedDB] = useState<'ecommerce'|'hr'|'sales'>('ecommerce')
const [results, setResults] = useState<QueryResult | null>(null)
const [isRunning, setIsRunning] = useState(false)
const [error, setError] = useState<string | null>(null)
const [splitRatio, setSplitRatio] = useState(0.6)
const [showSchema, setShowSchema] = useState(false)
const [activeResultTab, setActiveResultTab] = useState<'results'|'info'>('results')
const [sortCol, setSortCol] = useState<number | null>(null)
const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
const [showHistory, setShowHistory] = useState(false)
const [showSaved, setShowSaved] = useState(false)
const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
```

### Default Queries

```sql
-- ecommerce
SELECT c.name AS customer, c.country,
  COUNT(o.id) AS order_count,
  ROUND(SUM(o.total), 2) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.country
ORDER BY total_spent DESC LIMIT 10;

-- hr
SELECT e.name, d.name AS department, e.salary,
  ROUND(AVG(e.salary) OVER (PARTITION BY e.department_id), 2) AS dept_avg,
  RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS salary_rank
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY d.name, salary_rank;

-- sales
SELECT s.name AS salesperson, r.name AS region,
  COUNT(CASE WHEN d.stage = 'won' THEN 1 END) AS deals_won,
  ROUND(SUM(CASE WHEN d.stage = 'won' THEN d.amount ELSE 0 END), 2) AS revenue
FROM salespeople s
JOIN regions r ON s.region_id = r.id
LEFT JOIN deals d ON d.salesperson_id = s.id
GROUP BY s.id, s.name, r.name
ORDER BY revenue DESC;
```

### Layout

```
┌────────────────────────────────────────────────────┐
│ TOP BAR (48px)                                      │
│ [⚡ SQL Playground] [ecommerce ▼] [▶ Run] [Format] │
│                     [Schema] [History] [Saved]      │
├──────────────────────────┬─────────────────────────┤
│ MONACO EDITOR            │ SCHEMA PANEL (260px)    │
│ (flex-1, splitRatio %)   │ collapsible accordion   │
├──────────────────────────┴─────────────────────────┤
│ DRAG HANDLE (8px, cursor: row-resize)               │
├────────────────────────────────────────────────────┤
│ RESULTS PANEL ((1-splitRatio) %)                   │
│ Tabs: [Results] [Query Info]                        │
└────────────────────────────────────────────────────┘
```

### Monaco Editor Config

```ts
import Editor, { OnMount } from '@monaco-editor/react'

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
```

Register SQL autocomplete provider `beforeMount` with:
- SQL keywords (SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, JOIN types, aggregate functions, window functions, CTEs)
- Table names for the currently selected DB
- Column names per table (hardcoded for all 3 DBs)

### Keyboard Shortcut

```ts
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runQuery()
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [query, selectedDB])
```

### Schema Panel (260px, collapsible)

Hardcode schema tree for all 3 DBs. Accordion per table:
- Click table name → inserts `SELECT * FROM {table} LIMIT 10;` at cursor
- Click column name → inserts column name at cursor position

### Drag Handle (resize editor/results split)

```ts
const handleMouseDown = (e: React.MouseEvent) => {
  const startY = e.clientY
  const startRatio = splitRatio
  const totalHeight = containerRef.current?.clientHeight || 600
  const onMove = (e: MouseEvent) => {
    const delta = e.clientY - startY
    const newRatio = Math.max(0.2, Math.min(0.8, startRatio + delta / totalHeight))
    setSplitRatio(newRatio)
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
```

### Results Panel

**Loading:** 3 skeleton rows with `animate-pulse`

**Error state:**
```tsx
<div className="p-4 bg-red-950/30 border border-red-500/30 rounded-lg">
  <p className="text-red-400 font-mono text-sm">{error}</p>
  {error.includes('syntax error') && (
    <p className="text-red-300/70 text-xs mt-1">Tip: Check for typos. Common mistake: FORM instead of FROM.</p>
  )}
  {error.includes('no such table') && (
    <p className="text-red-300/70 text-xs mt-1">Available tables: {TABLES[selectedDB].join(', ')}</p>
  )}
</div>
```

**Success table:**
- Sticky column headers — click to sort (toggle asc/desc, show ↑↓ arrow)
- Alternating row colors
- NULL values: `<span className="text-white/30 italic text-xs">NULL</span>`
- Numbers right-aligned, strings left-aligned
- If `rowCount > 1000`: yellow warning banner "Showing 1,000 of N rows"
- Footer: `"{rowCount} rows · {executionTime}ms"`
- Export CSV button → download `results.csv`
- Export JSON button → download `results.json`
- Copy as Markdown table button

**Query Info tab:** query text (read-only), database, timestamp, row count, execution time, character count

### History Slide-Over (localStorage key: `de_sql_history`, max 50)

```ts
type HistoryEntry = {
  id: number
  query: string
  database: string
  rowCount: number
  executionTime: number
  timestamp: string
}
```

Framer Motion slide from right. Each entry: first 80 chars of query, DB badge, row count, time ago, delete button. Click → load into editor.

### Saved Queries Slide-Over (localStorage key: `de_sql_saved`)

Save dialog with name input. List with name, DB badge, created date, load/delete.

### Page

**File:** `src/app/(playground)/playground/sql/page.tsx`

```tsx
export const metadata = { title: 'SQL Playground — DataEngineering.Academy' }
export default function SqlPlaygroundPage() {
  return <div className="h-[calc(100vh-56px)]"><SqlPlayground /></div>
}
```

---

## DELIVERABLE 4 — Python Playground

**File:** `src/features/playground/python/PythonPlayground.tsx` — `'use client'`

### Pyodide Setup (inline in component, NOT a separate lib file)

```ts
useEffect(() => {
  async function loadPyodide() {
    setStatus('loading')
    try {
      if ((window as any).__pyodide) {
        setPyodide((window as any).__pyodide)
        setStatus('ready')
        return
      }
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Pyodide'))
        document.head.appendChild(script)
      })
      const py = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      })
      setStatus('installing')
      await py.loadPackagesFromImports('import numpy, pandas, matplotlib')
      py.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
      `)
      ;(window as any).__pyodide = py
      setPyodide(py)
      setStatus('ready')
    } catch (e) {
      setStatus('error')
      setLoadError(e instanceof Error ? e.message : 'Failed to load Python runtime')
    }
  }
  loadPyodide()
}, [])
```

### Run Code Function

```ts
async function runCode() {
  if (!pyodide || isRunning) return
  setIsRunning(true)
  setOutput({ stdout: '', stderr: '', chart: null })
  const startTime = performance.now()
  try {
    await pyodide.runPythonAsync(code)
    const stdout = pyodide.runPython('sys.stdout.getvalue()')
    const stderr = pyodide.runPython('sys.stderr.getvalue()')
    pyodide.runPython('sys.stdout = io.StringIO(); sys.stderr = io.StringIO()')
    let chart: string | null = null
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
      `)
      if (!chart) chart = null
    } catch { chart = null }
    const elapsed = Math.round(performance.now() - startTime)
    setOutput({ stdout, stderr, chart, elapsed })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    pyodide.runPython('sys.stdout = io.StringIO(); sys.stderr = io.StringIO()')
    setOutput({ stdout: '', stderr: msg, chart: null, elapsed: 0 })
  }
  setIsRunning(false)
}
```

### Layout

```
┌──────────────────────────┬──────────────────────────┐
│ EDITOR PANEL (55%)       │ OUTPUT PANEL (45%)       │
│ Monaco — python          │ Status bar               │
│ Ctrl+Enter to run        │ stdout (monospace)       │
│                          │ stderr (red, if error)   │
│ [▶ Run] [Clear] [Reset]  │ chart (base64 img)       │
│ [Starter code ▼]         │ [Copy output]            │
└──────────────────────────┴──────────────────────────┘
│ Status bar: "Powered by Pyodide 0.25 · Python 3.11" │
└─────────────────────────────────────────────────────┘
```

### Status Bar States

| State | Display |
|-------|---------|
| loading | `⟳ Loading Python runtime...` |
| installing | `⟳ Installing pandas, numpy, matplotlib...` |
| ready | `● Ready` |
| running | `⟳ Running...` |
| done | `✓ Done in {elapsed}ms` |
| error | `✗ Error` |

### Starter Code Presets (5 options in dropdown)

**1. Hello World**
```python
print("Hello, Data Engineering!")
for i in range(5):
    print(f"  Step {i+1}: Processing batch {i+1}...")
print("Pipeline complete! ✓")
```

**2. Pandas DataFrame**
```python
import pandas as pd
data = {
    'name': ['Alice','Bob','Carol','David','Eve'],
    'department': ['Engineering','Marketing','Engineering','Sales','Marketing'],
    'salary': [95000,72000,88000,65000,78000],
    'years': [5,3,7,2,4]
}
df = pd.DataFrame(data)
print(df.to_string())
print(f"\nAverage salary: ${df['salary'].mean():,.0f}")
print(df.groupby('department')['salary'].agg(['mean','count']).to_string())
```

**3. Data Analysis**
```python
import pandas as pd, numpy as np
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=100, freq='D')
sales = pd.DataFrame({
    'date': dates,
    'revenue': np.random.normal(10000, 2000, 100).clip(5000),
    'units': np.random.randint(50, 200, 100),
    'region': np.random.choice(['North','South','East','West'], 100)
})
print(f"Total Revenue: ${sales['revenue'].sum():,.2f}")
print(f"Best Day: {sales.loc[sales['revenue'].idxmax(), 'date'].date()}")
print("\nBy Region:")
print(sales.groupby('region')['revenue'].sum().sort_values(ascending=False).to_string())
```

**4. Matplotlib Chart**
```python
import matplotlib.pyplot as plt, numpy as np
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
print("Chart rendered above ↑")
```

**5. ETL Pipeline Simulation**
```python
import random
def extract(source):
    print(f"[EXTRACT] Reading from {source}...")
    records = [{'id': i, 'value': random.randint(1,100),
                'status': random.choice(['active','inactive','pending'])} for i in range(1,21)]
    print(f"[EXTRACT] ✓ Extracted {len(records)} records")
    return records

def transform(records):
    cleaned = [r for r in records if r['status'] == 'active']
    enriched = [{**r, 'value_usd': r['value'] * 1.08} for r in cleaned]
    print(f"[TRANSFORM] ✓ {len(enriched)} records (removed {len(records)-len(enriched)} inactive)")
    return enriched

def load(records, target):
    print(f"[LOAD] ✓ Loaded {len(records)} records to {target}")
    return len(records)

print("=" * 50)
raw = extract("PostgreSQL sales_db")
transformed = transform(raw)
count = load(transformed, "Snowflake warehouse")
print(f"\n✅ Pipeline complete. {count} records processed.")
```

---

## DELIVERABLE 5 — SQL Visualizers

All 10 visualizers share these rules:
- `'use client'` directive
- Built-in sample data (no required props)
- Dark-themed matching the rest of the app
- Play / Pause / Step Forward / Step Back / Reset controls
- Speed selector: 0.5x / 1x / 2x
- Framer Motion `AnimatePresence` for step transitions

### Shared Types & Control Bar

**File:** `src/features/visualizers/sql/VisualizerControls.tsx`

```tsx
interface VisualizerControlsProps {
  step: number
  totalSteps: number
  stepLabel: string
  isPlaying: boolean
  speed: 0.5 | 1 | 2
  onReset: () => void
  onBack: () => void
  onPlayPause: () => void
  onForward: () => void
  onSpeedChange: (s: 0.5 | 1 | 2) => void
}
```

UI: `[◀◀ Reset] [◀ Back] [▶/⏸] [▶ Next] · Step {step} of {totalSteps} — {stepLabel} · Speed: [0.5x] [1x] [2x]`

---

### Visualizer 1 — SQL Execution Order

**File:** `src/features/visualizers/sql/ExecutionOrderVisualizer.tsx`

Sample employees table (12 rows):

| id | name | department | salary |
|----|------|------------|--------|
| 1 | Alice Chen | Engineering | 95000 |
| 2 | Bob Smith | Marketing | 45000 |
| 3 | Carol Jones | Engineering | 88000 |
| 4 | David Lee | Sales | 62000 |
| 5 | Eve Wilson | Engineering | 72000 |
| 6 | Frank Brown | Marketing | 38000 |
| 7 | Grace Kim | Sales | 55000 |
| 8 | Henry Park | Engineering | 91000 |
| 9 | Iris Taylor | HR | 58000 |
| 10 | Jack Davis | Marketing | 52000 |
| 11 | Kate Miller | HR | 61000 |
| 12 | Liam Garcia | Sales | 48000 |

Query shown (read-only, highlighted clause underlined in indigo):
```sql
SELECT department, COUNT(*) as headcount, AVG(salary) as avg_salary
FROM employees
WHERE salary > 50000
GROUP BY department
HAVING COUNT(*) >= 2
ORDER BY avg_salary DESC
LIMIT 5;
```

**6 Steps:**

| Step | Clause | What happens |
|------|--------|--------------|
| 1 | FROM | All 12 rows appear row-by-row (stagger animation) |
| 2 | WHERE `salary > 50000` | Bob(45k), Frank(38k), Liam(48k) fade red. "9 of 12 rows pass filter" |
| 3 | GROUP BY `department` | Rows animate into colour-coded stacks: Engineering(indigo), Sales(green), HR(amber), Marketing(pink) |
| 4 | HAVING `COUNT(*) >= 2` | Marketing group (1 row) fades out. "3 groups remain" |
| 5 | SELECT | Only `department`, `headcount`, `avg_salary` columns visible. Aggregates populate |
| 6 | ORDER BY + LIMIT | Rows sort: Engineering($86,500) → HR($59,500) → Sales($58,500) |

Layout:
- Top: read-only SQL with current clause underlined
- Bottom-left: data table showing current state
- Bottom-right: step explanation card ("🔍 Step 2: WHERE Filter — Rows not matching salary > 50000 are eliminated")

---

### Visualizer 2 — SELECT Visualizer

**File:** `src/features/visualizers/sql/SelectVisualizer.tsx`

Interactive — no Play button, user toggles directly.

- Column toggle pills above table: `[✓ id] [✓ name] [✓ department] [✓ salary] [✓ hire_date]`
- Click to toggle → live SQL query updates below, result table on right updates instantly
- `SELECT *` master toggle at top
- Alias button next to each column → adds `AS alias` to query
- Callout box: "⚠ SELECT * is convenient but always specify columns in production pipelines — schema changes break downstream jobs"

---

### Visualizer 3 — WHERE Visualizer

**File:** `src/features/visualizers/sql/WhereVisualizer.tsx`

Condition builder:
```
Column: [salary ▼]  Operator: [> ▼]  Value: [50000]
+ AND/OR  Column: [department ▼]  Operator: [= ▼]  Value: ['Engineering']
```

Available columns: `salary`, `department`, `hire_date`, `name`
Available operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IN`, `IS NULL`, `BETWEEN`

Behaviour:
- Matching rows: glow green, `scale(1.02)` animation
- Non-matching: `opacity: 0.3`, red left border
- Live SQL query updates below
- Counter: "8 of 12 rows match"
- LIKE selected → tooltip explaining `%` wildcard
- IN selected → comma-separated input box
- IS NULL selected → one row has NULL salary to demonstrate

---

### Visualizer 4 — GROUP BY Visualizer

**File:** `src/features/visualizers/sql/GroupByVisualizer.tsx`

Controls:
- Aggregate function: `COUNT(*) | SUM(salary) | AVG(salary) | MIN(salary) | MAX(salary)`
- Group by: `department | job_title`
- HAVING toggle + threshold input

**5 Steps (Framer Motion `layout` animation):**
1. Flat list of 12 rows, all gray
2. Rows physically animate into colour-coded stacks by department
3. Aggregate computation animates inside each group (values summing → result pops in)
4. If HAVING enabled: groups below threshold fade out
5. Groups collapse to single summary rows → result table appears

Group colours (consistent across all visualizers):
- Engineering → indigo
- Marketing → pink
- Sales → green
- HR → amber

---

### Visualizer 5 — HAVING vs WHERE Visualizer

**File:** `src/features/visualizers/sql/HavingVisualizer.tsx`

Two panels side-by-side, animating simultaneously:

| Left panel (WHERE) | Right panel (HAVING) |
|---------------------|----------------------|
| `WHERE salary > 60000` | `HAVING AVG(salary) > 60000` |
| Rows filtered BEFORE grouping | All rows grouped FIRST |
| Then grouped | Then groups filtered |
| Different result | Different result |

**Error Demo Tab:**
Show this query:
```sql
SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > 2 GROUP BY department;
```
Animate: red ❌ "ERROR: Invalid use of group function"
Explanation + corrected version with HAVING.

---

### Visualizer 6 — JOIN Visualizer

**File:** `src/features/visualizers/sql/JoinVisualizer.tsx`

**customers** (8 rows):
| id | name | country |
|----|------|---------|
| 1 | Alice | USA |
| 2 | Bob | UK |
| 3 | Carol | USA |
| 4 | David | GER |
| 5 | Eve | USA |
| 6 | Frank | UK |
| 7 | Grace | JPN |
| 8 | Henry | NULL |

**orders** (10 rows):
| id | customer_id | total |
|----|-------------|-------|
| 1 | 1 | 299 |
| 2 | 1 | 145 |
| 3 | 2 | 567 |
| 4 | 3 | 89 |
| 5 | 3 | 234 |
| 6 | 5 | 445 |
| 7 | 5 | 78 |
| 8 | 6 | 891 |
| 9 | NULL | 123 |
| 10 | NULL | 456 |

Customers 4, 7, 8 have no orders. Orders 9, 10 have no customer.

**JOIN type selector tabs:** `INNER JOIN | LEFT JOIN | RIGHT JOIN | FULL OUTER | CROSS JOIN`

**Venn diagram** (SVG, top-center): two circles, highlight included region per JOIN type.

**Animations:**
- Draw connector lines between matching rows
- INNER: only matched rows remain, unmatched fade
- LEFT: all left rows kept, NULLs fill right side for unmatched
- RIGHT: opposite
- FULL OUTER: everything included, NULLs on both sides
- CROSS: show warning "⚠ CROSS JOIN produces 8×10 = 80 rows!"

**Row count badges:**

| JOIN type | Rows |
|-----------|------|
| INNER | 8 |
| LEFT | 10 |
| RIGHT | 10 |
| FULL OUTER | 12 |
| CROSS | 80 |

---

### Visualizer 7 — Subquery Visualizer

**File:** `src/features/visualizers/sql/SubqueryVisualizer.tsx`

**Three tabs:**

**Tab 1 — Scalar subquery:**
```sql
SELECT name, salary,
  (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees;
```
Step 1: Inner query highlighted in yellow box → Step 2: result floats up "$68,500" → Step 3: column fills with that value for every row

**Tab 2 — List subquery (IN):**
```sql
SELECT * FROM orders
WHERE customer_id IN (
  SELECT id FROM customers WHERE country = 'USA'
);
```
Step 1: Inner query returns `[1, 3, 5]` as floating list → Step 2: outer filters orders → Step 3: matches highlight

**Tab 3 — Table subquery (FROM clause):**
```sql
SELECT dept_stats.department, dept_stats.avg_salary
FROM (
  SELECT department, AVG(salary) AS avg_salary
  FROM employees GROUP BY department
) AS dept_stats
WHERE avg_salary > 60000;
```
Step 1: Inner executes → temp table materialises with label "dept_stats" → Step 2: outer WHERE filters → Step 3: final result

---

### Visualizer 8 — Correlated Subquery Visualizer

**File:** `src/features/visualizers/sql/CorrelatedSubqueryVisualizer.tsx`

Query:
```sql
SELECT name, salary, department
FROM employees e1
WHERE salary > (
  SELECT AVG(salary) FROM employees e2
  WHERE e2.department = e1.department
);
```

**Key concept to show:** inner query re-runs for each outer row.

Animation per row:
1. Highlight current outer row (e.g. Alice, Engineering, $95,000)
2. Inner query fires: `"SELECT AVG(salary) ... WHERE department = 'Engineering'"`
3. Inner result appears: `$86,500`
4. Compare: `$95,000 > $86,500` ✅ → row turns green
5. Counter increments: "Inner query executed: 1 time"

Repeat for all 12 rows.

Final: counter shows "Inner query executed: 12 times"
Warning: "⚠ Correlated subqueries can be slow on large tables — consider JOIN instead"

Speed timing: `1x = 0.8s/row`, `2x = 0.4s/row`, `0.5x = 1.6s/row`

---

### Visualizer 9 — Window Function Visualizer

**File:** `src/features/visualizers/sql/WindowFunctionVisualizer.tsx`

Sample data:

| salesperson | region | amount |
|-------------|--------|--------|
| Alice | East | 55000 |
| Bob | East | 62000 |
| Carol | West | 38000 |
| David | West | 71000 |
| Eve | East | 55000 |
| Frank | West | 43000 |
| Grace | North | 88000 |
| Henry | North | 76000 |

> Note: Alice and Eve have identical amounts (55000) — required for tie-breaking demo.

**Controls:**
- Function: `ROW_NUMBER | RANK | DENSE_RANK | SUM OVER | AVG OVER | LAG | LEAD`
- PARTITION BY: `No partition | By region`
- ORDER BY: `amount DESC | amount ASC | salesperson`

**Window frame visualizer:**
- Blue bracket highlights rows in the current row's partition
- Moves as user focuses different rows

**Tie-breaking comparison for 55000 tie:**

| Function | Alice | Eve | others |
|----------|-------|-----|--------|
| ROW_NUMBER | 2 | 3 | unique |
| RANK | 2 | 2 | skips 3 |
| DENSE_RANK | 2 | 2 | no skip |

Result column slides in from right with stagger animation when function changes. Live SQL query updates as controls change.

---

### Visualizer 10 — CTE Visualizer

**File:** `src/features/visualizers/sql/CTEVisualizer.tsx`

**Two tabs:**

**Tab 1 — Standard CTE:**
```sql
WITH dept_avg AS (
  SELECT department, AVG(salary) AS avg_salary
  FROM employees GROUP BY department
),
high_earners AS (
  SELECT name, salary, department
  FROM employees WHERE salary > 70000
)
SELECT h.name, h.salary, d.avg_salary, h.department
FROM high_earners h
JOIN dept_avg d ON h.department = d.department;
```

Step 1: `dept_avg` CTE highlighted → executes → materialises as labelled floating table
Step 2: `high_earners` CTE highlighted → executes → second floating table appears
Step 3: Final SELECT highlighted → arrows from both CTEs → join → result

**Tab 2 — Recursive CTE:**
```sql
WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level;
```

Animation: iteration counter, tree grows level by level
- Level 1: CEO node appears
- Level 2: VP nodes appear, connected to CEO
- Level 3: Manager nodes
- Level 4: IC nodes

---

## DELIVERABLE 6 — `VisualizerEmbed` Replacement

**File:** `src/components/mdx/VisualizerEmbed.tsx` — `'use client'`

```tsx
'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const visualizerMap = {
  ExecutionOrder:     dynamic(() => import('@/features/visualizers/sql/ExecutionOrderVisualizer')),
  SelectVisualizer:   dynamic(() => import('@/features/visualizers/sql/SelectVisualizer')),
  WhereVisualizer:    dynamic(() => import('@/features/visualizers/sql/WhereVisualizer')),
  GroupByVisualizer:  dynamic(() => import('@/features/visualizers/sql/GroupByVisualizer')),
  HavingVisualizer:   dynamic(() => import('@/features/visualizers/sql/HavingVisualizer')),
  JoinVisualizer:     dynamic(() => import('@/features/visualizers/sql/JoinVisualizer')),
  SubqueryVisualizer: dynamic(() => import('@/features/visualizers/sql/SubqueryVisualizer')),
  CorrelatedSubquery: dynamic(() => import('@/features/visualizers/sql/CorrelatedSubqueryVisualizer')),
  WindowFunction:     dynamic(() => import('@/features/visualizers/sql/WindowFunctionVisualizer')),
  CteVisualizer:      dynamic(() => import('@/features/visualizers/sql/CTEVisualizer')),
  EtlPipeline:        dynamic(() => import('@/features/visualizers/de/EtlPipelineVisualizer')),
  SparkArch:          dynamic(() => import('@/features/visualizers/de/SparkArchVisualizer')),
  KafkaArch:          dynamic(() => import('@/features/visualizers/de/KafkaArchVisualizer')),
  AirflowDag:         dynamic(() => import('@/features/visualizers/de/AirflowDagVisualizer')),
}

interface VisualizerEmbedProps {
  name: keyof typeof visualizerMap
  autoPlay?: boolean
}

export function VisualizerEmbed({ name, autoPlay = false }: VisualizerEmbedProps) {
  const Component = visualizerMap[name]
  if (!Component) return <p className="text-red-400">Unknown visualizer: {name}</p>
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 my-6">
      <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-lg" />}>
        <Component autoPlay={autoPlay} />
      </Suspense>
    </div>
  )
}
```

---

## DELIVERABLE 7 — DE Visualizers

All 4 DE visualizers use `@xyflow/react`. All are `'use client'` components.

### DE Visualizer 1 — ETL Pipeline

**File:** `src/features/visualizers/de/EtlPipelineVisualizer.tsx`

**Custom node types (glassmorphic):**
- `SourceNode`: blue border, icon
- `ProcessNode`: indigo border, gear icon
- `TargetNode`: green border, warehouse icon

**Nodes:**

| ID | Label | Type |
|----|-------|------|
| csv_file | CSV File | Source |
| rest_api | REST API | Source |
| postgres | PostgreSQL | Source |
| kafka | Kafka Topic | Source |
| extract | Extract | Process |
| clean | Clean & Validate | Process |
| enrich | Enrich Data | Process |
| aggregate | Aggregate | Process |
| load | Load | Process |
| warehouse | Data Warehouse | Target |
| lake | Data Lake | Target |
| dashboard | Dashboard | Target |

**Edges:** React Flow animated edges, stroke indigo

**Controls:**
- Play: nodes highlight sequentially as data flows
- Toggle: `ETL mode ↔ ELT mode` (Load moves before Transform, nodes rearrange)
- Speed: slow / normal / fast
- Click any node → side panel with explanation

**Stats panel (bottom):** Records Extracted / Transformed / Loaded (animated counters), Pipeline Status

---

### DE Visualizer 2 — Spark Architecture

**File:** `src/features/visualizers/de/SparkArchVisualizer.tsx`

**Three tabs:** `Architecture | Job Execution | RDD vs DataFrame`

**Architecture nodes:**
- `driver`: "Driver Program" (top, indigo, large)
- `sparkcontext`: "SparkContext" (below driver)
- `cluster_manager`: "Cluster Manager" (dropdown: YARN / K8s / Standalone)
- `worker1`, `worker2`, `worker3`: "Worker Node N" (bottom row, each contains executor → tasks)

**Job Execution animation (7 steps):**
1. User submits job → Driver highlighted
2. DAG created → mini-flowchart appears
3. DAG Scheduler divides into stages
4. Tasks dispatched to executors (animated lines)
5. Shuffle shown as cross-worker arrows
6. Results collected → Driver highlighted

---

### DE Visualizer 3 — Kafka Architecture

**File:** `src/features/visualizers/de/KafkaArchVisualizer.tsx`

**Nodes:**
- `producer1`, `producer2`, `producer3`: Producers (left, blue)
- `broker1`, `broker2`, `broker3`: Brokers (center, each showing P0 Leader / P1 Follower / P2 Follower)
- `consumer_group_a`: Consumer Group A (3 consumers)
- `consumer_group_b`: Consumer Group B (2 consumers)

**Animations:**
- Messages flow from producer → broker partition (show offset number)
- Replication: leader → followers (dashed arrow)
- Consumer reads: broker → consumer (offset tracking)

**Controls:**
- "Add Message" button → fires a message, animates through
- Consumer lag indicator: "Group A: 0 lag | Group B: 45 lag"

---

### DE Visualizer 4 — Airflow DAG

**File:** `src/features/visualizers/de/AirflowDagVisualizer.tsx`

**DAG:** `daily_sales_pipeline`

**Tasks (custom Airflow-style nodes with green header):**

| Task ID | Operator | Depends on |
|---------|----------|------------|
| extract_postgres | PythonOperator | — |
| extract_api | HttpOperator | — |
| validate_data | PythonOperator | extract_postgres, extract_api |
| transform_sales | PythonOperator | validate_data |
| transform_customers | PythonOperator | validate_data |
| load_warehouse | SnowflakeOperator | transform_sales, transform_customers |
| send_alert | SlackOperator | load_warehouse |
| generate_report | PythonOperator | load_warehouse |

**Task state colours:**

| State | Colour |
|-------|--------|
| none | light gray |
| queued | gray |
| running | yellow + pulse |
| success | green |
| failed | red |
| upstream_failed | orange |
| skipped | pink |

**Controls:**
- `▶ Run DAG`: animate through states in dependency order (parallel where possible)
- `Simulate Failure`: `extract_postgres` fails → downstream cascade
- Click task → detail panel (Task ID, Operator, Duration, State, log placeholder)
- `Clear All` → reset all to `none`

---

## DELIVERABLE 8 — Quiz Engine

### QuizUI Component

**File:** `src/features/quiz/components/QuizUI.tsx` — `'use client'`

**4 States:** `idle → in_progress → review → completed`

**Idle:**
Card with quiz title, description, N questions, time limit (or "Untimed"), XP reward, difficulty breakdown, "Start Quiz" button.

**In Progress:**
- Progress bar: segments (completed=indigo, current=white, remaining=gray)
- Timer (if timed): circular SVG countdown. Colors: normal=indigo, <30s=amber, <10s=red + pulse
- Question text (`text-xl font-medium`)
- 4 option cards (A/B/C/D). States:
  - Default: gray border
  - Selected (before confirm): indigo border + bg
  - After reveal: correct=green, wrong=red, correct-but-not-chosen=green outline
- "Confirm Answer" button (disabled until selection)
- After confirm: explanation shown → "Next Question" button
- Keyboard: `1`/`2`/`3`/`4` to select, `Enter` to confirm/advance

> Use `useRef` for timer, NOT `useState` — prevents re-render lag.

**Review:**
Scrollable list of all questions with: question text, your answer, correct answer, ✅/❌, explanation.

**Completed:**
- Animated score: "8 / 10" (SVG circle, animated `stroke-dashoffset`)
- Pass/fail badge
- XP awarded (floats up as animation)
- Stats: correct / incorrect / time taken / accuracy %
- Buttons: "Review Answers" | "Retake Quiz" | "Next Lesson" (if `nextLessonSlug` prop provided)
- Server Action: `submitQuizAttempt(quizId, answers, timeUsed)`

### QuizEmbed Component

**File:** `src/components/mdx/QuizEmbed.tsx` — `'use client'`

```tsx
interface QuizEmbedProps {
  quizId: string
  nextLessonSlug?: string
}
```

- Fetch quiz from `/api/quiz/[quizId]` on mount
- Loading state: skeleton card
- Error state: "Quiz not found"
- Render `<QuizUI quiz={quiz} nextLessonSlug={nextLessonSlug} />`

### Quiz Route Handler

**File:** `src/app/api/quiz/[quizId]/route.ts`

```ts
import 'server-only'
// Mongoose cold-start registration
import User from '@/models/User'
// ... all models
import Quiz from '@/models/Quiz'

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
  await connectDB()
  try {
    const quiz = await Quiz.findById(params.quizId)
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    return NextResponse.json(quiz)
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### Quiz Submit Route Handler

**File:** `src/app/api/quiz/submit/route.ts`

```ts
import 'server-only'
// Mongoose cold-start registration — all models

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { quizId, answers, timeUsed } = await req.json()

  const user = await User.findOne({ clerkId })
  const quiz = await Quiz.findById(quizId)

  // Score calculation
  let correct = 0
  quiz.questions.forEach((q: any, i: number) => {
    if (answers[i] === q.correct) correct++
  })
  const score = Math.round((correct / quiz.questions.length) * 100)
  const passed = score >= (quiz.passingScore || 70)
  const xpEarned = passed ? quiz.xpReward : Math.round(quiz.xpReward * 0.3)

  // Save attempt — upsert (not create)
  await QuizAttempt.findOneAndUpdate(
    { userId: user._id, quizId },
    { $set: { answers, score, passed, timeUsed, xpEarned, completedAt: new Date() } },
    { upsert: true, new: true }
  )

  // Award XP
  await awardXP(user._id.toString(), xpEarned, `Quiz: ${quiz.title}`)
  const newAchievements = await checkAchievements(user._id.toString())

  revalidatePath('/dashboard')
  return NextResponse.json({ score, passed, xpEarned, correct, total: quiz.questions.length, newAchievements })
}
```

---

## DELIVERABLE 9 — Flashcard System

### FlashcardDeck Component

**File:** `src/features/flashcards/components/FlashcardDeck.tsx` — `'use client'`

**Card 3D flip animation:**
```tsx
<motion.div
  style={{ rotateY: isFlipped ? 180 : 0, transformStyle: 'preserve-3d' }}
  transition={{ duration: 0.4 }}
>
  <div style={{ backfaceVisibility: 'hidden' }}>Front</div>
  <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>Back</div>
</motion.div>
```

**Controls:**
- `[← Prev] [Card N of M] [🔀 Shuffle] [Next →]`
- Keyboard: `←`/`→` navigate, `Space` to flip

**After seeing back — difficulty rating:**
- `[😊 Easy] [😐 Medium] [😓 Hard]`
- Stored in localStorage: `de_flashcard_ratings`
- "Study Again" re-queues: Hard first → Medium → skip Easy

**Progress bar:** N of M cards reviewed this session
**Stats footer:** Easy: N | Medium: N | Hard: N

### Flashcard Route Handler

**File:** `src/app/api/flashcards/[moduleSlug]/route.ts`

```ts
import 'server-only'
// Mongoose cold-start registration
import Flashcard from '@/models/Flashcard'
import Module from '@/models/Module'
// ... all models

export async function GET(req: Request, { params }: { params: { moduleSlug: string } }) {
  await connectDB()
  const module = await Module.findOne({ slug: params.moduleSlug })
  if (!module) return NextResponse.json([])
  const cards = await Flashcard.find({ moduleId: module._id }).sort({ order: 1 })
  return NextResponse.json(cards)
}
```

---

## DELIVERABLE 10 — Practice Page

**File:** `src/app/(practice)/practice/page.tsx` — `'use client'`

**Three tabs:** `SQL Challenges | Flashcards | Quick Quiz`

### SQL Challenges Tab

Filter bar:
- Difficulty pills: `All | Beginner | Intermediate | Advanced`
- Category pills: `All | Joins | Aggregations | Window Functions | CTEs | Subqueries`

Fetch from `/api/challenges?difficulty=intermediate&category=joins`

Challenge cards (2-col grid):
- Difficulty badge (green/amber/red)
- Category badge
- Title
- XP reward
- Completion indicator (✅ if completed, from user Progress)
- "Solve Challenge" button → opens Radix Dialog modal

**Challenge Modal:**
- Left: problem statement + sample data tables + expected output
- Right: mini `SqlPlayground` (smaller height, no history panel)
- "Check Answer" → POST `/api/challenges/[id]/check` → compare output
  - ✅ "Correct! +25 XP" (awards XP via server action)
  - ❌ "Not quite — check your output"
- Hints: "Reveal Hint 1" → "Reveal Hint 2" (progressive)
- "Show Solution" (after 3 failed attempts)

### Flashcards Tab

Module selector pills: `SQL | Python | Linux | Git | ...`
`<FlashcardDeck />` for selected module (fetches `/api/flashcards/[moduleSlug]`)

### Quick Quiz Tab

Module selector dropdown + "Start 10-Question Quiz" button
Renders `<QuizUI />` inline

---

## DELIVERABLE 11 — Interview Prep Page

**File:** `src/app/(interview)/interview/page.tsx`

**Layout:** `sidebar (200px) | question list (flex-1) | detail panel (400px)`

**Left sidebar filters:**
- Topic: `All | SQL | Python | Spark | Kafka | Airflow | Snowflake | System Design | Scenario-Based`
- Difficulty: `All | Easy | Medium | Hard`
- Company: `All | Google | Meta | Amazon | Uber | Netflix`

**Question list rows:**
- Difficulty badge
- Question title (60 chars, truncated)
- Company badges (up to 3)
- 👍 upvote count
- 🔖 bookmark button
- Click → loads detail panel (or modal on mobile)

**Detail panel:**
- Full question text
- Tags
- "Show Answer" toggle (hidden by default)
- Answer with MDX rendering + code examples
- Related questions (3 links)
- "Mark as Reviewed" → Server Action saves to Progress collection
- "Bookmark" → Server Action toggles Bookmark document

**Route Handler:** `src/app/api/interview-questions/route.ts`

```
GET /api/interview-questions?topic=sql&difficulty=hard&company=google&page=1&limit=20
```

All models cold-start imported.

---

## DELIVERABLE 12 — Playground Layout

**File:** `src/app/(playground)/layout.tsx`

- No sidebar
- Minimal navbar: logo + theme toggle + `<UserButton />` only
- `height: 100vh`, `overflow: hidden`
- Bottom status bar (28px fixed): keyboard shortcuts hint

> Add `/playground/(.*)` to public routes in `middleware.ts` if playground should be accessible without login.

---

## DELIVERABLE 13 — Extended Seed Script

**File:** `src/scripts/seed.ts` — **APPEND only, do not replace existing content**

### 20 SQL Challenges

**Beginner (6):**

| # | Title | Concept |
|---|-------|---------|
| 1 | Find All Customers | `SELECT *` |
| 2 | Customers from USA | `WHERE country = 'USA'` |
| 3 | Top 5 Most Expensive Products | `ORDER BY price DESC LIMIT 5` |
| 4 | Count Orders per Status | `GROUP BY status` |
| 5 | Products Under $50 | `WHERE price < 50` |
| 6 | Customers with Email | `WHERE email IS NOT NULL` |

**Intermediate (8):**

| # | Title | Concept |
|---|-------|---------|
| 7 | Customers and Their Order Count | `LEFT JOIN + COUNT + GROUP BY` |
| 8 | Revenue by Category | `JOIN products + categories + order_items` |
| 9 | Customers Who Never Ordered | `LEFT JOIN + WHERE order_id IS NULL` |
| 10 | Monthly Revenue | `GROUP BY month ORDER BY month` |
| 11 | Average Order Value by Country | `JOIN + GROUP BY + AVG` |
| 12 | Products Never Ordered | `NOT IN subquery` |
| 13 | Top Customer per Country | correlated subquery or window function |
| 14 | Orders Above Average Value | `AVG` subquery |

**Advanced (6):**

| # | Title | Concept |
|---|-------|---------|
| 15 | Rank Customers by Spend | `DENSE_RANK OVER (ORDER BY total_spent DESC)` |
| 16 | Running Total of Revenue | `SUM OVER (ROWS UNBOUNDED PRECEDING)` |
| 17 | Month-over-Month Growth | `LAG` window function |
| 18 | Employee Hierarchy | Recursive CTE (hr.db) |
| 19 | Salespeople Above Dept Average | Correlated subquery (hr.db) |
| 20 | Top 3 Products per Category | `ROW_NUMBER OVER (PARTITION BY category)` |

Each challenge document:
```ts
{
  title, description, type: 'sql', difficulty, category,
  database: 'ecommerce' | 'hr' | 'sales',
  starterCode: string,
  solution: string,
  expectedOutput: { columns: string[], rows: unknown[][] },
  hints: [hint1, hint2],
  xpReward: number,
  tags: string[],
  order: number
}
```

### 20 SQL Flashcards

| Front | Back |
|-------|------|
| What does SELECT * do? | Returns all columns. Avoid in production — always specify columns. |
| INNER JOIN returns... | Only rows where the join condition matches in BOTH tables. |
| LEFT JOIN returns... | All rows from left table + matching rows from right. NULL if no match. |
| Difference: WHERE vs HAVING | WHERE filters rows before grouping. HAVING filters groups after aggregation. |
| What is a CTE? | Common Table Expression. A named temporary result using WITH clause. |
| What does DISTINCT do? | Removes duplicate rows from result set. |
| SQL Execution Order (6 steps) | FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY/LIMIT |
| What is a correlated subquery? | A subquery that references columns from the outer query. Runs once per outer row. |
| ROW_NUMBER vs RANK | ROW_NUMBER always unique. RANK gives same number to ties, skips next rank. |
| DENSE_RANK vs RANK | DENSE_RANK gives same number to ties but does NOT skip next rank. |
| What is NULL in SQL? | Absence of value. NULL ≠ 0 ≠ ''. Use IS NULL / IS NOT NULL. |
| CROSS JOIN produces... | Cartesian product — every row of table A × every row of table B. |
| What is a subquery? | A query nested inside another query. Executes first. |
| What does GROUP BY do? | Groups rows with same values. Used with aggregate functions. |
| What is PARTITION BY? | Used in window functions to divide rows into groups without collapsing them. |
| LAG() does what? | Returns value from previous row in window partition. |
| LEAD() does what? | Returns value from next row in window partition. |
| What is a View? | A saved SQL query stored as a virtual table. Doesn't store data (unless materialized). |
| What is an Index? | Data structure that speeds up SELECT queries. Slows INSERT/UPDATE. |
| EXPLAIN shows what? | Query execution plan — how the DB will retrieve data. Used for optimization. |

### 10 SQL Quiz Questions

| Q | Question | Correct answer |
|---|----------|----------------|
| 1 | What is the correct SQL execution order? | FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY |
| 2 | Which JOIN returns all rows from the left table? | LEFT JOIN |
| 3 | HAVING clause filters... | Groups after aggregation |
| 4 | RANK() for values 100,100,90,80 returns... | 1,1,3,4 |
| 5 | A correlated subquery... | References outer query columns |
| 6 | SELECT COUNT(*) counts... | All rows including NULLs |
| 7 | CTE stands for... | Common Table Expression |
| 8 | NULL = NULL evaluates to... | NULL |
| 9 | DENSE_RANK for values 100,100,90,80 returns... | 1,1,2,3 |
| 10 | Window functions require... | OVER() clause |

### 30 Interview Questions

**SQL (10):**

| # | Question | Difficulty | Type | Companies |
|---|----------|------------|------|-----------|
| 1 | Explain the difference between WHERE and HAVING | easy | conceptual | |
| 2 | Write a query to find the second highest salary | medium | coding | Amazon, Google |
| 3 | What is the N+1 query problem? | medium | scenario | |
| 4 | Explain ACID properties in databases | hard | conceptual | Meta, Google |
| 5 | How would you optimize a slow query? | hard | scenario | all |
| 6 | What is a query execution plan? | medium | conceptual | |
| 7 | Difference between RANK, DENSE_RANK, ROW_NUMBER | medium | conceptual | Uber |
| 8 | Write a recursive CTE to traverse org hierarchy | hard | coding | Meta |
| 9 | CTE vs subquery vs temp table — when to use each? | hard | scenario | |
| 10 | How do indexes work and when NOT to use them? | hard | conceptual | Netflix |

**Python (5):**

| # | Question | Difficulty | Companies |
|---|----------|------------|-----------|
| 11 | Difference between list and generator | easy | |
| 12 | How does Pandas handle missing data? | medium | |
| 13 | Explain map(), filter(), reduce() | easy | Amazon |
| 14 | Process a 10GB CSV with limited RAM | hard | Uber |
| 15 | What is the GIL in Python? | hard | Google |

**Spark (5):**

| # | Question | Difficulty | Companies |
|---|----------|------------|-----------|
| 16 | RDD vs DataFrame vs Dataset | medium | |
| 17 | Explain lazy evaluation in Spark | medium | Netflix |
| 18 | What causes a shuffle? How to minimize it? | hard | Uber |
| 19 | Spark execution model (DAG, stages, tasks) | hard | Meta |
| 20 | How to handle skewed data in Spark? | hard | Amazon |

**Kafka (5):**

| # | Question | Difficulty | Companies |
|---|----------|------------|-----------|
| 21 | What is a consumer group? | easy | |
| 22 | Kafka delivery guarantees | medium | |
| 23 | How to handle duplicate messages? | hard | Uber |
| 24 | What is partition rebalancing? | medium | Netflix |
| 25 | Ensure message ordering in Kafka | hard | |

**Airflow (5):**

| # | Question | Difficulty | Companies |
|---|----------|------------|-----------|
| 26 | What is a DAG in Airflow? | easy | |
| 27 | BashOperator vs PythonOperator | easy | |
| 28 | Handle task failures in Airflow | medium | |
| 29 | What is XCom in Airflow? | medium | Uber |
| 30 | Scale Airflow for 1000+ DAGs | hard | Netflix |

---

## QUALITY RULES

- **TypeScript strict mode** — zero `any` types, zero TypeScript errors
- **All visualizers** work with zero props (built-in sample data)
- **SQL runner** sanitises all input — no raw query string concatenation
- **Pyodide** initialised only once (cached on `window`) — show loading state during init
- **React Flow** diagrams must be responsive and touch-friendly
- **All animations** respect `prefers-reduced-motion`
- **Quiz timer** uses `useRef` not `useState` — prevents re-render lag
- **FlashcardDeck** keyboard navigation works without clicking first (auto-focus)
- **All route handlers**: `try/catch` every DB operation, return proper HTTP status codes
- **`revalidatePath('/dashboard')`** after every XP-awarding mutation
- **Mobile responsive** — playground collapses editor/results to tabs on `<768px`
- **All forms** use React Hook Form + Zod validation
- **Accessible** — semantic HTML, aria-labels, keyboard navigation throughout

---

## DO NOT BUILD IN SPRINT 3

- MDX Blog (Sprint 4)
- Cloud module content: Spark, Kafka, Airflow, Snowflake, AWS, Azure, GCP lessons (Sprint 4)
- Projects section detail pages (Sprint 4)
- Discussion Forum (Sprint 5)
- Admin dashboard (Sprint 5)