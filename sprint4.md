# DataEngineering.Academy — Sprint 4 Prompt
## Python Module + Spark Module + Projects Section + MDX Blog
### (Soft-Launch Readiness Sprint)

---

## CONTEXT

You are a world-class Senior Full Stack Engineer continuing **DataEngineering.Academy**.

Sprints 1, 2 & 3 are **100% COMPLETE** and deployed to Vercel with zero build errors. The following are live in production:

- Next.js 16 App Router + React 19 + Tailwind CSS v4
- Clerk auth (static imports only)
- MongoDB Atlas + all 17 Mongoose models (cold-start registered)
- XP / streak / achievement engine
- Dashboard, Profile, Learn catalog (15 courses), SQL module (24 lessons, full content)
- Lesson viewer with MDX, mark complete, confetti
- SQL Playground (better-sqlite3, 3 seeded DBs) + Python Playground (Pyodide)
- 10 SQL visualizers + 4 DE visualizers (React Flow + Framer Motion)
- Quiz engine, Flashcard system, Practice page, Interview Prep page
- 20 SQL challenges, 20 flashcards, 10 quiz questions, 30 interview questions seeded

**DO NOT rebuild anything from Sprints 1–3. Import and extend only.**

This sprint makes the platform **soft-launch ready**: two more full learning modules, a complete projects section, and a working blog.

---

## PRODUCTION RULES — APPLY TO EVERY SINGLE FILE

Carried forward from Sprint 2/3 deployment lessons. Breaking these crashes production.

### Rule 1 — Static imports only

```ts
// ❌ NEVER
const { currentUser } = await import('@clerk/nextjs/server')
// ✅ ALWAYS
import { currentUser, auth } from '@clerk/nextjs/server'
```

### Rule 2 — Mongoose cold-start registration

Every server file touching MongoDB imports every model that any `.populate()` could reach:

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
import Project from '@/models/Project'
import BlogPost from '@/models/BlogPost'
import Comment from '@/models/Comment'
import Bookmark from '@/models/Bookmark'
```

### Rule 3 — Decouple static content from auth

Never call `auth()`/`currentUser()` in an RSC that also calls `generateStaticParams()`. Progress and auth-dependent UI load in separate Client Components after hydration.

### Rule 4 — Bulletproof upsert, never `.create()`

```ts
await User.findOneAndUpdate(
  { $or: [{ clerkId }, { email }] },
  { $set: { clerkId, email, ...data } },
  { upsert: true, new: true }
)
```

### Rule 5 — `server-only` guard

Top of every route handler, server action, `src/lib/db.ts`, `src/lib/xp.ts`, and any file importing `better-sqlite3`.

### Rule 6 — `better-sqlite3` stays server-only

Never import outside Route Handlers. `serverExternalPackages: ['better-sqlite3']` stays in `next.config.ts`.

### Rule 7 — `next/dynamic` is fine in Client Components

The dynamic-import ban only applies to server code, not `'use client'` files using `next/dynamic`.

---

## NEW PACKAGES TO INSTALL

```json
"gray-matter": "^4.0.3",
"reading-time": "^1.5.0",
"feed": "^4.2.2"
```

> `next-mdx-remote`, `rehype-highlight`, `remark-gfm` should already be present from Sprint 2. Verify and add if missing.

---

## FILE OUTPUT ORDER

```
PART A — PYTHON MODULE
1.  src/app/(learn)/learn/python/page.tsx
2.  src/features/learn/components/PythonModuleProgress.tsx
3.  Seed script additions — Python course content (append to seed.ts)

PART B — SPARK MODULE
4.  src/app/(learn)/learn/spark/page.tsx
5.  src/features/learn/components/SparkModuleProgress.tsx
6.  Seed script additions — Spark course content (append to seed.ts)

PART C — PROJECTS SECTION
7.  src/app/(projects)/projects/page.tsx
8.  src/app/(projects)/projects/[slug]/page.tsx
9.  src/app/(projects)/projects/loading.tsx
10. src/features/projects/components/ProjectCard.tsx
11. src/features/projects/components/ProjectArchitectureDiagram.tsx
12. src/features/projects/actions/index.ts
13. Seed script additions — 7 projects (append to seed.ts)

