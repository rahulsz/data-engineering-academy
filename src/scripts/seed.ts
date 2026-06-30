import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { Course } from "../models/Course";
import { Module } from "../models/Module";
import { Lesson } from "../models/Lesson";
import { Challenge } from "../models/Challenge";
import { Flashcard } from "../models/Flashcard";
import { Quiz } from "../models/Quiz";
import { InterviewQuestion } from "../models/InterviewQuestion";
import { Project } from "../models/Project";

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

const sqlChallenges = [
  // Beginner
  { title: "Find All Customers", description: "Retrieve all records from the customers table.", type: "sql", difficulty: "beginner", category: "Select", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM customers;", testCases: [{ input: "SELECT * FROM customers;", expected: "...", hidden: false }], hints: ["Use the SELECT statement.", "Use * to get all columns."], xpReward: 10, tags: ["select"], order: 1 },
  { title: "Customers from USA", description: "Find all customers who are from the USA.", type: "sql", difficulty: "beginner", category: "Where", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM customers WHERE country = 'USA';", testCases: [], hints: ["Use WHERE clause."], xpReward: 10, tags: ["where"], order: 2 },
  { title: "Top 5 Most Expensive Products", description: "List the top 5 most expensive products.", type: "sql", difficulty: "beginner", category: "Order By", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM products ORDER BY price DESC LIMIT 5;", testCases: [], hints: ["Use ORDER BY and LIMIT."], xpReward: 15, tags: ["order-by", "limit"], order: 3 },
  { title: "Count Orders per Status", description: "Count how many orders there are for each status.", type: "sql", difficulty: "beginner", category: "Group By", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT status, COUNT(*) FROM orders GROUP BY status;", testCases: [], hints: ["Use GROUP BY status."], xpReward: 15, tags: ["group-by", "count"], order: 4 },
  { title: "Products Under $50", description: "Find products with a price less than 50.", type: "sql", difficulty: "beginner", category: "Where", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM products WHERE price < 50;", testCases: [], hints: ["Use < operator."], xpReward: 10, tags: ["where"], order: 5 },
  { title: "Customers with Email", description: "Find customers whose email is not null.", type: "sql", difficulty: "beginner", category: "Where", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM customers WHERE email IS NOT NULL;", testCases: [], hints: ["Use IS NOT NULL."], xpReward: 10, tags: ["where", "null"], order: 6 },
  
  // Intermediate
  { title: "Customers and Their Order Count", description: "List customers and their total number of orders.", type: "sql", difficulty: "intermediate", category: "Joins", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT c.name, COUNT(o.id) FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;", testCases: [], hints: ["Use LEFT JOIN and GROUP BY."], xpReward: 25, tags: ["join", "group-by"], order: 7 },
  { title: "Revenue by Category", description: "Calculate total revenue per category.", type: "sql", difficulty: "intermediate", category: "Joins", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT c.name, SUM(oi.price * oi.quantity) FROM categories c JOIN products p ON c.id = p.category_id JOIN order_items oi ON p.id = oi.product_id GROUP BY c.id, c.name;", testCases: [], hints: ["Join categories, products, and order_items."], xpReward: 25, tags: ["join", "sum"], order: 8 },
  { title: "Customers Who Never Ordered", description: "Find customers who have 0 orders.", type: "sql", difficulty: "intermediate", category: "Joins", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT c.* FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;", testCases: [], hints: ["Use LEFT JOIN and check for NULL."], xpReward: 25, tags: ["left-join", "null"], order: 9 },
  { title: "Monthly Revenue", description: "Calculate total revenue by month.", type: "sql", difficulty: "intermediate", category: "Aggregations", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT strftime('%Y-%m', date) as month, SUM(total) FROM orders GROUP BY month;", testCases: [], hints: ["Group by month."], xpReward: 20, tags: ["group-by", "date"], order: 10 },
  { title: "Average Order Value by Country", description: "Calculate average order total per country.", type: "sql", difficulty: "intermediate", category: "Joins", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT c.country, AVG(o.total) FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.country;", testCases: [], hints: ["Use AVG()."], xpReward: 20, tags: ["join", "avg"], order: 11 },
  { title: "Products Never Ordered", description: "Find products that have never been in any order.", type: "sql", difficulty: "intermediate", category: "Subqueries", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM products WHERE id NOT IN (SELECT product_id FROM order_items);", testCases: [], hints: ["Use NOT IN."], xpReward: 25, tags: ["subquery"], order: 12 },
  { title: "Top Customer per Country", description: "Find the customer who spent the most in each country.", type: "sql", difficulty: "intermediate", category: "Window Functions", database: "ecommerce", starterCode: "-- Your code here\n", solution: "WITH Ranked AS (SELECT c.id, c.name, c.country, SUM(o.total) as total, ROW_NUMBER() OVER(PARTITION BY c.country ORDER BY SUM(o.total) DESC) as rn FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id) SELECT * FROM Ranked WHERE rn = 1;", testCases: [], hints: ["Use ROW_NUMBER()."], xpReward: 30, tags: ["window", "cte"], order: 13 },
  { title: "Orders Above Average Value", description: "Find orders whose total is above the overall average.", type: "sql", difficulty: "intermediate", category: "Subqueries", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT * FROM orders WHERE total > (SELECT AVG(total) FROM orders);", testCases: [], hints: ["Use a scalar subquery in WHERE."], xpReward: 25, tags: ["subquery"], order: 14 },
  
  // Advanced
  { title: "Rank Customers by Spend", description: "Rank all customers by total spent.", type: "sql", difficulty: "advanced", category: "Window Functions", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT c.name, SUM(o.total) as spend, DENSE_RANK() OVER(ORDER BY SUM(o.total) DESC) as rank FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id;", testCases: [], hints: ["Use DENSE_RANK()."], xpReward: 35, tags: ["window", "rank"], order: 15 },
  { title: "Running Total of Revenue", description: "Calculate running total of revenue over time.", type: "sql", difficulty: "advanced", category: "Window Functions", database: "ecommerce", starterCode: "-- Your code here\n", solution: "SELECT date, total, SUM(total) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) as running_total FROM orders;", testCases: [], hints: ["Use SUM OVER ROWS UNBOUNDED PRECEDING."], xpReward: 35, tags: ["window"], order: 16 },
  { title: "Month-over-Month Growth", description: "Calculate revenue difference from previous month.", type: "sql", difficulty: "advanced", category: "Window Functions", database: "ecommerce", starterCode: "-- Your code here\n", solution: "WITH Monthly AS (SELECT strftime('%Y-%m', date) as m, SUM(total) as rev FROM orders GROUP BY m) SELECT m, rev, LAG(rev) OVER(ORDER BY m) as prev, rev - LAG(rev) OVER(ORDER BY m) as growth FROM Monthly;", testCases: [], hints: ["Use LAG()."], xpReward: 40, tags: ["window", "lag"], order: 17 },
  { title: "Employee Hierarchy", description: "Traverse the organization chart.", type: "sql", difficulty: "advanced", category: "CTEs", database: "hr", starterCode: "-- Your code here\n", solution: "WITH RECURSIVE org AS (SELECT id, name, manager_id, 1 as level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.manager_id, o.level + 1 FROM employees e JOIN org o ON e.manager_id = o.id) SELECT * FROM org;", testCases: [], hints: ["Use WITH RECURSIVE."], xpReward: 45, tags: ["recursive", "cte"], order: 18 },
  { title: "Salespeople Above Dept Average", description: "Find salespeople earning above their department average.", type: "sql", difficulty: "advanced", category: "Subqueries", database: "hr", starterCode: "-- Your code here\n", solution: "SELECT e1.* FROM employees e1 WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e1.department_id = e2.department_id);", testCases: [], hints: ["Use a correlated subquery."], xpReward: 35, tags: ["correlated"], order: 19 },
  { title: "Top 3 Products per Category", description: "Find the top 3 most expensive products in each category.", type: "sql", difficulty: "advanced", category: "Window Functions", database: "ecommerce", starterCode: "-- Your code here\n", solution: "WITH Ranked AS (SELECT *, ROW_NUMBER() OVER(PARTITION BY category_id ORDER BY price DESC) as rn FROM products) SELECT * FROM Ranked WHERE rn <= 3;", testCases: [], hints: ["Use ROW_NUMBER and PARTITION BY."], xpReward: 35, tags: ["window"], order: 20 },
];

const sqlFlashcards = [
  { front: "What does SELECT * do?", back: "Returns all columns. Avoid in production — always specify columns.", difficulty: "easy", tags: ["select"], order: 1 },
  { front: "INNER JOIN returns...", back: "Only rows where the join condition matches in BOTH tables.", difficulty: "easy", tags: ["joins"], order: 2 },
  { front: "LEFT JOIN returns...", back: "All rows from left table + matching rows from right. NULL if no match.", difficulty: "easy", tags: ["joins"], order: 3 },
  { front: "Difference: WHERE vs HAVING", back: "WHERE filters rows before grouping. HAVING filters groups after aggregation.", difficulty: "medium", tags: ["filtering"], order: 4 },
  { front: "What is a CTE?", back: "Common Table Expression. A named temporary result using WITH clause.", difficulty: "medium", tags: ["cte"], order: 5 },
  { front: "What does DISTINCT do?", back: "Removes duplicate rows from result set.", difficulty: "easy", tags: ["select"], order: 6 },
  { front: "SQL Execution Order (6 steps)", back: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY/LIMIT", difficulty: "hard", tags: ["theory"], order: 7 },
  { front: "What is a correlated subquery?", back: "A subquery that references columns from the outer query. Runs once per outer row.", difficulty: "hard", tags: ["subquery"], order: 8 },
  { front: "ROW_NUMBER vs RANK", back: "ROW_NUMBER always unique. RANK gives same number to ties, skips next rank.", difficulty: "medium", tags: ["window"], order: 9 },
  { front: "DENSE_RANK vs RANK", back: "DENSE_RANK gives same number to ties but does NOT skip next rank.", difficulty: "medium", tags: ["window"], order: 10 },
  { front: "What is NULL in SQL?", back: "Absence of value. NULL ≠ 0 ≠ ''. Use IS NULL / IS NOT NULL.", difficulty: "easy", tags: ["theory"], order: 11 },
  { front: "CROSS JOIN produces...", back: "Cartesian product — every row of table A × every row of table B.", difficulty: "medium", tags: ["joins"], order: 12 },
  { front: "What is a subquery?", back: "A query nested inside another query. Executes first.", difficulty: "easy", tags: ["subquery"], order: 13 },
  { front: "What does GROUP BY do?", back: "Groups rows with same values. Used with aggregate functions.", difficulty: "easy", tags: ["group-by"], order: 14 },
  { front: "What is PARTITION BY?", back: "Used in window functions to divide rows into groups without collapsing them.", difficulty: "medium", tags: ["window"], order: 15 },
  { front: "LAG() does what?", back: "Returns value from previous row in window partition.", difficulty: "hard", tags: ["window"], order: 16 },
  { front: "LEAD() does what?", back: "Returns value from next row in window partition.", difficulty: "hard", tags: ["window"], order: 17 },
  { front: "What is a View?", back: "A saved SQL query stored as a virtual table. Doesn't store data (unless materialized).", difficulty: "medium", tags: ["views"], order: 18 },
  { front: "What is an Index?", back: "Data structure that speeds up SELECT queries. Slows INSERT/UPDATE.", difficulty: "hard", tags: ["performance"], order: 19 },
  { front: "EXPLAIN shows what?", back: "Query execution plan — how the DB will retrieve data. Used for optimization.", difficulty: "hard", tags: ["performance"], order: 20 },
];

const sqlQuizQuestions = [
  { question: "What is the correct SQL execution order?", options: ["SELECT → FROM → WHERE", "FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY", "WHERE → FROM → SELECT", "FROM → SELECT → WHERE"], correct: 1, explanation: "SQL executes FROM and JOINs first, filters with WHERE, groups, filters groups with HAVING, then SELECTs and orders.", difficulty: "medium", points: 10 },
  { question: "Which JOIN returns all rows from the left table?", options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "CROSS JOIN"], correct: 2, explanation: "LEFT JOIN preserves all rows from the left table.", difficulty: "easy", points: 10 },
  { question: "HAVING clause filters...", options: ["Rows before grouping", "Groups after aggregation", "Columns", "Tables"], correct: 1, explanation: "HAVING operates on aggregated groups.", difficulty: "medium", points: 10 },
  { question: "RANK() for values 100, 100, 90, 80 returns...", options: ["1, 2, 3, 4", "1, 1, 2, 3", "1, 1, 3, 4", "1, 1, 1, 1"], correct: 2, explanation: "RANK skips the next number after a tie.", difficulty: "hard", points: 10 },
  { question: "A correlated subquery...", options: ["Runs completely independently", "References outer query columns", "Is faster than a JOIN", "Cannot be used in SELECT"], correct: 1, explanation: "It references the outer query and executes once per row.", difficulty: "hard", points: 10 },
  { question: "SELECT COUNT(*) counts...", options: ["Only NOT NULL values", "All rows including NULLs", "Only distinct values", "None of the above"], correct: 1, explanation: "COUNT(*) counts the physical rows regardless of NULLs.", difficulty: "medium", points: 10 },
  { question: "CTE stands for...", options: ["Common Table Expression", "Centralized Table Entity", "Cross Table Execution", "Calculated Table Extractor"], correct: 0, explanation: "CTE = Common Table Expression (WITH clause).", difficulty: "easy", points: 10 },
  { question: "NULL = NULL evaluates to...", options: ["TRUE", "FALSE", "NULL", "ERROR"], correct: 2, explanation: "NULL comparisons always result in NULL (unknown). Use IS NULL.", difficulty: "medium", points: 10 },
  { question: "DENSE_RANK for values 100, 100, 90, 80 returns...", options: ["1, 2, 3, 4", "1, 1, 2, 3", "1, 1, 3, 4", "None"], correct: 1, explanation: "DENSE_RANK does not skip ranks after a tie.", difficulty: "hard", points: 10 },
  { question: "Window functions require...", options: ["GROUP BY clause", "OVER() clause", "HAVING clause", "JOIN clause"], correct: 1, explanation: "Window functions must have an OVER() clause.", difficulty: "medium", points: 10 },
];

const interviewQuestions = [
  // SQL
  { topic: "SQL", subtopic: "Filtering", question: "Explain the difference between WHERE and HAVING", answer: "WHERE filters rows before aggregation. HAVING filters groups after aggregation.", difficulty: "easy", type: "conceptual", company: [], tags: ["filtering"], order: 1 },
  { topic: "SQL", subtopic: "Subqueries", question: "Write a query to find the second highest salary", answer: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);", difficulty: "medium", type: "coding", company: ["Amazon", "Google"], tags: ["subquery", "max"], order: 2 },
  { topic: "SQL", subtopic: "Performance", question: "What is the N+1 query problem?", answer: "Fetching a list of N items, then running an additional query for each item (N queries), totaling N+1 queries. Solved by JOINs or eager loading.", difficulty: "medium", type: "scenario", company: [], tags: ["performance", "orm"], order: 3 },
  { topic: "SQL", subtopic: "Theory", question: "Explain ACID properties in databases", answer: "Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safe), Durability (saved permanently).", difficulty: "hard", type: "conceptual", company: ["Meta", "Google"], tags: ["acid", "transactions"], order: 4 },
  { topic: "SQL", subtopic: "Performance", question: "How would you optimize a slow query?", answer: "Check EXPLAIN plan, add indexes, avoid SELECT *, rewrite correlated subqueries to JOINs, filter early.", difficulty: "hard", type: "scenario", company: ["all"], tags: ["optimization"], order: 5 },
  { topic: "SQL", subtopic: "Performance", question: "What is a query execution plan?", answer: "The sequence of operations the database engine performs to execute a query.", difficulty: "medium", type: "conceptual", company: [], tags: ["explain"], order: 6 },
  { topic: "SQL", subtopic: "Window Functions", question: "Difference between RANK, DENSE_RANK, ROW_NUMBER", answer: "ROW_NUMBER is strictly sequential. RANK ties get same number but skips next. DENSE_RANK ties get same but doesn't skip.", difficulty: "medium", type: "conceptual", company: ["Uber"], tags: ["window"], order: 7 },
  { topic: "SQL", subtopic: "CTEs", question: "Write a recursive CTE to traverse org hierarchy", answer: "WITH RECURSIVE org AS (SELECT id, manager_id FROM emp WHERE manager_id IS NULL UNION ALL SELECT e.id, e.manager_id FROM emp e JOIN org o ON e.manager_id = o.id) SELECT * FROM org;", difficulty: "hard", type: "coding", company: ["Meta"], tags: ["recursive", "cte"], order: 8 },
  { topic: "SQL", subtopic: "Architecture", question: "CTE vs subquery vs temp table — when to use each?", answer: "CTE for readability and recursion. Temp table for heavy intermediate processing (reused). Subquery for simple inline filters.", difficulty: "hard", type: "scenario", company: [], tags: ["cte", "subquery"], order: 9 },
  { topic: "SQL", subtopic: "Indexes", question: "How do indexes work and when NOT to use them?", answer: "B-trees speed up lookups. Do not use on highly volatile tables (frequent inserts/updates) or low cardinality columns.", difficulty: "hard", type: "conceptual", company: ["Netflix"], tags: ["indexes"], order: 10 },
  
  // Python
  { topic: "Python", subtopic: "Core", question: "Difference between list and generator", answer: "Lists hold all items in memory. Generators compute items lazily on the fly (yield).", difficulty: "easy", type: "conceptual", company: [], tags: ["generators"], order: 11 },
  { topic: "Python", subtopic: "Pandas", question: "How does Pandas handle missing data?", answer: "NaN values. Methods: isna(), dropna(), fillna() for imputation.", difficulty: "medium", type: "conceptual", company: [], tags: ["pandas", "nulls"], order: 12 },
  { topic: "Python", subtopic: "Functional", question: "Explain map(), filter(), reduce()", answer: "map applies func to all, filter keeps if func returns True, reduce aggregates to single value.", difficulty: "easy", type: "conceptual", company: ["Amazon"], tags: ["functional"], order: 13 },
  { topic: "Python", subtopic: "Data", question: "Process a 10GB CSV with limited RAM", answer: "Use chunksize in pandas.read_csv(), process chunks sequentially, or use Dask/PySpark.", difficulty: "hard", type: "scenario", company: ["Uber"], tags: ["bigdata"], order: 14 },
  { topic: "Python", subtopic: "Concurrency", question: "What is the GIL in Python?", answer: "Global Interpreter Lock. Prevents multiple native threads from executing Python bytecodes at once.", difficulty: "hard", type: "conceptual", company: ["Google"], tags: ["concurrency"], order: 15 },
  
  // Spark
  { topic: "Spark", subtopic: "Core", question: "RDD vs DataFrame vs Dataset", answer: "RDD is low-level, unoptimized. DataFrame is optimized with Catalyst, untyped. Dataset is typed DataFrame (Scala/Java only).", difficulty: "medium", type: "conceptual", company: [], tags: ["rdd", "dataframe"], order: 16 },
  { topic: "Spark", subtopic: "Core", question: "Explain lazy evaluation in Spark", answer: "Transformations aren't executed until an action (like count, collect) is called. Allows DAG optimization.", difficulty: "medium", type: "conceptual", company: ["Netflix"], tags: ["lazy", "dag"], order: 17 },
  { topic: "Spark", subtopic: "Performance", question: "What causes a shuffle? How to minimize it?", answer: "Caused by wide transformations (groupBy, join). Minimize by broadcasting small tables, pre-partitioning.", difficulty: "hard", type: "conceptual", company: ["Uber"], tags: ["shuffle"], order: 18 },
  { topic: "Spark", subtopic: "Architecture", question: "Spark execution model (DAG, stages, tasks)", answer: "Job -> DAG -> Split into Stages (by shuffles) -> Split into Tasks (by partitions). Executed by workers.", difficulty: "hard", type: "conceptual", company: ["Meta"], tags: ["architecture"], order: 19 },
  { topic: "Spark", subtopic: "Performance", question: "How to handle skewed data in Spark?", answer: "Salting (adding random prefix to keys to distribute evenly), broadcast joins, custom partitioning.", difficulty: "hard", type: "scenario", company: ["Amazon"], tags: ["skew", "optimization"], order: 20 },
  
  // Kafka
  { topic: "Kafka", subtopic: "Core", question: "What is a consumer group?", answer: "A group of consumers sharing a group id. Each partition is read by exactly one consumer in the group, enabling parallel processing.", difficulty: "easy", type: "conceptual", company: [], tags: ["consumer-group"], order: 21 },
  { topic: "Kafka", subtopic: "Architecture", question: "Kafka delivery guarantees", answer: "At most once (fire and forget), At least once (ack all, may duplicate), Exactly once (transactional).", difficulty: "medium", type: "conceptual", company: [], tags: ["guarantees"], order: 22 },
  { topic: "Kafka", subtopic: "Scenario", question: "How to handle duplicate messages?", answer: "Idempotent consumers (upserts, unique keys in DB), or Kafka exactly-once semantics.", difficulty: "hard", type: "scenario", company: ["Uber"], tags: ["duplicates"], order: 23 },
  { topic: "Kafka", subtopic: "Architecture", question: "What is partition rebalancing?", answer: "When consumers join/leave, Kafka redistributes partitions among remaining consumers.", difficulty: "medium", type: "conceptual", company: ["Netflix"], tags: ["rebalance"], order: 24 },
  { topic: "Kafka", subtopic: "Architecture", question: "Ensure message ordering in Kafka", answer: "Order is only guaranteed WITHIN a single partition. Send related messages to same partition using a key.", difficulty: "hard", type: "conceptual", company: [], tags: ["ordering"], order: 25 },
  
  // Airflow
  { topic: "Airflow", subtopic: "Core", question: "What is a DAG in Airflow?", answer: "Directed Acyclic Graph. A collection of tasks with defined dependencies, running on a schedule.", difficulty: "easy", type: "conceptual", company: [], tags: ["dag"], order: 26 },
  { topic: "Airflow", subtopic: "Core", question: "BashOperator vs PythonOperator", answer: "Bash executes shell commands. Python executes Python callable functions.", difficulty: "easy", type: "conceptual", company: [], tags: ["operators"], order: 27 },
  { topic: "Airflow", subtopic: "Scenario", question: "Handle task failures in Airflow", answer: "Use retries, email_on_failure, trigger_rules (e.g., all_done, one_failed).", difficulty: "medium", type: "scenario", company: [], tags: ["failures"], order: 28 },
  { topic: "Airflow", subtopic: "Core", question: "What is XCom in Airflow?", answer: "Cross-Communication. Allows tasks to exchange small amounts of data/metadata.", difficulty: "medium", type: "conceptual", company: ["Uber"], tags: ["xcom"], order: 29 },
  { topic: "Airflow", subtopic: "Architecture", question: "Scale Airflow for 1000+ DAGs", answer: "Use CeleryExecutor or KubernetesExecutor. Separate webserver/scheduler. Optimize DAG parsing time.", difficulty: "hard", type: "scenario", company: ["Netflix"], tags: ["scaling"], order: 30 }
];



const pythonLessons = [
  // Section 1
  { slug: "python-intro", title: "Introduction to Python for Data Engineering", type: "theory", xp: 10, duration: 5, visualizer: false, order: 1 },
  { slug: "variables-types", title: "Variables, Data Types & Type Hints", type: "theory", xp: 10, duration: 5, visualizer: false, order: 2 },
  { slug: "control-flow", title: "Control Flow: if/else, loops", type: "interactive", xp: 15, duration: 10, visualizer: false, order: 3 },
  { slug: "functions", title: "Functions & Lambda Expressions", type: "interactive", xp: 15, duration: 10, visualizer: false, order: 4 },
  { slug: "data-structures", title: "Lists, Dicts, Tuples & Sets", type: "interactive", xp: 15, duration: 10, visualizer: false, order: 5 },
  // Section 2
  { slug: "file-io", title: "Reading & Writing Files (CSV, JSON, TXT)", type: "interactive", xp: 20, duration: 10, visualizer: false, order: 6 },
  { slug: "error-handling", title: "Exception Handling & Try/Except", type: "theory", xp: 15, duration: 5, visualizer: false, order: 7 },
  { slug: "working-with-apis", title: "Working with REST APIs (requests library)", type: "interactive", xp: 20, duration: 10, visualizer: false, order: 8 },
  { slug: "regex-basics", title: "Regular Expressions for Data Cleaning", type: "interactive", xp: 20, duration: 10, visualizer: false, order: 9 },
  // Section 3
  { slug: "pandas-intro", title: "Introduction to Pandas & DataFrames", type: "interactive", xp: 25, duration: 10, visualizer: true, order: 10 },
  { slug: "pandas-selection", title: "Selecting & Filtering Data", type: "interactive", xp: 25, duration: 10, visualizer: false, order: 11 },
  { slug: "pandas-groupby", title: "GroupBy & Aggregation in Pandas", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 12 },
  { slug: "pandas-merge", title: "Merging & Joining DataFrames", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 13 },
  { slug: "pandas-cleaning", title: "Data Cleaning: Nulls, Duplicates, Types", type: "interactive", xp: 25, duration: 10, visualizer: false, order: 14 },
  // Section 4
  { slug: "list-comprehensions", title: "List Comprehensions & Generators", type: "interactive", xp: 20, duration: 10, visualizer: false, order: 15 },
  { slug: "decorators", title: "Decorators for Pipeline Logging", type: "theory", xp: 25, duration: 5, visualizer: false, order: 16 },
  { slug: "context-managers", title: "Context Managers (with statement)", type: "theory", xp: 20, duration: 5, visualizer: false, order: 17 },
  // Section 5
  { slug: "python-etl", title: "Building an ETL Script in Python", type: "exercise", xp: 35, duration: 15, visualizer: false, order: 18 },
  { slug: "multiprocessing", title: "Parallel Processing for Large Datasets", type: "theory", xp: 30, duration: 5, visualizer: false, order: 19 },
  { slug: "python-interview", title: "Python Interview Master Class", type: "interactive", xp: 40, duration: 10, visualizer: false, order: 20 },
];

const pythonLesson1Content = `
# Introduction to Python for Data Engineering

Why Python dominates data engineering (vs Java/Scala):
Python is incredibly versatile and has a massive ecosystem of libraries tailored for data. While Java and Scala are often used for heavy JVM-based frameworks like Spark, Python has become the lingua franca for data engineering due to its ease of use.

The data engineering Python stack:
- **Pandas**: For in-memory data manipulation.
- **PySpark**: For distributed big data processing.
- **Airflow**: For orchestrating data pipelines.
- **dbt**: For SQL-based data transformations.

Real examples:
- **Airbnb** uses Python for Airflow to manage thousands of daily pipelines.
- **Spotify** uses Python extensively for their data processing and machine learning workflows.

<Callout type="tip">Python's readability makes it the default choice for ETL scripts and orchestration logic</Callout>
`;

const pythonLesson6Content = `
# Reading & Writing Files

Working with files is a core data engineering skill.

Reading CSV with built-in \`csv\` module vs Pandas:
<CodeBlock language="python">
{\`import csv
with open('data.csv', mode='r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)\`}
</CodeBlock>

Pandas is much easier for tabular data:
<CodeBlock language="python">
{\`import pandas as pd
df = pd.read_csv('data.csv')
print(df.head())\`}
</CodeBlock>

Reading/writing JSON:
<CodeBlock language="python">
{\`import json
# Write JSON
with open('data.json', 'w') as f:
    json.dump({'name': 'Data', 'type': 'JSON'}, f)

# Read JSON
with open('data.json', 'r') as f:
    data = json.load(f)\`}
</CodeBlock>

Working with file paths using \`pathlib\`:
<CodeBlock language="python">
{\`from pathlib import Path
path = Path('data.csv')
if path.exists():
    print("File found!")\`}
</CodeBlock>

Common pitfalls:
- Encoding issues: Always use \`encoding='utf-8'\` when opening text files.
- Large file handling: Do not read a 10GB file into memory using \`.read()\`. Iterate line by line.
`;

const pythonLesson10Content = `
# Introduction to Pandas & DataFrames

What is a DataFrame?
Conceptually, a DataFrame is a 2-dimensional labeled data structure with columns of potentially different types. You can think of it like a spreadsheet or SQL table.

Creating DataFrames from dicts, lists, CSV:
<CodeBlock language="python">
{\`import pandas as pd

# From a dict
data = {'Name': ['Tom', 'nick', 'krish', 'jack'], 'Age': [20, 21, 19, 18]}
df = pd.DataFrame(data)

# From CSV
df_csv = pd.read_csv('sales.csv')\`}
</CodeBlock>

Exploring data:
- \`.head()\`: View first 5 rows
- \`.info()\`: View schema and null counts
- \`.describe()\`: Summary statistics
- \`.shape\`: Tuple representing (rows, columns)

Series vs DataFrame:
A Series is a single column. A DataFrame is a collection of Series.

<VisualizerEmbed name="PandasIntro" />
`;

const pythonLesson18Content = `
# Building an ETL Script in Python

Here is a full worked example of an Extract, Transform, Load script. We extract from a CSV, transform the data using Pandas, and load it into a new CSV.

<CodeBlock language="python">
{\`import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)

def extract(file_path):
    logging.info(f"Extracting data from {file_path}")
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        logging.error(f"Failed to extract: {e}")
        raise

def transform(df):
    logging.info("Transforming data")
    # Clean nulls
    df = df.dropna()
    # Type casting
    df['price'] = pd.to_numeric(df['price'])
    # Derive new column
    df['total'] = df['price'] * df['quantity']
    return df

def load(df, output_path):
    logging.info(f"Loading data to {output_path}")
    try:
        df.to_csv(output_path, index=False)
    except Exception as e:
        logging.error(f"Failed to load: {e}")
        raise

if __name__ == "__main__":
    df = extract("raw_sales.csv")
    df_transformed = transform(df)
    load(df_transformed, "clean_sales.csv")\`}
</CodeBlock>

Error handling and logging are crucial in production ETL scripts!

Exercise: Modify this script to handle a JSON source instead.
`;



const sparkLessons = [
  // Section 1
  { slug: "spark-intro", title: "What is Apache Spark?", type: "theory", xp: 15, duration: 5, visualizer: false, order: 1 },
  { slug: "spark-architecture", title: "Spark Architecture: Driver, Executors, Cluster Manager", type: "interactive", xp: 25, duration: 10, visualizer: true, order: 2 },
  { slug: "rdd-basics", title: "RDDs: Resilient Distributed Datasets", type: "interactive", xp: 25, duration: 10, visualizer: false, order: 3 },
  { slug: "spark-setup", title: "Setting Up a Spark Environment", type: "theory", xp: 15, duration: 5, visualizer: false, order: 4 },
  // Section 2
  { slug: "spark-dataframes", title: "Spark DataFrames", type: "interactive", xp: 25, duration: 10, visualizer: false, order: 5 },
  { slug: "dataframe-operations", title: "DataFrame Operations: select, filter, withColumn", type: "interactive", xp: 25, duration: 10, visualizer: false, order: 6 },
  { slug: "spark-sql", title: "Spark SQL & Temp Views", type: "interactive", xp: 25, duration: 10, visualizer: false, order: 7 },
  { slug: "spark-joins", title: "Joins in Spark", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 8 },
  { slug: "spark-aggregations", title: "Aggregations & GroupBy in Spark", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 9 },
  // Section 3
  { slug: "lazy-evaluation", title: "Lazy Evaluation & Transformations vs Actions", type: "theory", xp: 25, duration: 5, visualizer: false, order: 10 },
  { slug: "spark-dag", title: "DAG, Stages & Tasks", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 11 },
  { slug: "partitioning", title: "Partitioning Strategies", type: "theory", xp: 30, duration: 5, visualizer: false, order: 12 },
  { slug: "shuffling", title: "Understanding Shuffle Operations", type: "interactive", xp: 35, duration: 10, visualizer: false, order: 13 },
  // Section 4
  { slug: "spark-caching", title: "Caching & Persistence", type: "theory", xp: 25, duration: 5, visualizer: false, order: 14 },
  { slug: "broadcast-joins", title: "Broadcast Joins for Performance", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 15 },
  { slug: "data-skew", title: "Handling Data Skew", type: "theory", xp: 30, duration: 5, visualizer: false, order: 16 },
  { slug: "spark-tuning", title: "Spark Configuration & Tuning Basics", type: "theory", xp: 30, duration: 5, visualizer: false, order: 17 },
  // Section 5
  { slug: "spark-streaming-intro", title: "Intro to Spark Structured Streaming", type: "theory", xp: 30, duration: 5, visualizer: false, order: 18 },
  { slug: "spark-with-airflow", title: "Orchestrating Spark Jobs with Airflow", type: "theory", xp: 25, duration: 5, visualizer: false, order: 19 },
  { slug: "reading-writing-formats", title: "Reading/Writing Parquet, Avro, Delta", type: "interactive", xp: 30, duration: 10, visualizer: false, order: 20 },
  // Section 6
  { slug: "spark-etl-project", title: "Mini ETL Project with PySpark", type: "exercise", xp: 40, duration: 15, visualizer: false, order: 21 },
  { slug: "spark-interview", title: "Spark Interview Master Class", type: "interactive", xp: 40, duration: 10, visualizer: false, order: 22 },
];

const sparkLesson1Content = `
# What is Apache Spark?

Spark vs Hadoop MapReduce (why Spark won):
Historically, Hadoop MapReduce was the standard for big data processing. However, it involved writing data to disk after every step, which was incredibly slow. Spark introduced **in-memory processing**, meaning it keeps data in RAM across operations, making it up to 100x faster for certain workloads.

Spark's unified engine:
Spark isn't just one thing. It's a unified engine that supports:
- **Batch Processing** (Core/DataFrames)
- **Streaming** (Structured Streaming)
- **Machine Learning** (MLlib)
- **SQL** (Spark SQL)

Real examples:
- **Netflix** processes recommendation data with Spark to handle petabytes of viewing history.
- **Uber** uses Spark for trip data aggregation and real-time analytics.

<Callout type="info">Spark can be 100x faster than MapReduce for in-memory operations</Callout>
`;

const sparkLesson2Content = `
# Spark Architecture

Understanding how Spark runs under the hood is critical for data engineers.

Core components:
- **Driver Program**: The process running your \`main()\` function. It creates the \`SparkContext\` and converts your code into a DAG.
- **Cluster Manager**: Allocates resources across the cluster (e.g., YARN, Kubernetes, Standalone).
- **Worker Nodes**: The machines that actually run the tasks.
- **Executors**: Processes launched on Worker Nodes that run tasks and keep data in memory or on disk.

How a job gets distributed:
When you call an action (like \`.collect()\`), the Driver translates your code into a physical execution plan, splits it into stages and tasks, and sends those tasks to the Executors. The Executors run the code on their chunk of the data (partitions) and report back.

<VisualizerEmbed name="SparkArch" />

The diagram above shows the relationship between the Driver, Cluster Manager, and multiple Executors across Worker Nodes. Notice how each Executor handles multiple Tasks simultaneously!
`;

const sparkLesson10Content = `
# Lazy Evaluation

Lazy evaluation is one of Spark's most important concepts.

Transformations vs Actions:
- **Transformations (Lazy)**: Operations like \`.map()\`, \`.filter()\`, or \`.join()\`. When you call these, Spark does **not** execute them immediately. It just builds a lineage graph (DAG) of the operations.
- **Actions (Eager)**: Operations like \`.collect()\`, \`.count()\`, or \`.write()\`. When you call an action, Spark finally executes the entire DAG to compute the result.

Why lazy evaluation matters:
It allows Spark to optimize the execution plan. For example, if you filter a dataset and then join it, Spark can optimize the plan to push the filter down to the data source (Predicate Pushdown), reading only the necessary data into memory.

Code example:
<CodeBlock language="python">
{\`# Transformations (Lazy) - Nothing runs yet!
rdd = sc.textFile("data.csv")
filtered_rdd = rdd.filter(lambda x: "ERROR" in x)
mapped_rdd = filtered_rdd.map(lambda x: x.split(","))

# Action (Eager) - Now Spark executes the DAG!
errors_count = mapped_rdd.count()
print(f"Found {errors_count} errors")\`}
</CodeBlock>

Common confusion: "Why didn't my code run yet?"
If you write a complex PySpark script full of transformations and it finishes in 0.01 seconds, it's because you didn't call an Action! The data hasn't been processed yet.
`;


const projectsData = [
  {
    slug: "netflix-etl-pipeline",
    title: "Netflix-Style Content ETL Pipeline",
    difficulty: "intermediate",
    stack: ["Python", "Pandas", "PostgreSQL", "Airflow", "Docker"],
    estimatedHours: 6,
    coverImage: "🎬",
    overview: "Build an ETL pipeline that ingests raw viewing data (CSV), cleans and transforms it, and loads it into a PostgreSQL warehouse — simulating how Netflix processes viewing event data for analytics.",
    architecture: `Raw CSV Files (viewing_events.csv)
↓
Extract (Python script reads CSV in chunks)
↓
Transform (Pandas: dedupe, type casting, derive watch_duration_minutes)
↓
Load (psycopg2 batch insert into PostgreSQL)
↓
PostgreSQL Warehouse (fact_viewing_events table)
↓
Airflow DAG (orchestrates daily run)`,
    folderStructure: `netflix-etl-pipeline/
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
└── requirements.txt`,
    implementationGuide: `
# Netflix-Style ETL Implementation Guide

1. **Set up PostgreSQL with Docker Compose**
   Create a \`docker-compose.yml\` with a Postgres image.

2. **Write the extract script**
   Read the CSV in chunks to avoid memory issues with large files.
   <CodeBlock language="python">
   {\`import pandas as pd
   chunks = pd.read_csv('data.csv', chunksize=10000)\`}
   </CodeBlock>

3. **Write the transform script**
   Clean the data with Pandas (deduplication, casting).

4. **Write the load script**
   Use psycopg2 \`execute_batch\` for efficient bulk inserts.

5. **Build the Airflow DAG**
   Create a PythonOperator for each stage (Extract, Transform, Load) and define dependencies \`extract >> transform >> load\`.
    `,
    learningOutcomes: ["Building idempotent ETL scripts", "Chunked processing for large files", "Airflow DAG authoring", "PostgreSQL bulk insert patterns"],
    prerequisites: ["Python module", "SQL module", "Airflow basics"]
  },
  {
    slug: "spotify-data-pipeline",
    title: "Spotify-Style Listening Analytics Pipeline",
    difficulty: "intermediate",
    stack: ["Python", "Apache Kafka", "Spark Streaming", "MongoDB"],
    estimatedHours: 8,
    coverImage: "🎧",
    overview: "Simulate a real-time listening event pipeline — producer generates 'song played' events, Kafka streams them, Spark Structured Streaming aggregates listens per artist in near real-time, results land in MongoDB.",
    architecture: `Event Producer (Python script simulates user listens)
↓
Kafka Topic: listening-events
↓
Spark Structured Streaming (consumes, windows by 1-minute, aggregates by artist)
↓
MongoDB (real-time artist_play_counts collection)
↓
Dashboard (simple Flask/Streamlit view of top artists)`,
    folderStructure: `spotify-data-pipeline/
├── producer/
│   └── event_generator.py
├── streaming/
│   └── spark_consumer.py
├── sink/
│   └── mongo_writer.py
├── dashboard/
│   └── app.py
├── docker-compose.yml (Kafka + Zookeeper + MongoDB)
└── requirements.txt`,
    implementationGuide: `
# Spotify-Style Pipeline Guide

Set up a streaming architecture using Kafka and Spark.
1. Use a Python producer to send JSON events to a Kafka topic.
2. Build a Spark Structured Streaming job to read from Kafka.
3. Apply a tumbling window aggregation on the 'artist' field.
4. Write the aggregated results to MongoDB using the \`foreachBatch\` sink.
    `,
    learningOutcomes: ["Event-driven architecture", "Kafka producer/consumer patterns", "Spark Structured Streaming windowing", "Real-time aggregation patterns"],
    prerequisites: ["Spark module", "Kafka fundamentals"]
  },
  {
    slug: "uber-analytics-pipeline",
    title: "Uber-Style Trip Analytics Pipeline",
    difficulty: "advanced",
    stack: ["PySpark", "Apache Airflow", "Snowflake", "dbt"],
    estimatedHours: 10,
    coverImage: "🚗",
    overview: "Batch pipeline processing daily trip data — calculating surge pricing zones, driver utilization, and trip patterns. Demonstrates a full modern data stack (ELT pattern with dbt transformations on Snowflake).",
    architecture: `Raw Trip Data (Parquet files, partitioned by date)
↓
PySpark (Extract + Load raw data to Snowflake staging)
↓
Snowflake (raw_trips table)
↓
dbt models (staging → intermediate → marts)
↓
Snowflake (fct_trips, dim_drivers, agg_surge_zones)
↓
Airflow (orchestrates: Spark job → dbt run → dbt test)`,
    folderStructure: `uber-analytics-pipeline/
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
└── data/sample_trips.parquet`,
    implementationGuide: `
# Uber-Style ELT Pipeline

This project implements the modern ELT (Extract, Load, Transform) pattern.
Instead of transforming data in Spark before loading, we load raw data into Snowflake and use **dbt (data build tool)** to execute SQL transformations entirely within the warehouse.
    `,
    learningOutcomes: ["ELT pattern", "dbt fundamentals", "Snowflake architecture", "Modern data stack orchestration"],
    prerequisites: ["Spark module", "SQL module (advanced)", "Snowflake concepts"]
  },
  {
    slug: "sales-analytics-dashboard",
    title: "End-to-End Sales Analytics Dashboard",
    difficulty: "beginner",
    stack: ["Python", "SQL", "Pandas", "Streamlit"],
    estimatedHours: 4,
    coverImage: "📊",
    overview: "A beginner-friendly project — ingest sales CSV data, run SQL transformations, build a Streamlit dashboard showing revenue trends, top products, and regional breakdowns.",
    architecture: `Sales CSV
↓
SQLite (local DB)
↓
SQL aggregation queries
↓
Streamlit Dashboard`,
    folderStructure: `sales-analytics-dashboard/
├── data/sales.csv
├── db/setup.py
├── queries/aggregations.sql
├── app.py (Streamlit)
└── requirements.txt`,
    implementationGuide: `
# Sales Dashboard

A perfect introductory project linking Python, SQL, and simple visualization.
Load a CSV into a local SQLite DB, execute \`GROUP BY\` queries to find total revenue per month, and display charts using Streamlit.
    `,
    learningOutcomes: ["SQL aggregation in practice", "Basic dashboarding", "End-to-end data flow for beginners"],
    prerequisites: ["SQL module"]
  },
  {
    slug: "data-warehouse-design",
    title: "Star Schema Data Warehouse Design",
    difficulty: "intermediate",
    stack: ["PostgreSQL", "SQL", "dbt", "ERD tools"],
    estimatedHours: 5,
    coverImage: "🏛️",
    overview: "Design and implement a star-schema data warehouse for an e-commerce business — fact tables, dimension tables, slowly changing dimensions (SCD Type 2).",
    architecture: `OLTP source tables (normalized)
↓
Staging layer (raw copies)
↓
Dimension tables (dim_customer with SCD2, dim_product, dim_date)
↓
Fact table (fct_orders — grain: one row per order line item)
↓
BI-ready star schema`,
    folderStructure: `data-warehouse-design/
├── sql/
│   ├── 01_staging.sql
│   ├── 02_dimensions.sql
│   ├── 03_scd2_logic.sql
│   └── 04_fact_table.sql
├── docs/erd.png
└── README.md`,
    implementationGuide: `
# Dimensional Modeling

Focus heavily on designing a Star Schema. Define your Fact table (e.g., \`fct_orders\`) surrounded by Dimension tables (\`dim_customer\`, \`dim_product\`, \`dim_date\`).
Implement Slowly Changing Dimensions (SCD Type 2) to track historical changes in customer addresses.
    `,
    learningOutcomes: ["Dimensional modeling", "SCD Type 2 implementation", "Star schema design principles"],
    prerequisites: ["SQL module (advanced)", "Data Warehousing concepts"]
  },
  {
    slug: "pyspark-analytics-project",
    title: "Large-Scale Log Analytics with PySpark",
    difficulty: "advanced",
    stack: ["PySpark", "Parquet", "AWS S3"],
    estimatedHours: 7,
    coverImage: "📈",
    overview: "Process and analyze a large synthetic web server log dataset (millions of rows) using PySpark — extract patterns, detect anomalies, optimize for performance.",
    architecture: `Raw log files (gzipped text, simulating S3 storage)
↓
PySpark read + parse (regex extraction of log fields)
↓
Transformations (sessionization, error rate calculation, partitioning by date)
↓
Write to Parquet (partitioned by date, optimized for downstream queries)
↓
Analysis queries (top error pages, traffic patterns, response time percentiles)`,
    folderStructure: `pyspark-analytics-project/
├── data/generate_logs.py
├── jobs/
│   ├── parse_logs.py
│   ├── sessionize.py
│   └── analyze.py
└── notebooks/exploration.ipynb`,
    implementationGuide: `
# Spark Log Analytics

Use PySpark and Regex to parse unstructured text logs into structured DataFrames.
Apply advanced window functions for sessionization (grouping user actions into contiguous sessions).
Optimize performance by writing the output as partitioned Parquet files.
    `,
    learningOutcomes: ["Large-scale data processing", "Spark performance optimization", "Partitioning strategy", "Log analytics patterns"],
    prerequisites: ["Spark module (full)"]
  },
  {
    slug: "kafka-streaming-project",
    title: "Real-Time Fraud Detection with Kafka",
    difficulty: "advanced",
    stack: ["Apache Kafka", "Python", "Redis", "Flask"],
    estimatedHours: 8,
    coverImage: "🔍",
    overview: "Build a real-time fraud detection system — transaction events flow through Kafka, a Python consumer applies rule-based fraud detection, flagged transactions trigger alerts via Redis pub/sub.",
    architecture: `Transaction Producer (simulates payment events)
↓
Kafka Topic: transactions
↓
Fraud Detection Consumer (Python: velocity checks, amount thresholds, geo-anomalies)
↓
Kafka Topic: fraud-alerts (flagged transactions)
↓
Redis Pub/Sub (real-time alert distribution)
↓
Flask Dashboard (live alert feed via WebSocket)`,
    folderStructure: `kafka-streaming-project/
├── producer/transaction_generator.py
├── consumer/fraud_detector.py
├── rules/fraud_rules.py
├── dashboard/
│   ├── app.py
│   └── templates/index.html
└── docker-compose.yml`,
    implementationGuide: `
# Real-Time Fraud Detection

Build a streaming pipeline that can evaluate transactions in real-time.
Consumers will apply rules (e.g. "more than 3 transactions in 1 minute from the same IP") and push fraud alerts to a secondary Kafka topic or Redis.
    `,
    learningOutcomes: ["Real-time stream processing", "Rule-based detection systems", "Kafka consumer patterns", "Pub/sub architecture"],
    prerequisites: ["Kafka fundamentals", "Python module"]
  }
];

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
      slug: "sql",
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
      if (lesson.order === 1) content = lesson1Content + `\n\n<VisualizerEmbed name="ExecutionOrder" />`;
      if (lesson.order === 2) content = lesson2Content;
      if (lesson.order === 3) content = lesson3Content;
      if (lesson.order === 8) content = `# GROUP BY Clause\n\n<VisualizerEmbed name="GroupByVisualizer" />`;
      if (lesson.order === 9) content = `# HAVING vs WHERE\n\n<VisualizerEmbed name="HavingVisualizer" />`;
      if (lesson.order === 11 || lesson.order === 12) content = `# SQL Joins\n\n<VisualizerEmbed name="JoinVisualizer" />`;
      if (lesson.order === 15) content = `# Subqueries\n\n<VisualizerEmbed name="SubqueryVisualizer" />`;
      if (lesson.order === 16) content = `# Correlated Subqueries\n\n<VisualizerEmbed name="CorrelatedSubqueryVisualizer" />`;
      if (lesson.order === 18 || lesson.order === 19) content = `# Window Functions\n\n<VisualizerEmbed name="WindowFunctionVisualizer" />`;
      if (lesson.order === 20) content = `# Common Table Expressions (CTEs)\n\n<VisualizerEmbed name="CTEVisualizer" />`;
      if (lesson.order === 23) content = `# Data Engineering Architecture Diagrams\n\nHere are some of the advanced React Flow visualizers we built!\n\n<VisualizerEmbed name="EtlPipelineVisualizer" />\n\n<VisualizerEmbed name="SparkArchVisualizer" />\n\n<VisualizerEmbed name="KafkaArchVisualizer" />\n\n<VisualizerEmbed name="AirflowDagVisualizer" />`;

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

    // Map remaining courses so they don't 404
    
    // Get Python Course
    const pythonCourse = courses.find(c => c.slug === "python");
    if (!pythonCourse) throw new Error("Python Course not created");

    // Create Module for Python
    const pythonModule = await Module.create({
      courseId: pythonCourse._id,
      slug: "python",
      title: "Python Fundamentals",
      description: "Master Python fundamentals, Pandas, and data processing patterns used in real data pipelines",
      order: 2,
      icon: "🐍",
      totalLessons: 20,
      estimatedMinutes: 420,
      published: true
    });
    console.log("Created Python Module.");

    // Insert Python Lessons
    let pythonLessonOrder = 1;
    for (const lesson of pythonLessons) {
      let content = "More content coming soon...";
      if (lesson.order === 1) content = pythonLesson1Content;
      if (lesson.order === 6) content = pythonLesson6Content;
      if (lesson.order === 10) content = pythonLesson10Content;
      if (lesson.order === 18) content = pythonLesson18Content;

      await Lesson.create({
        courseId: pythonCourse._id,
        moduleId: pythonModule._id,
        slug: lesson.slug,
        title: lesson.title,
        type: lesson.type as any,
        content: content,
        xpReward: lesson.xp,
        order: lesson.order,
        duration: lesson.duration,
        hasVisualizer: lesson.visualizer,
        hasPlayground: lesson.type === "interactive",
        published: true,
      });
      pythonLessonOrder++;
    }
    console.log(`Inserted ${pythonLessonOrder - 1} Python lessons.`);

    
    // Get Spark Course
    const sparkCourse = courses.find(c => c.slug === "spark");
    if (!sparkCourse) throw new Error("Spark Course not created");

    // Create Module for Spark
    const sparkModule = await Module.create({
      courseId: sparkCourse._id,
      slug: "spark",
      title: "Apache Spark Fundamentals",
      description: "Distributed data processing from RDDs to production pipelines",
      order: 9,
      icon: "⚡",
      totalLessons: 22,
      estimatedMinutes: 540,
      published: true
    });
    console.log("Created Spark Module.");

    // Insert Spark Lessons
    let sparkLessonOrder = 1;
    for (const lesson of sparkLessons) {
      let content = "More content coming soon...";
      if (lesson.order === 1) content = sparkLesson1Content;
      if (lesson.order === 2) content = sparkLesson2Content;
      if (lesson.order === 10) content = sparkLesson10Content;

      await Lesson.create({
        courseId: sparkCourse._id,
        moduleId: sparkModule._id,
        slug: lesson.slug,
        title: lesson.title,
        type: lesson.type as any,
        content: content,
        xpReward: lesson.xp,
        order: lesson.order,
        duration: lesson.duration,
        hasVisualizer: lesson.visualizer,
        hasPlayground: lesson.type === "interactive",
        published: true,
      });
      sparkLessonOrder++;
    }
    console.log(`Inserted ${sparkLessonOrder - 1} Spark lessons.`);

    for (const c of courses) {
      if (c.slug === "sql" || c.slug === "python" || c.slug === "spark") continue;

      const mod = await Module.create({
        courseId: c._id,
        slug: c.slug,
        title: `${c.title} Basics`,
        description: `Introduction to ${c.title}.`,
        order: 1,
        icon: c.icon,
        totalLessons: 1,
        estimatedMinutes: 60,
        published: true
      });

      await Lesson.create({
        courseId: c._id,
        moduleId: mod._id,
        slug: "intro",
        title: `Introduction to ${c.title}`,
        type: "theory",
        content: `# Welcome to ${c.title}\n\nThis course is currently under development. Please check back later!`,
        xpReward: 10,
        order: 1,
        duration: 10,
        hasVisualizer: false,
        hasPlayground: false,
        published: true,
      });
    }
    console.log(`Inserted placeholder modules for other courses.`);

    // --- SPRINT 3 NEW SEED DATA ---
    await Challenge.deleteMany({});
    await Flashcard.deleteMany({});
    await Quiz.deleteMany({});
    await InterviewQuestion.deleteMany({});
    console.log("Cleared existing Sprint 3 data.");

    // Insert Challenges
    for (const c of sqlChallenges) {
      await Challenge.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(c as any)
      });
    }
    console.log(`Inserted ${sqlChallenges.length} challenges.`);

    // Insert Flashcards
    for (const f of sqlFlashcards) {
      await Flashcard.create({
        moduleId: sqlModule._id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(f as any)
      });
    }
    console.log(`Inserted ${sqlFlashcards.length} flashcards.`);

    // Insert Quiz
    await Quiz.create({
      moduleId: sqlModule._id,
      title: "SQL Master Assessment",
      description: "Test your SQL knowledge with this comprehensive quiz.",
      timeLimit: 600, // 10 minutes
      passingScore: 70,
      xpReward: 200,
      shuffleQuestions: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      questions: sqlQuizQuestions as any,
    });
    console.log("Inserted SQL Master Assessment Quiz.");

    // Insert Interview Questions
    for (const iq of interviewQuestions) {
      await InterviewQuestion.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(iq as any)
      });
    }
    console.log(`Inserted ${interviewQuestions.length} interview questions.`);

    
    // --- SPRINT 4 PROJECTS DATA ---
    await Project.deleteMany({});
    console.log("Cleared existing Projects.");
    
    for (const p of projectsData) {
      await Project.create(p as any);
    }
    console.log(`Inserted ${projectsData.length} projects.`);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
