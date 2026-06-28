import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { Course } from "../models/Course";
import { Module } from "../models/Module";
import { Lesson } from "../models/Lesson";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const coursesData = [
  { slug: "sql", title: "SQL for Data Engineers", description: "Master SQL from basics to advanced window functions.", icon: "🗄️", level: "beginner", estimatedHours: 8, totalLessons: 24, order: 1 },
  { slug: "python", title: "Python for Data Engineering", description: "Learn Python programming for data processing.", icon: "🐍", level: "beginner", estimatedHours: 10, totalLessons: 20, order: 2 },
  { slug: "linux", title: "Linux & Shell Scripting", description: "Essential command-line skills.", icon: "🐧", level: "beginner", estimatedHours: 5, totalLessons: 15, order: 3 },
  { slug: "git", title: "Git & Version Control", description: "Manage source code efficiently.", icon: "🌿", level: "beginner", estimatedHours: 3, totalLessons: 10, order: 4 },
  { slug: "db-fundamentals", title: "Database Fundamentals", description: "Core concepts of databases.", icon: "📊", level: "beginner", estimatedHours: 6, totalLessons: 18, order: 5 },
  { slug: "data-warehousing", title: "Data Warehousing", description: "Build scalable data warehouses.", icon: "🏛️", level: "intermediate", estimatedHours: 12, totalLessons: 16, order: 6 },
  { slug: "etl", title: "ETL Pipelines", description: "Extract, Transform, and Load patterns.", icon: "⚙️", level: "intermediate", estimatedHours: 14, totalLessons: 14, order: 7 },
  { slug: "elt", title: "ELT & Modern Stack", description: "Modern ELT workflows using dbt.", icon: "🔄", level: "intermediate", estimatedHours: 10, totalLessons: 12, order: 8 },
  { slug: "spark", title: "Apache Spark", description: "Big data processing with PySpark.", icon: "⚡", level: "intermediate", estimatedHours: 15, totalLessons: 22, order: 9 },
  { slug: "kafka", title: "Apache Kafka", description: "Real-time streaming pipelines.", icon: "📨", level: "intermediate", estimatedHours: 12, totalLessons: 18, order: 10 },
  { slug: "airflow", title: "Apache Airflow", description: "Orchestrate data workflows.", icon: "🌊", level: "intermediate", estimatedHours: 10, totalLessons: 16, order: 11 },
  { slug: "snowflake", title: "Snowflake", description: "Cloud data warehousing.", icon: "❄️", level: "advanced", estimatedHours: 15, totalLessons: 20, order: 12 },
  { slug: "aws-de", title: "AWS for Data Engineering", description: "Build pipelines on AWS.", icon: "☁️", level: "advanced", estimatedHours: 20, totalLessons: 24, order: 13 },
  { slug: "azure-de", title: "Azure Data Engineering", description: "Data engineering on Azure.", icon: "🔷", level: "advanced", estimatedHours: 18, totalLessons: 20, order: 14 },
  { slug: "gcp-de", title: "GCP Data Engineering", description: "Data engineering on Google Cloud.", icon: "🌐", level: "advanced", estimatedHours: 16, totalLessons: 18, order: 15 },
];

const sqlLessons = [
  // Section 1
  { slug: "intro", title: "Introduction to SQL & Databases", type: "theory", xp: 10, duration: 15, visualizer: false, order: 1 },
  { slug: "select", title: "SELECT Statement Deep Dive", type: "interactive", xp: 15, duration: 20, visualizer: true, order: 2 },
  { slug: "where", title: "WHERE Clause & Filtering", type: "interactive", xp: 15, duration: 20, visualizer: true, order: 3 },
  { slug: "order-limit", title: "ORDER BY & LIMIT", type: "theory", xp: 10, duration: 10, visualizer: false, order: 4 },
  { slug: "distinct", title: "DISTINCT & NULL Handling", type: "interactive", xp: 10, duration: 15, visualizer: false, order: 5 },
  { slug: "data-types", title: "SQL Data Types", type: "theory", xp: 10, duration: 15, visualizer: false, order: 6 },
  
  // Section 2
  { slug: "aggregations", title: "Aggregate Functions", type: "interactive", xp: 20, duration: 25, visualizer: true, order: 7 },
  { slug: "group-by", title: "GROUP BY Clause", type: "interactive", xp: 20, duration: 25, visualizer: true, order: 8 },
  { slug: "having", title: "HAVING Clause vs WHERE", type: "interactive", xp: 20, duration: 20, visualizer: true, order: 9 },
  { slug: "nested-agg", title: "Nested Aggregations", type: "theory", xp: 15, duration: 15, visualizer: false, order: 10 },
  
  // Section 3
  { slug: "inner-join", title: "INNER JOIN", type: "interactive", xp: 25, duration: 25, visualizer: true, order: 11 },
  { slug: "outer-join", title: "LEFT, RIGHT & FULL OUTER JOIN", type: "interactive", xp: 25, duration: 30, visualizer: true, order: 12 },
  { slug: "self-cross", title: "SELF JOIN & CROSS JOIN", type: "theory", xp: 20, duration: 20, visualizer: false, order: 13 },
  { slug: "multi-join", title: "Multi-table JOINs", type: "exercise", xp: 25, duration: 30, visualizer: false, order: 14 },
  
  // Section 4
  { slug: "subqueries", title: "Subqueries in SELECT & WHERE", type: "interactive", xp: 25, duration: 25, visualizer: true, order: 15 },
  { slug: "correlated", title: "Correlated Subqueries", type: "interactive", xp: 30, duration: 30, visualizer: true, order: 16 },
  { slug: "exists", title: "EXISTS & NOT EXISTS", type: "theory", xp: 20, duration: 20, visualizer: false, order: 17 },
  
  // Section 5
  { slug: "window-rank", title: "Window Functions: ROW_NUMBER, RANK", type: "interactive", xp: 35, duration: 35, visualizer: true, order: 18 },
  { slug: "window-lag", title: "Window Functions: LAG, LEAD", type: "interactive", xp: 35, duration: 30, visualizer: true, order: 19 },
  { slug: "cte", title: "CTEs & Recursive CTEs", type: "interactive", xp: 35, duration: 35, visualizer: true, order: 20 },
  { slug: "views", title: "Views & Materialized Views", type: "theory", xp: 25, duration: 25, visualizer: false, order: 21 },
  { slug: "indexes", title: "Indexes & Query Optimization", type: "theory", xp: 30, duration: 30, visualizer: false, order: 22 },
  
  // Section 6
  { slug: "sql-etl", title: "SQL in ETL Pipelines", type: "theory", xp: 30, duration: 25, visualizer: false, order: 23 },
  { slug: "interview", title: "SQL Interview Master Class", type: "interactive", xp: 40, duration: 45, visualizer: false, order: 24 },
];