PART D — MDX BLOG
14. src/lib/blog.ts
15. content/blog/*.mdx (10 seed posts)
16. src/app/(blog)/blog/page.tsx
17. src/app/(blog)/blog/[slug]/page.tsx
18. src/app/(blog)/blog/category/[category]/page.tsx
19. src/features/blog/components/BlogCard.tsx
20. src/features/blog/components/BlogSearch.tsx
21. src/features/blog/components/CommentSection.tsx
22. src/features/blog/actions/index.ts
23. src/app/api/blog/search/route.ts

PART E — INTEGRATION
24. src/components/layout/Navbar.tsx (update — add Projects, Blog links)
25. src/app/page.tsx (update — add Projects + Blog teasers to landing page)
```

---

# PART A — PYTHON MODULE

## A1. Python Module Page

**File:** `src/app/(learn)/learn/python/page.tsx`

Same structural pattern as the SQL module page from Sprint 2 — static-first Server Component, no `auth()` call at top level, progress loads client-side.

### Module Header

- Icon: 🐍 + "Python for Data Engineering"
- Description: "Master Python fundamentals, Pandas, and data processing patterns used in real data pipelines"
- Stats: "20 lessons · ~7 hours · Beginner friendly"
- Progress bar (Client Component, loads async)
- "Continue Learning" button

### Learning Path — 20 lessons across 5 sections

**Section 1: Python Foundations (5 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 1 | python-intro | Introduction to Python for Data Engineering | theory | 10 |
| 2 | variables-types | Variables, Data Types & Type Hints | theory | 10 |
| 3 | control-flow | Control Flow: if/else, loops | interactive | 15 |
| 4 | functions | Functions & Lambda Expressions | interactive | 15 |
| 5 | data-structures | Lists, Dicts, Tuples & Sets | interactive | 15 |

**Section 2: File & Data Handling (4 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 6 | file-io | Reading & Writing Files (CSV, JSON, TXT) | interactive | 20 |
| 7 | error-handling | Exception Handling & Try/Except | theory | 15 |
| 8 | working-with-apis | Working with REST APIs (requests library) | interactive | 20 |
| 9 | regex-basics | Regular Expressions for Data Cleaning | interactive | 20 |

**Section 3: Pandas Fundamentals (5 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 10 | pandas-intro | Introduction to Pandas & DataFrames | interactive | 25 |
| 11 | pandas-selection | Selecting & Filtering Data | interactive | 25 |
| 12 | pandas-groupby | GroupBy & Aggregation in Pandas | interactive | 30 |
| 13 | pandas-merge | Merging & Joining DataFrames | interactive | 30 |
| 14 | pandas-cleaning | Data Cleaning: Nulls, Duplicates, Types | interactive | 25 |

**Section 4: Data Processing Patterns (3 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 15 | list-comprehensions | List Comprehensions & Generators | interactive | 20 |
| 16 | decorators | Decorators for Pipeline Logging | theory | 25 |
| 17 | context-managers | Context Managers (with statement) | theory | 20 |

**Section 5: Python for Data Engineering (3 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 18 | python-etl | Building an ETL Script in Python | exercise | 35 |
| 19 | multiprocessing | Parallel Processing for Large Datasets | theory | 30 |
| 20 | python-interview | Python Interview Master Class | interactive | 40 |

Same lesson row UI as SQL module: number, status icon, title, type badge, XP badge, duration, lock/unlock logic.

### Hardcoded MDX Content (write full content for these 4 lessons)

**Lesson 1 — Introduction to Python for Data Engineering**

Must include:
- Why Python dominates data engineering (vs Java/Scala)
- The data engineering Python stack: Pandas, PySpark, Airflow, dbt
- Real examples: "Airbnb uses Python for...", "Spotify uses Python for..."
- `<Callout type="tip">Python's readability makes it the default choice for ETL scripts and orchestration logic</Callout>`

**Lesson 6 — Reading & Writing Files**

Must include:
- Reading CSV with built-in `csv` module vs Pandas
- Reading/writing JSON
- Working with file paths (`pathlib`)
- 5+ worked code examples
- `<CodeBlock language="python">` with practical examples
- Common pitfall: encoding issues, large file handling

**Lesson 10 — Introduction to Pandas & DataFrames**

Must include:
- What is a DataFrame (conceptually — table-like structure)
- Creating DataFrames from dicts, lists, CSV
- `.head()`, `.info()`, `.describe()`, `.shape`
- Series vs DataFrame
- `<VisualizerEmbed name="PandasIntro" />` (placeholder — visualizer built in future sprint)
- 6 worked examples with a sample sales dataset

**Lesson 18 — Building an ETL Script in Python**

Must include:
- Full worked example: extract from CSV → transform with Pandas → load to a new CSV
- Error handling around each stage
- Logging pattern
- `<CodeBlock language="python">` with the complete script (30+ lines)
- Exercise prompt: "Modify this script to handle a JSON source instead"

### Python Progress Client Component

**File:** `src/features/learn/components/PythonModuleProgress.tsx`

Same pattern as `SqlModuleProgress.tsx` from Sprint 2: `'use client'`, fetches `/api/progress/python` on mount, shows overall progress + lock/unlock state + Continue button.

---

## A2. Seed Script Additions — Python

Append to `src/scripts/seed.ts`:

```ts
// Python course
{
  slug: 'python',
  title: 'Python for Data Engineering',
  description: 'Master Python fundamentals, Pandas, and data processing patterns',
  icon: '🐍',
  level: 'beginner',
  tags: ['python', 'pandas', 'etl'],
  order: 2,
  estimatedHours: 7,
  totalLessons: 20,
  published: true
}
```

Plus one `Module` document and 20 `Lesson` documents matching the table above (slug, title, type, xpReward, order, duration estimate: theory=5min, interactive=10min, exercise=15min).

---

# PART B — SPARK MODULE

## B1. Spark Module Page

**File:** `src/app/(learn)/learn/spark/page.tsx`

Same static-first pattern.

### Module Header

- Icon: ⚡ + "Apache Spark"
- Description: "Learn distributed data processing with Apache Spark — from RDDs to production pipelines"
- Stats: "22 lessons · ~9 hours · Intermediate"
- Progress bar + Continue button

### Learning Path — 22 lessons across 6 sections

**Section 1: Spark Fundamentals (4 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 1 | spark-intro | What is Apache Spark? | theory | 15 |
| 2 | spark-architecture | Spark Architecture: Driver, Executors, Cluster Manager | interactive | 25 |
| 3 | rdd-basics | RDDs: Resilient Distributed Datasets | interactive | 25 |
| 4 | spark-setup | Setting Up a Spark Environment | theory | 15 |

**Section 2: DataFrames & SQL (5 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 5 | spark-dataframes | Spark DataFrames | interactive | 25 |
| 6 | dataframe-operations | DataFrame Operations: select, filter, withColumn | interactive | 25 |
| 7 | spark-sql | Spark SQL & Temp Views | interactive | 25 |
| 8 | spark-joins | Joins in Spark | interactive | 30 |
| 9 | spark-aggregations | Aggregations & GroupBy in Spark | interactive | 30 |

**Section 3: Spark Internals (4 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 10 | lazy-evaluation | Lazy Evaluation & Transformations vs Actions | theory | 25 |
| 11 | spark-dag | DAG, Stages & Tasks | interactive | 30 |
| 12 | partitioning | Partitioning Strategies | theory | 30 |
| 13 | shuffling | Understanding Shuffle Operations | interactive | 35 |

**Section 4: Performance & Optimization (4 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 14 | spark-caching | Caching & Persistence | theory | 25 |
| 15 | broadcast-joins | Broadcast Joins for Performance | interactive | 30 |
| 16 | data-skew | Handling Data Skew | theory | 30 |
| 17 | spark-tuning | Spark Configuration & Tuning Basics | theory | 30 |

**Section 5: Spark for Data Engineering (3 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 18 | spark-streaming-intro | Intro to Spark Structured Streaming | theory | 30 |
| 19 | spark-with-airflow | Orchestrating Spark Jobs with Airflow | theory | 25 |
| 20 | reading-writing-formats | Reading/Writing Parquet, Avro, Delta | interactive | 30 |

**Section 6: Spark Practice (2 lessons)**

| # | Slug | Title | Type | XP |
|---|------|-------|------|-----|
| 21 | spark-etl-project | Mini ETL Project with PySpark | exercise | 40 |
| 22 | spark-interview | Spark Interview Master Class | interactive | 40 |

### Hardcoded MDX Content (write full content for these 3 lessons)

**Lesson 1 — What is Apache Spark?**

Must include:
- Spark vs Hadoop MapReduce (why Spark won)
- In-memory processing explained simply
- Spark's unified engine: batch, streaming, ML, SQL
- Real examples: "Netflix processes recommendation data with Spark", "Uber uses Spark for trip data aggregation"
- `<Callout type="info">Spark can be 100x faster than MapReduce for in-memory operations</Callout>`

**Lesson 2 — Spark Architecture**

Must include:
- Driver Program, SparkContext, Cluster Manager, Worker Nodes, Executors explained
- How a job gets distributed
- `<VisualizerEmbed name="SparkArch" />` (links to Sprint 3's built visualizer)
- Diagram description in text form (since this references the existing visualizer)

**Lesson 10 — Lazy Evaluation**

Must include:
- Transformations (lazy) vs Actions (eager) — the core Spark concept
- Why lazy evaluation matters for optimization
- Code examples: `.filter()`, `.map()` (lazy) vs `.collect()`, `.count()` (eager)
- Common confusion: "why didn't my code run yet?"

### Spark Progress Client Component

**File:** `src/features/learn/components/SparkModuleProgress.tsx`

Same pattern as Python's — fetches `/api/progress/spark`.

---

## B2. Seed Script Additions — Spark

Append to `src/scripts/seed.ts`:

```ts
{
  slug: 'spark',
  title: 'Apache Spark',
  description: 'Distributed data processing from RDDs to production pipelines',
  icon: '⚡',
  level: 'intermediate',
  tags: ['spark', 'pyspark', 'distributed-computing'],
  order: 9,
  estimatedHours: 9,
  totalLessons: 22,
  published: true
}
```

Plus 1 `Module` + 22 `Lesson` documents per the table above.

---

# PART C — PROJECTS SECTION

## C1. Projects Catalog Page

**File:** `src/app/(projects)/projects/page.tsx`

Static page (no auth coupling).

### Header

- "Hands-On Projects" heading
- "Apply what you've learned to real-world data engineering scenarios"
- Filter pills: `All | Beginner | Intermediate | Advanced`

### Projects Grid (2-col, responsive)

7 project cards using `ProjectCard` component. Each shows: cover image/icon, title, difficulty badge, stack badges (top 4), estimated hours, "View Project" button.

## C2. The 7 Projects — Full Specifications

### Project 1: Netflix-Style ETL Pipeline

```yaml
slug: netflix-etl-pipeline
title: Netflix-Style Content ETL Pipeline
difficulty: intermediate
stack: [Python, Pandas, PostgreSQL, Airflow, Docker]
estimatedHours: 6
coverImage: "🎬"
```

**Overview:** Build an ETL pipeline that ingests raw viewing data (CSV), cleans and transforms it, and loads it into a PostgreSQL warehouse — simulating how Netflix processes viewing event data for analytics.

**Architecture** (text description for diagram):
```
Raw CSV Files (viewing_events.csv)
    ↓
Extract (Python script reads CSV in chunks)
    ↓
Transform (Pandas: dedupe, type casting, derive watch_duration_minutes)
    ↓
Load (psycopg2 batch insert into PostgreSQL)
    ↓
PostgreSQL Warehouse (fact_viewing_events table)
    ↓
Airflow DAG (orchestrates daily run)
```

**Folder Structure:**
```
netflix-etl-pipeline/
├── dags/
│   └── viewing_events_dag.py
├── scripts/
│   ├── extract.py
│   ├── transform.py
│   └── load.py
├── sql/
│   └── create_tables.sql
├── data/
│   └── sample_viewing_events.csv
├── docker-compose.yml
└── requirements.txt
```

**Implementation Guide (MDX, write full content):**
1. Set up PostgreSQL with Docker Compose
2. Write the extract script (chunked CSV reading)
3. Write the transform script (Pandas cleaning logic, with code)
4. Write the load script (batch insert pattern, with code)
5. Build the Airflow DAG (with code, using PythonOperator for each stage)
6. Test end-to-end run

**Learning Outcomes:**
- Building idempotent ETL scripts
- Chunked processing for large files
- Airflow DAG authoring
- PostgreSQL bulk insert patterns

**Prerequisites:** Python module, SQL module, Airflow basics (lesson 26 from interview questions covers DAG concept)

---

### Project 2: Spotify-Style Data Pipeline

```yaml
slug: spotify-data-pipeline
title: Spotify-Style Listening Analytics Pipeline
difficulty: intermediate
stack: [Python, Apache Kafka, Spark Streaming, MongoDB]
estimatedHours: 8
coverImage: "🎧"
```

**Overview:** Simulate a real-time listening event pipeline — producer generates "song played" events, Kafka streams them, Spark Structured Streaming aggregates listens per artist in near real-time, results land in MongoDB.

**Architecture:**
```
Event Producer (Python script simulates user listens)
    ↓
Kafka Topic: listening-events
    ↓
Spark Structured Streaming (consumes, windows by 1-minute, aggregates by artist)
    ↓
MongoDB (real-time artist_play_counts collection)
    ↓
Dashboard (simple Flask/Streamlit view of top artists)
```

**Folder Structure:**
```
spotify-data-pipeline/
├── producer/
│   └── event_generator.py
├── streaming/
│   └── spark_consumer.py
├── sink/
│   └── mongo_writer.py
├── dashboard/
│   └── app.py
├── docker-compose.yml (Kafka + Zookeeper + MongoDB)
└── requirements.txt
```

**Implementation Guide:** producer setup → Kafka topic creation → Spark streaming consumer with windowed aggregation → MongoDB sink → simple dashboard

**Learning Outcomes:** Event-driven architecture, Kafka producer/consumer patterns, Spark Structured Streaming windowing, real-time aggregation patterns

**Prerequisites:** Spark module, Kafka fundamentals (interview questions cover concepts)

---

### Project 3: Uber-Style Analytics Pipeline

```yaml
slug: uber-analytics-pipeline
title: Uber-Style Trip Analytics Pipeline
difficulty: advanced
stack: [PySpark, Apache Airflow, Snowflake, dbt]
estimatedHours: 10
coverImage: "🚗"
```

**Overview:** Batch pipeline processing daily trip data — calculating surge pricing zones, driver utilization, and trip patterns. Demonstrates a full modern data stack (ELT pattern with dbt transformations on Snowflake).

**Architecture:**
```
Raw Trip Data (Parquet files, partitioned by date)
    ↓
PySpark (Extract + Load raw data to Snowflake staging)
    ↓
Snowflake (raw_trips table)
    ↓
dbt models (staging → intermediate → marts)
    ↓
Snowflake (fct_trips, dim_drivers, agg_surge_zones)
    ↓
Airflow (orchestrates: Spark job → dbt run → dbt test)
```

**Folder Structure:**
```
uber-analytics-pipeline/
├── dags/
│   └── trip_analytics_dag.py
├── spark_jobs/
│   └── load_raw_trips.py
├── dbt_project/
│   ├── models/
│   │   ├── staging/stg_trips.sql
│   │   ├── intermediate/int_trip_durations.sql
│   │   └── marts/fct_trips.sql
│   └── dbt_project.yml
└── data/sample_trips.parquet
```

**Implementation Guide:** Spark extraction job → dbt staging models → dbt intermediate models with business logic → dbt marts → Airflow DAG tying it together with dbt Cloud/CLI operators

**Learning Outcomes:** ELT pattern, dbt fundamentals, Snowflake architecture, modern data stack orchestration

**Prerequisites:** Spark module, SQL module (advanced), Snowflake concepts

---

### Project 4: Sales Analytics Dashboard

```yaml
slug: sales-analytics-dashboard
title: End-to-End Sales Analytics Dashboard
difficulty: beginner
stack: [Python, SQL, Pandas, Plotly/Streamlit]
estimatedHours: 4
coverImage: "📊"
```

**Overview:** A beginner-friendly project — ingest sales CSV data, run SQL transformations, build a Streamlit dashboard showing revenue trends, top products, and regional breakdowns.

**Architecture:**
```
Sales CSV → SQLite (local DB) → SQL aggregation queries → Streamlit Dashboard
```

**Folder Structure:**
```
sales-analytics-dashboard/
├── data/sales.csv
├── db/setup.py
├── queries/aggregations.sql
├── app.py (Streamlit)
└── requirements.txt
```

**Implementation Guide:** Load CSV into SQLite → write 5 SQL aggregation queries (revenue by month, top products, regional totals) → build Streamlit charts for each → deploy locally

**Learning Outcomes:** SQL aggregation in practice, basic dashboarding, end-to-end data flow for beginners

**Prerequisites:** SQL module only

---

### Project 5: Data Warehouse Design Project

```yaml
slug: data-warehouse-design
title: Star Schema Data Warehouse Design
difficulty: intermediate
stack: [PostgreSQL, SQL, dbt, ERD tools]
estimatedHours: 5
coverImage: "🏛️"
```

**Overview:** Design and implement a star-schema data warehouse for an e-commerce business — fact tables, dimension tables, slowly changing dimensions (SCD Type 2).

**Architecture:**
```
OLTP source tables (normalized)
    ↓
Staging layer (raw copies)
    ↓
Dimension tables (dim_customer with SCD2, dim_product, dim_date)
    ↓
Fact table (fct_orders — grain: one row per order line item)
    ↓
BI-ready star schema
```

**Folder Structure:**
```
data-warehouse-design/
├── sql/
│   ├── 01_staging.sql
│   ├── 02_dimensions.sql
│   ├── 03_scd2_logic.sql
│   └── 04_fact_table.sql
├── docs/erd.png
└── README.md
```

**Implementation Guide:** explain star vs snowflake schema → design dim_customer with SCD Type 2 (full SQL implementation) → design dim_product, dim_date → build fct_orders → write sample BI queries

**Learning Outcomes:** Dimensional modeling, SCD Type 2 implementation, star schema design principles

**Prerequisites:** SQL module (advanced), Data Warehousing concepts

---

### Project 6: PySpark Analytics Project

```yaml
slug: pyspark-analytics-project
title: Large-Scale Log Analytics with PySpark
difficulty: advanced
stack: [PySpark, Parquet, AWS S3 (simulated locally)]
estimatedHours: 7
coverImage: "📈"
```

**Overview:** Process and analyze a large synthetic web server log dataset (millions of rows) using PySpark — extract patterns, detect anomalies, optimize for performance.

**Architecture:**
```
Raw log files (gzipped text, simulating S3 storage)
    ↓
PySpark read + parse (regex extraction of log fields)
    ↓
Transformations (sessionization, error rate calculation, partitioning by date)
    ↓
Write to Parquet (partitioned by date, optimized for downstream queries)
    ↓
Analysis queries (top error pages, traffic patterns, response time percentiles)
```

**Folder Structure:**
```
pyspark-analytics-project/
├── data/generate_logs.py (synthetic data generator)
├── jobs/
│   ├── parse_logs.py
│   ├── sessionize.py
│   └── analyze.py
└── notebooks/exploration.ipynb
```

**Implementation Guide:** generate synthetic logs (Python script provided) → PySpark log parsing with regex → sessionization logic (window functions) → write partitioned Parquet → performance comparison: before/after partitioning

**Learning Outcomes:** Large-scale data processing, Spark performance optimization, partitioning strategy, log analytics patterns

**Prerequisites:** Spark module (full — especially performance section)

---

### Project 7: Kafka Streaming Project

```yaml
slug: kafka-streaming-project
title: Real-Time Fraud Detection with Kafka
difficulty: advanced
stack: [Apache Kafka, Python, Redis, Flask]
estimatedHours: 8
coverImage: "🔍"
```

**Overview:** Build a real-time fraud detection system — transaction events flow through Kafka, a Python consumer applies rule-based fraud detection, flagged transactions trigger alerts via Redis pub/sub.

**Architecture:**
```
Transaction Producer (simulates payment events)
    ↓
Kafka Topic: transactions
    ↓
Fraud Detection Consumer (Python: velocity checks, amount thresholds, geo-anomalies)
    ↓
Kafka Topic: fraud-alerts (flagged transactions)
    ↓
Redis Pub/Sub (real-time alert distribution)
    ↓
Flask Dashboard (live alert feed via WebSocket)
```

**Folder Structure:**
```
kafka-streaming-project/
├── producer/transaction_generator.py
├── consumer/fraud_detector.py
├── rules/fraud_rules.py
├── dashboard/
│   ├── app.py
│   └── templates/index.html
└── docker-compose.yml
```

**Implementation Guide:** Kafka setup → transaction producer → fraud detection rules (velocity, amount, geo) → consumer implementation → Redis pub/sub → live dashboard with WebSocket updates

**Learning Outcomes:** Real-time stream processing, rule-based detection systems, Kafka consumer patterns, pub/sub architecture

**Prerequisites:** Kafka fundamentals, Python module

---

## C3. Project Detail Page

**File:** `src/app/(projects)/projects/[slug]/page.tsx`

Static page with `generateStaticParams()` for all 7 project slugs.

### Layout

- Hero: cover icon (large), title, difficulty badge, stack badges, estimated hours
- Tabs: `Overview | Architecture | Folder Structure | Implementation Guide | Learning Outcomes`

**Overview tab:** MDX-rendered overview content

**Architecture tab:**
- Render the architecture flow as a simple vertical diagram (boxes connected by arrows, similar styling to DE visualizers but static — not animated)
- Use `ProjectArchitectureDiagram` component (parses the YAML-style arrow text into a flowchart)

**Folder Structure tab:** Render as a styled tree (same visual style as the master folder structure doc) — monospace, indented, with folder/file icons

**Implementation Guide tab:** Full MDX-rendered step-by-step content with code blocks

**Learning Outcomes tab:** Bullet list with checkmark icons + Prerequisites section

### Bottom CTA

- "Mark as Started" button → adds to user's bookmarks/in-progress projects
- GitHub link placeholder (if `githubUrl` field populated)
- "Back to Projects" link

## C4. ProjectArchitectureDiagram Component

**File:** `src/features/projects/components/ProjectArchitectureDiagram.tsx`

```tsx
interface ProjectArchitectureDiagramProps {
  steps: string[]  // array of stage descriptions, rendered top to bottom with arrows
}
```

Renders each step as a glassmorphic box, connected by a vertical arrow (↓) with Framer Motion fade-up stagger animation on scroll into view.

## C5. Projects Server Actions

**File:** `src/features/projects/actions/index.ts`

```ts
'use server'
import 'server-only'
// Mongoose cold-start registration — all models

export async function getAllProjects(): Promise<Project[]>
export async function getProjectBySlug(slug: string): Promise<Project | null>
export async function markProjectStarted(projectId: string): Promise<void>
  // Bookmarks the project for the current user via findOneAndUpdate upsert
```

## C6. Seed Script Additions — Projects

Append all 7 `Project` documents (from C2 specs above) to `src/scripts/seed.ts`.

---

# PART D — MDX BLOG

## D1. Blog Library

**File:** `src/lib/blog.ts`

```ts
import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogMeta {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  coverImage?: string
  publishedAt: string
  readingTime: string
  author: string
}

export function getAllBlogSlugs(): string[] {
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''))
}

export function getBlogPostBySlug(slug: string): { meta: BlogMeta, content: string } | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)
  return {
    meta: { slug, ...data, readingTime: stats.text } as BlogMeta,
    content
  }
}

export function getAllBlogPosts(): BlogMeta[] {
  return getAllBlogSlugs()
    .map(slug => getBlogPostBySlug(slug)?.meta)
    .filter(Boolean) as BlogMeta[]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostsByCategory(category: string): BlogMeta[] {
  return getAllBlogPosts().filter(p => p.category === category)
}

export function searchPosts(query: string): BlogMeta[] {
  const q = query.toLowerCase()
  return getAllBlogPosts().filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  )
}
```

> Blog content lives as static MDX files in `/content/blog/` — NOT in MongoDB. This keeps the blog buildable at static-generation time with zero DB dependency, per the Sprint 2 architecture decision.

## D2. Seed 10 Blog Posts

Create 10 `.mdx` files in `content/blog/`. Each needs frontmatter:

```yaml
---
title: "Post Title"
excerpt: "One-sentence summary"
category: "sql" | "python" | "spark" | "career" | "tutorials"
tags: ["sql", "joins", "beginners"]
coverImage: "🗄️"
publishedAt: "2026-01-15"
author: "DataEngineering.Academy Team"
---
```

**Write full content (500-900 words each) for these 10 posts:**

1. **`why-sql-still-matters-2026.mdx`** — category: career — "Why SQL Is Still the #1 Skill for Data Engineers in 2026"
   Cover the enduring relevance of SQL despite new tools, real job posting stats (described generally, not fabricated specific numbers), and how SQL skills transfer across the modern data stack.

2. **`window-functions-explained.mdx`** — category: sql — "Window Functions Explained: ROW_NUMBER vs RANK vs DENSE_RANK"
   Deep dive matching the visualizer content, with code examples and a practical use case (deduplication).

3. **`etl-vs-elt-modern-stack.mdx`** — category: tutorials — "ETL vs ELT: Which Pattern Fits the Modern Data Stack?"
   Compare the two patterns, when to use each, how cloud warehouses changed the calculus.

4. **`spark-vs-pandas.mdx`** — category: spark — "Spark vs Pandas: When Do You Actually Need Distributed Computing?"
   Practical guidance on the data size threshold, common misconceptions, migration path.

5. **`first-data-engineering-job.mdx`** — category: career — "How to Land Your First Data Engineering Job: A Practical Roadmap"
   Skills checklist, portfolio project advice, interview prep strategy (ties into the Interview Prep module).

6. **`kafka-for-beginners.mdx`** — category: tutorials — "Kafka for Beginners: Producers, Consumers, and Topics Explained Simply"
   Conceptual intro with analogies, common beginner confusions addressed.

7. **`python-pandas-tips.mdx`** — category: python — "10 Pandas Tricks Every Data Engineer Should Know"
   Practical code-heavy tips post — `.pipe()`, vectorization, `query()`, memory optimization with dtypes.

8. **`ctes-vs-subqueries.mdx`** — category: sql — "CTEs vs Subqueries vs Temp Tables: When to Use Each"
   Decision framework with examples, readability arguments, performance notes.

9. **`airflow-best-practices.mdx`** — category: tutorials — "5 Airflow DAG Best Practices for Production Pipelines"
   Idempotency, avoiding XCom for large data, retry strategies, sensor patterns.

10. **`data-engineer-vs-data-scientist.mdx`** — category: career — "Data Engineer vs Data Scientist: What's the Real Difference?"
    Role comparison, skill overlap, career path guidance for people deciding between tracks.

Each post should use the existing MDX components where relevant: `<Callout>`, `<CodeBlock language="sql|python">`.

## D3. Blog Listing Page

**File:** `src/app/(blog)/blog/page.tsx`

Static Server Component (no auth coupling — public blog).

### Layout

- Header: "Blog" + "Insights on data engineering, career advice, and tutorials"
- `<BlogSearch />` (Client Component — debounced search input, calls `/api/blog/search`)
- Category filter pills: `All | SQL | Python | Spark | Career | Tutorials`
- Featured post (first/most recent) — large card at top
- Grid of `<BlogCard />` for remaining posts (3-col responsive)

## D4. Blog Category Page

**File:** `src/app/(blog)/blog/category/[category]/page.tsx`

`generateStaticParams()` for all 5 categories. Same grid layout as main blog page, filtered.

## D5. Blog Post Detail Page

**File:** `src/app/(blog)/blog/[slug]/page.tsx`

`generateStaticParams()` returns all blog slugs from `getAllBlogSlugs()`.

### Layout

- Cover icon (large) + category badge
- Title (text-4xl)
- Meta row: author, published date, reading time
- MDX-rendered content (`next-mdx-remote`, same components as lessons: `Callout`, `CodeBlock`)
- Tags at bottom
- Share buttons (Twitter/X, LinkedIn — simple URL-based share links, no SDK needed)
- `<CommentSection postId={slug} />` (Client Component, loads comments client-side after hydration — keeps page static)
- Related posts (3 cards, same category)

## D6. Blog Components

**`src/features/blog/components/BlogCard.tsx`**
Glassmorphic card: cover icon, category badge, title, excerpt, author, reading time, date. Hover lift effect.

**`src/features/blog/components/BlogSearch.tsx`**
`'use client'` — debounced input (300ms), calls `/api/blog/search?q=`, shows dropdown results, click → navigate to post.

**`src/features/blog/components/CommentSection.tsx`**
`'use client'` — fetches comments for the post, comment form (requires auth — show sign-in prompt if not logged in), list of comments with like button, nested replies (1 level deep).

## D7. Blog Server Actions

**File:** `src/features/blog/actions/index.ts`

```ts
'use server'
import 'server-only'
// Mongoose cold-start registration

export async function postComment(postSlug: string, content: string, parentId?: string): Promise<Comment>
export async function getComments(postSlug: string): Promise<Comment[]>
export async function likeComment(commentId: string): Promise<void>
```

> Comments ARE stored in MongoDB (the `Comment` model from Sprint 1), unlike blog post content which is static MDX. `postId` field stores the blog slug as a string reference.

## D8. Blog Search Route Handler

**File:** `src/app/api/blog/search/route.ts`

```ts
import 'server-only'
import { searchPosts } from '@/lib/blog'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  if (q.length < 2) return NextResponse.json([])
  const results = searchPosts(q)
  return NextResponse.json(results.slice(0, 8))
}
```

> No MongoDB needed here — searches static MDX frontmatter only. No cold-start registration required for this specific file.

---

# PART E — INTEGRATION

## E1. Navbar Update

**File:** `src/components/layout/Navbar.tsx` (update existing — do not rebuild)

Add two new nav links between existing items:
- "Projects" → `/projects`
- "Blog" → `/blog`

Keep all existing functionality (ThemeToggle, UserButton, mobile sheet) untouched.

## E2. Landing Page Update

**File:** `src/app/page.tsx` (update existing — do not rebuild)

Add two new sections (insert after the existing `ModulesSection`, before `StatsSection`):

**ProjectsTeaserSection:**
- "Build Real Projects" heading
- 3 featured project cards (Netflix ETL, Spotify Pipeline, Sales Dashboard — pick the most visually appealing 3)
- "View All Projects →" link to `/projects`

**BlogTeaserSection:**
- "Latest from the Blog" heading
- 3 most recent blog post cards
- "Read More →" link to `/blog`

Both sections use the same glassmorphic card style and Framer Motion patterns established in Sprint 1's landing page.

---

## QUALITY RULES

- **TypeScript strict mode** — zero `any`, zero errors
- **All blog pages** are statically generated (`generateStaticParams()`) — zero auth coupling in the RSC layer
- **CommentSection** is the only blog component requiring client-side auth check
- **Project architecture diagrams** are static (no Framer Motion `useState` step logic) — scroll-triggered fade-in only, not interactive playback
- **All new MongoDB-touching files** follow cold-start registration (Rule 2)
- **All new mutations** use bulletproof upsert pattern (Rule 4)
- **Mobile responsive** — project tabs collapse to accordion on `<768px`, blog grid goes single-column
- **Accessible** — semantic HTML, proper heading hierarchy in blog posts, alt text on any images

---

## DO NOT BUILD IN SPRINT 4

- Remaining 9 modules: Linux, Git, DB Fundamentals, Kafka, Airflow, Snowflake, AWS, Azure, GCP (Sprint 5)
- Discussion Forum (Sprint 5)
- Admin dashboard (Sprint 6)
- Blog comment moderation / admin tools (Sprint 6)
- RSS feed generation (optional Sprint 5 polish — `feed` package is installed now for future use)

---

## SPRINT 4 COMPLETION CHECKLIST

When done, verify:

- [ ] `/learn/python` loads with all 20 lessons, lock/unlock works
- [ ] `/learn/spark` loads with all 22 lessons, lock/unlock works
- [ ] Lessons 1, 6, 10, 18 (Python) have full readable MDX content
- [ ] Lessons 1, 2, 10 (Spark) have full readable MDX content
- [ ] `/projects` shows all 7 project cards with correct difficulty badges
- [ ] Each `/projects/[slug]` page renders all 5 tabs correctly
- [ ] `/blog` shows 10 posts, search works, category filters work
- [ ] Each `/blog/[slug]` renders MDX content + comment section
- [ ] Posting a comment requires sign-in and persists to MongoDB
- [ ] Navbar shows Projects + Blog links
- [ ] Landing page shows Projects teaser + Blog teaser sections
- [ ] `npm run build` completes with 0 errors
- [ ] No `auth()` calls inside any `generateStaticParams()` page