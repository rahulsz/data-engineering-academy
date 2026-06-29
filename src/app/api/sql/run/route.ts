import 'server-only';
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const dbCache: Record<string, Database.Database> = {};

function createAndSeedDB(name: string): Database.Database {
  const db = new Database(':memory:');
  db.pragma('limit_memory = 20971520'); // 20MB limit

  if (name === 'ecommerce') {
    db.exec(`
      CREATE TABLE categories (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category_id INTEGER, price REAL);
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, country TEXT);
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, date TEXT, status TEXT, total REAL);
      CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, price REAL);
    `);

    // Categories
    db.exec(`
      INSERT INTO categories (id, name) VALUES 
      (1, 'Electronics'), (2, 'Clothing'), (3, 'Books'), (4, 'Home & Garden'),
      (5, 'Sports'), (6, 'Toys'), (7, 'Food'), (8, 'Beauty');
    `);

    // Products
    for (let i = 1; i <= 30; i++) {
      const categoryId = (i % 8) + 1;
      const price = Math.round((Math.random() * 1195 + 5) * 100) / 100;
      db.prepare(`INSERT INTO products (id, name, category_id, price) VALUES (?, ?, ?, ?)`).run(i, `Product ${i}`, categoryId, price);
    }

    // Customers (50). IDs 46-50 have zero orders
    const countries = ['USA', 'UK', 'Germany', 'India', 'Japan'];
    const countryIdx = 0;
    for (let i = 1; i <= 50; i++) {
      let country = countries[4];
      if (i <= 20) country = countries[0];
      else if (i <= 30) country = countries[1];
      else if (i <= 38) country = countries[2];
      else if (i <= 45) country = countries[3];
      db.prepare(`INSERT INTO customers (id, name, email, country) VALUES (?, ?, ?, ?)`).run(i, `Customer ${i}`, `customer${i}@example.com`, country);
    }

    // Orders (200)
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    for (let i = 1; i <= 200; i++) {
      const customerId = Math.floor(Math.random() * 45) + 1; // Only 1-45 place orders
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const total = Math.round((Math.random() * 500 + 10) * 100) / 100;
      db.prepare(`INSERT INTO orders (id, customer_id, date, status, total) VALUES (?, ?, '2023-10-15', ?, ?)`).run(i, customerId, status, total);
    }

    // Order Items (~500)
    let itemId = 1;
    for (let i = 1; i <= 200; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const productId = Math.floor(Math.random() * 30) + 1;
        db.prepare(`INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)`).run(itemId++, i, productId, 1, 99.99);
      }
    }
  } else if (name === 'hr') {
    db.exec(`
      CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, salary REAL, manager_id INTEGER);
      CREATE TABLE salaries (id INTEGER PRIMARY KEY, employee_id INTEGER, salary REAL, from_date TEXT, to_date TEXT);
      CREATE TABLE job_history (employee_id INTEGER, start_date TEXT, end_date TEXT, role TEXT);
    `);

    db.exec(`
      INSERT INTO departments (id, name) VALUES 
      (1, 'Engineering'), (2, 'Marketing'), (3, 'Sales'), (4, 'HR'),
      (5, 'Finance'), (6, 'Product'), (7, 'Design'), (8, 'Operations');
    `);

    // Employees (40). CEO is 1. Two share identical salary.
    db.prepare(`INSERT INTO employees (id, name, department_id, salary, manager_id) VALUES (1, 'CEO', NULL, 250000, NULL)`).run();
    for (let i = 2; i <= 40; i++) {
      const deptId = (i % 8) + 1;
      let salary = Math.round(Math.random() * 50000 + 45000);
      if (i === 10 || i === 11) { // Identical salary
        salary = 85000;
      }
      const managerId = i <= 5 ? 1 : Math.floor(Math.random() * 4) + 2;
      db.prepare(`INSERT INTO employees (id, name, department_id, salary, manager_id) VALUES (?, ?, ?, ?, ?)`).run(i, `Employee ${i}`, deptId, salary, managerId);
      
      // Add salaries
      db.prepare(`INSERT INTO salaries (id, employee_id, salary, from_date, to_date) VALUES (?, ?, ?, '2020-01-01', '2021-01-01')`).run(i * 3 - 2, i, salary - 10000);
      db.prepare(`INSERT INTO salaries (id, employee_id, salary, from_date, to_date) VALUES (?, ?, ?, '2021-01-01', NULL)`).run(i * 3 - 1, i, salary);
    }

    for (let i = 1; i <= 15; i++) {
      db.prepare(`INSERT INTO job_history (employee_id, start_date, end_date, role) VALUES (?, '2019-01-01', '2020-01-01', 'Junior')`).run(i);
    }
  } else if (name === 'sales') {
    db.exec(`
      CREATE TABLE regions (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE salespeople (id INTEGER PRIMARY KEY, name TEXT, region_id INTEGER);
      CREATE TABLE deals (id INTEGER PRIMARY KEY, salesperson_id INTEGER, amount REAL, stage TEXT, closed_date TEXT);
      CREATE TABLE targets (id INTEGER PRIMARY KEY, salesperson_id INTEGER, quarter TEXT, target_amount REAL);
    `);

    db.exec(`
      INSERT INTO regions (id, name) VALUES 
      (1, 'North America'), (2, 'Europe'), (3, 'Asia Pacific'), (4, 'Latin America'), (5, 'Middle East');
    `);

    for (let i = 1; i <= 20; i++) {
      const regionId = (i % 5) + 1;
      db.prepare(`INSERT INTO salespeople (id, name, region_id) VALUES (?, ?, ?)`).run(i, `Salesperson ${i}`, regionId);
      
      // Targets
      db.prepare(`INSERT INTO targets (id, salesperson_id, quarter, target_amount) VALUES (?, ?, 'Q1-2024', 100000)`).run(i * 4 - 3, i);
      db.prepare(`INSERT INTO targets (id, salesperson_id, quarter, target_amount) VALUES (?, ?, 'Q2-2024', 110000)`).run(i * 4 - 2, i);
    }

    for (let i = 1; i <= 300; i++) {
      const spId = Math.floor(Math.random() * 20) + 1;
      const amount = Math.round((Math.random() * 50000 + 5000) * 100) / 100;
      const r = Math.random();
      let stage = 'pipeline';
      let date = null;
      if (r < 0.4) { stage = 'won'; date = '2024-05-10'; }
      else if (r < 0.65) { stage = 'lost'; }
      
      db.prepare(`INSERT INTO deals (id, salesperson_id, amount, stage, closed_date) VALUES (?, ?, ?, ?, ?)`).run(i, spId, amount, stage, date);
    }
  }

  return db;
}