const lesson1Content = `
What is SQL?
SQL (Structured Query Language) is the standard language for managing and manipulating relational databases.

Key concepts:
- **Tables**: Collections of related data entries.
- **Rows/Columns**: A table is made of rows (records) and columns (attributes).
- **Primary Keys**: A unique identifier for a row.

<Callout type="tip">SQL is the #1 skill for data engineering roles. Master this, and you are 50% there!</Callout>

Why SQL matters for Data Engineers:
Companies like Netflix use SQL to analyze viewer habits, while Uber uses it to optimize ride routes in real-time.
`;

const lesson2Content = `
## Basic SELECT Syntax

The SELECT statement is used to select data from a database.

<CodeBlock language="sql">
SELECT column1, column2 FROM table_name;
SELECT * FROM employees;
</CodeBlock>

### Column Aliases
Use AS to rename a column in the output:
<CodeBlock language="sql">
SELECT first_name AS "First Name" FROM employees;
</CodeBlock>

<VisualizerEmbed name="SelectVisualizer" />
`;

const lesson3Content = `
## Filtering Data with WHERE

The WHERE clause is used to filter records.

<CodeBlock language="sql">
SELECT * FROM employees WHERE department = 'Engineering';
</CodeBlock>

### Logical Operators
You can combine conditions using AND, OR, and NOT.

<CodeBlock language="sql">
SELECT * FROM employees 
WHERE department = 'Engineering' AND salary > 80000;
</CodeBlock>

<VisualizerEmbed name="WhereVisualizer" />
`;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB.");

    // Clear existing data (optional, be careful in prod!)
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    console.log("Cleared existing courses, modules, and lessons.");

    // Insert Courses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses: any[] = [];
    for (const c of coursesData) {
      const course = await Course.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(c as any),
        published: true,
        coverImage: `/images/courses/${c.slug}.png`
      });
      courses.push(course);
    }
    console.log(`Inserted ${courses.length} courses.`);

    // Get SQL Course
    const sqlCourse = courses.find(c => c.slug === "sql");
    if (!sqlCourse) throw new Error("SQL Course not created");

    // Create Module for SQL
    const sqlModule = await Module.create({
      courseId: sqlCourse._id,
      slug: "sql-fundamentals",
      title: "SQL Fundamentals",
      description: "Master the basics and advanced concepts of SQL.",
      order: 1,
      icon: "🗄️",
      totalLessons: 24,
      estimatedMinutes: 480,
      published: true
    });
    console.log("Created SQL Module.");

    // Insert SQL Lessons
    let lessonOrder = 1;
    for (const lesson of sqlLessons) {
      let content = "More content coming soon...";
      if (lesson.order === 1) content = lesson1Content;
      if (lesson.order === 2) content = lesson2Content;
      if (lesson.order === 3) content = lesson3Content;

      await Lesson.create({
        courseId: sqlCourse._id,
        moduleId: sqlModule._id,
        slug: lesson.slug,
        title: lesson.title,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: lesson.type as any,
        content: content,
        xpReward: lesson.xp,
        order: lesson.order,
        duration: lesson.duration,
        hasVisualizer: lesson.visualizer,
        hasPlayground: lesson.type === "interactive",
        published: true,
      });
      lessonOrder++;
    }
    console.log(`Inserted ${lessonOrder - 1} SQL lessons.`);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
