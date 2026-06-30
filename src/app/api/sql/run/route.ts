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

    // Products (Realistic names mapped to categories)
    const productNames = [
      ['MacBook Pro 16"', 'iPhone 15 Pro', 'Sony WH-1000XM5', 'Apple Watch Series 9', 'iPad Air', 'Dell XPS 13'],
      ["Levi's 501 Original", 'Nike Air Max 270', 'Patagonia Fleece', 'Adidas Track Pants', 'Hanes Cotton T-Shirt'],
      ['Clean Code by Robert Martin', 'Dune by Frank Herbert', 'Atomic Habits', 'The Pragmatic Programmer', 'Sapiens'],
      ['Dyson V15 Vacuum', 'Nespresso Vertuo', 'Philips Hue Starter Kit', 'Herman Miller Chair', 'Yeti Rambler'],
      ['Spalding Basketball', 'Manduka Yoga Mat', 'Bowflex Dumbbells', 'Wilson Tennis Racket', 'Fitbit Charge 6'],
      ['LEGO Star Wars Falcon', 'Monopoly Classic', 'Nerf Elite Blaster', 'Barbie Dreamhouse', "Rubik's Cube"],
      ['Lavazza Espresso', 'Kirkland Olive Oil', 'Lindt Dark Chocolate', 'Manuka Honey', 'Blue Diamond Almonds'],
      ['CeraVe Cleanser', 'Mac Lipstick', 'Chanel No. 5', 'Olaplex No. 7', 'Neutrogena Sunscreen']
    ];
    let prodId = 1;
    for (let cIdx = 0; cIdx < productNames.length; cIdx++) {
      for (const pName of productNames[cIdx]) {
        const price = Math.round((Math.random() * (cIdx === 0 ? 1500 : 80) + 10) * 100) / 100;
        db.prepare(`INSERT INTO products (id, name, category_id, price) VALUES (?, ?, ?, ?)`).run(prodId++, pName, cIdx + 1, price);
      }
    }

    // Customers (50) - Realistic names
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    const countries = ['USA', 'UK', 'Germany', 'India', 'Japan', 'Canada', 'Australia', 'Brazil', 'France', 'Italy'];
    
    for (let i = 1; i <= 50; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;
      db.prepare(`INSERT INTO customers (id, name, email, country) VALUES (?, ?, ?, ?)`).run(i, `${fName} ${lName}`, email, country);
    }

    // Orders (200)
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled'];
    for (let i = 1; i <= 200; i++) {
      const customerId = Math.floor(Math.random() * 45) + 1; // 1-45 place orders
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const total = Math.round((Math.random() * 500 + 15) * 100) / 100;
      
      // Random date in past year
      const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0];
      db.prepare(`INSERT INTO orders (id, customer_id, date, status, total) VALUES (?, ?, ?, ?, ?)`).run(i, customerId, date, status, total);
    }

    // Order Items
    let itemId = 1;
    for (let i = 1; i <= 200; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const productId = Math.floor(Math.random() * (prodId - 1)) + 1;
        const qty = Math.floor(Math.random() * 3) + 1;
        db.prepare(`INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)`).run(itemId++, i, productId, qty, 49.99); // Price simplified for mockup
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

    // Employees (40)
    const empNames = [
      'Sarah Connor', 'John Smith', 'Alice Johnson', 'Michael Chang', 'Emily Davis', 
      'David Miller', 'Sophia Martinez', 'James Wilson', 'Olivia Anderson', 'Daniel Thomas',
      'Isabella Taylor', 'Matthew Moore', 'Charlotte Jackson', 'Andrew Martin', 'Amelia Lee',
      'Joshua Perez', 'Mia Thompson', 'Christopher White', 'Harper Harris', 'Ryan Clark',
      'Evelyn Ramirez', 'Nathan Lewis', 'Abigail Robinson', 'Christian Walker', 'Elizabeth Young',
      'Jonathan Allen', 'Sofia King', 'Samuel Wright', 'Avery Scott', 'Benjamin Torres',
      'Ella Nguyen', 'Alexander Hill', 'Madison Flores', 'Justin Green', 'Scarlett Adams',
      'Brandon Nelson', 'Grace Baker', 'Tyler Hall', 'Chloe Rivera', 'Zachary Campbell'
    ];

    db.prepare(`INSERT INTO employees (id, name, department_id, salary, manager_id) VALUES (1, 'Sarah Connor', NULL, 250000, NULL)`).run();
    for (let i = 2; i <= 40; i++) {
      const deptId = (i % 8) + 1;
      let salary = Math.round((Math.random() * 50000 + 65000) / 1000) * 1000; // Round to nearest 1000
      if (i === 10 || i === 11) salary = 85000;
      
      const managerId = i <= 8 ? 1 : (deptId === 1 ? 2 : (deptId === 2 ? 3 : Math.floor(Math.random() * 7) + 2));
      db.prepare(`INSERT INTO employees (id, name, department_id, salary, manager_id) VALUES (?, ?, ?, ?, ?)`).run(i, empNames[i-1], deptId, salary, managerId);
      
      // Salaries
      db.prepare(`INSERT INTO salaries (id, employee_id, salary, from_date, to_date) VALUES (?, ?, ?, '2020-01-01', '2022-01-01')`).run(i * 2 - 1, i, salary - 12000);
      db.prepare(`INSERT INTO salaries (id, employee_id, salary, from_date, to_date) VALUES (?, ?, ?, '2022-01-01', NULL)`).run(i * 2, i, salary);
    }

    // Job History
    const roles = ['Junior Developer', 'Marketing Associate', 'Sales Representative', 'HR Specialist', 'Financial Analyst'];
    for (let i = 10; i <= 25; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      db.prepare(`INSERT INTO job_history (employee_id, start_date, end_date, role) VALUES (?, '2019-03-01', '2022-01-01', ?)`).run(i, role);
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

    const spNames = ['Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo'];
    
    for (let i = 1; i <= 20; i++) {
      const regionId = (i % 5) + 1;
      db.prepare(`INSERT INTO salespeople (id, name, region_id) VALUES (?, ?, ?)`).run(i, `${spNames[i-1]} Sales`, regionId);
      
      // Targets
      db.prepare(`INSERT INTO targets (id, salesperson_id, quarter, target_amount) VALUES (?, ?, 'Q1-2024', 150000)`).run(i * 4 - 3, i);
      db.prepare(`INSERT INTO targets (id, salesperson_id, quarter, target_amount) VALUES (?, ?, 'Q2-2024', 165000)`).run(i * 4 - 2, i);
      db.prepare(`INSERT INTO targets (id, salesperson_id, quarter, target_amount) VALUES (?, ?, 'Q3-2024', 180000)`).run(i * 4 - 1, i);
      db.prepare(`INSERT INTO targets (id, salesperson_id, quarter, target_amount) VALUES (?, ?, 'Q4-2024', 200000)`).run(i * 4, i);
    }

    // Deals
    const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'won', 'won', 'lost'];
    for (let i = 1; i <= 300; i++) {
      const spId = Math.floor(Math.random() * 20) + 1;
      const amount = Math.round((Math.random() * 80000 + 10000) * 100) / 100;
      const stage = stages[Math.floor(Math.random() * stages.length)];
      let date = null;
      if (stage === 'won' || stage === 'lost') {
        date = new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split('T')[0];
      }
      
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