function getDB(name: string): Database.Database {
  if (!dbCache[name]) {
    dbCache[name] = createAndSeedDB(name);
  }
  return dbCache[name];
}

const ALLOWED = /^\s*(SELECT|WITH|EXPLAIN)\b/i;
const BLOCKED = [
  /INTO\s+OUTFILE/i,
  /INTO\s+DUMPFILE/i,
  /LOAD_FILE/i,
  /ATTACH\s+DATABASE/i,
];

const hasMultipleStatements = (q: string) => /;(?!\s*$)/.test(q);

export async function POST(req: Request) {
  try {
    const { query, database = 'ecommerce' } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'No query provided' }, { status: 400 });
    }
    
    if (!['ecommerce', 'hr', 'sales'].includes(database)) {
      return NextResponse.json({ error: 'Invalid database selected' }, { status: 400 });
    }

    const trimmed = query.trim();

    if (!ALLOWED.test(trimmed)) {
      return NextResponse.json({ error: 'Only SELECT, WITH, and EXPLAIN statements are allowed.' }, { status: 403 });
    }

    if (hasMultipleStatements(trimmed)) {
      return NextResponse.json({ error: 'Multiple statements are not allowed.' }, { status: 403 });
    }

    for (const pattern of BLOCKED) {
      if (pattern.test(trimmed)) {
        return NextResponse.json({ error: 'Query contains blocked keywords.' }, { status: 403 });
      }
    }

    const db = getDB(database);

    const start = performance.now();
    const stmt = db.prepare(query);
    const rows = stmt.all() as Record<string, unknown>[];
    const executionTime = Math.round(performance.now() - start);
    
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const limited = rows.slice(0, 1000);
    const rowArrays = limited.map(r => columns.map(c => r[c] ?? null));
    
    return NextResponse.json({ columns, rows: rowArrays, rowCount: rows.length, executionTime });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
