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
    for (const c of courses) {
      if (c.slug === "sql") continue;

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

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
